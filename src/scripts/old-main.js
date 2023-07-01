// Функция для отображения данных в таблице
function displayTableData(data) {
    const tableBody = document.querySelector(".table-main");

    // Очищаем содержимое tbody
    tableBody.innerHTML = "";

    const dataArray = Object.values(data);

    // Генерируем строки данных
    dataArray.forEach(item => {
        const row = createTableRow(item);
        tableBody.appendChild(row);
    });
}

// Функция для создания строки таблицы
function createTableRow(item) {
    const row = document.createElement("tr");
    row.classList.add("table-row");

    // Создаем ячейки данных
    const customerNameCell = createTableCell(item["Customer Name"]);
    const companyCell = createTableCell(item["Company"]);
    const phoneNumberCell = createLinkTableCell(item["Phone Number"], `tel:${item["Phone Number"]}`);
    const emailCell = createLinkTableCell(item["Email"], `mailto:${item["Email"]}`);
    const countryCell = createTableCell(item["Country"]);
    const statusCell = createStatusTableCell(item["Status"]);

    // Добавляем ячейки в строку
    row.appendChild(customerNameCell);
    row.appendChild(companyCell);
    row.appendChild(phoneNumberCell);
    row.appendChild(emailCell);
    row.appendChild(countryCell);
    row.appendChild(statusCell);

    return row;
}

// Функция для создания ячейки таблицы
function createTableCell(text) {
    const cell = document.createElement("td");
    cell.classList.add("td-text");
    cell.textContent = text;
    return cell;
}

// Функция для создания ячейки-ссылки таблицы
function createLinkTableCell(text, link) {
    const cell = document.createElement("td");
    cell.classList.add("td-text");
    const linkElement = document.createElement("a");
    linkElement.href = link;
    linkElement.textContent = text;
    cell.appendChild(linkElement);
    return cell;
}

// Функция для создания ячейки со статусом
function createStatusTableCell(status) {
    const cell = document.createElement("td");
    cell.classList.add("td-text", "td-status");
    const statusSpan = document.createElement("span");
    statusSpan.textContent = status;
    statusSpan.classList.add(status === "Active" ? "td-active" : "td-inactive");
    cell.appendChild(statusSpan);
    return cell;
}

// Функция для получения данных с Firebase
function fetchDataFromFirebase() {
    return fetch("https://dashboard-70ed8-default-rtdb.firebaseio.com/.json")
        .then(response => response.json())
        .then(data => {
            // Обработка полученных данных
            return data;
        });
}

// Запрашиваем данные с Firebase и отображаем их в таблице
fetchDataFromFirebase().then(data => {
    displayTableData(data);
});

// Получаем ссылки на элементы формы и таблицы
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".i-text");
const tableBody = document.querySelector(".table-main");

// Слушаем событие input на текстовом поле поиска
searchInput.addEventListener("input", event => {
    const searchValue = event.target.value.toLowerCase();

    // Очищаем таблицу
    tableBody.innerHTML = "";

    // Получаем данные с Firebase
    fetch("https://dashboard-70ed8-default-rtdb.firebaseio.com/.json")
        .then(response => response.json())
        .then(data => {
            // Фильтруем данные по полю "Customer Name" и отрис
            Object.values(data).forEach(item => {
                const customerName = item["Customer Name"].toLowerCase();

                if (customerName.includes(searchValue)) {
                    const newRow = createTableRow(item);
                    tableBody.appendChild(newRow);
                }
            });
        })
        .catch(error => console.log(error));
});