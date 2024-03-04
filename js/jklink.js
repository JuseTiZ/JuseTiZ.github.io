
function generatePortalLinks(currentArticleId) {
    var links = [
        { id: 1, title: "JuseKit —— 提取最长转录本", url: "https://biojuse.com/2023/04/08/JuseKit（一） —— 提取最长转录本" },
        { id: 2, title: "JuseKit —— 序列id简化、加前缀尾缀或转变为物种名", url: "https://biojuse.com/2023/04/09/JuseKit（二） —— 序列id简化、加前缀尾缀或转变为物种名" },
        { id: 3, title: "JuseKit —— 串联序列、根据id提取序列、批量修改文件尾缀", url: "https://biojuse.com/2023/04/13/JuseKit（三） —— 串联序列、根据id提取序列、批量修改文件尾缀" },
        { id: 4, title: "JuseKit —— 序列格式转换以及 Orthogroup 的 cds 提取", url: "https://biojuse.com/2023/04/26/JuseKit（四） —— 序列格式转换以及 Orthogroup 的 cds 提取" },
        { id: 5, title: "JuseKit —— 用于系统发育分析的序列过滤", url: "https://biojuse.com/2023/05/14/JuseKit（五） —— 用于系统发育分析的序列过滤" },
        { id: 6, title: "JuseKit —— 绘制火山图", url: "https://biojuse.com/2023/07/04/JuseKit（六） —— 绘制火山图" },
        { id: 7, title: "JuseKit —— 绘制 GO 富集分析气泡图", url: "https://biojuse.com/2023/08/04/JuseKit（七） —— 绘制 GO 富集分析气泡图" },
        { id: 8, title: "JuseKit —— 计算转录组组装指标", url: "https://biojuse.com/2023/09/01/JuseKit（八） —— 计算转录组组装指标" }
    ];

    var html = '<div class="portal">';
    html += '<h3>🚀🚀系列文章传送门🚀🚀</h3>';
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

    html += '<div class="warning"><h3>⚡☢️阅读前<strong>须知事项</strong>☢️⚡</h3>';
    html += '<ul>';
    html += '<li>根据文章内容进行数据操作前，若相关操作涉及到原数据文件的变动（不管是内容还是位置），请<strong>做好备份</strong>以避免不可逆的数据丢失或者数据损坏。</li>'
    html += '<li>根据文章内容进行数据操作前，若相关操作涉及到大量文件，请<strong>选出一个小数据集（文件）</strong>进行试分析以确定是否能够正常运行并产生结果。</li>'
    html += '<li>根据文章内容进行命令执行前，若相关命令涉及到内存、线程等参数（或者是 & 等执行多条命令的操作），请<strong>留意电脑或服务器是否能够承受足够负载（htop）</strong>。</li>'
    html += '<li>文章中涉及到的脚本、命令参数等<strong>需根据实际情况进行修正</strong>，盲目抄代码不可取，重要的是适合自己的流程。</li>'
    html += '<li>该软件源代码于 Juse github 可见，如有错误或者可优化及改进的地方欢迎提交 PR 或联系 Juse 修改。</li>'
    html += '</ul></div>';
    html += '<h3><a href = "/pic2/jusekit.gif" target="_blank">🪢🖼️Jusekit v0.8 界面演示🖼️🪢（点击前往）</a></h3>';
    document.getElementById('portalContainer').innerHTML = html;
}