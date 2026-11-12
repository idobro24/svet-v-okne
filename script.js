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

// Номер фразы, которая сейчас на экране.
let current = 0;

// Идёт ли сейчас смена фразы (чтобы частые нажатия не сбивали анимацию).
let changing = false;

// Сколько длится затухание, в миллисекундах. Должно совпадать с transition в CSS.
const FADE_TIME = 500;

// ---------- Сохранённые фразы ----------

// Под этим именем список хранится в памяти браузера на телефоне.
const STORAGE_KEY = 'savedPhrases';

// Достаём сохранённые фразы. Если ничего нет или память недоступна, начинаем с пустого списка.
function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

// Записываем список обратно в память.
function storeSaved(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    // Если память недоступна, просто ничего не сохраняем.
  }
}

let saved = loadSaved();

// Перекрашиваем сердечко: заполненное, если текущая фраза уже сохранена.
function updateHeart() {
  const isSaved = saved.includes(phrases[current]);
  saveBtn.classList.toggle('saved', isSaved);
  saveBtn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
  saveBtn.setAttribute('aria-label', isSaved ? 'Убрать из сохранённых' : 'Сохранить фразу');
}

// Нажатие на сердечко: сохраняем фразу или убираем её из сохранённых.
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

// ---------- Смена фраз ----------

// Выбираем случайную фразу, но не ту же самую, что уже показана.
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

  // 1. Плавно прячем текущую фразу.
  phraseEl.classList.add('hidden');

  // 2. Когда она исчезла, меняем текст, обновляем сердечко и плавно показываем новую.
  setTimeout(function () {
    current = pickNext();
    phraseEl.textContent = phrases[current];
    updateHeart();
    phraseEl.classList.remove('hidden');
    changing = false;
  }, FADE_TIME);
});

// При открытии страницы сразу показываем правильное состояние сердечка.
updateHeart();
