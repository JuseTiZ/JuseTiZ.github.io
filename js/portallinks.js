
function generatePortalLinks(currentArticleId) {
    var links = [
        //填写 id 及对应的标题和链接
        { id: 1, title: "这里填写标题 1", url: "这里填写链接 1" },
        { id: 2, title: "这里填写标题 2", url: "这里填写链接 2" },
        { id: 3, title: "这里填写标题 3", url: "这里填写链接 3" },
        { id: 4, title: "这里填写标题 4", url: "这里填写链接 4" },
        //如果还有更多就继续依次填写
    ];

    var html = '<div class="portal">';
    //看自己需要可以修改部分
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
