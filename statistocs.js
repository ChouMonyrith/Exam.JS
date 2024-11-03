function getTopBooks() {
  const cards = JSON.parse(localStorage.getItem(cardStorageKey)) || [];
  const bookCounts = {};

  cards.forEach((card) => {
    if (bookCounts[card.bookId]) {
      bookCounts[card.bookId]++;
    } else {
      bookCounts[card.bookId] = 1;
    }
  });

  const books = JSON.parse(localStorage.getItem(bookStorageKey)) || [];
  const sortedBooks = Object.entries(bookCounts)
    .map(([bookId, count]) => {
      const book = books.find((book) => book.id == bookId);
      return { title: book ? book.title : "Unknown", count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  displayTopBooks(sortedBooks);
}

function displayTopBooks(topBooks) {
  const popularBookList = document.getElementById("popularBookList");
  popularBookList.innerHTML = "";
  topBooks.forEach((book) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${book.title}</td><td>${book.count}</td>`;
    popularBookList.appendChild(tr);
  });
}

function getTopVisitors() {
  const cards = JSON.parse(localStorage.getItem(cardStorageKey)) || [];
  const visitorCounts = {};

  cards.forEach((card) => {
    if (visitorCounts[card.visitorId]) {
      visitorCounts[card.visitorId]++;
    } else {
      visitorCounts[card.visitorId] = 1;
    }
  });

  const visitors = JSON.parse(localStorage.getItem(visitorStorageKey)) || [];
  const sortedVisitors = Object.entries(visitorCounts)
    .map(([visitorId, count]) => {
      const visitor = visitors.find((visitor) => visitor.id == visitorId);
      return { name: visitor ? visitor.name : "Unknown", count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  displayTopVisitors(sortedVisitors);
}

function displayTopVisitors(topVisitors) {
  const mostActiveVisitors = document.getElementById("mostActiveVisitors");
  mostActiveVisitors.innerHTML = "";
  topVisitors.forEach((visitor) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${visitor.name}</td><td>${visitor.count}</td>`;
    mostActiveVisitors.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateStatistics();
});

function updateStatistics() {
  getTopBooks();
  getTopVisitors();
}
