const bookStorageKey = "books";

let editingBookId = null;

function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.style.display = "none";
  });
  document.getElementById(sectionId).style.display = "block";
}

function toggleBookForm() {
  const bookForm = document.getElementById("bookFormPopover");
  bookForm.classList.toggle("visible");
}

function addBook(event) {
  event.preventDefault();
  const book = {
    id: document.getElementById("bookID").value,
    title: document.getElementById("bookTitle").value,
    author: document.getElementById("bookAuthor").value,
    yearOfPublish: document.getElementById("yearOfPublish").value,
    publisherName: document.getElementById("publisherName").value,
    numberOfPages: document.getElementById("numberOfPages").value,
    copies: document.getElementById("copies").value,
  };

  let books = JSON.parse(localStorage.getItem(bookStorageKey)) || [];
  if (editingBookId) {
    books = books.map((b) => (b.id === editingBookId ? book : b));
    editingBookId = null;
  } else {
    books.push(book);
  }
  localStorage.setItem(bookStorageKey, JSON.stringify(books));
  displayBooks();
  toggleBookForm();
}

function displayBooks() {
  const booksTBody = document.getElementById("booksTBody");
  booksTBody.innerHTML = "";
  const books = JSON.parse(localStorage.getItem(bookStorageKey)) || [];
  books.forEach((book) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.yearOfPublish}</td>
      <td>${book.publisherName}</td>
      <td>${book.numberOfPages}</td>
      <td>${book.copies}</td>
      <td>
        <button onclick="editBook('${book.id}')">Edit</button>
        <button onclick="deleteBook('${book.id}')">Delete</button>
      </td>
    `;
    booksTBody.appendChild(tr);
  });
}

function editBook(id) {
  const books = JSON.parse(localStorage.getItem(bookStorageKey)) || [];
  const book = books.find((b) => b.id == id);
  if (book) {
    document.getElementById("bookID").value = book.id;
    document.getElementById("bookTitle").value = book.title;
    document.getElementById("bookAuthor").value = book.author;
    document.getElementById("yearOfPublish").value = book.yearOfPublish;
    document.getElementById("publisherName").value = book.publisherName;
    document.getElementById("numberOfPages").value = book.numberOfPages;
    document.getElementById("copies").value = book.copies;
    editingBookId = id;
    toggleBookForm();
  }
}

function deleteBook(id) {
  let books = JSON.parse(localStorage.getItem(bookStorageKey)) || [];
  books = books.filter((book) => book.id != id);
  localStorage.setItem(bookStorageKey, JSON.stringify(books));
  displayBooks();
}

function searchBook() {
  const query = document.getElementById("searchBooks").value.toLowerCase();
  const booksTBody = document.getElementById("booksTBody");

  booksTBody.innerHTML = "";
  const books = JSON.parse(localStorage.getItem(bookStorageKey)) || [];
  console.log(JSON.parse(localStorage.getItem(bookStorageKey)));
  books.forEach((book) => {
    console.log(book);
    const {
      id,
      title,
      author,
      yearOfPublish,
      publisherName,
      numberOfPages,
      copies,
    } = book;

    if (
      id.toString().toLowerCase().includes(query) ||
      (title && title.toLowerCase().includes(query)) ||
      (author && author.toLowerCase().includes(query)) ||
      (publisherName && publisherName.toLowerCase().includes(query))
    ) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${id}</td>
        <td>${title}</td>
        <td>${author}</td>
        <td>${yearOfPublish}</td>
        <td>${publisherName}</td>
        <td>${numberOfPages}   </td>
        <td>${copies}</td>
        <td>
          <button onclick="editBook('${id}')">Edit</button>
          <button onclick="deleteBook('${id}')">Delete</button>
        </td>
      `;
      booksTBody.appendChild(tr);
    }
  });
}

function displaySortedBooks(sortedBooks) {
  const booksTBody = document.getElementById("booksTBody");

  booksTBody.innerHTML = "";

  sortedBooks.forEach((book) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.yearOfPublish}</td>
      <td>${book.publisherName}</td>
      <td>${book.numberOfPages}</td>
      <td>${book.copies}</td>
      <td>
        <button onclick="editBook('${book.id}')">Edit</button>
        <button onclick="deleteBook('${book.id}')">Delete</button>
      </td>
    `;
    booksTBody.appendChild(tr);
  });
}

function sortBooks() {
  const sortOption = document.getElementById("sortOption").value;
  let books = JSON.parse(localStorage.getItem(bookStorageKey)) || [];

  books.sort((a, b) => {
    if (sortOption === "ID") {
      return a.id - b.id;
    } else if (sortOption === "Title") {
      return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
    } else if (sortOption === "yearOfPublish") {
      return new Date(a.yearOfPublish) - new Date(b.yearOfPublish);
    }
  });
  displaySortedBooks(books);
}

document.addEventListener("DOMContentLoaded", () => {
  displayBooks();
  showSection("books");
  document.getElementById("searchBooks").addEventListener("button", searchBook);
  document.getElementById.addEventListener("button", sortBooks);
});
