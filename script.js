// Версия приложения. Меняйте её здесь при каждом заметном обновлении,
// и она сама обновится внизу экранов и в разделе «О приложении».
const APP_VERSION = '1.1';

document.querySelectorAll('[data-version]').forEach(function (el) {
  el.textContent = APP_VERSION;
});

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
  { text: 'Ты не должна быть сильной каждый день. Иногда достаточно просто быть.' },
  { text: 'Сегодняшний день не определяет всю твою жизнь.' },
  { text: 'Ты уже пережила много трудных дней. Переживёшь и этот.' },
  { text: 'Отдых — это не лень. Это то, что тебе сейчас нужно.' },
  { text: 'Ты имеешь право на свою версию истории и на свои чувства, какими бы они ни были.' },
  { text: 'Ты не обязана объяснять свой развод тем, кто в нём не жил.' },
  { text: 'Можно одновременно грустить и надеяться. Одно не отменяет другого.' },
  { text: 'Маленькие шаги — тоже шаги. Сегодня их достаточно.' },
  { text: 'Ты — не то, что о тебе пишут. Ты — то, как ты заботишься о себе и о других.' },
  { text: 'Будь с собой такой же бережной, какой была бы с лучшей подругой.' },
  { text: 'Новая жизнь не обязана начинаться с большого решения. Иногда она начинается с прогулки или книги.' },
  { text: 'Твоё сердце умеет восстанавливаться. Дай ему время.' },
  { text: 'Не сравнивай себя с чужими красивыми картинками. Там не видно их трудных ночей.' },
  { text: 'Ты заслуживаешь любви, в том числе своей собственной.' },
  { text: 'Если сегодня получилось только встать с кровати — это тоже победа.' },

  { text: 'Напиши кому-то, кто тебя любит. Даже короткое «мне сейчас тяжело» — это уже много.', only: 'people' },
  { text: 'Разрешай близким помогать. Им важно быть рядом с тобой.', only: 'people' },
  { text: 'Ты не обязана рассказывать всем свою историю. Но одному близкому человеку — можно.', only: 'people' },

  { text: 'Если сейчас кажется, что рядом никого нет, это чувство настоящее. Но оно не приговор.', only: 'alone' },
  { text: 'Тебе не обязательно иметь кого-то, чтобы заслуживать заботы. Ты заслуживаешь её и так.', only: 'alone' },
  { text: 'Пустота сейчас не значит пустота навсегда. Новые люди приходят, даже когда кажется, что уже не придут.', only: 'alone' },
  { text: 'Близость можно строить заново, понемногу: курсы, кружок, группа поддержки.', only: 'alone' },
  { text: 'Ты уже здесь и читаешь эти слова. Значит, часть тебя продолжает искать свет. Береги её.', only: 'alone' },

  { text: 'Вы с малышом уже команда. И эта команда сильнее, чем кажется.', only: 'baby' },
  { text: 'Твоему ребёнку нужна не идеальная мама, а живая и любящая. Такая, как ты.', only: 'baby' },
  { text: 'Каждый раз, когда ты отдыхаешь и заботишься о себе, ты заботишься и о малыше.', only: 'baby' },
  { text: 'Однажды ты будешь держать малыша на руках, и этот момент будет только вашим.', only: 'baby' },
  { text: 'Твой малыш придёт в мир, где его очень ждут. И это ты.', only: 'baby' },
  { text: 'Просить о помощи во время беременности — нормально. Это забота о вас обоих.', only: 'baby' }
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
  fog:   { icon: '💭', name: 'туман', phrase: 'В тумане не нужно видеть далеко. Достаточно следующего маленького шага.' },
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

// Рисуем текущую неделю: с понедельника по воскресенье.
// Прошедшие дни показывают отметку (или точку), будущие — бледные.
function renderWeek() {
  moodWeekEl.innerHTML = '';
  const today = new Date();
  const todayKey = dayKey(today);
  const daysSinceMonday = (today.getDay() + 6) % 7; // в JS неделя начинается с воскресенья (0)

  for (let i = 0; i < 7; i++) {
    const date = daysAgo(daysSinceMonday - i);
    const key = dayKey(date);
    const mood = moods[key];
    const isFuture = key > todayKey;

    const item = document.createElement('li');
    if (key === todayKey) item.classList.add('today');
    if (isFuture) item.classList.add('future');
    item.setAttribute('aria-label',
      date.toLocaleDateString('ru-RU', { weekday: 'long' }) + ': '
      + (isFuture ? 'ещё впереди' : (mood ? MOODS[mood].name : 'без отметки')));

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
    // Погоду только что выбрали — сразу раскрываем идеи, чем себе помочь.
    setSelfcareOpen(true);
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
const selfcareToggleBtn = document.getElementById('selfcare-toggle');
const selfcareBodyEl = document.getElementById('selfcare-body');

// Раскрываем или скрываем идеи. При открытии приложения блок всегда свёрнут.
function setSelfcareOpen(open) {
  selfcareBodyEl.hidden = !open;
  selfcareToggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

selfcareToggleBtn.addEventListener('click', function () {
  setSelfcareOpen(selfcareBodyEl.hidden);
});

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
  const empty = jar.length === 0;

  // Пустая банка — приглашение текстом под фото. Иначе — табличка со счётчиком на фото.
  jarCountEl.hidden = !empty;
  jarCountEl.textContent = 'Банка пока пустая. Запиши первый хороший момент, даже совсем маленький.';
  jarBadgeEl.hidden = empty;
  jarBadgeEl.textContent = 'В банке ' + jar.length + ' ' + notesWord(jar.length);

  jarDrawBtn.hidden = empty;
}

const jarPhotoEl = document.getElementById('jar-photo-wrap');
const jarBadgeEl = document.getElementById('jar-badge');

// Сколько уходит прежняя записка, в миллисекундах. Совпадает с note-out в CSS.
const NOTE_OUT_TIME = 300;
let noteAnimating = false;

// Перезапускаем CSS-анимацию: убираем класс, заставляем браузер это заметить
// (чтение offsetWidth), и добавляем класс снова.
function restartAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function showNote(index) {
  shownNote = index;
  noteDateEl.textContent = formatDate(jar[index].date);
  noteTextEl.textContent = jar[index].text;
  noteEl.hidden = false;
  restartAnimation(noteEl, 'appear');
}

// Достаём случайную записку, по возможности не ту, что уже открыта.
jarDrawBtn.addEventListener('click', function () {
  if (jar.length === 0 || noteAnimating) return;
  let index = 0;
  if (jar.length > 1) {
    do {
      index = Math.floor(Math.random() * jar.length);
    } while (index === shownNote);
  }

  restartAnimation(jarPhotoEl, 'shake');

  if (noteEl.hidden) {
    showNote(index);
    return;
  }

  // Если записка уже открыта, сначала «возвращаем» её в банку, потом достаём новую.
  noteAnimating = true;
  noteEl.classList.remove('appear');
  noteEl.classList.add('leaving');
  setTimeout(function () {
    noteEl.classList.remove('leaving');
    showNote(index);
    noteAnimating = false;
  }, NOTE_OUT_TIME);
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

// ---------- Письмо себе в будущее ----------

const LETTERS_KEY = 'futureLetters';
const DAY = 24 * 60 * 60 * 1000; // сутки в миллисекундах

// Начала предложений, чтобы было легче начать писать.
const STARTERS = [
  { text: 'Привет, это я из прошлого. Сейчас, когда я пишу это письмо, мне…' },
  { text: 'Сегодня мне тяжелее всего от того, что…' },
  { text: 'Но даже сейчас я горжусь собой за то, что…' },
  { text: 'Вот что меня сейчас поддерживает:' },
  { text: 'Я надеюсь, что к тому моменту, когда ты это читаешь…' },
  { text: 'Хочу напомнить тебе, что…' },
  { text: 'Если тебе снова станет тяжело, вспомни…' },
  { text: 'Я обещаю тебе, что…' },
  { text: 'Спасибо тебе за то, что…' },
  { text: 'Малыш сейчас у меня под сердцем, и…', only: 'baby' },
  { text: 'Когда ты будешь держать малыша на руках, я хочу, чтобы ты знала…', only: 'baby' }
];

const startersEl = document.getElementById('starters');
const letterInput = document.getElementById('letter-input');
const letterSaveBtn = document.getElementById('letter-save');
const lettersBlockEl = document.getElementById('letters-block');
const lettersEl = document.getElementById('letters');
const letterReadyEl = document.getElementById('letter-ready');

function loadLetters() {
  try {
    const raw = localStorage.getItem(LETTERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function storeLetters(list) {
  try {
    localStorage.setItem(LETTERS_KEY, JSON.stringify(list));
  } catch (error) {
    // Если память недоступна, просто ничего не сохраняем.
  }
}

// Каждое письмо: { id, text, created, openAt, opened }
let letters = loadLetters();

// Какое прочитанное письмо сейчас развёрнуто.
let expandedLetter = null;

// Пришёл ли срок открыть письмо.
function isReady(letter) {
  return new Date(letter.openAt) <= new Date();
}

// Добавляем начало предложения в письмо, с новой строки.
function insertStarter(text, button) {
  const current = letterInput.value;
  const separator = current && !current.endsWith('\n') ? '\n\n' : '';
  // Многоточие на кнопке только подсказывает, что фразу нужно продолжить, в письмо его не ставим.
  letterInput.value = current + separator + text.replace(/…$/, '') + ' ';

  // Курсор в конец, и само поле прокручиваем к последней строке.
  letterInput.focus({ preventScroll: true });
  const end = letterInput.value.length;
  letterInput.setSelectionRange(end, end);
  letterInput.scrollTop = letterInput.scrollHeight;

  // Страницу двигаем совсем чуть-чуть: так, чтобы были видны и подсказки, и поле.
  startersEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (button) button.classList.add('used');
}

function renderStarters() {
  startersEl.innerHTML = '';
  STARTERS.filter(fitsProfile).forEach(function (starter) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'starter';
    button.textContent = starter.text;
    button.addEventListener('click', function () {
      insertStarter(starter.text, button);
    });
    startersEl.append(button);
  });
}

function openLetter(letter) {
  letter.opened = true;
  storeLetters(letters);
  expandedLetter = letter.id;
  renderLetters();
  updateLetterBanner();
}

function makeLink(label, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'link';
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

function renderLetters() {
  lettersEl.innerHTML = '';
  lettersBlockEl.hidden = letters.length === 0;

  // Сначала те, что откроются раньше.
  const sorted = letters.slice().sort(function (a, b) {
    return new Date(a.openAt) - new Date(b.openAt);
  });

  sorted.forEach(function (letter) {
    const item = document.createElement('li');
    item.className = 'letter-card';

    const status = document.createElement('p');
    status.className = 'letter-status';
    const meta = document.createElement('p');
    meta.className = 'letter-meta';
    const actions = document.createElement('div');
    actions.className = 'letter-actions';

    if (letter.opened) {
      // Прочитанное письмо
      status.textContent = '✉️ Письмо от ' + formatDate(letter.created);
      meta.textContent = 'Открыто';
      item.append(status, meta);

      if (expandedLetter === letter.id) {
        const paper = document.createElement('div');
        paper.className = 'letter-paper';
        paper.textContent = letter.text;
        item.append(paper);
        actions.append(makeLink('Свернуть', function () {
          expandedLetter = null;
          renderLetters();
        }));
      } else {
        actions.append(makeLink('Перечитать', function () {
          expandedLetter = letter.id;
          renderLetters();
        }));
      }

      actions.append(makeLink('Удалить', function () {
        if (!confirm('Удалить это письмо навсегда?')) return;
        letters = letters.filter(function (l) { return l.id !== letter.id; });
        storeLetters(letters);
        renderLetters();
      }));
      item.append(actions);
    } else if (isReady(letter)) {
      // Срок пришёл, но письмо ещё не открыто
      status.textContent = '✉️ Письмо готово!';
      meta.textContent = 'Ты написала его ' + formatDate(letter.created);
      const openBtn = document.createElement('button');
      openBtn.type = 'button';
      openBtn.className = 'btn-primary';
      openBtn.textContent = 'Открыть';
      openBtn.addEventListener('click', function () { openLetter(letter); });
      item.append(status, meta, openBtn);
    } else {
      // Ещё запечатано
      status.textContent = '✉️ Запечатано';
      meta.textContent = 'Откроется ' + formatDate(letter.openAt);
      actions.append(makeLink('Открыть раньше', function () {
        if (!confirm('Это письмо должно открыться ' + formatDate(letter.openAt) + '. Открыть сейчас?')) return;
        openLetter(letter);
      }));
      item.append(status, meta, actions);
    }

    lettersEl.append(item);
  });
}

// Плашка на главном экране, если есть письмо, которое пора открыть.
function updateLetterBanner() {
  const waiting = letters.some(function (letter) {
    return !letter.opened && isReady(letter);
  });
  letterReadyEl.hidden = !waiting;
}

letterSaveBtn.addEventListener('click', function () {
  const text = letterInput.value.trim();
  if (!text) {
    letterInput.focus();
    return;
  }
  const days = Number(document.querySelector('input[name="when"]:checked').value);
  const now = new Date();

  letters.push({
    id: String(now.getTime()),
    text: text,
    created: now.toISOString(),
    openAt: new Date(now.getTime() + days * DAY).toISOString(),
    opened: false
  });
  storeLetters(letters);

  letterInput.value = '';
  renderStarters(); // снимаем отметки «использовано»
  renderLetters();

  // Короткое подтверждение на самой кнопке.
  letterSaveBtn.textContent = 'Письмо запечатано ✉️';
  letterSaveBtn.disabled = true;
  setTimeout(function () {
    letterSaveBtn.textContent = 'Запечатать письмо';
    letterSaveBtn.disabled = false;
  }, 2000);

  lettersBlockEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const firstTime = !profile;
  profile = { people: chosen.value === 'yes', baby: startBabyInput.checked };
  storeProfile(profile);
  // Новому человеку «Что нового» не показываем: для него новое всё.
  if (firstTime) markVersionSeen();

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

// ---------- Треск камина ----------

// Громкость (от 0 до 1) и сколько секунд звук плавно нарастает.
const FIRE_VOLUME = 0.6;
const FIRE_FADE_IN = 2.5;

const fireButtons = document.querySelectorAll('.fire-toggle');

let audioCtx = null;
let fireBuffer = null;   // раскодированный звук, загружается один раз
let fireSource = null;   // то, что сейчас играет
let fireGain = null;     // «ручка громкости» для плавного включения и выключения
let fireOn = false;

function updateFireButtons() {
  fireButtons.forEach(function (button) {
    button.setAttribute('aria-pressed', fireOn ? 'true' : 'false');
    const label = button.querySelector('.fire-label');
    if (label) label.textContent = fireOn ? 'Выключить камин' : 'Треск камина';
    if (!label) button.setAttribute('aria-label', fireOn ? 'Выключить треск камина' : 'Треск камина');
  });
}

function loadFire() {
  if (fireBuffer) return Promise.resolve(fireBuffer);
  return fetch('fire.mp3')
    .then(function (response) { return response.arrayBuffer(); })
    .then(function (data) {
      // Старые iPhone понимают только вариант decodeAudioData с функциями-ответами.
      return new Promise(function (resolve, reject) {
        audioCtx.decodeAudioData(data, resolve, reject);
      });
    })
    .then(function (buffer) {
      fireBuffer = buffer;
      return buffer;
    });
}

function startFire() {
  // Звук на iPhone можно включить только в ответ на нажатие, поэтому создаём его здесь.
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  audioCtx.resume();
  fireOn = true;
  updateFireButtons();

  loadFire()
    .then(function (buffer) {
      if (!fireOn || fireSource) return; // пока грузилось, камин успели выключить
      fireSource = audioCtx.createBufferSource();
      fireSource.buffer = buffer;
      // Запись склеена в бесшовное кольцо; края чуть обрезаем, чтобы не было щелчка.
      fireSource.loop = true;
      fireSource.loopStart = 0.05;
      fireSource.loopEnd = buffer.duration - 0.05;

      fireGain = audioCtx.createGain();
      const now = audioCtx.currentTime;
      fireGain.gain.setValueAtTime(0, now);
      fireGain.gain.linearRampToValueAtTime(FIRE_VOLUME, now + FIRE_FADE_IN);

      fireSource.connect(fireGain);
      fireGain.connect(audioCtx.destination);
      fireSource.start(0, 0.05);
    })
    .catch(function () {
      // Не получилось загрузить звук — просто выключаем кнопку.
      fireOn = false;
      updateFireButtons();
    });
}

function stopFire() {
  fireOn = false;
  updateFireButtons();
  if (!fireSource) return;

  // Плавно затихаем за секунду, потом останавливаем.
  const source = fireSource;
  const gain = fireGain;
  const now = audioCtx.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.linearRampToValueAtTime(0, now + 1);
  source.stop(now + 1.05);
  fireSource = null;
  fireGain = null;
}

fireButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    if (fireOn) {
      stopFire();
    } else {
      startFire();
    }
  });
});

// Когда приложение свёрнуто, звук ставим на паузу, а при возвращении продолжаем.
document.addEventListener('visibilitychange', function () {
  if (!audioCtx) return;
  if (document.hidden) {
    audioCtx.suspend();
  } else if (fireOn) {
    audioCtx.resume();
  }
});

// ---------- Пересчёт размеров экрана на iPhone ----------

// При запуске с домашнего экрана iPhone иногда сначала неверно считает высоту экрана,
// и нижнее меню встаёт выше, чем нужно. Чуть-чуть «шевелим» страницу, чтобы он
// пересчитал размеры, — так же, как это происходит при переключении вкладок.
function nudgeViewport() {
  const x = window.scrollX;
  const y = window.scrollY;
  window.scrollTo(x, y + 1);
  requestAnimationFrame(function () {
    window.scrollTo(x, y);
  });
  // Заодно заставляем браузер заново разложить нижнее меню.
  const bar = document.querySelector('.tabbar');
  if (bar) {
    bar.style.transform = 'translateZ(0)';
    void bar.offsetHeight;
    bar.style.transform = '';
  }
}

window.addEventListener('load', function () {
  nudgeViewport();
  setTimeout(nudgeViewport, 300);
  setTimeout(nudgeViewport, 1000);
});

// Когда приложение возвращается из свёрнутого состояния или меняются размеры экрана.
window.addEventListener('pageshow', nudgeViewport);
window.addEventListener('orientationchange', function () { setTimeout(nudgeViewport, 300); });
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', nudgeViewport);
}
document.addEventListener('visibilitychange', function () {
  if (!document.hidden) setTimeout(nudgeViewport, 100);
});

// ---------- Режим набора текста ----------

// Пока человек пишет записку или письмо, прячем нижнее меню.
// Иначе на iPhone оно подпрыгивает над клавиатурой и закрывает кнопки формы.
document.addEventListener('focusin', function (event) {
  if (event.target.matches('textarea')) {
    document.body.classList.add('typing');
  }
});

document.addEventListener('focusout', function (event) {
  if (event.target.matches('textarea')) {
    // Небольшая пауза, чтобы меню не мигало, если фокус сразу переходит дальше.
    setTimeout(function () {
      if (!document.activeElement || !document.activeElement.matches('textarea')) {
        document.body.classList.remove('typing');
      }
    }, 100);
  }
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
  let activeTab = name;
  if (name === 'saved' || name === 'about') activeTab = 'phrases';
  if (name === 'letter') activeTab = 'jar';
  tabs.forEach(function (tab) {
    if (tab.dataset.go === activeTab) {
      tab.setAttribute('aria-current', 'page');
    } else {
      tab.removeAttribute('aria-current');
    }
  });

  if (name === 'phrases') {
    renderMood();
    updateLetterBanner();
  }
  if (name === 'letter') {
    renderStarters();
    renderLetters();
  }
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

// ---------- Сколько людей сегодня с нами (GoatCounter) ----------

const GOATCOUNTER_CODE = 'svet-v-okne';

// Плашку показываем, только если за день набралось хотя бы столько людей,
// чтобы маленькое число не прозвучало одиноко.
const MIN_PEOPLE = 15;

// Сколько секунд плашка висит на экране.
const TOAST_SECONDS = 8;

const TOAST_DAY_KEY = 'peopleToastDay';
const peopleToastEl = document.getElementById('people-toast');

// dev-сайт и проверки на компьютере не считаем, чтобы не накручивать счётчик.
const isDevSite = location.hostname.indexOf('dev--') === 0
  || location.hostname === 'localhost'
  || location.protocol === 'file:';

// Подключаем счётчик посещений GoatCounter (только на основном сайте).
function startCounting() {
  if (isDevSite) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.setAttribute('data-goatcounter', 'https://' + GOATCOUNTER_CODE + '.goatcounter.com/count');
  document.head.append(script);
}

// «1 человек», «3 человека», «47 человек».
function peopleWord(n) {
  const last = n % 10;
  const lastTwo = n % 100;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'человека';
  return 'человек';
}

function showPeopleToast(count) {
  showToastText('Сегодня свет в окне зажгли уже ' + count + ' ' + peopleWord(count) + '. Ты не одна.');
}

function showToastText(text) {
  peopleToastEl.textContent = text;
  peopleToastEl.hidden = false;
  requestAnimationFrame(function () {
    peopleToastEl.classList.add('visible');
  });
  setTimeout(hidePeopleToast, TOAST_SECONDS * 1000);
}

function hidePeopleToast() {
  peopleToastEl.classList.remove('visible');
  setTimeout(function () { peopleToastEl.hidden = true; }, 600);
}

// По нажатию плашку можно закрыть раньше.
peopleToastEl.addEventListener('click', hidePeopleToast);

// Узнаём у GoatCounter, сколько разных людей открыли приложение сегодня.
// Для проверки на dev-сайте добавьте к адресу #toast-test: тогда плашка покажется
// с настоящим числом, даже если оно меньше порога и плашку сегодня уже видели.
function checkPeopleToday() {
  const testMode = location.hash === '#toast-test';
  const today = dayKey(new Date());

  if (!testMode) {
    try {
      if (localStorage.getItem(TOAST_DAY_KEY) === today) return; // сегодня уже показывали
    } catch (error) {}
  }

  // Период «сегодня»: с начала сегодняшнего дня до начала завтрашнего,
  // чтобы сегодняшние посещения точно попали в подсчёт целиком.
  const tomorrow = dayKey(daysAgo(-1));
  const url = 'https://' + GOATCOUNTER_CODE + '.goatcounter.com/counter/'
    + encodeURIComponent('/') + '.json?start=' + today + '&end=' + tomorrow;

  fetch(url)
    .then(function (response) {
      // Если сегодня ещё никого не посчитали, GoatCounter отвечает «не найдено» (404) — это ноль.
      if (response.status === 404) return { count_unique: '0' };
      if (!response.ok) throw new Error('GoatCounter ответил кодом ' + response.status);
      return response.json();
    })
    .then(function (data) {
      // Число приходит строкой с разделителями тысяч, например «1 234»: оставляем только цифры.
      const raw = data.count_unique || data.count || '0';
      const count = parseInt(String(raw).replace(/\D/g, ''), 10) || 0;
      if (!testMode && count < MIN_PEOPLE) return;
      showPeopleToast(count);
      if (!testMode) {
        try { localStorage.setItem(TOAST_DAY_KEY, today); } catch (error) {}
      }
    })
    .catch(function (error) {
      // Нет интернета или GoatCounter недоступен — обычно просто работаем дальше без плашки.
      // В тестовом режиме показываем, что пошло не так, чтобы было проще разобраться.
      if (testMode) showToastText('Тест: не удалось получить число. ' + (error && error.message ? error.message : ''));
    });
}

startCounting();

// ---------- Что нового ----------

// Список изменений для каждой версии. Для новой версии добавьте сюда новый блок
// с тем же номером, что в APP_VERSION, — окно покажется всем один раз.
const WHATS_NEW = {
  '1.1': [
    { icon: '🔥', title: 'Треск камина', text: 'Значок огонька на главном экране и на экране дыхания включает тихий треск камина.' },
    { icon: '✉️', title: 'Письмо себе в будущее', text: 'Напиши себе сейчас и прочитай через неделю, месяц или год. Есть подсказки, с чего начать. Ищи во вкладке «Банка».' },
    { icon: '🕯️', title: 'Ты не одна', text: 'Иногда приложение будет тихо напоминать, сколько людей сегодня тоже зажгли здесь свет.' },
    { icon: '📌', title: 'Записки на листе', text: 'Записки из банки теперь появляются на бумаге с зажимом, а при смене плавно возвращаются в банку.' },
    { icon: '🏠', title: 'Своя иконка', text: 'На экране «Домой» теперь тёплое окошко. Если иконка старая — удали ярлык и добавь заново.' }
  ]
};

const SEEN_VERSION_KEY = 'seenVersion';
const whatsNewEl = document.getElementById('whatsnew');
const whatsNewListEl = document.getElementById('whatsnew-list');
const whatsNewCloseBtn = document.getElementById('whatsnew-close');

function markVersionSeen() {
  try { localStorage.setItem(SEEN_VERSION_KEY, APP_VERSION); } catch (error) {}
}

// Нужно ли показать окно: человек уже пользовался приложением (есть ответы о себе),
// но эту версию ещё не видел. Для проверки добавьте к адресу #whatsnew-test.
function shouldShowWhatsNew() {
  if (location.hash === '#whatsnew-test') return true;
  if (!profile || !WHATS_NEW[APP_VERSION]) return false;
  try {
    return localStorage.getItem(SEEN_VERSION_KEY) !== APP_VERSION;
  } catch (error) {
    return false;
  }
}

let afterWhatsNew = null; // что сделать, когда окно закроют

function showWhatsNew(then) {
  afterWhatsNew = then || null;
  whatsNewListEl.innerHTML = '';
  (WHATS_NEW[APP_VERSION] || []).forEach(function (item) {
    const li = document.createElement('li');

    const icon = document.createElement('span');
    icon.className = 'whatsnew-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = item.icon;

    const body = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = item.title;
    const text = document.createElement('span');
    text.className = 'whatsnew-text';
    text.textContent = item.text;
    body.append(title, text);

    li.append(icon, body);
    whatsNewListEl.append(li);
  });

  whatsNewEl.hidden = false;
  requestAnimationFrame(function () {
    whatsNewEl.classList.add('visible');
  });
}

function closeWhatsNew() {
  markVersionSeen();
  whatsNewEl.classList.remove('visible');
  setTimeout(function () {
    whatsNewEl.hidden = true;
    if (afterWhatsNew) afterWhatsNew();
    afterWhatsNew = null;
  }, 400);
}

whatsNewCloseBtn.addEventListener('click', closeWhatsNew);

// Закрыть можно и нажатием на затемнённый фон вокруг окна, и клавишей Esc.
whatsNewEl.addEventListener('click', function (event) {
  if (event.target === whatsNewEl) closeWhatsNew();
});
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && !whatsNewEl.hidden) closeWhatsNew();
});

// При открытии страницы: если человек ещё не отвечал на вопросы, начинаем с них.
updateHeart();
applyProfile();
show(profile ? 'phrases' : 'start');

// Тестовые адреса срабатывают и тогда, когда их дописали к уже открытой странице.
window.addEventListener('hashchange', function () {
  if (location.hash === '#toast-test') checkPeopleToday();
  if (location.hash === '#whatsnew-test') showWhatsNew();
});

// Сначала «Что нового» (если есть что показать), а плашку «ты не одна» — уже после него.
// На самом первом экране с вопросами ни то ни другое не показываем.
if (shouldShowWhatsNew()) {
  setTimeout(function () {
    showWhatsNew(function () { setTimeout(checkPeopleToday, 1500); });
  }, 800);
} else if (profile) {
  setTimeout(checkPeopleToday, 2000);
}
