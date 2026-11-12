// ---------- Ответы о себе (первый вход) ----------

const PROFILE_KEY = 'profile';

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function storeProfile(data) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
  } catch (error) {
    // Если память недоступна, просто ничего не сохраняем.
  }
}

// { people: true/false, baby: true/false } или null, если человек ещё не отвечал.
let profile = loadProfile();

// ---------- Фразы ----------

// Все фразы приложения. У некоторых есть пометка only — кому их показывать:
//   'people' — тем, у кого есть с кем поговорить;
//   'alone'  — тем, кому сейчас не с кем;
//   'baby'   — тем, кто ждёт ребёнка.
// Фразы без пометки видят все. Новую фразу добавляйте по тому же образцу.
const ALL_PHRASES = [
  { text: 'Сегодня достаточно просто прожить этот день.' },
  { text: 'Тебе сейчас тяжело, и это нормально. Ты не обязана держаться.' },
  { text: 'Плакать можно. Это не слабость, это сердце делает свою работу.' },
  { text: 'Боль сейчас огромная, но она не навсегда. Она меняется, даже когда ты этого не замечаешь.' },
  { text: 'Ты не должна понимать, что будет дальше. Достаточно сделать следующий маленький шаг.' },
  { text: 'Конец брака не делает тебя неудачницей. Он делает тебя человеком, который прошёл через трудное.' },
  { text: 'То, что пишут незнакомые люди, говорит о них, а не о тебе.' },
  { text: 'Твоя ценность не уменьшилась ни на грамм.' },
  { text: 'Первые недели самые тяжёлые. Потом становится понемногу легче, правда.' },
  { text: 'Однажды ты поймаешь себя на том, что весь день не думала о боли. Этот день придёт.' },
  { text: 'Через год ты будешь знать о себе то, чего не знаешь сегодня. И многое из этого тебе понравится.' },
  { text: 'Чувство, что тебя никто не любит, — это боль, а не правда о тебе.' },
  { text: 'Ты можешь быть для себя тем человеком, который говорит: «Я рядом».' },
  { text: 'Не читай комментарии сегодня. Они подождут, а твоё спокойствие важнее.' },
  { text: 'Выпей воды и выйди на пять минут на свежий воздух.' },

  { text: 'Напиши кому-то, кто тебя любит. Даже короткое «мне сейчас тяжело» — это уже много.', only: 'people' },
  { text: 'Разрешай близким помогать. Им важно быть рядом с тобой.', only: 'people' },

  { text: 'Если сейчас кажется, что рядом никого нет, это чувство настоящее. Но оно не приговор.', only: 'alone' },
  { text: 'Тебе не обязательно иметь кого-то, чтобы заслуживать заботы. Ты заслуживаешь её и так.', only: 'alone' },
  { text: 'Пустота сейчас не значит пустота навсегда. Новые люди приходят, даже когда кажется, что уже не придут.', only: 'alone' },

  { text: 'Вы с малышом уже команда. И эта команда сильнее, чем кажется.', only: 'baby' },
  { text: 'Твоему ребёнку нужна не идеальная мама, а живая и любящая. Такая, как ты.', only: 'baby' },
  { text: 'Каждый раз, когда ты отдыхаешь и заботишься о себе, ты заботишься и о малыше.', only: 'baby' }
];

// Отбираем фразы, которые подходят этому человеку.
function availablePhrases() {
  const p = profile || {};
  return ALL_PHRASES.filter(function (item) {
    if (!item.only) return true;
    if (item.only === 'people') return p.people === true;
    if (item.only === 'alone') return p.people === false;
    if (item.only === 'baby') return p.baby === true;
    return false;
  }).map(function (item) {
    return item.text;
  });
}

let phrases = availablePhrases();

// Находим элементы на странице по их id.
const phraseEl = document.getElementById('phrase');
const nextBtn = document.getElementById('next');
const saveBtn = document.getElementById('save');
const savedListEl = document.getElementById('saved-list');
const savedEmptyEl = document.getElementById('saved-empty');

// Номер фразы, которая сейчас на экране.
let current = 0;

// Текст, который сейчас на экране (это может быть и ответ на «погоду»).
let currentText = phrases[0];

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
  const isSaved = saved.includes(currentText);
  saveBtn.classList.toggle('saved', isSaved);
  saveBtn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
  saveBtn.setAttribute('aria-label', isSaved ? 'Убрать из сохранённых' : 'Сохранить фразу');
}

saveBtn.addEventListener('click', function () {
  const text = currentText;
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

// Плавно меняем текст на экране: прячем старый, ставим новый, показываем.
function fadeTo(text) {
  if (changing) return;
  changing = true;
  phraseEl.classList.add('hidden');

  setTimeout(function () {
    currentText = text;
    phraseEl.textContent = text;
    updateHeart();
    phraseEl.classList.remove('hidden');
    changing = false;
  }, FADE_TIME);
}

nextBtn.addEventListener('click', function () {
  if (changing) return;
  current = pickNext();
  fadeTo(phrases[current]);
});

// ---------- Погода внутри ----------

const MOOD_KEY = 'moodByDay';

// Для каждой «погоды»: значок, название и фраза-ответ.
const MOODS = {
  storm: { icon: '⛈️', name: 'гроза', phrase: 'Грозы проходят, даже самые сильные. Сегодня можно просто переждать.' },
  fog:   { icon: '🌫️', name: 'туман', phrase: 'В тумане не нужно видеть далеко. Достаточно следующего маленького шага.' },
  cloud: { icon: '☁️', name: 'облачно', phrase: 'Облачно — тоже погода. Береги себя сегодня чуть больше обычного.' },
  sun:   { icon: '🌤️', name: 'солнце', phrase: 'Как хорошо, что проглянуло солнце. Может, положишь этот момент в банку?' }
};

const moodAskEl = document.getElementById('mood-ask');
const moodTodayEl = document.getElementById('mood-today');
const moodTodayTextEl = document.getElementById('mood-today-text');
const moodChangeBtn = document.getElementById('mood-change');
const moodWeekEl = document.getElementById('mood-week');
const careCardEl = document.getElementById('care-card');

function loadMoods() {
  try {
    const raw = localStorage.getItem(MOOD_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function storeMoods(data) {
  try {
    localStorage.setItem(MOOD_KEY, JSON.stringify(data));
  } catch (error) {
    // Если память недоступна, просто ничего не сохраняем.
  }
}

// Отметки хранятся по дням: { '2026-11-12': 'fog', ... }
let moods = loadMoods();

// Дата в виде '2026-11-12' по времени телефона.
function dayKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

// Дата, которая была `daysAgo` дней назад.
function daysAgo(n) {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

// Сколько гроз было за последние 7 дней.
function countStorms() {
  let count = 0;
  for (let i = 0; i < 7; i++) {
    if (moods[dayKey(daysAgo(i))] === 'storm') count++;
  }
  return count;
}

// Рисуем полоску из 7 дней: от самого старого слева до сегодня справа.
function renderWeek() {
  moodWeekEl.innerHTML = '';
  for (let i = 6; i >= 0; i--) {
    const date = daysAgo(i);
    const mood = moods[dayKey(date)];

    const item = document.createElement('li');
    item.setAttribute('aria-label',
      date.toLocaleDateString('ru-RU', { weekday: 'long' }) + ': ' + (mood ? MOODS[mood].name : 'без отметки'));

    const icon = document.createElement('span');
    icon.className = 'mood-week-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = mood ? MOODS[mood].icon : '·';

    const day = document.createElement('span');
    day.className = 'mood-week-day';
    day.setAttribute('aria-hidden', 'true');
    day.textContent = date.toLocaleDateString('ru-RU', { weekday: 'short' });

    item.append(icon, day);
    moodWeekEl.append(item);
  }
}

function renderMood() {
  const today = moods[dayKey(new Date())];
  moodAskEl.hidden = Boolean(today);
  moodTodayEl.hidden = !today;
  if (today) {
    moodTodayTextEl.textContent = 'Сегодня у тебя ' + MOODS[today].name + ' ' + MOODS[today].icon;
    renderWeek();
  }
  // Если гроз 4 и больше за неделю, бережно предлагаем поддержку.
  careCardEl.hidden = countStorms() < 4;

  // Идеи самопомощи под сегодняшнюю погоду.
  renderSelfCare(today);
}

document.querySelectorAll('.mood-btn').forEach(function (button) {
  button.addEventListener('click', function () {
    const mood = button.dataset.mood;
    moods[dayKey(new Date())] = mood;
    storeMoods(moods);
    renderMood();
    fadeTo(MOODS[mood].phrase); // отвечаем фразой под настроение
  });
});

moodChangeBtn.addEventListener('click', function () {
  moodAskEl.hidden = false;
  moodTodayEl.hidden = true;
});

// ---------- Самопомощь под погоду ----------

// Идеи для каждой погоды. У некоторых есть кнопка-действие (go — какой раздел открыть)
// и пометка only — как у фраз: 'people', 'alone' или 'baby'.
const SELF_CARE = {
  storm: [
    { text: 'Подыши со мной одну минуту. Выдох длиннее вдоха — так тело быстрее успокаивается.', action: { label: 'Подышать', go: 'breath' } },
    { text: 'Где-то глубоко в тебе есть ты маленькая. Ей сейчас страшно. Положи руку на сердце и скажи ей: «Я с тобой. Мы справимся».' },
    { text: 'Назови 5 вещей, которые видишь, 4 — которые можешь потрогать, 3 звука, 2 запаха и 1 вкус. Это возвращает в «здесь и сейчас».' },
    { text: 'Укутайся в плед и сделай тёплый чай. Тепло помогает телу почувствовать себя в безопасности.' },
    { text: 'Разреши себе поплакать. Не нужно держаться, слёзы тоже помогают.' },
    { text: 'Отложи телефон и не открывай комментарии хотя бы час.' },
    { text: 'Напиши тому, кто рядом: «Мне сейчас тяжело, можешь позвонить?» Просить о помощи — нормально.', only: 'people', action: { label: 'Написать', share: 'Мне сейчас тяжело, можешь позвонить?' } },
    { text: 'Позвони на телефон доверия. Там выслушают без осуждения, даже если просто хочется поговорить.', only: 'alone', action: { label: 'Открыть помощь', go: 'help' } }
  ],
  fog: [
    { text: 'Выпей стакан воды. Это самое маленькое, что можно сделать для себя прямо сейчас.' },
    { text: 'Вспомни себя маленькую. Что бы ты сказала ей, если бы она грустила? Скажи это себе, тихо или вслух.' },
    { text: 'Открой окно и подыши свежим воздухом хотя бы минуту.' },
    { text: 'Прими тёплый душ. Вода хорошо возвращает ощущение тела.' },
    { text: 'Назови чувство словом: «мне грустно», «мне пусто», «я злюсь». Так туман становится чуть прозрачнее.' },
    { text: 'Наведи порядок на одном маленьком месте: тумбочка, одна полка. Видимый результат за пять минут.' },
    { text: 'Подыши минуту вместе с огоньком.', action: { label: 'Подышать', go: 'breath' } }
  ],
  cloud: [
    { text: 'Достань записку из банки и вспомни что-то хорошее.', action: { label: 'Открыть банку', go: 'jar' } },
    { text: 'Внутри тебя есть ты маленькая. Сделай сегодня что-то приятное для неё: какао, мультик, плед, любимая песня из детства.' },
    { text: 'Выйди на 10 минут на дневной свет, даже просто дойти до магазина.' },
    { text: 'Включи любимую песню или уютный сериал.' },
    { text: 'Съешь что-то вкусное и не торопись.' },
    { text: 'Потянись пару минут, особенно спину и плечи.' },
    { text: 'Запиши в банку один хороший момент сегодняшнего дня, даже совсем маленький.', action: { label: 'Записать момент', go: 'jar' } }
  ]
};

// Открываем окно «Поделиться» с готовым текстом: человек сам выбирает,
// кому и через что отправить — мессенджер, СМС или почта.
// Если браузер так не умеет, открываем СМС с этим текстом.
function shareText(text) {
  if (navigator.share) {
    navigator.share({ text: text }).catch(function () {
      // Человек закрыл окно, ничего не отправив, — это нормально.
    });
  } else {
    window.location.href = 'sms:?body=' + encodeURIComponent(text);
  }
}

// Сколько идей показываем за раз.
const IDEAS_AT_ONCE = 3;

const selfcareEl = document.getElementById('selfcare');
const selfcareListEl = document.getElementById('selfcare-list');
const selfcareMoreBtn = document.getElementById('selfcare-more');

let ideas = [];        // перемешанные идеи для текущей погоды
let ideasOffset = 0;   // с какой идеи начинаем показывать
let ideasMood = null;  // для какой погоды они перемешаны

// Перемешиваем список (алгоритм Фишера — Йетса).
function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

// Подходит ли идея этому человеку (по ответам при первом входе).
function fitsProfile(item) {
  const p = profile || {};
  if (!item.only) return true;
  if (item.only === 'people') return p.people === true;
  if (item.only === 'alone') return p.people === false;
  if (item.only === 'baby') return p.baby === true;
  return false;
}

function renderIdeas() {
  selfcareListEl.innerHTML = '';
  for (let i = 0; i < Math.min(IDEAS_AT_ONCE, ideas.length); i++) {
    const idea = ideas[(ideasOffset + i) % ideas.length];

    const item = document.createElement('li');
    const text = document.createElement('span');
    text.textContent = idea.text;
    item.append(text);

    if (idea.action) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'selfcare-action';
      button.textContent = idea.action.label;
      button.addEventListener('click', function () {
        if (idea.action.share) {
          shareText(idea.action.share);
        } else {
          show(idea.action.go);
        }
      });
      item.append(button);
    }

    selfcareListEl.append(item);
  }
}

// Показываем блок для выбранной погоды. Для солнца он не нужен.
function renderSelfCare(mood) {
  if (!mood || !SELF_CARE[mood]) {
    selfcareEl.hidden = true;
    ideasMood = null;
    return;
  }
  // Перемешиваем заново, только если погода поменялась.
  if (mood !== ideasMood) {
    ideas = shuffle(SELF_CARE[mood].filter(fitsProfile));
    ideasOffset = 0;
    ideasMood = mood;
  }
  selfcareEl.hidden = false;
  renderIdeas();
}

selfcareMoreBtn.addEventListener('click', function () {
  ideasOffset = (ideasOffset + IDEAS_AT_ONCE) % ideas.length;
  renderIdeas();
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

// ---------- Первый вход ----------

const startDoneBtn = document.getElementById('start-done');
const startBabyInput = document.getElementById('start-baby');
const peopleInputs = document.querySelectorAll('input[name="people"]');
const helpBabyEl = document.getElementById('help-baby');
const editProfileBtn = document.getElementById('edit-profile');
const tabbarEl = document.querySelector('.tabbar');

// Кнопка «Дальше» становится активной, когда выбран ответ на вопрос.
peopleInputs.forEach(function (input) {
  input.addEventListener('change', function () {
    startDoneBtn.disabled = false;
  });
});

// Показываем или прячем то, что зависит от ответов.
function applyProfile() {
  helpBabyEl.hidden = !(profile && profile.baby);
}

startDoneBtn.addEventListener('click', function () {
  const chosen = document.querySelector('input[name="people"]:checked');
  if (!chosen) return;

  profile = { people: chosen.value === 'yes', baby: startBabyInput.checked };
  storeProfile(profile);

  // Пересобираем список фраз под новые ответы и начинаем с первой.
  phrases = availablePhrases();
  current = 0;
  currentText = phrases[0];
  phraseEl.textContent = currentText;
  updateHeart();

  applyProfile();
  ideasMood = null; // идеи пересоберутся под новые ответы
  show('phrases');
});

// Открываем вопросы заново, с уже отмеченными ответами.
editProfileBtn.addEventListener('click', function () {
  if (profile) {
    peopleInputs.forEach(function (input) {
      input.checked = (input.value === 'yes') === profile.people;
    });
    startBabyInput.checked = profile.baby;
    startDoneBtn.disabled = false;
  }
  show('start');
});

// ---------- Переключение разделов ----------

const views = document.querySelectorAll('.view');
const tabs = document.querySelectorAll('.tab');

// Показываем раздел с нужным именем, остальные прячем.
function show(name) {
  // На экране первого входа нижнее меню не нужно.
  tabbarEl.hidden = name === 'start';

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

  if (name === 'phrases') renderMood();
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

// При открытии страницы: если человек ещё не отвечал на вопросы, начинаем с них.
updateHeart();
applyProfile();
show(profile ? 'phrases' : 'start');
