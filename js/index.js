document.addEventListener("DOMContentLoaded", function() {
    let BOOKSURL = 'http://localhost:3000/books'
    
    fetch(BOOKSURL)
    .then(resp => resp.json())
    .then(books => books.forEach(renderBooks))
    
    let listPanel = document.getElementById('list-panel')
    
    listPanel.addEventListener('click', function(e){
        fetch(BOOKSURL+`/${e.target.id}`)
        .then(resp => resp.json())
        .then(book => renderSelectedBook(book))
    })
    })
    
    
    
    let renderBooks = book => {
        let listPanel = document.getElementById('list-panel')
        let li = document.createElement('li')
        li.id = book.id
        li.innerText = `${book.title}`
        listPanel.append(li)
    }
    
    let renderSelectedBook = book => {
        let showPanel = document.getElementById('show-panel')
        showPanel.innerHTML = `
        <h1> ${book.title}</h1>
        <img src=${book.img_url}/>
        <p> ${book.description}</p>
        <h3> Users that have read this book: </h3>
        <ul></ul>
        <button data-id=${book.id} class='button'>Read Book</button>
        `
        let ul = showPanel.getElementsByTagName('ul')[0]
        // console.log(showPanel.getElementsByTagName('ul')[0])
        book.users.forEach(user => {
            let li = document.createElement('li')
            li.innerText = user.username
            ul.append(li)
        })
        let readButton = showPanel.getElementsByClassName('button')[0]
    
    let currentUsers = [book.users][0]
    let newUsers = [...book.users, {"id": 1, "username": "pouros"}]
    
    readButton.addEventListener('click', function(e){
        console.log(currentUsers)
        if (currentUsers.some(user => user.username === "pouros")){
            alert('You have already read this book!')
        } else {
        fetch(`http://localhost:3000/books/${e.target.dataset.id}`, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'PATCH',
            body: JSON.stringify({
                "users": newUsers
            })
        })
        .then(resp => resp.json())
        .then(book => renderSelectedBook(book))
    }
    })}