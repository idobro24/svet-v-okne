// Версия приложения. Меняйте её здесь при каждом заметном обновлении,
// и она сама обновится внизу экранов и в разделе «О приложении».
const APP_VERSION = '1.2';

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
  // Под пасмурной погодой — приглашение сделать один маленький шаг.
  document.getElementById('steps-link').hidden = !today || today === 'sun';

  // Если гроз 4 и больше за неделю, бережно предлагаем поддержку.
  careCardEl.hidden = countStorms() < 4;

  // Идеи самопомощи под сегодняшнюю погоду.
  renderSelfCare(today);
}

// Только кнопки погоды: такой же вид есть и у ответов «Как ты теперь?» в «Маленьком шаге».
document.querySelectorAll('.mood-btn[data-mood]').forEach(function (button) {
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
    { text: 'Назови 5 вещей, которые видишь, 4 — которые можешь потрогать, 3 звука, 2 запаха и 1 вкус. Это возвращает в «здесь и сейчас».', action: { label: 'Пройти по шагам', go: 'calm' } },
    { text: 'Укутайся в плед и сделай тёплый чай. Тепло помогает телу почувствовать себя в безопасности.' },
    { text: 'Разреши себе поплакать. Не нужно держаться, слёзы тоже помогают.' },
    { text: 'Отложи телефон и не открывай комментарии хотя бы час.' },
    { text: 'Напиши тому, кто рядом: «Мне сейчас тяжело, можешь позвонить?» Просить о помощи — нормально.', only: 'people', action: { label: 'Написать', share: 'Мне сейчас тяжело, можешь позвонить?' } },
    { text: 'Позвони на телефон доверия. Там выслушают без осуждения, даже если просто хочется поговорить.', only: 'alone', action: { label: 'Открыть помощь', go: 'help' } },
    { text: 'Напряги и отпусти по очереди кисти, плечи, лицо. Две минуты, и телу становится спокойнее.', action: { label: 'Расслабить мышцы', go: 'relax' } },
    { text: 'Положи ладонь на сердце и скажи себе три тёплые фразы. Это минутка доброты к себе.', action: { label: 'Минутка доброты', go: 'kind' } }
  ],
  fog: [
    { text: 'Выпей стакан воды. Это самое маленькое, что можно сделать для себя прямо сейчас.' },
    { text: 'Вспомни себя маленькую. Что бы ты сказала ей, если бы она грустила? Скажи это себе, тихо или вслух.' },
    { text: 'Открой окно и подыши свежим воздухом хотя бы минуту.' },
    { text: 'Прими тёплый душ. Вода хорошо возвращает ощущение тела.' },
    { text: 'Назови чувство словом: «мне грустно», «мне пусто», «я злюсь». Так туман становится чуть прозрачнее.' },
    { text: 'Наведи порядок на одном маленьком месте: тумбочка, одна полка. Видимый результат за пять минут.' },
    { text: 'Подыши минуту вместе с огоньком.', action: { label: 'Подышать', go: 'breath' } },
    { text: 'Нет сил — и это понятно. Выбери одно крошечное дело, не дожидаясь настроения.', action: { label: 'Маленький шаг', go: 'steps' } },
    { text: 'Скажи себе: «Мне сейчас тяжело. Так бывает у многих. Пусть я буду к себе бережной».', action: { label: 'Минутка доброты', go: 'kind' } },
    { text: 'Если одна мысль крутится по кругу и не отпускает, можно спокойно поговорить с ней.', action: { label: 'Поговорить с мыслью', go: 'thought' } }
  ],
  cloud: [
    { text: 'Достань записку из банки и вспомни что-то хорошее.', action: { label: 'Открыть банку', go: 'jar' } },
    { text: 'Внутри тебя есть ты маленькая. Сделай сегодня что-то приятное для неё: какао, мультик, плед, любимая песня из детства.' },
    { text: 'Выйди на 10 минут на дневной свет, даже просто дойти до магазина.' },
    { text: 'Включи любимую песню или уютный сериал.' },
    { text: 'Съешь что-то вкусное и не торопись.' },
    { text: 'Сделай одно маленькое дело и заметь, как ты после него.', action: { label: 'Маленький шаг', go: 'steps' } },
    { text: 'Потянись пару минут, особенно спину и плечи.' },
    { text: 'Если какая-то мысль сегодня колет, посмотри на неё со стороны: что за, что против, что сказала бы подруга.', action: { label: 'Поговорить с мыслью', go: 'thought' } },
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
  deck = []; // ответы поменялись — собираем колоду заново
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

  playFire();
}

// Запускаем само звучание с плавным нарастанием.
function playFire() {
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

// Когда приложение сворачивают, звук не обрываем на полуслове (от этого и был
// неприятный «механический» звук), а очень быстро уводим в тишину и останавливаем.
// При возвращении камин снова плавно разгорается.
function muteFireForBackground() {
  if (!audioCtx) return;
  if (fireSource) {
    const source = fireSource;
    const gain = fireGain;
    fireSource = null;
    fireGain = null;
    const now = audioCtx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.08);
    try { source.stop(now + 0.1); } catch (error) {}
  }
  setTimeout(function () {
    if (document.hidden && audioCtx.state === 'running') audioCtx.suspend();
  }, 150);
}

function resumeFireAfterBackground() {
  if (!audioCtx || !fireOn) return;
  audioCtx.resume().then(function () {
    if (fireOn && !fireSource) playFire();
  });
}

document.addEventListener('visibilitychange', function () {
  if (document.hidden) {
    muteFireForBackground();
  } else {
    resumeFireAfterBackground();
  }
});

// На iPhone при сворачивании иногда раньше приходит pagehide — реагируем и на него.
window.addEventListener('pagehide', muteFireForBackground);

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
window.addEventListener('orientationchange', function () {
  setTimeout(nudgeViewport, 300);
});
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', nudgeViewport);
}
document.addEventListener('visibilitychange', function () {
  if (document.hidden) {
    // Приложение свернули — блок «Чем себе помочь» тоже сворачиваем.
    setSelfcareOpen(false);
  } else {
    setTimeout(nudgeViewport, 100);
  }
});

// ---------- Без увеличения двойным нажатием ----------

// На iPhone CSS-запрета иногда недостаточно. Двойное нажатие для увеличения —
// это два быстрых касания в одно и то же место. Если второе касание пришло почти
// сразу и почти туда же, отменяем его — тогда iPhone не увеличивает экран.
// Быстрые касания разных кнопок подряд не трогаем.
// В полях ввода не мешаем: там двойное касание выделяет слово.
let lastTap = { time: 0, x: 0, y: 0 };
document.addEventListener('touchend', function (event) {
  const touch = event.changedTouches && event.changedTouches[0];
  if (!touch) return;
  const now = Date.now();
  const inField = event.target.closest && event.target.closest('textarea, input');
  const near = Math.abs(touch.clientX - lastTap.x) < 30 && Math.abs(touch.clientY - lastTap.y) < 30;
  if (!inField && near && now - lastTap.time <= 300) {
    event.preventDefault();
  }
  lastTap = { time: now, x: touch.clientX, y: touch.clientY };
}, { passive: false });

// ---------- Режим набора текста ----------

// Пока человек пишет записку или письмо, прячем нижнее меню.
// Иначе на iPhone оно подпрыгивает над клавиатурой и закрывает кнопки формы.
document.addEventListener('focusin', function (event) {
  if (event.target.matches('textarea, input[type="text"]')) {
    document.body.classList.add('typing');
  }
});

document.addEventListener('focusout', function (event) {
  if (event.target.matches('textarea, input[type="text"]')) {
    // Небольшая пауза, чтобы меню не мигало, если фокус сразу переходит дальше.
    setTimeout(function () {
      if (!document.activeElement || !document.activeElement.matches('textarea, input[type="text"]')) {
        document.body.classList.remove('typing');
      }
    }, 100);
  }
});

// ---------- Мне сейчас очень тревожно ----------

// Дыхание без задержки и с длинным выдохом: при панике задержка дыхания
// может пугать, а длинный выдох быстрее успокаивает тело.
const CALM_PHASES = [
  { label: 'Вдох', time: 4000, big: true },
  { label: 'Медленный выдох', time: 6000, big: false }
];

// 6 кругов по 10 секунд — одна минута.
const CALM_ROUNDS = 6;

// Заземление 5-4-3-2-1: по одному чувству за раз, чтобы не держать всё в голове.
const GROUNDING = [
  { n: 5, title: 'Пять вещей, которые ты видишь', text: 'Оглянись и найди глазами пять предметов. Назови каждый про себя: «лампа», «чашка», «окно». Каждый раз нажимай «Нашла».' },
  { n: 4, title: 'Четыре вещи, которые можно потрогать', text: 'Дотронься до них ладонью. Какие они: тёплые, гладкие, мягкие, шершавые?' },
  { n: 3, title: 'Три звука', text: 'Прислушайся. Тиканье часов, шум за окном, твоё дыхание — подходят даже самые тихие.' },
  { n: 2, title: 'Два запаха', text: 'Понюхай рукав, чай, крем для рук. Если рядом ничего не пахнет, вспомни два любимых запаха.' },
  { n: 1, title: 'Один вкус', text: 'Сделай глоток воды или просто заметь, какой вкус сейчас во рту.' }
];

const CALM_ORDER = ['breath', 'ground', 'pass'];
const calmStepEls = {
  breath: document.getElementById('calm-breath'),
  ground: document.getElementById('calm-ground'),
  pass: document.getElementById('calm-pass')
};
const calmProgressEl = document.getElementById('calm-progress');
const calmOrbEl = document.getElementById('calm-orb');
const calmBreathTextEl = document.getElementById('calm-breath-text');
const calmBreathCountEl = document.getElementById('calm-breath-count');
const calmBreathNextBtn = document.getElementById('calm-breath-next');
const groundNumEl = document.getElementById('ground-num');
const groundTitleEl = document.getElementById('ground-title');
const groundTextEl = document.getElementById('ground-text');
const groundDotsEl = document.getElementById('ground-dots');
const groundStatusEl = document.getElementById('ground-status');
const groundFoundBtn = document.getElementById('ground-found');
const groundSkipBtn = document.getElementById('ground-skip');

let calmReturn = 'phrases'; // куда вернуться, когда станет легче
let calmTimer = null;
let calmPhase = 0;
let calmRound = 1;
let groundIndex = 0;
let groundFound = 0;
let groundTimer = null;

// Показываем нужный шаг сценария.
function calmGo(step) {
  Object.keys(calmStepEls).forEach(function (key) {
    calmStepEls[key].hidden = key !== step;
  });
  calmProgressEl.textContent = 'Шаг ' + (CALM_ORDER.indexOf(step) + 1) + ' из ' + CALM_ORDER.length;

  if (step === 'breath') {
    startCalmBreath();
  } else {
    stopCalmBreath();
  }
  if (step === 'ground') showSense(0);
  if (step === 'pass') {
    startWave();
  } else {
    stopWave();
  }
  window.scrollTo(0, 0);
}

// ---------- Переждать волну ----------

// Сколько прошло с начала сценария: видно, что время идёт и волна проходит.
const waveTimeEl = document.getElementById('wave-time');
let calmStartedAt = Date.now();
let waveTimer = null;

function updateWaveTime() {
  const sec = Math.max(0, Math.round((Date.now() - calmStartedAt) / 1000));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const passed = m ? m + ' мин ' + s + ' с' : s + ' с';
  waveTimeEl.textContent = 'Прошло ' + passed + '. Время идёт, и волна идёт вместе с ним.';
}

function startWave() {
  stopWave();
  updateWaveTime();
  waveTimer = setInterval(updateWaveTime, 1000);
}

function stopWave() {
  clearInterval(waveTimer);
  waveTimer = null;
}

function runCalmPhase() {
  const phase = CALM_PHASES[calmPhase];
  calmBreathTextEl.textContent = phase.label;
  calmBreathCountEl.textContent = 'Круг ' + calmRound + ' из ' + CALM_ROUNDS;
  calmOrbEl.style.transitionDuration = phase.time + 'ms';
  calmOrbEl.classList.toggle('big', phase.big);

  calmTimer = setTimeout(function () {
    calmPhase++;
    if (calmPhase === CALM_PHASES.length) {
      calmPhase = 0;
      calmRound++;
      if (calmRound > CALM_ROUNDS) {
        stopCalmBreath();
        calmBreathTextEl.textContent = 'Ты справилась с этой минутой.';
        calmBreathCountEl.textContent = 'Нажми «Дальше», когда будешь готова';
        return;
      }
    }
    runCalmPhase();
  }, phase.time);
}

function startCalmBreath() {
  stopCalmBreath();
  calmPhase = 0;
  calmRound = 1;
  runCalmPhase();
}

function stopCalmBreath() {
  clearTimeout(calmTimer);
  calmTimer = null;
  clearTimeout(groundTimer);
  groundTimer = null;
  calmOrbEl.style.transitionDuration = '1500ms';
  calmOrbEl.classList.remove('big');
}

// Один шаг заземления: цифра, подсказка и кружки, которые загораются по одному.
function showSense(index) {
  groundIndex = index;
  groundFound = 0;
  const sense = GROUNDING[index];
  groundNumEl.textContent = sense.n;
  groundTitleEl.textContent = sense.title;
  groundTextEl.textContent = sense.text;
  groundDotsEl.innerHTML = '';
  for (let i = 0; i < sense.n; i++) {
    groundDotsEl.append(document.createElement('li'));
  }
  groundStatusEl.textContent = 'Нашла 0 из ' + sense.n;
  groundFoundBtn.disabled = false;
}

function nextSense() {
  clearTimeout(groundTimer);
  groundTimer = null;
  if (groundIndex + 1 < GROUNDING.length) {
    showSense(groundIndex + 1);
  } else {
    calmGo('pass');
  }
}

groundFoundBtn.addEventListener('click', function () {
  const dots = groundDotsEl.children;
  if (groundFound >= dots.length) return;
  dots[groundFound].classList.add('lit');
  groundFound++;
  groundStatusEl.textContent = 'Нашла ' + groundFound + ' из ' + dots.length;
  if (groundFound === dots.length) {
    // Даём секунду увидеть, что все огоньки зажглись, и идём дальше.
    groundFoundBtn.disabled = true;
    groundTimer = setTimeout(nextSense, 800);
  }
});

groundSkipBtn.addEventListener('click', nextSense);
calmBreathNextBtn.addEventListener('click', function () { calmGo('ground'); });
document.getElementById('calm-again').addEventListener('click', function () { calmGo('breath'); });
document.getElementById('calm-close').addEventListener('click', function () { show(calmReturn); });

document.getElementById('calm-better').addEventListener('click', function () {
  show(calmReturn);
  setTimeout(function () {
    showToastText('Ты справилась. Не торопись, побудь ещё немного в тишине.');
  }, 400);
});

// ---------- Поговорить с мыслью ----------

const THOUGHT_DRAFT_KEY = 'thoughtDraft';
const THOUGHT_DIARY_KEY = 'thoughtDiary';
const THOUGHT_STEPS = 6;

const FEELINGS = ['Тревога', 'Грусть', 'Страх', 'Одиночество', 'Стыд', 'Вина', 'Злость', 'Обида', 'Пустота', 'Бессилие'];

// Ловушки мышления — простыми словами. starter — подсказка для новой мысли.
const TRAPS = [
  { id: 'all', name: 'Всё или ничего', example: '«Если не идеально, значит, провал»', starter: 'Между «идеально» и «провал» много всего. На самом деле…' },
  { id: 'catastrophe', name: 'Катастрофа', example: 'Ждать самого плохого: «Всё рухнет, я не выдержу»', starter: 'Плохое возможно, но вероятнее, что…' },
  { id: 'mind', name: 'Чтение мыслей', example: 'Быть уверенной, что знаешь, что о тебе думают', starter: 'Я не знаю точно, что думают другие. Может быть…' },
  { id: 'label', name: 'Ярлык', example: '«Я неудачница» вместо «мне сейчас трудно»', starter: 'Я не ярлык. Мне сейчас трудно, и при этом я…' },
  { id: 'always', name: 'Всегда и никогда', example: '«Так будет всегда», «меня никогда не полюбят»', starter: 'Сейчас кажется, что так будет всегда, но…' },
  { id: 'should', name: 'Я должна', example: 'Жёсткие правила к себе: «я должна справляться сама»', starter: 'Я не обязана со всем справляться одна. Мне можно…' },
  { id: 'blame', name: 'Всё из-за меня', example: 'Брать на себя вину за то, что зависит не только от тебя', starter: 'Это зависело не только от меня. Я сделала, что могла, и…' }
];

// Подсказки, которые подходят к любой мысли.
const BASE_REFRAMES = [
  'Это мысль, а не факт.',
  'Мне сейчас больно, поэтому кажется, что…',
  'Даже если это правда, я всё равно…',
  'Я уже справлялась с трудным, и…'
];

// Слова, при которых бережно показываем, куда позвонить.
const CARE_WORDS = /не\s*хочу\s*(больше\s*)?жить|покончить|убить\s*себя|умереть|суицид|самоубий|не\s*проснуться|лучше\s*бы\s*меня\s*не\s*было|навредить\s*себе|причинить\s*себе/i;

const thoughtCardEl = document.getElementById('thought-card');
const thoughtProgressEl = document.getElementById('thought-progress');
const thoughtStepEls = document.querySelectorAll('.thought-step');
const thoughtFields = document.querySelectorAll('#thought-card [data-field]');
const thoughtBackBtn = document.getElementById('thought-back');
const thoughtNextBtn = document.getElementById('thought-next');
const thoughtRestartBtn = document.getElementById('thought-restart');
const thoughtCareEl = document.getElementById('thought-care');
const thoughtFeelingsEl = document.getElementById('th-feelings');
const thoughtTrapsEl = document.getElementById('th-traps');
const thoughtStartersEl = document.getElementById('th-starters');
const thoughtResultEl = document.getElementById('thought-result');
const thoughtsBlockEl = document.getElementById('thoughts-block');
const thoughtsListEl = document.getElementById('thoughts-list');

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function storeJSON(key, value) {
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    // Если память недоступна, просто ничего не сохраняем.
  }
}

function emptyDraft() {
  return { step: 0, thought: '', before: 7, feelings: [], traps: [], pro: '', con: '', friend: '', reframe: '', after: null };
}

// Черновик хранится, пока разговор не закончен: можно уйти и вернуться.
let draft = loadJSON(THOUGHT_DRAFT_KEY, null) || emptyDraft();
let diary = loadJSON(THOUGHT_DIARY_KEY, []);
let expandedThought = null;

function saveDraft() {
  storeJSON(THOUGHT_DRAFT_KEY, draft);
  thoughtRestartBtn.hidden = !draftHasContent();
}

function draftHasContent() {
  return Boolean(draft.thought || draft.pro || draft.con || draft.friend || draft.reframe
    || draft.feelings.length || draft.traps.length);
}

function beliefText(value) {
  return value + ' из 10';
}

function trapById(id) {
  return TRAPS.find(function (trap) { return trap.id === id; });
}

// Кнопка-переключатель для чувства или ловушки.
function makeToggle(className, pressed, onToggle) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.setAttribute('aria-pressed', pressed ? 'true' : 'false');
  button.addEventListener('click', function () {
    const now = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', now ? 'true' : 'false');
    onToggle(now);
  });
  return button;
}

function toggleInList(list, value, on) {
  const rest = list.filter(function (item) { return item !== value; });
  if (on) rest.push(value);
  return rest;
}

function renderFeelings() {
  thoughtFeelingsEl.innerHTML = '';
  FEELINGS.forEach(function (feeling) {
    const button = makeToggle('chip', draft.feelings.includes(feeling), function (on) {
      draft.feelings = toggleInList(draft.feelings, feeling, on);
      saveDraft();
    });
    button.textContent = feeling;
    thoughtFeelingsEl.append(button);
  });
}

function renderTraps() {
  thoughtTrapsEl.innerHTML = '';
  TRAPS.forEach(function (trap) {
    const button = makeToggle('trap', draft.traps.includes(trap.id), function (on) {
      draft.traps = toggleInList(draft.traps, trap.id, on);
      saveDraft();
    });
    const name = document.createElement('strong');
    name.textContent = trap.name;
    const example = document.createElement('span');
    example.textContent = trap.example;
    button.append(name, example);
    thoughtTrapsEl.append(button);
  });
}

// Вставляем подсказку в конец поля новой мысли.
function insertReframe(text) {
  const field = document.getElementById('th-reframe');
  const current = field.value;
  const separator = current && !/\s$/.test(current) ? ' ' : '';
  // Многоточие на подсказке только показывает, что фразу нужно продолжить, в текст его не ставим.
  field.value = current + separator + text.replace(/…$/, '') + ' ';
  draft.reframe = field.value;
  saveDraft();
  field.focus({ preventScroll: true });
  const end = field.value.length;
  field.setSelectionRange(end, end);
  field.scrollTop = field.scrollHeight;
}

// Подсказки для новой мысли: сначала под выбранные ловушки, потом общие.
// Если человек написал слова для подруги, первой идёт подсказка взять их себе.
function renderReframeStarters() {
  thoughtStartersEl.innerHTML = '';
  const items = [];
  if (draft.friend.trim()) {
    items.push({ label: 'Сказать себе то же, что подруге', insert: draft.friend.trim() });
  }
  draft.traps.forEach(function (id) {
    const trap = trapById(id);
    if (trap) items.push({ label: trap.starter, insert: trap.starter });
  });
  BASE_REFRAMES.forEach(function (text) {
    items.push({ label: text, insert: text });
  });

  items.forEach(function (item) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'starter';
    button.textContent = item.label;
    button.addEventListener('click', function () {
      insertReframe(item.insert);
      button.classList.add('used');
    });
    thoughtStartersEl.append(button);
  });
  thoughtStartersEl.scrollLeft = 0;
}

// Переносим черновик в поля формы.
function fillThoughtFields() {
  thoughtFields.forEach(function (field) {
    const key = field.dataset.field;
    if (field.type === 'range') {
      const value = draft[key] === null ? draft.before : draft[key];
      field.value = value;
      document.getElementById(field.id + '-out').textContent = beliefText(value);
    } else {
      field.value = draft[key] || '';
    }
  });
  renderFeelings();
  renderTraps();
}

function checkThoughtCare() {
  const text = [draft.thought, draft.pro, draft.con, draft.friend, draft.reframe].join(' ');
  thoughtCareEl.hidden = !CARE_WORDS.test(text);
}

function renderThoughtStep() {
  const step = draft.step;
  thoughtStepEls.forEach(function (el) {
    el.hidden = Number(el.dataset.step) !== step;
  });
  thoughtProgressEl.textContent = 'Шаг ' + (step + 1) + ' из ' + THOUGHT_STEPS;
  thoughtBackBtn.hidden = step === 0;
  thoughtNextBtn.textContent = step === THOUGHT_STEPS - 1 ? 'Готово' : 'Дальше';

  if (step === THOUGHT_STEPS - 1) {
    if (draft.after === null) {
      draft.after = draft.before;
      saveDraft();
    }
    const afterField = document.getElementById('th-after');
    afterField.value = draft.after;
    document.getElementById('th-after-out').textContent = beliefText(draft.after);
    renderReframeStarters();
  }
  thoughtRestartBtn.hidden = !draftHasContent();
}

thoughtFields.forEach(function (field) {
  field.addEventListener('input', function () {
    const key = field.dataset.field;
    if (field.type === 'range') {
      draft[key] = Number(field.value);
      document.getElementById(field.id + '-out').textContent = beliefText(draft[key]);
    } else {
      draft[key] = field.value;
      checkThoughtCare();
    }
    saveDraft();
  });
});

function scrollToThoughtCard() {
  const top = thoughtCardEl.getBoundingClientRect().top;
  if (top < 0) thoughtCardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

thoughtNextBtn.addEventListener('click', function () {
  if (draft.step === 0 && !draft.thought.trim()) {
    document.getElementById('th-thought').focus();
    return;
  }
  if (draft.step < THOUGHT_STEPS - 1) {
    draft.step++;
    saveDraft();
    renderThoughtStep();
    scrollToThoughtCard();
  } else {
    finishThought();
  }
});

thoughtBackBtn.addEventListener('click', function () {
  if (draft.step === 0) return;
  draft.step--;
  saveDraft();
  renderThoughtStep();
  scrollToThoughtCard();
});

thoughtRestartBtn.addEventListener('click', function () {
  if (!confirm('Начать заново? Всё, что ты написала в этом разговоре, сотрётся.')) return;
  draft = emptyDraft();
  storeJSON(THOUGHT_DRAFT_KEY, null);
  fillThoughtFields();
  renderThoughtStep();
  checkThoughtCare();
});

// Разговор окончен: сохраняем в дневник и показываем итог.
function finishThought() {
  const now = new Date();
  const entry = {
    id: String(now.getTime()),
    date: now.toISOString(),
    thought: draft.thought.trim(),
    feelings: draft.feelings,
    traps: draft.traps,
    pro: draft.pro.trim(),
    con: draft.con.trim(),
    friend: draft.friend.trim(),
    reframe: draft.reframe.trim(),
    before: draft.before,
    after: draft.after === null ? draft.before : draft.after
  };
  diary.unshift(entry);
  storeJSON(THOUGHT_DIARY_KEY, diary);

  draft = emptyDraft();
  storeJSON(THOUGHT_DRAFT_KEY, null);
  thoughtRestartBtn.hidden = true;

  document.getElementById('result-old').textContent = '«' + entry.thought + '»';
  document.getElementById('result-new').textContent = entry.reframe
    || 'Новые слова пока не нашлись. Это нормально: к этой мысли можно вернуться позже.';

  let beliefLine;
  if (entry.after < entry.before) {
    beliefLine = 'Сначала ты верила этой мысли на ' + entry.before + ' из 10, а теперь на ' + entry.after
      + '. Она стала немного тише.';
  } else {
    beliefLine = 'Цифра почти не изменилась, и это нормально. Ты посмотрела на мысль со стороны, а это уже шаг. Иногда мысли затихают не сразу.';
  }
  document.getElementById('result-belief').textContent = beliefLine;

  thoughtCardEl.hidden = true;
  thoughtResultEl.hidden = false;
  renderThoughts();
  thoughtResultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('thought-another').addEventListener('click', function () {
  openThought();
  window.scrollTo(0, 0);
});

function addDetail(list, label, text) {
  if (!text) return;
  const item = document.createElement('li');
  const title = document.createElement('strong');
  title.textContent = label;
  item.append(title, document.createTextNode(text));
  list.append(item);
}

function renderThoughts() {
  thoughtsListEl.innerHTML = '';
  thoughtsBlockEl.hidden = diary.length === 0;

  diary.forEach(function (entry) {
    const item = document.createElement('li');
    item.className = 'letter-card';

    const meta = document.createElement('p');
    meta.className = 'letter-meta';
    meta.textContent = formatDate(entry.date);

    const oldText = document.createElement('p');
    oldText.className = 'thought-item-old';
    oldText.textContent = '«' + entry.thought + '»';
    item.append(meta, oldText);

    if (entry.reframe) {
      const newText = document.createElement('p');
      newText.className = 'thought-item-new';
      newText.textContent = entry.reframe;
      item.append(newText);
    }

    const actions = document.createElement('div');
    actions.className = 'letter-actions';

    if (expandedThought === entry.id) {
      const details = document.createElement('ul');
      details.className = 'thought-details';
      addDetail(details, 'Чувства', entry.feelings.join(', ').toLowerCase());
      addDetail(details, 'Ловушки', entry.traps.map(function (id) {
        const trap = trapById(id);
        return trap ? trap.name : '';
      }).filter(Boolean).join(', '));
      addDetail(details, 'В пользу мысли', entry.pro);
      addDetail(details, 'Против мысли', entry.con);
      addDetail(details, 'Слова для подруги', entry.friend);
      addDetail(details, 'Вера в мысль', 'было ' + beliefText(entry.before) + ', стало ' + beliefText(entry.after));
      item.append(details);
      actions.append(makeLink('Свернуть', function () {
        expandedThought = null;
        renderThoughts();
      }));
    } else {
      actions.append(makeLink('Подробнее', function () {
        expandedThought = entry.id;
        renderThoughts();
      }));
    }

    actions.append(makeLink('Удалить', function () {
      if (!confirm('Удалить этот разговор навсегда?')) return;
      diary = diary.filter(function (d) { return d.id !== entry.id; });
      storeJSON(THOUGHT_DIARY_KEY, diary);
      renderThoughts();
    }));

    item.append(actions);
    thoughtsListEl.append(item);
  });
}

// Открываем раздел: продолжаем незаконченный разговор или начинаем новый.
function openThought() {
  thoughtResultEl.hidden = true;
  thoughtCardEl.hidden = false;
  fillThoughtFields();
  renderThoughtStep();
  checkThoughtCare();
  renderThoughts();
}

// ---------- Карточка о грусти до и после родов ----------

const perinatalCopyBtn = document.getElementById('perinatal-copy');

perinatalCopyBtn.addEventListener('click', function () {
  const text = document.getElementById('perinatal-quote').textContent;
  function done() {
    perinatalCopyBtn.textContent = 'Скопировано ✓';
    setTimeout(function () { perinatalCopyBtn.textContent = 'Скопировать эти слова'; }, 2000);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(function () { shareText(text); });
  } else {
    shareText(text);
  }
});

// ---------- Расслабить мышцы ----------

const RELAX_PARTS = [
  { part: 'Кисти', tense: 'Сожми кулаки — крепко, но без боли.', relax: 'Отпусти. Почувствуй, как в ладонях становится тепло.' },
  { part: 'Руки', tense: 'Согни руки в локтях и напряги их, будто держишь тяжёлые сумки.', relax: 'Опусти руки. Пусть они станут тяжёлыми и мягкими.' },
  { part: 'Плечи', tense: 'Подними плечи к ушам и задержи.', relax: 'Опусти плечи. Заметь, как стало свободнее.' },
  { part: 'Лицо', tense: 'Зажмурься и сожми губы.', relax: 'Отпусти. Лоб гладкий, челюсть мягкая.' },
  { part: 'Стопы', tense: 'Сожми пальцы ног.', relax: 'Отпусти. Ноги тяжёлые и тёплые.' }
];

// Напрягаем 5 секунд, отпускаем 15. Вместе с финалом — ровно 2 минуты.
const RELAX_TENSE = 5000;
const RELAX_RELEASE = 15000;
const RELAX_FINAL = 20000;

// Собираем все шаги по порядку.
const RELAX_QUEUE = [];
RELAX_PARTS.forEach(function (item, i) {
  RELAX_QUEUE.push({ part: item.part, n: i + 1, text: item.tense, big: false, time: RELAX_TENSE });
  RELAX_QUEUE.push({ part: item.part, n: i + 1, text: item.relax, big: true, time: RELAX_RELEASE });
});
RELAX_QUEUE.push({ part: 'Всё тело', n: RELAX_PARTS.length + 1, text: 'Просто подыши. Пройди вниманием от макушки до пяток: всё мягкое и спокойное.', big: true, time: RELAX_FINAL });

const relaxOrbEl = document.getElementById('relax-orb');
const relaxPartEl = document.getElementById('relax-part');
const relaxTextEl = document.getElementById('relax-text');
const relaxCountEl = document.getElementById('relax-count');
const relaxBtn = document.getElementById('relax-btn');

let relaxTimer = null;
let relaxIndex = 0;
let relaxing = false;

function runRelaxStep() {
  const step = RELAX_QUEUE[relaxIndex];
  relaxPartEl.textContent = step.part;
  relaxTextEl.textContent = step.text;
  relaxCountEl.textContent = 'Часть ' + step.n + ' из ' + (RELAX_PARTS.length + 1);
  // Напряжение — огонёк быстро сжимается, расслабление — медленно разгорается.
  relaxOrbEl.style.transitionDuration = step.big ? '4000ms' : '1500ms';
  relaxOrbEl.classList.toggle('big', step.big);

  relaxTimer = setTimeout(function () {
    relaxIndex++;
    if (relaxIndex === RELAX_QUEUE.length) {
      stopRelax('Ты молодец. Побудь так ещё немного.');
      relaxBtn.textContent = 'Ещё раз';
      return;
    }
    runRelaxStep();
  }, step.time);
}

function stopRelax(message) {
  clearTimeout(relaxTimer);
  relaxTimer = null;
  relaxing = false;
  relaxOrbEl.style.transitionDuration = '1500ms';
  relaxOrbEl.classList.remove('big');
  relaxPartEl.textContent = '';
  relaxTextEl.textContent = message || 'Нажми, когда будешь готова';
  relaxCountEl.textContent = '';
  relaxBtn.textContent = 'Начать';
}

relaxBtn.addEventListener('click', function () {
  if (relaxing) {
    stopRelax();
    return;
  }
  relaxing = true;
  relaxIndex = 0;
  relaxBtn.textContent = 'Остановить';
  runRelaxStep();
});

// «1 дело», «3 дела», «5 дел» и так далее.
function plural(n, one, few, many) {
  const last = n % 10;
  const lastTwo = n % 100;
  if (last === 1 && lastTwo !== 11) return one;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return few;
  return many;
}

// ---------- Маленький шаг ----------

const SMALL_STEPS_KEY = 'smallSteps';
const TASKS_AT_ONCE = 6;

// Совсем крошечные дела. only — как у фраз: 'people', 'alone' или 'baby'.
const TASKS = [
  { text: 'Выпить стакан воды' },
  { text: 'Открыть окно на минуту' },
  { text: 'Умыться прохладной водой' },
  { text: 'Застелить кровать' },
  { text: 'Съесть что-нибудь, хоть яблоко' },
  { text: 'Помыть одну чашку' },
  { text: 'Переодеться в удобную чистую одежду' },
  { text: 'Расчесаться' },
  { text: 'Полить цветок' },
  { text: 'Включить любимую песню' },
  { text: 'Потянуться одну минуту' },
  { text: 'Вынести один пакет мусора' },
  { text: 'Протереть одну полку' },
  { text: 'Минуту постоять у окна и посмотреть на небо' },
  { text: 'Намазать руки кремом' },
  { text: 'Выйти на балкон или во двор на пять минут' },
  { text: 'Написать одно сообщение близкому человеку', only: 'people' },
  { text: 'Написать в чат по интересам одно сообщение', only: 'alone' },
  { text: 'Погладить живот и сказать малышу пару слов', only: 'baby' }
];

const AFTER_REPLIES = {
  better: 'Вот оно: маленькое дело — и стало чуть легче. Запомни это чувство. В следующий раз оно поможет начать.',
  same: 'Это тоже нормально. Иногда лёгкость приходит не сразу, а после нескольких маленьких дел. Ты всё равно сделала шаг.',
  worse: 'Спасибо, что честно. Значит, сейчас телу и душе нужен отдых. Укутайся, выпей тёплого и будь с собой бережной.'
};

const AFTER_LABELS = { better: 'стало чуть легче', same: 'так же', worse: 'стало тяжелее' };

const stepsChooseEl = document.getElementById('steps-choose');
const stepsDoingEl = document.getElementById('steps-doing');
const stepsAfterEl = document.getElementById('steps-after');
const stepsReplyEl = document.getElementById('steps-reply');
const tasksEl = document.getElementById('tasks');
const ownTaskInput = document.getElementById('own-task');
const stepsLogEl = document.getElementById('steps-log');

let smallSteps = loadJSON(SMALL_STEPS_KEY, []);
let taskDeck = [];
let taskOffset = 0;
let chosenTask = '';

function stepsStage(stage) {
  stepsChooseEl.hidden = stage !== 'choose';
  stepsDoingEl.hidden = stage !== 'doing';
  stepsAfterEl.hidden = stage !== 'after';
  stepsReplyEl.hidden = stage !== 'reply';
}

function renderTasks() {
  tasksEl.innerHTML = '';
  for (let i = 0; i < Math.min(TASKS_AT_ONCE, taskDeck.length); i++) {
    const text = taskDeck[(taskOffset + i) % taskDeck.length].text;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'task';
    button.textContent = text;
    button.addEventListener('click', function () { chooseTask(text); });
    tasksEl.append(button);
  }
}

function chooseTask(text) {
  chosenTask = text;
  document.getElementById('task-now').textContent = text;
  stepsStage('doing');
  window.scrollTo(0, 0);
}

document.getElementById('tasks-more').addEventListener('click', function () {
  taskOffset = (taskOffset + TASKS_AT_ONCE) % taskDeck.length;
  renderTasks();
});

document.getElementById('own-task-go').addEventListener('click', function () {
  const text = ownTaskInput.value.trim();
  if (!text) {
    ownTaskInput.focus();
    return;
  }
  ownTaskInput.value = '';
  ownTaskInput.blur();
  chooseTask(text);
});

document.getElementById('task-done').addEventListener('click', function () { stepsStage('after'); });
document.getElementById('task-change').addEventListener('click', function () { stepsStage('choose'); });
document.getElementById('task-again').addEventListener('click', function () {
  taskOffset = (taskOffset + TASKS_AT_ONCE) % taskDeck.length;
  renderTasks();
  stepsStage('choose');
  window.scrollTo(0, 0);
});

document.querySelectorAll('[data-after]').forEach(function (button) {
  button.addEventListener('click', function () {
    const after = button.dataset.after;
    smallSteps.unshift({
      date: new Date().toISOString(),
      task: chosenTask,
      after: after,
      mood: moods[dayKey(new Date())] || null // погода дня, когда сделан шаг
    });
    smallSteps = smallSteps.slice(0, 200); // храним последние 200 шагов
    storeJSON(SMALL_STEPS_KEY, smallSteps);
    document.getElementById('task-reply').textContent = AFTER_REPLIES[after];
    stepsStage('reply');
    renderStepsLog();
  });
});

// Итоги за 7 дней: сколько дел и после скольких стало легче.
function renderStepsLog() {
  const weekAgo = Date.now() - 7 * DAY;
  const week = smallSteps.filter(function (item) { return new Date(item.date).getTime() >= weekAgo; });
  stepsLogEl.hidden = week.length === 0;
  if (week.length === 0) return;

  const better = week.filter(function (item) { return item.after === 'better'; }).length;
  let summary = 'За последние 7 дней — ' + week.length + ' ' + plural(week.length, 'маленькое дело', 'маленьких дела', 'маленьких дел') + '.';
  if (better > 0) summary += ' После ' + better + ' из них стало чуть легче.';
  if (week.length >= 3 && better * 2 >= week.length) summary += ' Похоже, маленькие дела правда тебе помогают.';
  document.getElementById('steps-summary').textContent = summary;

  const list = document.getElementById('steps-list');
  list.innerHTML = '';
  week.slice(0, 7).forEach(function (item) {
    const li = document.createElement('li');
    const task = document.createElement('span');
    task.textContent = item.task;
    const meta = document.createElement('small');
    meta.textContent = new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
      + ', после — ' + AFTER_LABELS[item.after];
    li.append(task, meta);
    list.append(li);
  });
}

function openSteps() {
  taskDeck = shuffle(TASKS.filter(fitsProfile));
  taskOffset = 0;
  renderTasks();
  stepsStage('choose');
  renderStepsLog();
}

// ---------- Минутка доброты к себе ----------

const KIND_STEPS = [
  { title: 'Мне сейчас больно', text: 'Положи ладонь на сердце или туда, где тепло и спокойно. Тихо скажи себе: «Мне сейчас больно. Это трудный момент». Ничего не нужно менять — просто заметь.' },
  { title: 'Так бывает у многих', text: 'Боль — часть жизни каждого человека, а не знак, что с тобой что-то не так. Прямо сейчас многие женщины чувствуют то же, что и ты. Ты не одна в этом.' },
  { title: 'Пусть я буду добра к себе', text: 'Спроси себя: что мне сейчас нужно? Скажи себе то, что сказала бы любимой подруге: «Пусть я буду к себе бережной. Пусть у меня будут силы».' },
  { title: 'Эти слова всегда с тобой', text: 'Когда трудно, можно повторить про себя: «Мне сейчас больно. Так бывает у многих. Пусть я буду добра к себе». Своими словами тоже можно.' }
];

const KIND_PHRASE = 'Мне сейчас больно. Так бывает у многих. Пусть я буду добра к себе.';

const kindTitleEl = document.getElementById('kind-title');
const kindTextEl = document.getElementById('kind-text');
const kindProgressEl = document.getElementById('kind-progress');
const kindNextBtn = document.getElementById('kind-next');
const kindSaveBtn = document.getElementById('kind-save');
let kindIndex = 0;

function kindGo(index) {
  kindIndex = index;
  const step = KIND_STEPS[index];
  const last = index === KIND_STEPS.length - 1;
  kindTitleEl.textContent = step.title;
  kindTextEl.textContent = step.text;
  kindProgressEl.textContent = last ? '' : (index + 1) + ' из ' + (KIND_STEPS.length - 1);
  kindNextBtn.textContent = last ? 'Готово' : 'Дальше';
  kindSaveBtn.hidden = !last;
  const isSaved = saved.includes(KIND_PHRASE);
  kindSaveBtn.textContent = isSaved ? 'Фразы в «Сохранённых» ♥' : 'Сохранить три фразы';
  kindSaveBtn.disabled = isSaved;
  window.scrollTo(0, 0);
}

kindNextBtn.addEventListener('click', function () {
  if (kindIndex < KIND_STEPS.length - 1) {
    kindGo(kindIndex + 1);
  } else {
    show(returnTo.kind || 'phrases');
  }
});

kindSaveBtn.addEventListener('click', function () {
  if (!saved.includes(KIND_PHRASE)) {
    saved.push(KIND_PHRASE);
    storeSaved(saved);
    updateHeart();
  }
  kindSaveBtn.textContent = 'Фразы в «Сохранённых» ♥';
  kindSaveBtn.disabled = true;
});

// ---------- Тихая ночь ----------

const NIGHT_TIPS = [
  { text: 'Не смотри на часы. Подсчёт, сколько осталось спать, только будит.' },
  { text: 'Если не спится минут двадцать, встань и займись чем-то спокойным при тусклом свете: бумажная книга, камин. Вернись в постель, когда потянет в сон.' },
  { text: 'Запиши то, что крутится в голове, на листок и скажи себе: «Подумаю об этом завтра днём». Ночью мысли всегда кажутся тяжелее.' },
  { text: 'Подыши медленно: выдох чуть длиннее вдоха. Пусть с каждым выдохом тело становится тяжелее.' },
  { text: 'Сделай комнату чуть прохладнее и темнее. Телу так легче уснуть.' },
  { text: 'Тёплые носки или тёплый душ перед сном помогают телу расслабиться.' },
  { text: 'Даже если не получается уснуть, лежать в тишине с закрытыми глазами — уже отдых.' },
  { text: 'Старайся вставать примерно в одно время, даже после плохой ночи. Так сон понемногу наладится.' },
  { text: 'Ложись на бок и положи подушку между коленями: так спине и животу легче.', only: 'baby' },
  { text: 'Если уже две недели не получается уснуть, даже когда есть возможность, скажи об этом врачу. Это важно.', only: 'baby' }
];

const nightTipEl = document.getElementById('night-tip');
const nightDimEl = document.getElementById('night-dim');
const nightEntryEl = document.getElementById('night-entry');
let nightDeck = [];
let nightIndex = 0;

function openNight() {
  nightDeck = shuffle(NIGHT_TIPS.filter(fitsProfile));
  nightIndex = 0;
  nightTipEl.textContent = nightDeck[0].text;
}

document.getElementById('night-next').addEventListener('click', function () {
  nightIndex = (nightIndex + 1) % nightDeck.length;
  nightTipEl.textContent = nightDeck[nightIndex].text;
});

// Приглашение в ночной режим на главном экране — с 23:00 до 5:00.
function updateNightEntry() {
  const hour = new Date().getHours();
  nightEntryEl.hidden = !(hour >= 23 || hour < 5);
}

// Кнопки «← Назад» возвращают туда, откуда пришли.
const RETURNABLE = ['relax', 'steps', 'kind', 'night'];
const returnTo = {};

document.querySelectorAll('.back-btn').forEach(function (button) {
  button.addEventListener('click', function () {
    show(returnTo[button.dataset.back] || 'phrases');
  });
});

// ---------- Переключение разделов ----------

const views = document.querySelectorAll('.view');
const tabs = document.querySelectorAll('.tab');

// Какой раздел сейчас на экране.
let currentView = null;

// Показываем раздел с нужным именем, остальные прячем.
function show(name) {
  // Уходим с главного экрана — сворачиваем «Чем себе помочь».
  if (name !== 'phrases') setSelfcareOpen(false);

  // На экране первого входа и в тревожном сценарии нижнее меню не нужно:
  // там важно, чтобы ничего не отвлекало.
  tabbarEl.hidden = name === 'start' || name === 'calm';

  // Если ушли с экрана дыхания, останавливаем упражнение.
  if (name !== 'breath' && breathing) stopBreath();

  // Запоминаем, откуда пришли в тревожный сценарий, чтобы туда же и вернуться.
  if (name === 'calm' && currentView !== 'calm') {
    calmStartedAt = Date.now();
    // В тревожном сценарии ничего не должно всплывать сверху.
    if (!peopleToastEl.hidden) hidePeopleToast();
    if (currentView && currentView !== 'start') calmReturn = currentView;
  }
  if (name !== 'calm') {
    stopCalmBreath();
    stopWave();
  }

  // Для разделов с «← Назад» запоминаем, откуда пришли.
  // Из тревожного сценария возвращаемся туда, откуда пришли в него.
  if (RETURNABLE.includes(name) && currentView !== name) {
    let from = currentView && currentView !== 'start' ? currentView : 'phrases';
    if (from === 'calm') from = calmReturn;
    returnTo[name] = from;
  }

  // Ушли с расслабления — останавливаем его. Ночной режим приглушает экран только у себя.
  if (name !== 'relax' && relaxing) stopRelax();
  nightDimEl.hidden = name !== 'night';
  currentView = name;

  views.forEach(function (view) {
    view.hidden = view.id !== 'view-' + name;
  });

  // «Сохранённые» живут внутри раздела «Фразы», поэтому подсвечиваем его вкладку.
  let activeTab = name;
  if (name === 'saved' || name === 'about' || name === 'steps' || name === 'kind') activeTab = 'phrases';
  if (name === 'relax' || name === 'night') activeTab = 'breath';
  if (name === 'letter' || name === 'thought') activeTab = 'jar';
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
    updateNightEntry();
  }
  if (name === 'steps') openSteps();
  if (name === 'kind') kindGo(0);
  if (name === 'night') openNight();
  if (name === 'letter') {
    renderStarters();
    renderLetters();
  }
  if (name === 'saved') renderSaved();
  if (name === 'jar') {
    resetJarView();
    updateJarCount();
  }
  if (name === 'thought') openThought();
  window.scrollTo(0, 0);
  // Тревожный сценарий запускаем после прокрутки: дыхание начинается сразу.
  if (name === 'calm') calmGo('breath');
}

// Любая кнопка с атрибутом data-go переключает на свой раздел.
document.querySelectorAll('[data-go]').forEach(function (button) {
  button.addEventListener('click', function () {
    show(button.dataset.go);
  });
});

// ---------- Сколько людей за месяц с нами (GoatCounter) ----------

const GOATCOUNTER_CODE = 'svet-v-okne';

// Плашку показываем, только если за месяц набралось хотя бы столько людей,
// чтобы маленькое число не прозвучало одиноко. Поставьте 0, чтобы показывать всегда.
const MIN_PEOPLE = 10;

// Сколько секунд плашка висит на экране.
const TOAST_SECONDS = 8;

// Если приложение было свёрнуто дольше стольких минут, возвращение считаем новым входом.
const NEW_VISIT_MINUTES = 30;

// Последнее известное число людей — пригодится, если нет интернета.
const PEOPLE_MONTH_KEY = 'peopleMonth';
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
  showToastText('За месяц свет в окне зажгли уже ' + count + ' ' + peopleWord(count) + '. Ты не одна.');
}

let toastTimer = null;

function showToastText(text) {
  clearTimeout(toastTimer);
  peopleToastEl.textContent = text;
  peopleToastEl.hidden = false;
  // Двойной кадр: сначала плашка встаёт на место невидимой, потом плавно проявляется.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      peopleToastEl.classList.add('visible');
    });
  });
  toastTimer = setTimeout(hidePeopleToast, TOAST_SECONDS * 1000);
}

function hidePeopleToast() {
  clearTimeout(toastTimer);
  peopleToastEl.classList.remove('visible');
  // Ждём, пока плашка мягко растает (столько же, сколько transition в CSS).
  toastTimer = setTimeout(function () { peopleToastEl.hidden = true; }, 900);
}

// По нажатию плашку можно закрыть раньше.
peopleToastEl.addEventListener('click', hidePeopleToast);

// Узнаём у GoatCounter, сколько разных людей открывали приложение за последние 30 дней,
// и показываем плашку при каждом входе.
// Для проверки на dev-сайте добавьте к адресу #toast-test: плашка покажется
// с настоящим числом, даже если оно меньше порога.
function checkPeopleMonth() {
  const testMode = location.hash === '#toast-test';

  function showIfEnough(count) {
    if (!testMode && count < MIN_PEOPLE) return;
    showPeopleToast(count);
  }

  // 30 дней, считая сегодня: со дня 29 дней назад до начала завтрашнего дня.
  // На dev-сайте и при проверке на компьютере берём числа основного сайта на GitHub Pages:
  // сам dev не считается. На основном сайте — числа его собственного адреса.
  const path = isDevSite ? '/svet-v-okne/' : (location.pathname.replace(/index\.html$/, '') || '/');
  const url = 'https://' + GOATCOUNTER_CODE + '.goatcounter.com/counter/'
    + encodeURIComponent(path) + '.json?start=' + dayKey(daysAgo(29)) + '&end=' + dayKey(daysAgo(-1));

  fetch(url)
    .then(function (response) {
      // Если никого не посчитали, GoatCounter отвечает «не найдено» (404) — это ноль.
      if (response.status === 404) return { count_unique: '0' };
      if (!response.ok) throw new Error('GoatCounter ответил кодом ' + response.status);
      return response.json();
    })
    .then(function (data) {
      // count_unique — разные люди. Число приходит строкой вроде «1 234»: оставляем только цифры.
      const raw = data.count_unique || '0';
      const count = parseInt(String(raw).replace(/\D/g, ''), 10) || 0;
      try { localStorage.setItem(PEOPLE_MONTH_KEY, String(count)); } catch (error) {}
      showIfEnough(count);
    })
    .catch(function (error) {
      // Нет интернета — показываем число из прошлого раза, если оно есть.
      let cached = 0;
      try { cached = Number(localStorage.getItem(PEOPLE_MONTH_KEY)) || 0; } catch (e) {}
      if (cached) {
        showIfEnough(cached);
      } else if (testMode) {
        showToastText('Тест: не удалось получить число. ' + (error && error.message ? error.message : ''));
      }
    });
}

// Вернулись в приложение после долгого перерыва — это новый вход, показываем плашку снова.
let hiddenAt = 0;
document.addEventListener('visibilitychange', function () {
  if (document.hidden) {
    hiddenAt = Date.now();
  } else if (profile && hiddenAt && Date.now() - hiddenAt >= NEW_VISIT_MINUTES * 60 * 1000
    && whatsNewEl.hidden && currentView !== 'calm' && currentView !== 'start') {
    setTimeout(checkPeopleMonth, 1200);
  }
});

startCounting();

// ---------- Строка «за месяц уже N раз» ----------

// Строку показываем при каждом открытии, если за 30 дней набралось хотя бы столько открытий.
const MIN_MONTH_VISITS = 20;
const MONTH_KEY = 'monthVisits'; // последнее известное число — чтобы строка была видна сразу и без интернета
const togetherEl = document.getElementById('together');

// «1 раз», «3 раза», «115 раз».
function timesWord(n) {
  const last = n % 10;
  const lastTwo = n % 100;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'раза';
  return 'раз';
}

function showMonthVisits(count) {
  if (count < MIN_MONTH_VISITS) {
    togetherEl.hidden = true;
    return;
  }
  togetherEl.textContent = 'Каждый день «Свет в окне» открывают женщины, которым тоже бывает непросто: за месяц уже '
    + count + ' ' + timesWord(count) + '. Ты не одна.';
  togetherEl.hidden = false;
}

function checkMonthVisits() {
  // Сначала показываем то, что узнали в прошлый раз.
  try {
    const cached = Number(localStorage.getItem(MONTH_KEY));
    if (cached) showMonthVisits(cached);
  } catch (error) {}

  // Потом спрашиваем свежее число у GoatCounter: последние 30 дней, считая сегодня.
  // На dev-сайте и при проверке на компьютере берём числа основного сайта на GitHub Pages,
  // потому что сам dev не считается.
  const path = isDevSite ? '/svet-v-okne/' : (location.pathname.replace(/index\.html$/, '') || '/');
  const url = 'https://' + GOATCOUNTER_CODE + '.goatcounter.com/counter/'
    + encodeURIComponent(path) + '.json?start=' + dayKey(daysAgo(29)) + '&end=' + dayKey(daysAgo(-1));

  fetch(url)
    .then(function (response) {
      if (response.status === 404) return { count: '0' };
      if (!response.ok) throw new Error('GoatCounter ответил кодом ' + response.status);
      return response.json();
    })
    .then(function (data) {
      // count — все открытия, как в «Тише»; число приходит строкой вроде «1 234».
      const count = parseInt(String(data.count || '0').replace(/\D/g, ''), 10) || 0;
      try { localStorage.setItem(MONTH_KEY, String(count)); } catch (error) {}
      showMonthVisits(count);
    })
    .catch(function () {
      // Нет интернета — остаётся число из прошлого раза.
    });
}

checkMonthVisits();

// Когда приложение снова открывают из свёрнутого состояния, обновляем число.
document.addEventListener('visibilitychange', function () {
  if (!document.hidden) checkMonthVisits();
});

// ---------- Что нового ----------

// Список изменений для каждой версии. Для новой версии добавьте сюда новый блок
// с тем же номером, что в APP_VERSION, — окно покажется всем один раз.
const WHATS_NEW = {
  '1.2': [
    { icon: '🌊', title: 'Мне сейчас очень тревожно', text: 'Кнопка на главном экране для минут, когда накрывает паника: дыхание, пять опор вокруг, волна, которую можно переждать, и объяснение, что происходит с телом.' },
    { icon: '🌱', title: 'Маленький шаг', text: 'Когда нет сил, выбери одно крошечное дело, отметь «сделала» и заметь, как ты после него. Ссылка появляется под погодой дня.' },
    { icon: '💬', title: 'Поговорить с мыслью', text: 'Если тяжёлая мысль крутится по кругу, можно спокойно разобрать её по шагам и найти слова бережнее. Ищи во вкладке «Банка».' },
    { icon: '🤍', title: 'Минутка доброты к себе', text: 'Три коротких шага, когда больно: заметить боль, вспомнить, что так бывает у многих, и сказать себе тёплые слова.' },
    { icon: '🌙', title: 'Тихая ночь', text: 'Приглушённый экран, камин и бережные советы для сна. Поздно вечером приглашение появится на главном экране. А на экране «Дыхание» теперь есть и расслабление мышц.' },
    { icon: '🌷', title: 'Грусть до и после родов', text: 'В «Помощи» появилась карточка о том, когда грусть во время беременности и после родов — повод сказать врачу, и как подобрать для этого слова.' }
  ],
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
  if (location.hash === '#toast-test') checkPeopleMonth();
  if (location.hash === '#whatsnew-test') showWhatsNew();
});

// Сначала «Что нового» (если есть что показать), а плашку «ты не одна» — уже после него.
// На самом первом экране с вопросами ни то ни другое не показываем.
if (shouldShowWhatsNew()) {
  setTimeout(function () {
    showWhatsNew(function () { setTimeout(checkPeopleMonth, 1500); });
  }, 800);
} else if (profile) {
  setTimeout(checkPeopleMonth, 2000);
}
