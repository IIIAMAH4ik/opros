// Подготовка данных
const validStudents = [
    "Токмакова", "Кочесокова", "Белимготова", "Калмыкова", "Хабалов", "Шуева",
    "Хавпачев", "Ципинов", "Тишков", "Биттиров", "Жанимов", "Келеметов",
    "Шогенов", "Шарипова", "Дауров"
];
const resultsKey = "surveyResults"; // Ключ для хранения данных в LocalStorage

// Правильные ответы
const correctAnswers = {
    q1: "Оба варианта",
    q2: "Очень полезен",
    q3: "Очень полезны",
    q4: "Отлично",
    q5: "Всегда готов",
    q6: "Позитивная",
    q7: "Позитивная",
    q8: "Отличный",
    q9: "Отличный",
    q10: "Отличная"
};

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("auth-form").addEventListener("submit", handleAuth);
    document.getElementById("survey-form").addEventListener("submit", handleSurvey);
});

// Функция авторизации
function handleAuth(event) {
    event.preventDefault(); // Предотвращает обновление страницы
    const lastName = document.getElementById("lastName").value.trim();
    const course = document.getElementById("course").value.trim();

    if (validStudents.includes(lastName) && course === "3") {
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("survey-container").style.display = "block";
    } else if (lastName === "Бозиев" && course.toLowerCase() === "преподаватель") {
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("results-container").style.display = "block";
        showResults();
    } else {
        alert("Неверная фамилия или курс!");
    }
}

// Функция обработки отправки формы опроса
function handleSurvey(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userAnswers = Object.fromEntries(formData.entries());

    // Подсчет правильных ответов
    let correctCount = 0;
    const totalQuestions = Object.keys(correctAnswers).length;

    for (let question in correctAnswers) {
        if (userAnswers[question] === correctAnswers[question]) {
            correctCount++;
        }
    }

    // Расчет процента правильных ответов
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);

    // Сохранение результатов
    saveResults(userAnswers, scorePercent);

    // Отображение сообщения с результатом
    alert(`Ваши ответы сохранены! Вы набрали ${scorePercent}% правильных ответов.`);

    // Сброс формы
    event.target.reset();
}

// Функция сохранения результатов
function saveResults(answers, scorePercent) {
    const results = JSON.parse(localStorage.getItem(resultsKey)) || [];
    results.push({ answers, scorePercent, date: new Date().toLocaleString() });
    localStorage.setItem(resultsKey, JSON.stringify(results));
}

// Функция отображения результатов
function showResults() {
    const resultsContainer = document.getElementById("results");
    const results = JSON.parse(localStorage.getItem(resultsKey)) || [];
    if (results.length === 0) {
        resultsContainer.innerHTML = "<p>Нет сохраненных результатов.</p>";
        return;
    }

    resultsContainer.innerHTML = results
        .map((res, index) => {
            return `
                <div>
                    <h3>Опрос ${index + 1} (${res.date})</h3>
                    <p>Результат: ${res.scorePercent}% правильных ответов</p>
                    <p>Ответы: ${JSON.stringify(res.answers)}</p>
                </div>
            `;
        })
        .join("");
}
