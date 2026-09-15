#!/usr/bin/env python3
"""Send compact, readable Codex completion notifications to a WeCom bot."""

from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime
from pathlib import Path
from typing import Any


WEBHOOK_FILE = Path("~/.codex_wecom_webhook")
SESSIONS_DIR = Path("~/.codex/sessions")
MAX_CONTENT_BYTES = 3800
ELLIPSIS = "…"
HOOK_TOOL_NAMES = {"request_user_input", "request_user_input_async"}
SECRET_PATTERNS = (
    re.compile(r"(?i)(\bauthorization\b\s*[=:]\s*)(?:bearer\s+)?[^\s'\"]+"),
    re.compile(
        r"(?i)(\b(?:api[_-]?key|token|secret|password|passwd)\b\s*[=:]\s*)"
        r"([^\s,;]+)"
    ),
    re.compile(r"(?i)(bearer\s+)[A-Za-z0-9._~+/=-]+"),
    re.compile(r"\bsk-[A-Za-z0-9_-]{12,}\b"),
    re.compile(r"(qyapi\.weixin\.qq\.com/cgi-bin/webhook/send\?key=)[^&\s]+"),
)


def _clean(value: Any, limit: int) -> str:
    """Convert a notification field to bounded, printable text."""
    if value is None:
        return ""
    text = str(value).replace("\x00", "").strip()
    if len(text) > limit:
        text = text[:limit].rstrip() + "…"
    return text


def _escape(value: str) -> str:
    """Prevent notification data from becoming WeCom tags or mentions."""
    return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _redact(value: str) -> str:
    """Remove common credential forms before forwarding tool input."""
    redacted = value
    redacted = SECRET_PATTERNS[0].sub(r"\1[REDACTED]", redacted)
    redacted = SECRET_PATTERNS[1].sub(r"\1[REDACTED]", redacted)
    redacted = SECRET_PATTERNS[2].sub(r"\1[REDACTED]", redacted)
    redacted = SECRET_PATTERNS[3].sub("[REDACTED]", redacted)
    redacted = SECRET_PATTERNS[4].sub(r"\1[REDACTED]", redacted)
    return redacted


def _truncate_utf8(value: str, max_bytes: int) -> str:
    encoded = value.encode("utf-8")
    if len(encoded) <= max_bytes:
        return value
    suffix = ELLIPSIS.encode("utf-8")
    if max_bytes < len(suffix):
        return ""
    return (
        encoded[: max_bytes - len(suffix)]
        .decode("utf-8", errors="ignore")
        .rstrip()
        + ELLIPSIS
    )


def _is_session_title_turn(notification: dict[str, Any]) -> bool:
    prompt = _input_messages(notification)
    return (
        "Generate a concise, single-line task title" in prompt
        and "Do not answer the request." in prompt
    )


def _input_messages(notification: dict[str, Any]) -> str:
    messages = notification.get("input-messages", [])
    if isinstance(messages, list):
        cleaned = [_clean(item, 700) for item in messages if item is not None]
        return "\n\n".join(item for item in cleaned if item)
    return _clean(messages, 700)


def _quote_block(value: str) -> str:
    """Render arbitrary text as one WeCom Markdown quote block."""
    return "\n".join(f"> {line}" if line else ">" for line in value.splitlines())


def _short_id(value: Any) -> str:
    identifier = _clean(value, 120)
    if not identifier:
        return "未知"
    if len(identifier) <= 12:
        return identifier
    return f"{identifier[:8]}…{identifier[-4:]}"


def _metadata(notification: dict[str, Any]) -> tuple[str, str]:
    raw_cwd = _clean(notification.get("cwd"), 500)
    cwd = _escape(raw_cwd or "未知")
    project = _escape(Path(raw_cwd).name if raw_cwd else "未知项目")
    session_id = notification.get("thread-id", notification.get("session_id"))
    turn_value = notification.get("turn-id", notification.get("turn_id"))
    thread_id = _escape(_short_id(session_id))
    turn_id = _escape(_short_id(turn_value))
    timestamp = datetime.now().astimezone().strftime("%Y-%m-%d %H:%M:%S")
    metadata = (
        f"> **时间：** {timestamp}\n"
        f"> **目录：** {cwd}\n"
        f"> **会话 / 轮次：** {thread_id} / {turn_id}"
    )
    return project, metadata


def _proposed_plan(text: Any) -> str:
    if not isinstance(text, str):
        return ""
    match = re.fullmatch(r"\s*<proposed_plan>(.*?)</proposed_plan>\s*", text, re.S)
    return match.group(1).strip() if match else ""


def _completed_plan(notification: dict[str, Any]) -> str:
    """Recover a completed plan from this exact turn, never from an earlier one."""
    direct = _proposed_plan(notification.get("last-assistant-message"))
    if direct:
        return direct
    # Ordinary nonempty replies need no session scan.
    if notification.get("last-assistant-message"):
        return ""
    thread_id = notification.get("thread-id")
    turn_id = notification.get("turn-id")
    if not all(isinstance(value, str) and re.fullmatch(r"[a-zA-Z0-9-]+", value)
               for value in (thread_id, turn_id)):
        return ""
    try:
        for path in SESSIONS_DIR.glob(f"*/*/*/rollout-*-{thread_id}.jsonl"):
            active_turn = None
            plan = ""
            with path.open(encoding="utf-8") as stream:
                for line in stream:
                    try:
                        record = json.loads(line)
                    except json.JSONDecodeError:
                        continue  # A concurrently appended last line may be incomplete.
                    if not isinstance(record, dict):
                        continue
                    payload = record.get("payload")
                    if not isinstance(payload, dict):
                        continue
                    kind = payload.get("type")
                    if record.get("type") == "turn_context" or (
                        record.get("type") == "event_msg" and kind == "task_started"
                    ):
                        active_turn = payload.get("turn_id")
                    if record.get("type") == "event_msg":
                        if kind == "item_completed" and payload.get("turn_id") == turn_id:
                            item = payload.get("item")
                            if isinstance(item, dict) and item.get("type") == "Plan":
                                plan = _clean(item.get("text"), 3000)
                        if kind == "task_complete" and payload.get("turn_id") == turn_id:
                            return plan
                    elif record.get("type") == "response_item" and active_turn == turn_id:
                        if kind == "message" and payload.get("role") == "assistant":
                            parts = payload.get("content", [])
                            if isinstance(parts, list):
                                for part in parts:
                                    if isinstance(part, dict) and part.get("type") == "output_text":
                                        plan = _proposed_plan(part.get("text")) or plan
            # notify can run after the Plan item is persisted but before task_complete.
            if plan:
                return plan
    except (OSError, UnicodeError):
        pass  # Missing/unreadable session data must not break completion notifications.
    return ""


def _format_completion(notification: dict[str, Any]) -> str:
    project, metadata = _metadata(notification)
    inputs = _escape(_input_messages(notification) or "无")
    plan = _completed_plan(notification)
    title = "⏳ Codex 已制定 plan，等待决策" if plan else "✅ Codex 本轮已结束"
    section = "📋 计划（请在 Codex 中选择执行或修改）" if plan else "🤖 最终回复"
    assistant = _escape(
        _clean(plan or notification.get("last-assistant-message"), 3000)
        or "Codex 已结束本轮任务，但没有返回文本消息。"
    )

    content = (
        f"## {title} · {project}\n"
        f"{metadata}\n"
        "\n### 📝 任务\n"
        f"{_quote_block(inputs)}\n"
        f"\n### {section}\n"
        f"{_quote_block(assistant)}"
    )
    return _truncate_utf8(content, MAX_CONTENT_BYTES)


def _format_questions(tool_input: Any) -> str:
    if not isinstance(tool_input, dict):
        return "> Codex 正在等待你的输入。"
    questions = tool_input.get("questions")
    if not isinstance(questions, list):
        return "> Codex 正在等待你的输入。"

    blocks: list[str] = []
    for index, question in enumerate(questions[:3], start=1):
        if not isinstance(question, dict):
            continue
        header = _escape(_clean(question.get("header"), 80) or f"问题 {index}")
        prompt = _escape(_clean(question.get("question"), 600) or "请选择或输入答案。")
        lines = [f"**{index}. {header}**", _quote_block(prompt)]
        options = question.get("options")
        if isinstance(options, list):
            for option in options[:3]:
                if not isinstance(option, dict):
                    continue
                label = _escape(_clean(option.get("label"), 120))
                description = _escape(_clean(option.get("description"), 300))
                if label:
                    suffix = f" — {description}" if description else ""
                    lines.append(f"- {label}{suffix}")
        blocks.append("\n".join(lines))
    return "\n\n".join(blocks) or "> Codex 正在等待你的输入。"


def _format_user_input_request(notification: dict[str, Any]) -> str:
    project, metadata = _metadata(notification)
    permission_mode = _escape(_clean(notification.get("permission_mode"), 40) or "未知")
    questions = _format_questions(notification.get("tool_input"))
    content = (
        f"## ⏳ Codex 等待你的决策 · {project}\n"
        f"{metadata}\n"
        f"> **模式：** {permission_mode}\n"
        "\n### ❓ 需要你回答\n"
        f"{questions}"
    )
    return _truncate_utf8(content, MAX_CONTENT_BYTES)


def _permission_summary(tool_input: Any) -> tuple[str, str]:
    if not isinstance(tool_input, dict):
        return "未提供审批原因", "未提供命令或权限详情"

    reason = (
        tool_input.get("description")
        or tool_input.get("justification")
        or tool_input.get("reason")
        or "未提供审批原因"
    )
    detail = tool_input.get("command", tool_input.get("cmd"))
    if detail is None:
        selected = {
            key: tool_input[key]
            for key in (
                "host",
                "protocol",
                "sandbox_permissions",
                "permissions",
                "additional_permissions",
            )
            if key in tool_input
        }
        detail = selected or "未提供命令或权限详情"
    if not isinstance(detail, str):
        detail = json.dumps(detail, ensure_ascii=False, sort_keys=True)
    return _clean(_redact(str(reason)), 600), _clean(_redact(detail), 1400)


def _format_permission_request(notification: dict[str, Any]) -> str:
    project, metadata = _metadata(notification)
    tool_name = _escape(_clean(notification.get("tool_name"), 120) or "未知工具")
    permission_mode = _escape(_clean(notification.get("permission_mode"), 40) or "未知")
    reason, detail = _permission_summary(notification.get("tool_input"))
    reason = _escape(reason)
    detail = _escape(detail)
    content = (
        f"## 🔐 Codex 等待权限审批 · {project}\n"
        f"{metadata}\n"
        f"> **工具 / 模式：** {tool_name} / {permission_mode}\n"
        "\n### 📌 申请原因\n"
        f"{_quote_block(reason)}\n"
        "\n### 💻 命令或权限\n"
        f"{_quote_block(detail)}"
    )
    return _truncate_utf8(content, MAX_CONTENT_BYTES)


def _format_content(notification: dict[str, Any]) -> str:
    event = notification.get("type", notification.get("hook_event_name"))
    if event == "agent-turn-complete":
        if _is_session_title_turn(notification):
            return ""
        return _format_completion(notification)
    if event == "PermissionRequest":
        return _format_permission_request(notification)
    if event == "PreToolUse" and notification.get("tool_name") in HOOK_TOOL_NAMES:
        return _format_user_input_request(notification)
    return ""


def _read_webhook() -> str:
    webhook = WEBHOOK_FILE.read_text(encoding="utf-8").strip()
    if not webhook.startswith("https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key="):
        raise ValueError("webhook 文件中的地址不是企业微信机器人 webhook")
    return webhook


def _send(notification: dict[str, Any]) -> bool:
    content = _format_content(notification)
    if not content:
        return True
    body = {
        "msgtype": "markdown",
        "markdown": {"content": content},
    }
    try:
        request = urllib.request.Request(
            _read_webhook(),
            data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=10) as response:
            result = json.loads(response.read(4096).decode("utf-8"))
    except (
        OSError,
        ValueError,
        urllib.error.URLError,
        json.JSONDecodeError,
        UnicodeDecodeError,
    ) as exc:
        print(f"Codex WeCom notification failed: {type(exc).__name__}", file=sys.stderr)
        return False

    if not isinstance(result, dict) or result.get("errcode") != 0:
        print("Codex WeCom notification rejected by webhook", file=sys.stderr)
        return False
    return True


def _sample_completion() -> dict[str, Any]:
    return {
        "type": "agent-turn-complete",
        "cwd": str(Path.cwd()),
        "thread-id": "01990c12-3456-7890-abcd-ef0123456789",
        "turn-id": "01990c98-7654-3210-abcd-ef0123456789",
        "input-messages": ["测试 Codex 到企业微信的 notify 推送"],
        "last-assistant-message": "企业微信 notify 推送配置测试成功。",
    }


def _sample_user_input() -> dict[str, Any]:
    return {
        "hook_event_name": "PreToolUse",
        "session_id": "01990c12-3456-7890-abcd-ef0123456789",
        "turn_id": "01990c98-7654-3210-abcd-ef0123456789",
        "cwd": str(Path.cwd()),
        "permission_mode": "plan",
        "tool_name": "request_user_input",
        "tool_input": {
            "questions": [
                {
                    "header": "执行范围",
                    "question": "请选择下一步执行范围。",
                    "options": [
                        {"label": "完整执行（推荐）", "description": "完成全部计划。"},
                        {"label": "仅运行测试", "description": "暂不修改业务代码。"},
                    ],
                }
            ]
        },
    }


def _sample_permission() -> dict[str, Any]:
    return {
        "hook_event_name": "PermissionRequest",
        "session_id": "01990c12-3456-7890-abcd-ef0123456789",
        "turn_id": "01990c98-7654-3210-abcd-ef0123456789",
        "cwd": str(Path.cwd()),
        "permission_mode": "default",
        "tool_name": "Bash",
        "tool_input": {
            "description": "允许下载项目依赖",
            "command": "curl -H 'Authorization: Bearer example-secret-token' https://example.com",
        },
    }


def main() -> int:
    if len(sys.argv) == 2 and sys.argv[1] == "--preview":
        samples = (_sample_completion(), _sample_user_input(), _sample_permission())
        print("\n\n---\n\n".join(_format_content(sample) for sample in samples))
        return 0

    if len(sys.argv) == 2 and sys.argv[1] == "--test":
        return 0 if _send(_sample_completion()) else 1

    if len(sys.argv) == 2 and sys.argv[1] == "--hook":
        try:
            notification = json.load(sys.stdin)
        except (json.JSONDecodeError, UnicodeDecodeError):
            return 0
        if isinstance(notification, dict):
            # Hook notification failures must not alter the tool or approval flow.
            _send(notification)
        return 0

    # Codex passes the notification as one JSON command-line argument.
    if len(sys.argv) != 2:
        return 0
    try:
        notification = json.loads(sys.argv[1])
    except json.JSONDecodeError:
        return 0
    if not isinstance(notification, dict) or notification.get("type") != "agent-turn-complete":
        return 0

    # A notification failure must not turn a completed Codex turn into a failed turn.
    _send(notification)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())