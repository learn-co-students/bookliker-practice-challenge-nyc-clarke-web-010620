const user = {"id":1, "username":"pouros"}

document.addEventListener("DOMContentLoaded", function() {
    fetchBooks(),
    bookClickListener()
});

function fetchBooks() {
    fetch("http://localhost:3000/books")
    .then(resp => resp.json())
    .then(json => json.forEach(book => renderBook(book)))
}

function renderBook(book) {
    const ul = document.getElementById("list")
    const li = document.createElement('li')
    // li.dataset.id = book.id
    li.innerHTML = `
    <p data-id="${book.id}">${book.title}</p>
    `
    ul.append(li)
}

function bookClickListener() {
    document.addEventListener("click", function(event){
        if (event.target.dataset.id) {
            fetchBookInfo(event.target.dataset.id)
        }
        if (event.target.className === "like-button") {
            likeBook(event.target, user)
        }
    })
}

function fetchBookInfo(bookId) {
    fetch(`http://localhost:3000/books/${bookId}`)
    .then(resp => resp.json())
    .then(json => fullBookRender(json))
}

function fullBookRender(bookInfo) {
    const bookDiv = document.getElementById("show-panel")
    bookDiv.innerHTML = ""
    const display = document.createElement('div')
    console.log(bookInfo)
    display.dataset.id = bookInfo.id
    display.innerHTML = `
    <h1>${bookInfo.title}</h1>
    <img src=${bookInfo.img_url}>
    <p>${bookInfo.description}</p>
    <ul id="user-likes">Users who like this book:</ul>
    <button class="like-button">Read Book</button>
    `
    const ul = document.createElement('ul')
    console.log(display)
    bookInfo.users.forEach(user => liRender(user, ul))
    display.append(ul)
    bookDiv.append(display)
}

function likeBook(button, user) {
    const bookId = button.parentNode.dataset.id
    fetch(`http://localhost:3000/books/${bookId}`)
    .then(resp => resp.json())
    .then(json => {
        if (usersToIds(json.users).includes(user.id)) {
            const usersList = json.users
            const userIndex = json.users.indexOf(user)
            usersList.splice(userIndex, 1)
            patchUser(bookId, usersList)
        }
        else {
            const usersList = json.users
            usersList.push(user)
            patchUser(bookId, usersList)
        }
    })

}

function patchUser(bookId, usersList){
    console.log(usersList)
    fetch(`http://localhost:3000/books/${bookId}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            users: usersList
        })
    })
    fetchBookInfo(bookId)
}

function usersToIds(users) {
    let ids = []
    users.forEach(user => ids.push(user.id))
    return ids
}

function liRender(user, ul) {
    const li = document.createElement('li')
    li.innerHTML = `${user.username}`
    ul.append(li)
}