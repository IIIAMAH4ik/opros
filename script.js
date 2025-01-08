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
    // Добавьте остальные правильные ответы
};

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("auth-form").addEventListener("submit", handleAuth);
    document.getElementById("survey-form").addEventListener("submit", handleSurvey);
});

// Функция авторизации
function handleAuth(event) {
    event.preventDefault();
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

    let correctCount = 0;
    const totalQuestions = Object.keys(correctAnswers).length;

    for (let question in correctAnswers) {
        if (userAnswers[question] === correctAnswers[question]) {
            correctCount++;
        }
    }

    const scorePercent = Math.round((correctCount / totalQuestions) * 100);

    saveResults(userAnswers, scorePercent);
    alert(`Ваши ответы сохранены! Вы набрали ${scorePercent}% правильных ответов.`);
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

    const theoreticalData = results.map((res, index) => ({
        student: `Участник ${index + 1}`,
        score: res.scorePercent,
        comment: res.scorePercent >= 70 ? "Хорошие знания" : "Нужно улучшить знания",
    }));

    const theoreticalTable = generateTable(
        ["Студент", "Результат (%)", "Комментарий"],
        theoreticalData.map((data) => [data.student, data.score, data.comment])
    );

    const averageScore = calculateAverage(theoreticalData.map((data) => data.score));

    resultsContainer.innerHTML = `
        <h3>Теоретический тест</h3>
        ${theoreticalTable}
        <h3>Анализ полученных результатов</h3>
        <p>Общее количество участников: ${theoreticalData.length}</p>
        <p>Средний балл теоретического теста: ${averageScore}%</p>
    `;
}

// Функция для генерации таблиц
function generateTable(headers, rows) {
    const headerRow = headers.map((header) => `<th>${header}</th>`).join("");
    const bodyRows = rows
        .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
        .join("");
    return `
        <table>
            <thead><tr>${headerRow}</tr></thead>
            <tbody>${bodyRows}</tbody>
        </table>
    `;
}

// Функция расчета среднего значения
function calculateAverage(values) {
    const total = values.reduce((sum, value) => sum + value, 0);
    return (total / values.length).toFixed(2);
}
