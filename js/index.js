document.addEventListener("DOMContentLoaded", function() {
    const list = document.getElementById('list')
    const showPanel = document.getElementById('show-panel')
    function listBooks(book){
        let bookName = document.createElement('li')
        bookName.innerText = book.title
        list.appendChild(bookName)
        bookName.addEventListener('click', () => {
            let likeButtonText
            if (book.users.some(user => user.username === 'pouros')){
                likeButtonText = 'Unlike'
            } else {
                likeButtonText = 'Like'
            }
            showPanel.innerHTML = 
                `<h2>${book.title}</h2>
                <img class='book-image' src = "${book.img_url}"/>
                <p>${book.description}</p>
                <button class= 'like-btn' data-id=${book.id}>${likeButtonText}</button>
                <p>Users who like this book:</p>`
            function listLike (user){
                let userLike = document.createElement('li')
                userLike.innerText = user.username
                showPanel.appendChild(userLike)
            }
            book.users.forEach(user => listLike(user))
            showPanel.addEventListener('click', function(e){
                if (e.target.className === 'like-btn'){
                    e.preventDefault()
                    const user = {"id":1, "username":"pouros"}
                    const userLikes = book.users
                    if (e.target.innerText === 'Like'){
                        userLikes.push(user)
                        fetch(`http://localhost:3000/books/${e.target.dataset.id}`,{
                        method: "PATCH",
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({'users':userLikes})
                        })
                        .then(listLike(user))
                        .then(e.target.innerText = 'Unlike')
                    } else if (e.target.innerText === 'Unlike'){
                        const newLikes = userLikes.filter(user => user.username !== 'pouros')
                        fetch(`http://localhost:3000/books/${e.target.dataset.id}`,{
                        method: "PATCH",
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({'users':newLikes})
                        })
                        .then(showPanel.removeChild(showPanel.lastChild))
                        .then(e.target.innerText = 'Like')
                    }
                }
            })
        })
    }
    fetch('http://localhost:3000/books')
        .then(resp => resp.json())
        .then(books => books.forEach(book => listBooks(book)))
   
});
