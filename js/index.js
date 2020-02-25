document.addEventListener("DOMContentLoaded", function() {

  let booksURL = "http://localhost:3000/books"
  
    fetch(booksURL)
    .then(response => response.json())
    .then(books => books.forEach(book=> listBooks(book)))
  
    function listBooks(book){
      const bookList = document.getElementById("list")
      const li = document.createElement("li")
      li.id = `li-${book.id}`
      li.innerHTML = book.title
      bookList.append(li)
      li.addEventListener('click', () => {
        const showPanel = document.getElementById("show-panel")
              // let h1 = document.createElement("h1")
              // h1.innerHTML = book.title
              // showPanel.append(h1)
        showPanel.innerHTML = `
          <h1>${book.title} </h1>
          <img src=${book.img_url}/>
          <p>${book.description}</p>
          <button data-id=${book.id} class="like-button"> Read me</button>
          <ul id="user-list"> Users who have read the book: </ul>
        `
        book.users.forEach(user => readBooksList(user))
  
        let likeButton = document.querySelector(".like-button")
        likeButton.addEventListener('click', likeButtonHandler)
  
          function likeButtonHandler(e){
  
            let bookId = e.target.dataset.id
  
            let data = book.users
            let newUser = {"id":1, "username":"pouros"}
  
            if (data.some(user => user.username === "pouros")) {
                alert("You already read this!!!!")
            } else {
  
            data.push(newUser)
  
            // let data = [{"id":1, "username":"pouros"}]
            // book.users.forEach(user => data.push(user))
  
            fetch(`${booksURL}/${bookId}`, {
              method: "PATCH",
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                },
              body: JSON.stringify({"users": data}),
            })
            .then( readBooksList(newUser) )
  
  
            let userList = document.getElementById("user-list")
          }
  
        // {"id":1, "username":"pouros"}
  
  
          }
          function readBooksList(user){
            let userList = document.getElementById("user-list")
  
            let li = document.createElement("li")
            li.innerHTML = user.username
            userList.append(li)
          }
      })
    }
  
  });