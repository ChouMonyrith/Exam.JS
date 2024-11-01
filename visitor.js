const visitorStorageKey = "visitors";
let editVisitorId = null;
function toggleVisitorForm() {
  const visitorForm = document.getElementById("visitorsPopover");
  visitorForm.classList.toggle("visible");
}

function addVisitor(event) {
  event.preventDefault();

  const visitor = {
    id: document.getElementById("visitorsID").value,
    name: document.getElementById("visitorsName").value,
    contact: document.getElementById("contact").value,
    registerDate: document.getElementById("registerDate").value,
  };

  let visitors = JSON.parse(localStorage.getItem(visitorStorageKey)) || [];

  if (editVisitor) {
    visitors = visitors.map((v) => (v.id === editVisitorId ? visitor : v));
    editVisitor = null;
  } else {
    visitors.push(visitor);
  }

  localStorage.setItem(visitorStorageKey, JSON.stringify(visitors));

  displayVisitors();
  toggleVisitorForm();

  document.getElementById("visitorsID").value = "";
  document.getElementById("visitorsName").value = "";
  document.getElementById("contact").value = "";
  document.getElementById("registerDate").value = "";
}

function displayVisitors() {
  const visitorsTBody = document.getElementById("visitorsTBody");
  visitorsTBody.innerHTML = "";
  const visitors = JSON.parse(localStorage.getItem(visitorStorageKey)) || [];

  visitors.forEach((visitor) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${visitor.id}</td>
      <td>${visitor.name}</td>
      <td>${visitor.contact}</td>
      <td>${visitor.registerDate}</td>
      <td>
        <button onclick="editVisitor('${visitor.id}')">Edit</button>
        <button onclick="deleteVisitor('${visitor.id}')">Delete</button>
      </td>
    `;
    visitorsTBody.appendChild(tr);
  });
}

function searchVisitor() {
  const query = document.getElementById("searchVisitor").value.toLowerCase();
  const visitorsTBody = document.getElementById("visitorsTBody");

  visitorsTBody.innerHTML = "";
  const visitors = JSON.parse(localStorage.getItem(visitorStorageKey)) || [];

  visitors.forEach((visitor) => {
    const { id, name, contact, registerDate } = visitor;

    if (
      id.toString().toLowerCase().includes(query) ||
      name.toString().toLowerCase().includes(query)
    ) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${contact}</td>
        <td>${registerDate}</td>
      <td>
          <button onclick="editBook('${id}')">Edit</button>
          <button onclick="deleteBook('${id}')">Delete</button>
        </td>
      `;
      visitorsTBody.appendChild(tr);
    }
  });
}
function sortVisitors(order) {
  const visitors = JSON.parse(localStorage.getItem(visitorStorageKey)) || [];

  visitors.sort((a, b) => {
    return order === "asc" ? a.id - b.id : b.id - a.id;
  });

  localStorage.setItem(visitorStorageKey, JSON.stringify(visitors));
  displayVisitors();
}

function editVisitor(id) {
  const visitors = JSON.parse(localStorage.getItem(visitorStorageKey)) || [];
  const visitor = visitors.find((v) => v.id == id);
  if (visitor) {
    document.getElementById("visitorsID").value = visitor.id;
    document.getElementById("visitorsName").value = visitor.name;
    document.getElementById("contact").value = visitor.contact;
    document.getElementById("registerDate").value = visitor.registerDate;

    editVisitorId = id;
    toggleVisitorForm();
  }
}
function deleteVisitor(id) {
  let visitors = JSON.parse(localStorage.getItem(visitorStorageKey)) || [];
  visitors = visitors.filter((visitor) => visitor.id != id);
  localStorage.setItem(visitorStorageKey, JSON.stringify(visitors));

  displayVisitors();
}

function sortVisitors() {
  const sortOption = document.getElementById("sortOption").value;
  let visitors = JSON.parse(localStorage.getItem(visitorStorageKey)) || [];

  visitors.sort((a, b) => {
    if (sortOption === "ID") {
      return a.id - b.id;
    } else if (sortOption === "Name") {
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    } else if (sortOption === "DateTime") {
      return new Date(a.registerDate) - new Date(b.registerDate);
    }
  });
  displaySortedVisitor(visitors);
}

function displaySortedVisitor(sortedVisitors) {
  const visitorsTBody = document.getElementById("visitorsTBody");
  visitorsTBody.innerHTML = "";
  sortedVisitors.forEach((visitor) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${visitor.id}</td>
      <td>${visitor.name}</td>
      <td>${visitor.contact}</td>
      <td>${visitor.registerDate}</td>
      <td>
        <button onclick="editVisitor('${visitor.id}')">Edit</button>
        <button onclick="deleteVisitor('${visitor.id}')">Delete</button>
      </td>
    `;
    visitorsTBody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  displayVisitors();
  document
    .getElementById("sortOption")
    .addEventListener("change", sortVisitors);
  document
    .getElementById("searchVisitor")
    .addEventListener("input", searchVisitor);
});
