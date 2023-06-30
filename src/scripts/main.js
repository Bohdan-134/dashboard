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
  function displayTableData(data) {
    const tableBody = document.querySelector(".table-main");
  
    // Очищаем содержимое tbody
    tableBody.innerHTML = "";

    const dataArray = Object.values(data);
  
    // Генерируем строки данных
    dataArray.forEach(item => {
      const row = document.createElement("tr");
      row.classList.add("table-row");
  
      // Создаем ячейки данных
      const nameCell = document.createElement("td");
      nameCell.classList.add("td-text");
      nameCell.textContent = item["Customer Name"];
      row.appendChild(nameCell);
  
      const companyCell = document.createElement("td");
      companyCell.classList.add("td-text");
      companyCell.textContent = item["Company"];
      row.appendChild(companyCell);
  
      const phoneNumberCell = document.createElement("td");
      phoneNumberCell.classList.add("td-text");
      phoneNumberCell.textContent = item["Phone Number"];
      row.appendChild(phoneNumberCell);
  
      const emailCell = document.createElement("td");
      emailCell.classList.add("td-text");
      emailCell.textContent = item["Email"];
      row.appendChild(emailCell);
  
      const countryCell = document.createElement("td");
      countryCell.classList.add("td-text");
      countryCell.textContent = item["Country"];
      row.appendChild(countryCell);
  
      const statusCell = document.createElement("td");
      statusCell.classList.add("td-text", "td-status");
      statusCell.textContent = item["Status"];
      row.appendChild(statusCell);
  
      // Добавляем строку в tbody
      tableBody.appendChild(row);
    });
  }
  
  // Запрашиваем данные с Firebase и отображаем их в таблице
  fetchDataFromFirebase().then(data => {
    displayTableData(data);
  });
  
  // Получаем ссылки на элементы формы и таблицы
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.i-text');
const tableRows = document.querySelectorAll('.table-row');

// Получаем ссылки на элементы таблицы
const tableBody = document.querySelector('.table-main');

// Слушаем событие input на текстовом поле поиска
searchInput.addEventListener('input', (event) => {
  const searchValue = event.target.value.toLowerCase();

  // Очищаем таблицу
  tableBody.innerHTML = '';

  // Получаем данные с Firebase
  fetch('https://dashboard-70ed8-default-rtdb.firebaseio.com/.json')
    .then(response => response.json())
    .then(data => {
      // Фильтруем данные по полю "Customer Name" и отрисовываем только соответствующие строки
      Object.values(data).forEach(item => {
        const customerName = item['Customer Name'].toLowerCase();

        if (customerName.includes(searchValue)) {
          const newRow = createTableRow(item);
          tableBody.appendChild(newRow);
        }
      });
    })
    .catch(error => console.log(error));
});

// Функция для создания новой строки таблицы
function createTableRow(item) {
  const row = document.createElement('tr');
  
  // Создаем ячейки и заполняем их данными из объекта
  const customerNameCell = createTableCell(item['Customer Name']);
  const companyCell = createTableCell(item['Company']);
  const phoneNumberCell = createTableCell(item['Phone Number']);
  const emailCell = createTableCell(item['Email']);
  const countryCell = createTableCell(item['Country']);
  const statusCell = createTableCell(item['Status']);

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
  const cell = document.createElement('td');
  cell.textContent = text;
  return cell;
}