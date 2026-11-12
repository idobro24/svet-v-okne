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
  { text: 'Тебе не нужно торопиться. Восстановление — не соревнование.' },
  { text: 'Ты можешь начинать заново столько раз, сколько понадобится.' },
  { text: 'Твои чувства важны, даже если другим они кажутся «слишком».' },
  { text: 'Сегодня можно ничего не решать. Решения подождут до завтра.' },
  { text: 'Ты не обязана быть удобной для всех. Достаточно быть честной с собой.' },
  { text: 'Злиться — нормально. Злость говорит о том, что тебе было важно.' },
  { text: 'Скучать — нормально. Это не значит, что нужно возвращать прошлое.' },
  { text: 'Ты всё ещё ты. Развод не стёр ни одной твоей хорошей черты.' },
  { text: 'Можно попросить о помощи и не объяснять, почему.' },
  { text: 'Иногда сила — это просто лечь пораньше спать.' },
  { text: 'Каждый вечер, который ты пережила, — уже маленькая победа.' },
  { text: 'Ты не опоздала. Твоя жизнь идёт в своём темпе.' },
  { text: 'Мир станет мягче. А пока будь мягкой к себе сама.' },
  { text: 'Прошлые ошибки — это опыт, а не приговор.' },
  { text: 'Даже в пасмурный день солнце никуда не исчезает. Оно просто за облаками.' },
  { text: 'Сделай сегодня одну приятную вещь только для себя.' },
  { text: 'Твоя жизнь — не испорченный черновик. Просто в ней началась новая глава.' },
  { text: 'Можно ничего не чувствовать. Так душа иногда берёт передышку.' },
  { text: 'Ты справляешься лучше, чем тебе кажется.' },
  { text: 'Твоё «достаточно хорошо» сегодня — действительно достаточно.' },
  { text: 'Можно радоваться мелочам, даже когда тяжело. Одно другому не мешает.' },
  { text: 'Не всё нужно понимать прямо сейчас. Некоторые ответы приходят со временем.' },
  { text: 'Ты имеешь право закрыть дверь, за которой тебе было больно.' },
  { text: 'Тишина вокруг — не пустота. Это место для нового.' },
  { text: 'Ты не одна в том, что чувствуешь. Многие проходили этот путь и вышли к свету.' },

  { text: 'Напиши кому-то, кто тебя любит. Даже короткое «мне сейчас тяжело» — это уже много.', only: 'people' },
  { text: 'Разрешай близким помогать. Им важно быть рядом с тобой.', only: 'people' },
  { text: 'Ты не обязана рассказывать всем свою историю. Но одному близкому человеку — можно.', only: 'people' },
  { text: 'Позвони тому, с кем тебе тепло. Можно даже не говорить о главном.', only: 'people' },
  { text: 'Скажи близким, что тебе нужно: обнять, помолчать рядом или помочь с делами.', only: 'people' },

  { text: 'Если сейчас кажется, что рядом никого нет, это чувство настоящее. Но оно не приговор.', only: 'alone' },
  { text: 'Тебе не обязательно иметь кого-то, чтобы заслуживать заботы. Ты заслуживаешь её и так.', only: 'alone' },
  { text: 'Пустота сейчас не значит пустота навсегда. Новые люди приходят, даже когда кажется, что уже не придут.', only: 'alone' },
  { text: 'Близость можно строить заново, понемногу: курсы, кружок, группа поддержки.', only: 'alone' },
  { text: 'Ты уже здесь и читаешь эти слова. Значит, часть тебя продолжает искать свет. Береги её.', only: 'alone' },
  { text: 'Одиночество — это состояние, а не то, кто ты есть. Оно меняется.', only: 'alone' },
  { text: 'Начни с маленького: чат по интересам, встреча, разговор с соседкой.', only: 'alone' },
  { text: 'Даже если сегодня рядом никого, эти слова написаны для тебя. Ты не невидимка.', only: 'alone' },

  { text: 'Вы с малышом уже команда. И эта команда сильнее, чем кажется.', only: 'baby' },
  { text: 'Твоему ребёнку нужна не идеальная мама, а живая и любящая. Такая, как ты.', only: 'baby' },
  { text: 'Каждый раз, когда ты отдыхаешь и заботишься о себе, ты заботишься и о малыше.', only: 'baby' },
  { text: 'Однажды ты будешь держать малыша на руках, и этот момент будет только вашим.', only: 'baby' },
  { text: 'Твой малыш придёт в мир, где его очень ждут. И это ты.', only: 'baby' },
  { text: 'Просить о помощи во время беременности — нормально. Это забота о вас обоих.', only: 'baby' },
  { text: 'Малыш чувствует твою любовь, даже когда ты плачешь.', only: 'baby' },
  { text: 'Тебе не нужно быть идеальной, чтобы стать хорошей мамой.', only: 'baby' },
  { text: 'Отдыхай без чувства вины. Сейчас ты растишь целого человека.', only: 'baby' },
  { text: 'Говори с малышом. Он уже слышит твой голос, и для него это самый родной звук.', only: 'baby' }
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

// «Колода» фраз: перемешиваем все и показываем по очереди, пока не закончатся.
// Так фраза не повторится, пока человек не увидит все остальные.
let deck = [];

function pickNext() {
  if (deck.length === 0) {
    const order = [];
    for (let i = 0; i < phrases.length; i++) order.push(i);
    deck = shuffle(order);
    // Чтобы на стыке колод не выпала та же фраза, что уже на экране.
    if (deck.length > 1 && deck[deck.length - 1] === current) {
      const last = deck.length - 1;
      deck[last] = deck[0];
      deck[0] = current;
    }
  }
  return deck.pop();
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

let id
