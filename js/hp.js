const textContent = document.getElementById("textContent");
const textModule = document.getElementById("textModule");
const texts = [
                '最大的希望：家人健康幸福',
                '目前的计划：科研有所成就',
                '当前的状态：回到学校上学',
                '现有的成就：谈了个可爱的女朋友',
              ];
let currentIndex = 0;

function changeText() {
    textContent.classList.remove("fade-in");
    textContent.classList.add("fade-out");

    setTimeout(() => {
        if (currentIndex >= texts.length) {
            currentIndex = 0;
        }
        html = '<strong>';
        html += texts[currentIndex];
        html += '</strong>';
        html += '<br>' + (currentIndex + 1) + '/' + texts.length;
        document.getElementById('textContent').innerHTML = html;
        textContent.classList.remove("fade-out");
        textContent.classList.add("fade-in");
        currentIndex++;
    }, 1000);
}

textModule.addEventListener('click', changeText);

changeText();