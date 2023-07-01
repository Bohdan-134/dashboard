// Функция для отображения данных в таблице
function displayTableData(data, currentPage, itemsPerPage) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const dataArray = Object.values(data).slice(startIndex, endIndex);

    const tableBody = document.querySelector(".table-main");

    // Очищаем содержимое tbody
    tableBody.innerHTML = "";

    // Генерируем строки данных
    dataArray.forEach(item => {
        const row = createTableRow(item);
        tableBody.appendChild(row);
    });
}

let currentPage = 1;

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

// Функция для отображения данных в таблице
function displayTableData(data, currentPage, itemsPerPage) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const dataArray = Object.values(data).slice(startIndex, endIndex);

    const tableBody = document.querySelector(".table-main");

    // Очищаем содержимое tbody
    tableBody.innerHTML = "";

    // Генерируем строки данных
    dataArray.forEach(item => {
        const row = createTableRow(item);
        tableBody.appendChild(row);
    });
}

// Функция для создания кнопки пагинации
function createPaginationButton(id, label, icon = null) {
    const button = document.createElement("button");
    button.id = id;
    button.classList.add("pagination-button");

    if (icon) {
        const iconImg = document.createElement("img");
        iconImg.src = `../img/${icon}`;
        iconImg.alt = "Chevron";
        button.appendChild(iconImg);
    } else {
        button.textContent = label;
    }

    const listItem = document.createElement("li");
    listItem.classList.add("pagination-item");
    listItem.appendChild(button);

    return listItem;
}

// Функция для отображения кнопок пагинации
function generatePaginationButtons(data, itemsPerPage) {
    const totalItems = Object.values(data).length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginationList = document.querySelector(".pagination-list");
    paginationList.innerHTML = "";

    // Кнопка "Предыдущая"
    const prevButton = createPaginationButton("pagination-prev", "Prev", "chevron.svg");
    paginationList.appendChild(prevButton);

    // Кнопки с номерами страниц
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = createPaginationButton(`pagination${i}`, i);
        paginationList.appendChild(pageButton);
    }

    // Кнопка "Следующая"
    const nextButton = createPaginationButton("pagination-next", "Next", "chevron.svg");
    paginationList.appendChild(nextButton);

    // Обработчики событий для кнопок пагинации
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayTableData(data, currentPage, itemsPerPage);
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayTableData(data, currentPage, itemsPerPage);
        }
    });

    const pageButtons = Array.from(paginationList.querySelectorAll(".pagination-button"));
    pageButtons.forEach(button => {
        button.addEventListener("click", () => {
            const pageNumber = parseInt(button.textContent);
            if (pageNumber !== currentPage) {
                currentPage = pageNumber;
                displayTableData(data, currentPage, itemsPerPage);
            }
        });
    });
}

const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".i-text");
const tableBody = document.querySelector(".table-main");

// Запрашиваем данные с Firebase и отображаем их в таблице
fetchDataFromFirebase().then(data => {
    const itemsPerPage = 8;
    let currentPage = 1;

    displayTableData(data, currentPage, itemsPerPage);
    generatePaginationButtons(data, itemsPerPage);

    // Слушаем событие input на текстовом поле поиска
    searchInput.addEventListener("input", event => {
        const searchValue = event.target.value.toLowerCase();

        // Очищаем таблицу
        tableBody.innerHTML = "";

        // Фильтруем данные по полю "Customer Name"
        const filteredData = Object.values(data).filter(item => {
            const customerName = item["Customer Name"].toLowerCase();
            return customerName.includes(searchValue);
        });

        displayTableData(filteredData, currentPage, itemsPerPage);
        generatePaginationButtons(filteredData, itemsPerPage);
    });
});