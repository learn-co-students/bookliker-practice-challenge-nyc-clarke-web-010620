document.addEventListener("DOMContentLoaded", function() {


    currentuser = {"id":1, "username":"pouros"}

    fetch("http://localhost:3000/books").then(resp=>resp.json()).then(response => {
        books = response;
        books.forEach(listBook)
        }
    )




}); //end of DOMContentLoaded


function listBook(book) {
    let ul = document.getElementById("list")
    let li = document.createElement("li")
    show  = document.getElementById("show-panel");
    li.innerText = book.title
    li.dataset.id = book.id
    ul.append(li)
    li.addEventListener("click",function(e){
        if (books.find(book=> book.id == e.target.dataset.id)){
            show.innerHTML = `
            <h1>${book.title}</h1>
            <img src=${book.img_url}>
            <p>${book.description}</p>
            <h2>User who liked this book</h2>
            <ul></ul>
            <form> <input type="submit" value="like book"> </form>
            `
            book.users.forEach(addUser)

            let button = show.querySelector("input")
            if(book.users.find(x => x.id == currentuser.id)){
                button.value = "unlike book"
            }

            button.addEventListener("click", e => {
                e.preventDefault()
                let ul = show.getElementsByTagName("ul")
                let allusers = book.users
                
                if (e.target.value == "like book"){
                allusers.push(currentuser)
                ul[0].innerHTML = ""
                allusers.forEach(addUser)
                e.target.value = "unlike book"

            } else {
                allusers = allusers.filter(user=> user.id != currentuser.id)
                ul[0].innerHTML = ""
                allusers.forEach(addUser)
                e.target.value = "like book"
            }

                fetch(`http://localhost:3000/books/${book.id}`,
                { method: 'PATCH',
                headers: {
                    "content-type": "application/json",
                    accept: "application/json"
                  },
                body: JSON.stringify({users: allusers})
                }
                )



            })
            

        }
    })


}

function addUser(user){
    let ul = show.getElementsByTagName("ul")
    let li = document.createElement("li")
    li.dataset.id = user.id
    li.innerText = user.username
    ul[0].append(li)
}