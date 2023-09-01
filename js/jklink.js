
function generatePortalLinks(currentArticleId) {
    var links = [
        { id: 1, title: "JuseKit —— 提取最长转录本", url: "https://jusetiz.github.io/2023/04/08/JuseKit（一） —— 提取最长转录本" },
        { id: 2, title: "JuseKit —— 序列id简化、加前缀尾缀或转变为物种名", url: "https://jusetiz.github.io/2023/04/09/JuseKit（二） —— 序列id简化、加前缀尾缀或转变为物种名" },
        { id: 3, title: "JuseKit —— 串联序列、根据id提取序列、批量修改文件尾缀", url: "https://jusetiz.github.io/2023/04/13/JuseKit（三） —— 串联序列、根据id提取序列、批量修改文件尾缀" },
        { id: 4, title: "JuseKit —— 序列格式转换以及 Orthogroup 的 cds 提取", url: "https://jusetiz.github.io/2023/04/26/JuseKit（四） —— 序列格式转换以及 Orthogroup 的 cds 提取" },
        { id: 5, title: "JuseKit —— 用于系统发育分析的序列过滤", url: "https://jusetiz.github.io/2023/05/14/JuseKit（五） —— 用于系统发育分析的序列过滤" },
        { id: 6, title: "JuseKit —— 绘制火山图", url: "https://jusetiz.github.io/2023/07/04/JuseKit（六） —— 绘制火山图" },
        { id: 7, title: "JuseKit —— 绘制 GO 富集分析气泡图", url: "https://jusetiz.github.io/2023/08/04/JuseKit（七） —— 绘制 GO 富集分析气泡图" },
        { id: 8, title: "JuseKit —— 计算转录组组装指标", url: "https://jusetiz.github.io/2023/08/04/JuseKit（八） —— 计算转录组组装指标" }
    ];

    var html = '<div class="portal">';
    html += '<h3>系列文章传送门</h3>';
    html += '<ul>';
    for (var i = 0; i < links.length; i++) {
        html += '<li>';
        if (links[i].id === currentArticleId) {
            html += '<strong>';
        }
        html += '<a href="' + links[i].url + '">' + links[i].title + '</a>';
        if (links[i].id === currentArticleId) {
            html += '</strong>  👈 您当前所处位置';
        }
        html += '</li>';
    }
    html += '</ul></div>';

    document.getElementById('portalContainer').innerHTML = html;
}