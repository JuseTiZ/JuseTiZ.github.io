setInterval(() => {
  let create_time = Math.round(new Date('2022-10-30 00:00:00').getTime() / 1000); //在此行修改建站时间
  let timestamp = Math.round((new Date().getTime()) / 1000);
  let second = timestamp - create_time;
  let time = new Array(0, 0, 0, 0, 0);

  var nol = function(h){
    return h>9?h:'0'+h;
  }
  if (second >= 365 * 24 * 3600) {
    time[0] = parseInt(second / (365 * 24 * 3600));
    second %= 365 * 24 * 3600;
  }
  if (second >= 24 * 3600) {
    time[1] = parseInt(second / (24 * 3600));
    second %= 24 * 3600;
  }
  if (second >= 3600) {
    time[2] = nol(parseInt(second / 3600));
    second %= 3600;
  }
  if (second >= 60) {
    time[3] = nol(parseInt(second / 60));
    second %= 60;
  }
  if (second > 0) {
    time[4] = nol(second);
  }
  if ((Number(time[2])<20) && (Number(time[2])>8)){
    currentTimeHtml ="<div class='juse-img'><img class='juseimg' src='https://img.shields.io/badge/Juse%F0%9F%94%8D-%E5%B7%A5%E4%BD%9C%E4%B8%AD%E2%9C%8A-blue' title='来一起工作吧伙计！~'></div><div class='juse-blog'>Juseの博客已经运行了 " + time[0] + ' 年 ' + time[1] + ' 天 ' + time[2] + ' 小时 ' + time[3] + ' 分 ' + time[4] + ' 秒，以后也请多关照</div>';
  }
  else{
    currentTimeHtml ="<div class='juse-img'><img class='juseimg' src='https://img.shields.io/badge/Juse%F0%9F%94%8D-%E6%91%B8%E9%B1%BC%E4%B8%AD%F0%9F%90%9F-blue' title='摸鱼时间到了放松下头脑！~'></div><div class='juse-blog'>Juseの博客已经运行了 " + time[0] + ' 年 ' + time[1] + ' 天 ' + time[2] + ' 小时 ' + time[3] + ' 分 ' + time[4] + ' 秒，以后也请多关照</div>';
  }
  document.getElementById("workboard").innerHTML = currentTimeHtml;
}, 1000);
