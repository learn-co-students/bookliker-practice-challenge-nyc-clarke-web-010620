document.addEventListener("DOMContentLoaded", function(){
    BOOKS_URL = "http://localhost:3000/books"
    bookList = document.getElementById('list')
    showPanel = document.getElementById('show-panel')
    
    fetchAndRenderBooks()
    addBookClickListener()
})

//get a list of books and render them
function fetchAndRenderBooks(){
    fetch(BOOKS_URL)
    .then(resp => resp.json())
    .then(json => (json.forEach(book => renderBook(book))))
}

function renderBook(book){
    let li = document.createElement('li')
    li.className = "list-element"
    li.dataset.id = book.id
    li.innerText = book.title
    bookList.append(li)
}

function addBookClickListener(){
    document.addEventListener("click", function(event){
        if (event.target.className === "list-element"){
            const bookId = event.target.dataset.id
            fetch(BOOKS_URL + "/" + bookId)
            .then(resp => resp.json())
            .then(json => {
                console.log(json)
                renderFullBookInfo(json)})
        } else if (event.target.className === "like-button"){
            console.log(event.target.parentNode.dataset.id)
            const bookId = event.target.parentNode.dataset.id
            addUserToBook(bookId)
        }
    })
}

function renderFullBookInfo(book){
    showPanel.innerHTML = ""
    let bookDiv = document.createElement('div')
    bookDiv.dataset.id = book.id
    bookDiv.innerHTML = `
    <h1>${book.title}</h1>
    <img src=${book.img_url}>
    <p>${book.description}</p>
    <ul class="users-ul">Users:</ul>
    <button class="like-button">Like Book</button>
    `
    showPanel.append(bookDiv)
    book.users.forEach(user => {
        let usersUl = document.getElementsByClassName('users-ul')[0]
        let userLi = document.createElement('li')
        userLi.innerText = user.username
        usersUl.append(userLi)
    })
}

function addUserToBook(bookId){
    const configObj = {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify({users: [{"id":1, "username":"pouros"}]})
    }
    
    fetch(BOOKS_URL + "/" + bookId, configObj)
    .then(resp => resp.json())
    .then(book => book.users.forEach(user => renderNewLikesList(user)))
}

function renderNewLikesList(userObject){
    let usersUl = document.getElementsByClassName('users-ul')[0]
    let userLi = document.createElement('li')
    userLi.innerText = userObject.username
    usersUl.append(userLi)
}
// like book button

//Bonus: clicking the like button twice "un-likes" the book