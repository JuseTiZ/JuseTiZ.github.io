function recordThemeChoice() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  localStorage.setItem('userTheme', currentTheme === 'light' ? 'dark' : 'light');
}

function setThemeBasedOnTime() {
  const html = document.documentElement;
  const userTheme = localStorage.getItem('userTheme');

  // 如果用户已经选择了主题，使用用户选择的主题
  if (userTheme) {
    html.setAttribute('data-theme', userTheme);
  } else {
    // 否则，根据当前时间设置主题
    const currentHour = new Date().getHours();
    const isDayTime = currentHour >= 7 && currentHour < 19;
    const theme = isDayTime ? 'light' : 'dark';
    html.setAttribute('data-theme', theme);

    // 如果自动设置为 dark 模式，弹出窗口询问是否要切换回 light 模式
    if (!isDayTime) {
      const switchToLight = confirm("根据您的本地时间将设定主题为夜间模式\n您要切换回白天模式吗（当前背景）？\n（右下角小齿轮处设置主题模式）");
      if (switchToLight) {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('userTheme', 'light');
      } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('userTheme', 'dark');
      }
    }
  }
}

// 在页面加载时调用函数
window.addEventListener('DOMContentLoaded', function() {
  setThemeBasedOnTime();

  // 为切换主题按钮添加点击事件监听器
  const themeSwitcherButton = document.getElementById('darkmode');
  if (themeSwitcherButton) {
    themeSwitcherButton.addEventListener('click', recordThemeChoice);
  }
});
