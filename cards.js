const cardStorageKey = "cards";

function updateAvailableBooks() {
  const bookSelect = document.getElementById("availableBooks");
  bookSelect.innerHTML = "";
  const books = JSON.parse(localStorage.getItem(bookStorageKey)) || [];

  books.forEach((book) => {
    if (book.copies > 0) {
      const option = document.createElement("option");
      option.value = book.id;
      option.textContent = `${book.title}`;
      bookSelect.appendChild(option);
    }
  });
}

function updateVisitorSelect() {
  const visitorSelect = document.getElementById("visitorSelect");
  visitorSelect.innerHTML = "";
  const visitors = JSON.parse(localStorage.getItem(visitorStorageKey)) || [];

  visitors.forEach((visitor) => {
    const option = document.createElement("option");
    option.value = visitor.id;
    option.textContent = visitor.name;
    visitorSelect.appendChild(option);
  });
}

function updateCardsTable() {
  const cardsTBody = document.getElementById("cardsTBody");
  cardsTBody.innerHTML = "";
  const cards = JSON.parse(localStorage.getItem(cardStorageKey)) || [];
  const books = JSON.parse(localStorage.getItem(bookStorageKey)) || [];
  const visitors = JSON.parse(localStorage.getItem(visitorStorageKey)) || [];

  cards.forEach((card) => {
    const book = books.find((book) => book.id === card.bookId);
    const visitor = visitors.find((visitor) => visitor.id === card.visitorId);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${card.id}</td>
      <td>${book ? book.title : "Unknown"}</td>
      <td>${visitor ? visitor.name : "Unknown"}</td>
      <td>${card.borrowDate}</td>
      <td>${
        card.returnDate ||
        `<button onclick="returnBook(${card.id})">Return</button>`
      }</td>
      <td>
        
        <button onclick="deleteCard('${card.id}')">Delete</button>
      </td>
    `;
    cardsTBody.appendChild(tr);
  });
}
function deleteCard(cardId) {
  const cards = JSON.parse(localStorage.getItem(cardStorageKey)) || [];
  const updatedCards = cards.filter((card) => card.id !== cardId);

  localStorage.setItem(cardStorageKey, JSON.stringify(updatedCards));
  updateCardsTable();
}
function lendBook(event) {
  event.preventDefault();

  const bookId = document.getElementById("availableBooks").value;
  const visitorId = document.getElementById("visitorSelect").value;
  const borrowDate = document.getElementById("borrowDate").value;
  const cardId = document.getElementById("cardId").value;

  let books = JSON.parse(localStorage.getItem(bookStorageKey)) || [];
  let cards = JSON.parse(localStorage.getItem(cardStorageKey)) || [];

  if (cards.some((card) => card.id === cardId)) {
    alert("Please Use Different ID");
    return;
  }
  books = books.map((book) => {
    if (book.id == bookId && book.copies > 0) {
      book.copies -= 1;
    }
    return book;
  });

  const newCard = {
    id: cardId,
    bookId: bookId,
    visitorId: visitorId,
    borrowDate: borrowDate,
    returnDate: null,
  };

  cards.push(newCard);

  localStorage.setItem(bookStorageKey, JSON.stringify(books));
  localStorage.setItem(cardStorageKey, JSON.stringify(cards));

  updateAvailableBooks();
  updateCardsTable();
  hideLendBookForm();
}

function returnBook(cardId) {
  const cards = JSON.parse(localStorage.getItem(cardStorageKey)) || [];
  const books = JSON.parse(localStorage.getItem(bookStorageKey)) || [];

  const card = cards.find((c) => c.id === cardId);
  if (card && !card.returnDate) {
    card.returnDate = new Date().toLocaleDateString();
    const book = books.find((book) => book.id === card.bookId);
    if (book) {
      book.copies += 1;
    }

    localStorage.setItem(cardStorageKey, JSON.stringify(cards));
    localStorage.setItem(bookStorageKey, JSON.stringify(books));

    updateAvailableBooks();
    updateCardsTable();
  }
}
function searchCard() {
  const query = document
    .getElementById("searchCard")
    .value.toLowerCase()
    .trim();
  const cardsTBody = document.getElementById("cardsTBody"); // Fixed capitalization
  cardsTBody.innerHTML = "";

  const books = JSON.parse(localStorage.getItem(bookStorageKey)) || [];
  const visitors = JSON.parse(localStorage.getItem(visitorStorageKey)) || [];
  const cards = JSON.parse(localStorage.getItem(cardStorageKey)) || [];

  cards.forEach((card) => {
    const book = books.find((b) => b.id === card.bookId);
    const visitor = visitors.find((v) => v.id === card.visitorId); // Changed == to ===

    if (
      card.id.toString().toLowerCase().includes(query) ||
      (book && book.title.toLowerCase().includes(query)) || // Fixed method call
      (visitor && visitor.name.toLowerCase().includes(query)) // Fixed method call
    ) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${card.id}</td>
        <td>${book ? book.title : "Unknown"}</td>
        <td>${visitor ? visitor.name : "Unknown"}</td>
        <td>${card.borrowDate}</td>
        <td>${
          card.returnDate ||
          `<button onclick="returnBook('${card.id}')" class="return-btn">Return</button>`
        }</td>
        <td>
          <button onclick="deleteCard('${
            card.id
          }')" class="delete-btn">Delete</button>
        </td>
      `;
      cardsTBody.appendChild(tr);
    }
  });
}

function sortCard() {
  const sortOption = document.getElementById("sortOption").value;
  let cards = JSON.parse(localStorage.getItem(cardStorageKey)) || [];
  const books = JSON.parse(localStorage.getItem(bookStorageKey)) || [];
  const visitors = JSON.parse(localStorage.getItem(visitorStorageKey)) || [];

  cards.sort((a, b) => {
    if (sortOption === "ID") {
      return a.id - b.id;
    } else if (sortOption === "Name") {
      const visitorA =
        visitors.find((visitor) => visitor.id === a.visitorId) || {};
      const visitorB =
        visitors.find((visitor) => visitor.id === b.visitorId) || {};
      return (visitorA.name || "").localeCompare(visitorB.name || "");
    } else if (sortOption === "lendDate") {
      return new Date(a.borrowDate) - new Date(b.borrowDate);
    } else if (sortOption === "ReturnDate") {
      return (
        new Date(a.returnDate || "9999-12-31") -
        new Date(b.returnDate || "9999-12-31")
      );
    }
  });

  displaySortedCards(cards, books, visitors);
}

function displaySortedCards(sortedCards, books, visitors) {
  const cardsTBody = document.getElementById("cardsTBody");
  cardsTBody.innerHTML = "";

  sortedCards.forEach((card) => {
    const book = books.find((book) => book.id === card.bookId);
    const visitor = visitors.find((visitor) => visitor.id === card.visitorId);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${card.id}</td>
      <td>${book ? book.title : "Unknown"}</td>
      <td>${visitor ? visitor.name : "Unknown"}</td>
      <td>${card.borrowDate}</td>
      <td>${
        card.returnDate ||
        `<button onclick="returnBook(${card.id})">Return</button>`
      }</td>
      <td>
        
        <button onclick="deleteCard('${card.id}')">Delete</button>
      </td>
    `;
    cardsTBody.appendChild(tr);
  });
}

function toggleCardForm() {
  const cardForm = document.getElementById("lendBookPopover");
  cardForm.classList.add("visible");
}

function hideLendBookForm() {
  document.getElementById("lendBookPopover").classList.remove("visible");
}

document.addEventListener("DOMContentLoaded", () => {
  updateAvailableBooks();
  updateVisitorSelect();
  updateCardsTable();
  displayBooks();
  updateBookSelect();
  document.getElementById("searchCard").addEventListener("input", searchCard);
});
