window.onload = createCustomersContent();

const buttons = document.querySelectorAll(".nav-button");
const container = document.querySelector(".container");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        buttons.forEach(btn => {
            btn.classList.remove("nav-button-active");
        });

        button.classList.add("nav-button-active");

        if (button.getAttribute("data-name") !== "customers") {
            container.innerHTML = '<div class="oops-title">Oops, something went wrong</div>';
        } else {
            createCustomersContent()
        }
    });
});

function createCustomersContent() {
    renderCustomersContent();
    fetchDataFromFirebase().then(data => {
        const searchInput = document.querySelector(".i-text");
        const tableBody = document.querySelector(".table-main");
        const itemsPerPage = 8;

        displayTableData(data, currentPage, itemsPerPage);
        generatePaginationButtons(data, itemsPerPage);

        searchInput.addEventListener("input", event => {
            const searchValue = event.target.value.toLowerCase();

            tableBody.innerHTML = "";

            const filteredData = Object.values(data).filter(item => {
                const customerName = item["Customer Name"].toLowerCase();
                return customerName.includes(searchValue);
            });
            currentPage = 1;
            displayTableData(filteredData, currentPage, itemsPerPage);
            generatePaginationButtons(filteredData, itemsPerPage);
        });
    });
}

function renderCustomersContent() {
    const container = document.querySelector(".container");
    const html = `
    <div class="customers-content">
      <div class="customers-content-header">
        <div class="customers-content-header-left">
          <h3 class="customers-title">All Customers</h3>
          <span class="status">Active Members</span>
        </div>
        <div class="customers-content-header-right">
          <form action="#" class="search-form">
            <button type="submit" class="btn-search">
              <img src="../img/search.svg" alt="Search">
            </button>
            <input type="text" placeholder="Search" class="i-text">
          </form>
        </div>
      </div>
      <div class="customers-content-main">
        <div class="customers-table-wrapp">
          <table class="table">
            <thead class="table-header">
              <tr class="table-row">
                <th class="table-header-title">Customer Name</th>
                <th class="table-header-title">Company</th>
                <th class="table-header-title">Phone Number</th>
                <th class="table-header-title">Email</th>
                <th class="table-header-title">Country</th>
                <th class="table-header-title status">Status</th>
              </tr>
            </thead>
            <tbody class="table-main"></tbody>
          </table>
        </div>
      </div>
      <div class="customers-content-footer">
        <div class="showing-data"></div>
        <div class="pagination">
          <ul class="pagination-list"></ul>
        </div>
      </div>
    </div>
  `;
    container.innerHTML = html;
}

let currentPage = 1;

function createTableRow(item) {
    const row = document.createElement("tr");
    row.classList.add("table-row");

    const customerNameCell = createTableCell(item["Customer Name"]);
    const companyCell = createTableCell(item["Company"]);
    const phoneNumberCell = createLinkTableCell(item["Phone Number"], `tel:${item["Phone Number"]}`);
    const emailCell = createLinkTableCell(item["Email"], `mailto:${item["Email"]}`);
    const countryCell = createTableCell(item["Country"]);
    const statusCell = createStatusTableCell(item["Status"]);

    row.appendChild(customerNameCell);
    row.appendChild(companyCell);
    row.appendChild(phoneNumberCell);
    row.appendChild(emailCell);
    row.appendChild(countryCell);
    row.appendChild(statusCell);

    return row;
}

function createTableCell(text) {
    const cell = document.createElement("td");
    cell.classList.add("td-text");
    cell.textContent = text;
    return cell;
}

function createLinkTableCell(text, link) {
    const cell = document.createElement("td");
    cell.classList.add("td-text");
    const linkElement = document.createElement("a");
    linkElement.href = link;
    linkElement.textContent = text;
    cell.appendChild(linkElement);
    return cell;
}

function createStatusTableCell(status) {
    const cell = document.createElement("td");
    cell.classList.add("td-text", "td-status");
    const statusSpan = document.createElement("span");
    statusSpan.textContent = status;
    statusSpan.classList.add(status === "Active" ? "td-active" : "td-inactive");
    cell.appendChild(statusSpan);
    return cell;
}

function fetchDataFromFirebase() {
    return fetch("https://dashboard-70ed8-default-rtdb.firebaseio.com/.json")
        .then(response => response.json())
        .then(data => {
            return data;
        });
}

function displayTableData(data, currentPage, itemsPerPage) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const dataArray = Object.values(data).slice(startIndex, endIndex);
    const tableBody = document.querySelector(".table-main");

    tableBody.innerHTML = "";

    dataArray.forEach(item => {
        const row = createTableRow(item);
        tableBody.appendChild(row);
    });
    updateShowingDataInfo(currentPage, itemsPerPage, Object.values(data).length);
}

function createPaginationButton(id, label, icon = null) {
    const button = document.createElement("button");
    button.id = id;
    button.classList.add(`${(id === `pagination-prev` || id === `pagination-next`) ? null : 'pagination-button'}`);
    if (icon) {
        button.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="chevron-right 2"><path id="Vector" d="M6 12L10 8L6 4" stroke="#9197B3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>';
    } else {
        button.textContent = label;
    }

    const listItem = document.createElement("li");
    listItem.classList.add("pagination-item");
    if (id === 'pagination-prev') {
        listItem.classList.add("prev");
    } else if (id === 'pagination-next') {
        listItem.classList.add("next");
    }
    listItem.appendChild(button);

    return listItem;
}

function generatePaginationButtons(data, itemsPerPage) {
    const totalItems = Object.values(data).length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginationList = document.querySelector(".pagination-list");
    paginationList.innerHTML = "";

    const prevButton = createPaginationButton("pagination-prev", "Prev", "chevron.svg");
    paginationList.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = createPaginationButton(`pagination${i}`, i);
        paginationList.appendChild(pageButton);
    }

    const nextButton = createPaginationButton("pagination-next", "Next", "chevron.svg");
    paginationList.appendChild(nextButton);

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayTableData(data, currentPage, itemsPerPage);
            updatePaginationButtons();
        }

    });

    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayTableData(data, currentPage, itemsPerPage);
            updatePaginationButtons();
        }
    });

    const pageButtons = Array.from(paginationList.querySelectorAll(".pagination-button"));
    pageButtons.forEach(button => {
        button.addEventListener("click", () => { 
          
            const pageNumber = parseInt(button.textContent);
            if (pageNumber !== currentPage) {
                currentPage = pageNumber;
                displayTableData(data, currentPage, itemsPerPage);
                updatePaginationButtons();
            }
        });
    });

    function updatePaginationButtons() {
      pageButtons.forEach(button => {
          const pageNumber = parseInt(button.textContent);
          if (pageNumber === currentPage) {
              button.classList.add("btn-pagination-active");
          } else {
              button.classList.remove("btn-pagination-active");
          }
      });
  }

  updatePaginationButtons();
}

function updateShowingDataInfo(currentPage, itemsPerPage, totalItems) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const showingDataInfo = document.querySelector(".showing-data");
  showingDataInfo.textContent = `Showing data ${startIndex + 1} to ${endIndex} of ${totalItems} entries`;
}