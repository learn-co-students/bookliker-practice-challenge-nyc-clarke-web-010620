document.addEventListener("DOMContentLoaded", function() {
    const listPanel = document.getElementById('list-panel')
    const showPanel = document.getElementById('show-panel')
    const listBooks = function(book){
        let bookName = document.createElement('li')
        bookName.innerText = book.title
        listPanel.appendChild(bookName)
        bookName.addEventListener('click', () => {
            let showBook = document.createElement('div')
            let likeButtonText
            const user1 = book.users.filter(user => user.username === 'pouros')
            if (user1[0]){
                likeButtonText = 'Unlike'
            } else {
                likeButtonText = 'Like'
            }
            showBook.innerHTML = 
                `<h2>${book.title}</h2>
                <img class='book-image' src = "${book.img_url}"/>
                <p>${book.description}</p>
                <button class= 'like-btn' data-id=${book.id}>${likeButtonText}</button>
                <p>Users who like this book:</p>`
            const listLike = function(user){
                let userLike = document.createElement('li')
                userLike.innerText = user.username
                showBook.appendChild(userLike)
            }
            book.users.forEach(user => listLike(user))
            if (showPanel.childElementCount === 0){
                showPanel.appendChild(showBook)
            } else {
                showPanel.innerHTML = ''
                showPanel.appendChild(showBook)
            }
            showBook.addEventListener('click', function(e){
                if (e.target.className === 'like-btn'){
                    e.preventDefault()
                    const user = {"id":1, "username":"pouros"}
                    const userLikes = book.users
                    if (e.target.innerText === 'Like'){
                        userLikes.push(user)
                        fetch(`http://localhost:3000/books/${e.target.dataset.id}`,{
                        method: "PATCH",
                        headers: {
                            "content-type": "application/json",
                            accept: "application/json"
                        },
                        body: JSON.stringify({'users':userLikes})
                        })
                        listLike(user)
                        e.target.innerText = 'Unlike'
                    } else if (e.target.innerText === 'Unlike'){
                        const newLikes = userLikes.filter(user => user.username !== 'pouros')
                        fetch(`http://localhost:3000/books/${e.target.dataset.id}`,{
                        method: "PATCH",
                        headers: {
                            "content-type": "application/json",
                            accept: "application/json"
                        },
                        body: JSON.stringify({'users':newLikes})
                        })
                        showBook.removeChild(showBook.lastChild)
                        e.target.innerText = 'Like'
                    }
                }
            })
        })
    }
    fetch('http://localhost:3000/books')
        .then(resp => resp.json())
        .then(books => books.forEach(book => listBooks(book)))
   
});
