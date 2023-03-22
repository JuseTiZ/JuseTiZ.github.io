function changeph() {

    document.getElementsByName("nick")[0].setAttribute("placeholder","昵称，不填默认匿名");
    document.getElementsByName("mail")[0].setAttribute("placeholder","邮箱（选填）");
    document.getElementsByName("link")[0].setAttribute("placeholder","网址（选填）");

}

window.onload = changeph;