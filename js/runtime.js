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
  if ((Number(time[2])<22) && (Number(time[2])>7)){
    currentTimeHtml ="<img class='boardsign' src='https://img.shields.io/badge/%F0%9F%92%AA-Juse%20%E6%89%93%E5%B7%A5%E4%B8%AD-blue' title='为了科研加油吧'><div id='runtime'>" + time[0] + ' YEAR ' + time[1] + ' DAYS ' + time[2] + ' : ' + time[3] + ' : ' + time[4] + '</div>这个博客竟然已经运行了那么久了<br>以后也请多关照';
  }
  else{
    currentTimeHtml ="<img class='boardsign' src='https://img.shields.io/badge/%F0%9F%92%A4-Juse%20%E7%9D%A1%E7%9C%A0%E4%B8%AD-blue' title='摸鱼时间到了给自己放个假'><div id='runtime'>" + time[0] + ' YEAR ' + time[1] + ' DAYS ' + time[2] + ' : ' + time[3] + ' : ' + time[4] + '</div>这个博客竟然已经运行了那么久了<br>以后也请多关照';
  }
  document.getElementById("workboard").innerHTML = currentTimeHtml;
}, 1000);
