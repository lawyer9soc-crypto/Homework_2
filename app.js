// 1. Исходные данные (вставлены без изменений)
const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

// Переменные для хранения данных
let data = null;

// Находим все нужные элементы в DOM
const titleEl = document.querySelector('#event-title');
const dateEl = document.querySelector('#event-date');
const placeEl = document.querySelector('#event-place');
const descEl = document.querySelector('#event-description');

const showProgramBtn = document.querySelector('#show-program');
const programEl = document.querySelector('#program');

const formEl = document.querySelector('#service-form');
const guideCheck = document.querySelector('#guide');
const audioCheck = document.querySelector('#audio');
const catalogCheck = document.querySelector('#catalog');

const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');
const resultEl = document.querySelector('#result');
const reportJsonEl = document.querySelector('#report-json');

// 2. Функция buildReport (по заданию)
function buildReport(services, guideChecked, audioChecked, catalogChecked) {
    // Отбираем услуги, которые выбраны
    const filtered = services.filter(service => {
        if (service.id === 'guide' && guideChecked) return true;
        if (service.id === 'audio' && audioChecked) return true;
        if (service.id === 'catalog' && catalogChecked) return true;
        return false;
    });

    // Преобразуем через map с деструктуризацией
    const items = filtered.map(({ title, price }) => {
        return {
            title: title.trim(), // очищаем пробелы
            price: price
        };
    });

    // Считаем сумму через reduce
    const total = items.reduce((sum, item) => sum + item.price, 0);

    return {
        count: items.length,
        total: total,
        items: items
    };
}

// 3. Инициализация страницы (разбор JSON)
try {
    data = JSON.parse(sourceJson);
    
    // Заполняем карточку события
    titleEl.textContent = data.event.title;
    dateEl.textContent = data.event.date;
    placeEl.textContent = data.event.place;
    descEl.textContent = data.event.description;

    // Показываем форму (так как JSON корректный)
    formEl.hidden = false;
    dataError.hidden = true;

} catch (error) {
    // Если JSON сломан
    dataError.hidden = false;
    formEl.hidden = true;
}

// 4. Обработчик кнопки "Показать программу"
showProgramBtn.addEventListener('click', () => {
    programEl.hidden = false;
    programEl.innerHTML = data.event.meeting;
});

// 5. Обработчик отправки формы
formEl.addEventListener('submit', (event) => {
    event.preventDefault(); // Отменяем перезагрузку страницы

    // Читаем состояние чекбоксов
    const isGuide = guideCheck.checked;
    const isAudio = audioCheck.checked;
    const isCatalog = catalogCheck.checked;

    // Проверяем, выбрано ли что-то
    if (!isGuide && !isAudio && !isCatalog) {
        // Ошибка: ничего не выбрано
        choiceError.hidden = false;
        resultEl.hidden = true;
        reportJsonEl.hidden = true;
        return;
    }

    // Ошибки нет
    choiceError.hidden = true;

    // Строим отчет
    const report = buildReport(data.services, isGuide, isAudio, isCatalog);

    // Формируем HTML для вывода результата
    let html = `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.<br>`;
    report.items.forEach(item => {
        html += `${item.title}<br>`;
    });

    // Выводим результат
    resultEl.innerHTML = html;
    resultEl.hidden = false;

    // Выводим JSON-строку
    const jsonString = JSON.stringify(report);
    reportJsonEl.textContent = jsonString;
    reportJsonEl.hidden = false;

    // Проверка через JSON.parse (по заданию)
    try {
        JSON.parse(jsonString);
    } catch (e) {
        console.error("Ошибка проверки JSON:", e);
    }
});