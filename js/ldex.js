function recordThemeChoice() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');

  // 将用户的选择存储在localStorage中
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  // 将新主题存储在localStorage中
  localStorage.setItem('userTheme', newTheme);
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
    const theme = (currentHour >= 7 && currentHour < 19) ? 'light' : 'dark';
    html.setAttribute('data-theme', theme);
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