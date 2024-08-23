function recordThemeChoice(newTheme = null) {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');

  // 如果传入了新主题，则使用新主题，否则切换主题
  const themeToSet = newTheme || (currentTheme === 'light' ? 'dark' : 'light');
  // 将新主题存储在localStorage中
  localStorage.setItem('userTheme', themeToSet);
  // 应用新主题
  html.setAttribute('data-theme', themeToSet);
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
      const switchToLight = confirm("根据您的本地时间将设定主题为夜间模式\n您要切换回白天模式吗（当前背景）？");
      if (switchToLight) {
        recordThemeChoice('light');
      } else {
        recordThemeChoice('dark');
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
