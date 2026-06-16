const key = "booklog";

function getBooks() {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveBooks(books) {
  localStorage.setItem(key, JSON.stringify(books));
}

function addBook() {
  const tittel = document.getElementById(`titleInput`).value.trim();
  if (!tittel) {
    alert("Tittel er påkrevd");
    return;
  }

  const books = getBooks();
  const bokExists = books.some(
    (book) => book.title.toLowerCase() === tittel.toLowerCase(),
  );

  if (bokExists) {
    alert("Denne boken er allerede registrert!");
    return;
  }
  books.push({
    id: Date.now(),
    title: document.getElementById(`titleInput`).value.trim(),
    author: document.getElementById(`authorInput`).value.trim(),
    genre: document.getElementById(`genreInput`).value.trim(),
    favoritt: false,
    
  });


  saveBooks(books);
  showBooks();

  titleInput.value = "";
  authorInput.value = "";
  genreInput.value = "";
  ratingInput.value = "";
  pageInput.value = "";
}

document.getElementById("addBtn").addEventListener("click", addBook);

console.log(localStorage);

function showBooks () {
  const books = getBooks();
  document.getElementById(`tableBody`).innerHTML = books
  .map(({id, title, author,genre, favoritt}) => `
      <tr>
        <td>${title}</td>
        <td>${author || "–"}</td>
        <td>${genre  || "–"}</td>
        <td><button onclick="toggleFavoritt(${id})">${favoritt ? "★" : "☆"}</button></td>
        <td><button onclick="deleteBook(${id})">Slett</button></td>
      </tr>
    `).join("") || "<tr><td colspan='5'>Ingen bøker ennå.</td></tr>";
}

function deleteBook(id) {
  const books = getBooks().filter(b => b.id !== id);
  saveBooks(books);
  showBooks();

 }