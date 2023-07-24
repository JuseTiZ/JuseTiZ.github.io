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
    currentTimeHtml ="正值美好时光，为了科研加油！<br>这个博客已经运行了 " + time[0] + ' 年 ' + time[1] + ' 天 ' + time[2] + ' 小时 ' + time[3] + ' 分 ' + time[4] + ' 秒<br>以后也请多关照';
  }
  else{
    currentTimeHtml ="摸鱼时间到了，给自己放个假~<br>这个博客已经运行了 " + time[0] + ' 年 ' + time[1] + ' 天 ' + time[2] + ' 小时 ' + time[3] + ' 分 ' + time[4] + ' 秒<br>以后也请多关照';
  }
  document.getElementById("workboard").innerHTML = currentTimeHtml;
}, 1000);
