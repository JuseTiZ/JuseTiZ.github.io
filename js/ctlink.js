
function generatePortalLinks(currentArticleId) {
    var links = [
        { id: 1, title: "比较转录组分析 —— 前提及概要", url: "https://biojuse.com/2022/11/01/比较转录组分析（一）—— 前提及概要" },
        { id: 2, title: "比较转录组分析 —— 原始数据的质控与转录组组装", url: "https://biojuse.com/2022/11/06/比较转录组分析（二）—— 原始数据的质控与转录组组装" },
        { id: 3, title: "比较转录组分析 —— 组装的质量检测与去冗余", url: "https://biojuse.com/2022/11/21/比较转录组分析（三）—— 组装的质量检测与去冗余" },
        { id: 4, title: "比较转录组分析 —— 组装的注释", url: "https://biojuse.com/2022/11/28/比较转录组分析（四）—— 组装的注释" },
        { id: 5, title: "比较转录组分析 —— 转录本定量与差异表达分析", url: "https://biojuse.com/2022/12/11/比较转录组分析（五）—— 转录本定量与差异表达分析" },
        { id: 6, title: "比较转录组分析 —— GO 富集分析与可视化", url: "https://biojuse.com/2022/12/19/比较转录组分析（六）—— GO 富集分析与可视化" },
        { id: 7, title: "比较转录组分析 —— 系统发育分析", url: "https://biojuse.com/2023/02/17/比较转录组分析（七）—— 系统发育分析" }
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

    var relatedlinks = [
        { title: "用于 IQtree 的序列串联方法", url: "https://biojuse.com/2023/01/29/用于 IQtree 的序列串联方法" },
        { title: "关于 PAML 的一二三事", url: "https://biojuse.com/2023/05/04/关于 PAML 的一二三事" },
        { title: "Astral 建树指南", url: "https://biojuse.com/2023/06/23/Astral 建树指南" },
        { title: "贝叶斯建树之 Mrbayes 篇", url: "https://biojuse.com/2023/07/06/贝叶斯建树之 Mrbayes 篇" },
        { title: "使用 IQTREE 计算一致性因子", url: "https://biojuse.com/2023/07/07/使用 IQTREE 计算一致性因子" },
        { title: "DiscoVista 可视化系统发育不一致", url: "https://biojuse.com/2023/07/12/DiscoVista 可视化系统发育不一致" },
        { title: "JuseKit 系列文章", url: "https://biojuse.com/categories/%E8%BD%AF%E4%BB%B6%E5%BC%80%E5%8F%91/" },
        { title: "Snakemake pipeline 搭建的进阶教程", url: "https://biojuse.com/2024/07/06/Snakemake%20pipeline%20搭建的进阶教程" }
    ];

    html += '<div class="rltpt"><h3>🏷️🏷️相关文章传送门🏷️🏷️</h3>';
    html += '<ul>';
    for (var i = 0; i < relatedlinks.length; i++) {
        html += '<li><a href="' + relatedlinks[i].url + '">' + relatedlinks[i].title + '</a></li>';
    }
    html += '</ul></div>';

    html += '<div class="warning"><h3>⚡⚡阅读前<strong>须知事项</strong>⚡⚡</h3>';
    html += '<ul>';
    html += '<li>根据文章内容进行数据操作前，若相关操作涉及到原数据文件的变动（不管是内容还是位置），请<strong>做好备份</strong>以避免不可逆的数据丢失或者数据损坏。</li>'
    html += '<li>根据文章内容进行数据操作前，若相关操作涉及到大量文件，请<strong>选出一个小数据集（文件）</strong>进行试分析以确定是否能够正常运行并产生结果。</li>'
    html += '<li>根据文章内容进行命令执行前，若相关命令涉及到内存、线程等参数（或者是 & 等执行多条命令的操作），请<strong>留意电脑或服务器是否能够承受足够负载（htop）</strong>。</li>'
    html += '<li>文章中涉及到的脚本、命令参数等<strong>需根据实际情况进行修正</strong>，盲目抄代码不可取，重要的是适合自己的流程。</li>'
    html += '<li>文章内容如有错误，欢迎联系 Juse 或评论留言进行更正，请在看文章的同时<strong>保持批判思维</strong>。</li>'
    html += '<li>部分脚本可能在 Github 上有所更新但未同步到文章之中，若有需求点击<a href="https://github.com/JuseTiZ/PyScript-for-CT">此处</a>进行搜索。</li>'
    html += '<li>世界是运动的，文章中的部分内容会由于版本变动问题**在某个时候变得过时或不正确**，此时可尝试按照官网文档进行。</li>'
    html += '</ul></div>';

    document.getElementById('portalContainer').innerHTML = html;
}