const key = "booklog";

function getBooks() {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveBooks(books) {
  localStorage.setItem(key, JSON.stringify(books));
}

function addBook() {
  const tittel = document.getElementById("titleInput").value.trim();
  if (!tittel) {
    alert("Tittel er påkrevd");
    return;
  }

  const books = getBooks();
  const bokExists = books.some(
    (book) => book.title.toLowerCase() === tittel.toLowerCase()
  );

  if (bokExists) {
    alert("Denne boken er allerede registrert!");
    return;
  }

  books.push({
    id: Date.now(),
    title: document.getElementById("titleInput").value.trim(),
    author: document.getElementById("authorInput").value.trim(),
    genre: document.getElementById("genreInput").value.trim(),
    rating: document.getElementById("ratingInput").value,
    pages: document.getElementById("pageInput").value,
    pagesRead: document.getElementById("pagesReadInput").value,
    favoritt: false,
  });

  saveBooks(books);
  showBooks();

  titleInput.value = "";
  authorInput.value = "";
  genreInput.value = "";
  ratingInput.value = "";
  pageInput.value = "";
  pagesReadInput.value = "";
}

document.getElementById("addBtn").addEventListener("click", addBook);

function showBooks() {
  const books = getBooks();

  document.getElementById("tableBody").innerHTML = books
    .map(({ id, title, author, genre, rating, pages, pagesRead, favoritt }) => `
      <tr>
        <td>${title}</td>
        <td>${author || "–"}</td>
        <td>${genre  || "–"}</td>
        <td>${"⭐".repeat(rating) || "–"}</td>
        <td>${pagesRead || "0"} / ${pages || "–"}</td>
        <td><button onclick="toggleFavoritt(${id})">${favoritt ? "★" : "☆"}</button></td>
        <td><button onclick="deleteBook(${id})">Slett</button></td>
      </tr>
    `).join("") || "<tr><td colspan='7'>Ingen bøker ennå.</td></tr>";
}

function deleteBook(id) {
  const books = getBooks().filter((b) => b.id !== id);
  saveBooks(books);
  showBooks();
}

function toggleFavoritt(id) {
  const books = getBooks().map((b) =>
    b.id === id ? { ...b, favoritt: !b.favoritt } : b
  );
  saveBooks(books);
  showBooks();
}

showBooks();