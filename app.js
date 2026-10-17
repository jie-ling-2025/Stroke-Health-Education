'use strict';

const menuToggle = document.querySelector('#menu-toggle');
const navigation = document.querySelector('#navigation');
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? '關閉導覽選單' : '開啟導覽選單');
  navigation.classList.toggle('open', isOpen);
});
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '開啟導覽選單');
  navigation.classList.remove('open');
}
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});
document.querySelector('#font-toggle').addEventListener('click', event => {
  const isLarge = document.documentElement.classList.toggle('large-text');
  event.currentTarget.setAttribute('aria-pressed', String(isLarge));
  event.currentTarget.setAttribute('aria-label', isLarge ? '恢復標準文字大小' : '放大文字');
  updateReadingProgress();
});
function updateReadingProgress() {
  const range = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = range > 0 ? Math.min(100, Math.max(0, window.scrollY / range * 100)) : 0;
  document.querySelector('#reading-progress').style.width = `${percentage}%`;
}
window.addEventListener('scroll', updateReadingProgress, { passive: true });
window.addEventListener('resize', updateReadingProgress);
updateReadingProgress();

const slides = [
  { title: '把握當下，<br>守護<span class="underline">腦健康。</span>', description: '當中風突然發生，懂得辨識、及時行動，<br class="desktop-break">就是你能為家人做的第一件事。', button: '認識中風警訊', href: '#recognize' },
  { title: '不再等待，<br>立即<span class="underline">採取行動。</span>', description: '突然臉歪、手無力或說不清楚？<br class="desktop-break">記下時間，立即打 119，讓專業團隊接手。', button: '了解緊急應對', href: '#action' },
  { title: '一起學習，<br>安心<span class="underline">陪伴照護。</span>', description: '從吞嚥安全到返家準備，<br class="desktop-break">把每一個照護問題，和醫療團隊一起問清楚。', button: '看看照護重點', href: '#care' }
];
let activeSlide = 0;
function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  const slide = slides[activeSlide];
  document.querySelector('h1').innerHTML = slide.title;
  document.querySelector('#hero-description').innerHTML = slide.description;
  const primary = document.querySelector('#hero-primary');
  primary.innerHTML = `${slide.button} <span>↗</span>`;
  primary.setAttribute('href', slide.href);
  document.querySelector('#slide-counter').textContent = `0${activeSlide + 1} / 03`;
  document.querySelectorAll('[data-slide]').forEach((dot, i) => {
    dot.classList.toggle('active', i === activeSlide);
    dot.setAttribute('aria-pressed', String(i === activeSlide));
  });
}
document.querySelector('#slide-prev').addEventListener('click', () => showSlide(activeSlide - 1));
document.querySelector('#slide-next').addEventListener('click', () => showSlide(activeSlide + 1));
document.querySelectorAll('[data-slide]').forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.slide))));

const treatmentTabs = [...document.querySelectorAll('[data-treatment]')];
function selectTreatment(tab) {
  treatmentTabs.forEach(button => {
    const isSelected = button === tab;
    button.setAttribute('aria-selected', String(isSelected));
    button.tabIndex = isSelected ? 0 : -1;
    document.querySelector(`#panel-${button.dataset.treatment}`).hidden = !isSelected;
  });
  updateReadingProgress();
}
treatmentTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTreatment(tab));
  tab.addEventListener('keydown', event => {
    let target;
    if (event.key === 'ArrowRight') target = treatmentTabs[(index + 1) % treatmentTabs.length];
    if (event.key === 'ArrowLeft') target = treatmentTabs[(index - 1 + treatmentTabs.length) % treatmentTabs.length];
    if (event.key === 'Home') target = treatmentTabs[0];
    if (event.key === 'End') target = treatmentTabs[treatmentTabs.length - 1];
    if (target) { event.preventDefault(); selectTreatment(target); target.focus(); }
  });
});
const checklistInputs = [...document.querySelectorAll('.checklist input')];
checklistInputs.forEach(input => input.addEventListener('change', () => {
  const count = checklistInputs.filter(item => item.checked).length;
  document.querySelector('#checklist-status').textContent = count === checklistInputs.length ? '5 / 5 項已確認；有疑問時，仍可再請教醫療團隊。' : `已確認 ${count} / 5 項`;
}));
document.querySelector('#print-button').addEventListener('click', () => window.print());
document.querySelectorAll('details').forEach(details => details.addEventListener('toggle', updateReadingProgress));

const questions = [
  { question: '吃早餐時，家人突然嘴角歪斜、說話含糊。你會怎麼做？', options: ['先喝點水，休息一下再看看', '立即打 119，記下症狀開始時間', '自己開車，順路買藥再去醫院'], correct: 1, explanation: '出現一項中風警訊，就應立即打 119。記下發作時間，不餵水、不自行給藥，也不要自己開車就醫。' },
  { question: '剛剛手臂突然無力，幾分鐘後又好了。接下來呢？', options: ['症狀好了，今天先不用處理', '等下次回診時再說', '即使恢復，仍立即打 119 求助'], correct: 2, explanation: '症狀消失不代表安全，可能是暫時性腦缺血等警訊。仍需立即就醫評估，不能在家自行排除中風。' },
  { question: '等待救護車時，家人想喝水，也想先吃阿斯匹靈。你會怎麼做？', options: ['先不餵水或給藥，依 119 指示處理', '喝少量水、吃半顆藥應該沒關係', '只要吞得下，就讓他自己決定'], correct: 0, explanation: '中風可能造成吞嚥障礙，且出血性中風不能自行服用阿斯匹靈。不要給食物、水或藥物，依救護指示處理。' }
];
let questionIndex = 0;
let correctCount = 0;
let answered = false;
const questionHeading = document.querySelector('#quiz-question');
const optionsContainer = document.querySelector('#quiz-options');
const feedback = document.querySelector('#quiz-feedback');
const nextButton = document.querySelector('#quiz-next');
function renderQuestion(shouldFocus = false) {
  answered = false;
  const question = questions[questionIndex];
  document.querySelector('#quiz-progress').textContent = `第 ${questionIndex + 1} 題，共 ${questions.length} 題`;
  document.querySelector('#quiz-progress-bar').style.width = `${(questionIndex + 1) / questions.length * 100}%`;
  questionHeading.textContent = question.question;
  questionHeading.hidden = false;
  optionsContainer.hidden = false;
  optionsContainer.replaceChildren();
  feedback.hidden = true;
  feedback.replaceChildren();
  nextButton.hidden = true;
  document.querySelector('#quiz-result').hidden = true;
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    const label = document.createElement('span');
    label.textContent = String.fromCharCode(65 + index);
    label.setAttribute('aria-hidden', 'true');
    button.append(label, document.createTextNode(option));
    button.addEventListener('click', () => answerQuestion(index));
    optionsContainer.append(button);
  });
  if (shouldFocus) questionHeading.focus({ preventScroll: true });
  updateReadingProgress();
}
function answerQuestion(selected) {
  if (answered) return;
  answered = true;
  const question = questions[questionIndex];
  const isCorrect = selected === question.correct;
  if (isCorrect) correctCount += 1;
  [...optionsContainer.children].forEach((button, index) => {
    button.disabled = true;
    if (index === question.correct) button.classList.add('correct');
    if (index === selected && !isCorrect) button.classList.add('incorrect');
  });
  const title = document.createElement('strong');
  title.textContent = isCorrect ? '✓ 答對了，這就是關鍵行動！' : '一起記住更安全的做法';
  feedback.append(title, document.createTextNode(question.explanation));
  feedback.hidden = false;
  nextButton.textContent = questionIndex === questions.length - 1 ? '查看學習結果 →' : '下一題 →';
  nextButton.hidden = false;
  nextButton.focus({ preventScroll: true });
  updateReadingProgress();
}
nextButton.addEventListener('click', () => {
  if (!answered) return;
  if (questionIndex < questions.length - 1) {
    questionIndex += 1;
    renderQuestion(true);
  } else {
    questionHeading.hidden = true;
    optionsContainer.hidden = true;
    feedback.hidden = true;
    nextButton.hidden = true;
    document.querySelector('#quiz-result').hidden = false;
    document.querySelector('#quiz-progress').textContent = '練習完成';
    document.querySelector('#quiz-score').textContent = `完成練習！答對 ${correctCount} / ${questions.length} 題`;
    document.querySelector('#quiz-restart').focus({ preventScroll: true });
    updateReadingProgress();
  }
});
document.querySelector('#quiz-restart').addEventListener('click', () => {
  questionIndex = 0;
  correctCount = 0;
  renderQuestion(true);
});
renderQuestion();
