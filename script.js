const validStudents = [
    "Токмакова", "Кочесокова", "Белимготова", "Калмыкова", "Хабалов", "Шуева",
    "Хавпачев", "Ципинов", "Тишков", "Биттиров", "Жанимов", "Келеметов",
    "Шогенов", "Шарипова", "Дауров"
];
const resultsKey = "surveyResults"; // Ключ для хранения данных в LocalStorage

// Инициализация
document.getElementById("auth-form").addEventListener("submit", handleAuth);
document.getElementById("survey-form").addEventListener("submit", handleSurvey);

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

// Функция отправки опроса
function handleSurvey(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const answers = Object.fromEntries(formData.entries());
    saveResults(answers);
    alert("Ваши ответы сохранены!");
    event.target.reset();
}

// Функция сохранения результатов
function saveResults(answers) {
    const results = JSON.parse(localStorage.getItem(resultsKey)) || [];
    results.push(answers);
    localStorage.setItem(resultsKey, JSON.stringify(results));
}

// Функция отображения результатов
function showResults() {
    const resultsContainer = document.getElementById("results");
    const results = JSON.parse(localStorage.getItem(resultsKey)) || [];
    resultsContainer.innerHTML = results.map((res, index) => {
        return `<p>Опрос ${index + 1}: ${JSON.stringify(res)}</p>`;
    }).join("");
}
