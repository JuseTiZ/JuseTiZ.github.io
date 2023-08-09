
function generatePortalLinks(currentArticleId) {
    var links = [
        { id: 1, title: "比较转录组分析 —— 前提及概要", url: "https://jusetiz.github.io/2022/11/01/比较转录组分析（一）—— 前提及概要" },
        { id: 2, title: "比较转录组分析 —— 原始数据的质控与转录组组装", url: "https://jusetiz.github.io/2022/11/06/比较转录组分析（二）—— 原始数据的质控与转录组组装" },
        { id: 3, title: "比较转录组分析 —— 组装的质量检测与去冗余", url: "https://jusetiz.github.io/2022/11/21/比较转录组分析（三）—— 组装的质量检测与去冗余" },
        { id: 4, title: "比较转录组分析 —— 组装的注释", url: "https://jusetiz.github.io/2022/11/28/比较转录组分析（四）—— 组装的注释" },
        { id: 5, title: "比较转录组分析 —— 转录本定量与差异表达分析", url: "https://jusetiz.github.io/2022/12/11/比较转录组分析（五）—— 转录本定量与差异表达分析" },
        { id: 6, title: "比较转录组分析 —— GO 富集分析与可视化", url: "https://jusetiz.github.io/2022/12/19/比较转录组分析（六）—— GO 富集分析与可视化" },
        { id: 7, title: "比较转录组分析 —— 系统发育分析", url: "https://jusetiz.github.io/2023/02/17/比较转录组分析（七）—— 系统发育分析" }
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

    var relatedlinks = [
        { title: "用于 IQtree 的序列串联方法", url: "https://jusetiz.github.io/2023/01/29/用于 IQtree 的序列串联方法" },
        { title: "关于 PAML 的一二三事", url: "https://jusetiz.github.io/2023/05/04/关于 PAML 的一二三事" },
        { title: "Astral 建树指南", url: "https://jusetiz.github.io/2023/06/23/Astral 建树指南" }, 
        { title: "贝叶斯建树之 Mrbayes 篇", url: "https://jusetiz.github.io/2023/07/06/贝叶斯建树之 Mrbayes 篇" }, 
        { title: "使用 IQTREE 计算一致性因子", url: "https://jusetiz.github.io/2023/07/07/使用 IQTREE 计算一致性因子" }, 
        { title: "DiscoVista 可视化系统发育不一致", url: "https://jusetiz.github.io/2023/07/12/DiscoVista 可视化系统发育不一致" }
    ];

    html += '<div class="rltpt"><h3>相关文章传送门</h3>';
    html += '<ul>';
    for (var i = 0; i < relatedlinks.length; i++) {
        html += '<li><a href="' + relatedlinks[i].url + '">' + relatedlinks[i].title + '</a></li>';
    }
    html += '</ul></div>';

    document.getElementById('portalContainer').innerHTML = html;
}