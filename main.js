let films = []
async function getPost(n){
    try{
        const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films?page=${n}`
        // const url = 'http://192.168.1.9:5000/comments/show/1'
        let response = await fetch(url, {
            headers:{
                'Content-Type': 'application/json',
                'X-API-KEY':'a7d976d9-db91-40e6-b42e-6e572168fedc'
            },
        })
        films = await response.json()
        console.log(films)
        showFilms(films.items)
    }
     catch(error){
        console.error(error)
        console.log('Возникла ошибка')
    }
}
getPost(1)

const postsDiv = document.getElementById('posts')

function change_page(d){
    postsDiv.innerHTML = ``
    getPost(d)
}

// отрисовка всех фильмов на главной стр
function showFilms(posts){
    for (let post of posts){
        let filmName = post.nameRu
        if (post.nameRu === null){
            filmName = post.nameOriginal
        } 
        //todo: добавить рейтинг кинопоиска в карточку фильма
        postsDiv.innerHTML+=`
        <a class="aaa" id="${post.kinopoiskId}" href="./page.html?id=${post.kinopoiskId}" target="_self" style="width:25%">
            <div class="post">
                <img src="${post.posterUrlPreview}" height="400px" width="300px" alt="${filmName}">
                <h4 style="display:flex; flex-wrap:wrap">${filmName}</h4>
                <p></p>
            </div> 
        </a>   
            `

    }
}