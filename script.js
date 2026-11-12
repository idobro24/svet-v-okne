// Все фразы приложения. Новую фразу можно добавить строкой в кавычках с запятой в конце.
const phrases = [
  'Сегодня достаточно просто прожить этот день.',
  'Тебе сейчас тяжело, и это нормально. Ты не обязана держаться.',
  'Плакать можно. Это не слабость, это сердце делает свою работу.',
  'Боль сейчас огромная, но она не навсегда. Она меняется, даже когда ты этого не замечаешь.',
  'Ты не должна понимать, что будет дальше. Достаточно сделать следующий маленький шаг.',
  'Конец брака не делает тебя неудачницей. Он делает тебя человеком, который прошёл через трудное.',
  'То, что пишут незнакомые люди, говорит о них, а не о тебе.',
  'Твоя ценность не уменьшилась ни на грамм.',
  'Первые недели самые тяжёлые. Потом становится понемногу легче, правда.',
  'Однажды ты поймаешь себя на том, что весь день не думала о боли. Этот день придёт.',
  'Через год ты будешь знать о себе то, чего не знаешь сегодня. И многое из этого тебе понравится.',
  'Чувство, что тебя никто не любит, — это боль, а не правда о тебе.',
  'Ты можешь быть для себя тем человеком, который говорит: «Я рядом».',
  'Вы с малышом уже команда. И эта команда сильнее, чем кажется.',
  'Твоему ребёнку нужна не идеальная мама, а живая и любящая. Такая, как ты.',
  'Не читай комментарии сегодня. Они подождут, а твоё спокойствие важнее.',
  'Выпей воды и выйди на пять минут на свежий воздух.'
];

// Находим элементы на странице по их id.
const phraseEl = document.getElementById('phrase');
const nextBtn = document.getElementById('next');
const saveBtn = document.getElementById('save');
const savedListEl = document.getElementById('saved-list');
const savedEmptyEl = document.getElementById('saved-empty');

// Номер фразы, которая сейчас на экране.
let current = 0;

// Идёт ли сейчас смена фразы (чтобы частые нажатия не сбивали анимацию).
let changing = false;

// Сколько длится затухание, в миллисекундах. Должно совпадать с transition в CSS.
const FADE_TIME = 500;

// ---------- Память телефона ----------

const STORAGE_KEY = 'savedPhrases';

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function storeSaved(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    // Если память недоступна, просто ничего не сохраняем.
  }
}

let saved = loadSaved();

// ---------- Сердечко ----------

function updateHeart() {
  const isSaved = saved.includes(phrases[current]);
  saveBtn.classList.toggle('saved', isSaved);
  saveBtn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
  saveBtn.setAttribute('aria-label', isSaved ? 'Убрать из сохранённых' : 'Сохранить фразу');
}

saveBtn.addEventListener('click', function () {
  const text = phrases[current];
  if (saved.includes(text)) {
    saved = saved.filter(function (item) { return item !== text; });
  } else {
    saved.push(text);
  }
  storeSaved(saved);
  updateHeart();
});

// ---------- Список сохранённых фраз ----------

// Заново рисуем список: для каждой сохранённой фразы создаём карточку с кнопкой «Убрать».
function renderSaved() {
  savedListEl.innerHTML = '';
  savedEmptyEl.hidden = saved.length > 0;

  saved.forEach(function (text) {
    const item = document.createElement('li');
    item.className = 'saved-item';

    const p = document.createElement('p');
    p.textContent = text;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Убрать';
    removeBtn.addEventListener('click', function () {
      saved = saved.filter(function (s) { return s !== text; });
      storeSaved(saved);
      renderSaved();
      updateHeart();
    });

    item.append(p, removeBtn);
    savedListEl.append(item);
  });
}

// ---------- Смена фраз ----------

function pickNext() {
  let index;
  do {
    index = Math.floor(Math.random() * phrases.length);
  } while (index === current);
  return index;
}

nextBtn.addEventListener('click', function () {
  if (changing) return;
  changing = true;

  phraseEl.classList.add('hidden');

  setTimeout(function () {
    current = pickNext();
    phraseEl.textContent = phrases[current];
    updateHeart();
    phraseEl.classList.remove('hidden');
    changing = false;
  }, FADE_TIME);
});

// ---------- Банка хороших моментов ----------

const JAR_KEY = 'jarNotes';

const jarCountEl = document.getElementById('jar-count');
const noteEl = document.getElementById('jar-note');
const noteDateEl = document.getElementById('note-date');
const noteTextEl = document.getElementById('note-text');
const noteDeleteBtn = document.getElementById('note-delete');
const jarForm = document.getElementById('jar-form');
const jarInput = document.getElementById('jar-input');
const jarCancelBtn = document.getElementById('jar-cancel');
const jarActions = document.getElementById('jar-actions');
const jarDrawBtn = document.getElementById('jar-draw');
const jarAddBtn = document.getElementById('jar-add');

function loadJar() {
  try {
    const raw = localStorage.getItem(JAR_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function storeJar(list) {
  try {
    localStorage.setItem(JAR_KEY, JSON.stringify(list));
  } catch (error) {
    // Если память недоступна, просто ничего не сохраняем.
  }
}

// Каждая записка — это объект: текст и дата, когда её положили в банку.
let jar = loadJar();

// Номер записки, которая сейчас открыта (-1 — никакая).
let shownNote = -1;

// «1 записка», «3 записки», «12 записок» — по правилам русского языка.
function notesWord(n) {
  const last = n % 10;
  const lastTwo = n % 100;
  if (last === 1 && lastTwo !== 11) return 'записка';
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'записки';
  return 'записок';
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function updateJarCount() {
  if (jar.length === 0) {
    jarCountEl.textContent = 'Банка пока пустая. Запиши первый хороший момент, даже совсем маленький.';
  } else {
    jarCountEl.textContent = 'В банке ' + jar.length + ' ' + notesWord(jar.length);
  }
  jarDrawBtn.hidden = jar.length === 0;
}

function showNote(index) {
  shownNote = index;
  noteDateEl.textContent = formatDate(jar[index].date);
  noteTextEl.textContent = jar[index].text;
  noteEl.hidden = false;
}

// Достаём случайную записку, по возможности не ту, что уже открыта.
jarDrawBtn.addEventListener('click', function () {
  if (jar.length === 0) return;
  let index = 0;
  if (jar.length > 1) {
    do {
      index = Math.floor(Math.random() * jar.length);
    } while (index === shownNote);
  }
  showNote(index);
});

function openForm() {
  jarForm.hidden = false;
  jarActions.hidden = true;
  noteEl.hidden = true;
  jarInput.focus();
}

function closeForm() {
  jarForm.hidden = true;
  jarActions.hidden = false;
  jarInput.value = '';
}

// Когда возвращаемся в банку, она снова «закрыта»: записка убрана, форма спрятана.
// Недописанный текст в форме при этом не стирается.
function resetJarView() {
  noteEl.hidden = true;
  jarForm.hidden = true;
  jarActions.hidden = false;
}

jarAddBtn.addEventListener('click', openForm);
jarCancelBtn.addEventListener('click', closeForm);

// Кладём новую записку в банку.
jarForm.addEventListener('submit', function (event) {
  event.preventDefault(); // не перезагружаем страницу
  const text = jarInput.value.trim();
  if (!text) {
    jarInput.focus();
    return;
  }
  jar.push({ text: text, date: new Date().toISOString() });
  storeJar(jar);
  closeForm();
  updateJarCount();
  showNote(jar.length - 1); // сразу показываем, что записка в банке
});

noteDeleteBtn.addEventListener('click', function () {
  if (shownNote < 0) return;
  if (!confirm('Убрать эту записку из банки?')) return;
  jar.splice(shownNote, 1);
  storeJar(jar);
  shownNote = -1;
  noteEl.hidden = true;
  updateJarCount();
});

// ---------- Дыхание ----------

const orbEl = document.getElementById('orb');
const breathTextEl = document.getElementById('breath-text');
const breathCountEl = document.getElementById('breath-count');
const breathBtn = document.getElementById('breath-btn');

// Фазы одного круга. Выдох длиннее вдоха — так тело быстрее успокаивается.
const PHASES = [
  { label: 'Вдох', time: 4000, big: true },
  { label: 'Задержи дыхание', time: 2000, big: true },
  { label: 'Выдох', time: 6000, big: false }
];

// 5 кругов по 12 секунд — ровно одна минута.
const TOTAL_ROUNDS = 5;

let breathTimer = null;
let phaseIndex = 0;
let round = 1;
let breathing = false;

function runPhase() {
  const phase = PHASES[phaseIndex];
  breathTextEl.textContent = phase.label;
  breathCountEl.textContent = 'Круг ' + round + ' из ' + TOTAL_ROUNDS;

  // Огонёк меняет размер ровно за время этой фазы.
  orbEl.style.transitionDuration = phase.time + 'ms';
  orbEl.classList.toggle('big', phase.big);

  breathTimer = setTimeout(function () {
    phaseIndex++;
    if (phaseIndex === PHASES.length) {
      phaseIndex = 0;
      round++;
      if (round > TOTAL_ROUNDS) {
        finishBreath();
        return;
      }
    }
    runPhase();
  }, phase.time);
}

function startBreath() {
  breathing = true;
  phaseIndex = 0;
  round = 1;
  breathBtn.textContent = 'Остановить';
  runPhase();
}

function stopBreath(message) {
  clearTimeout(breathTimer);
  breathing = false;
  orbEl.style.transitionDuration = '1500ms';
  orbEl.classList.remove('big');
  breathTextEl.textContent = message || 'Нажми, когда будешь готова';
  breathCountEl.textContent = '';
  breathBtn.textContent = 'Начать';
}

function finishBreath() {
  stopBreath('Ты молодец, что нашла эту минуту для себя.');
  breathBtn.textContent = 'Ещё минуту';
}

breathBtn.addEventListener('click', function () {
  if (breathing) {
    stopBreath();
  } else {
    startBreath();
  }
});

// ---------- Переключение разделов ----------

const views = document.querySelectorAll('.view');
const tabs = document.querySelectorAll('.tab');

// Показываем раздел с нужным именем, остальные прячем.
function show(name) {
  // Если ушли с экрана дыхания, останавливаем упражнение.
  if (name !== 'breath' && breathing) stopBreath();

  views.forEach(function (view) {
    view.hidden = view.id !== 'view-' + name;
  });

  // «Сохранённые» живут внутри раздела «Фразы», поэтому подсвечиваем его вкладку.
  const activeTab = name === 'saved' ? 'phrases' : name;
  tabs.forEach(function (tab) {
    if (tab.dataset.go === activeTab) {
      tab.setAttribute('aria-current', 'page');
    } else {
      tab.removeAttribute('aria-current');
    }
  });

  if (name === 'saved') renderSaved();
  if (name === 'jar') {
    resetJarView();
    updateJarCount();
  }
  window.scrollTo(0, 0);
}

// Любая кнопка с атрибутом data-go переключает на свой раздел.
document.querySelectorAll('[data-go]').forEach(function (button) {
  button.addEventListener('click', function () {
    show(button.dataset.go);
  });
});

// При открытии страницы.
updateHeart();
show('phrases');
