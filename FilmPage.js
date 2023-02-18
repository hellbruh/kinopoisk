let filmPoster = document.querySelector('#pos')

let filmNameId = document.querySelector('#filmName') 
let filmYearId = document.querySelector('#filmYear') 
let filmDescriptionId = document.querySelector('#filmDescription') 
let filmCountriesId = document.querySelector('#filmCountries')
let filmGenresId = document.querySelector('#filmGenres') 
let filmLengthId = document.querySelector('#filmLength')
let filmRatingId1 = document.querySelector('#filmRating1')
let filmRatingId2 = document.querySelector('#filmRating2')
let commentTextId = document.querySelector('#commentText')
let commentsId = document.querySelector('.otherComments')

//заранее очистили поле для комма после обновления стр
commentTextId.value = ''


// получаем айдишник фильма из query parameter
let filmID = window.location.href
filmID = filmID.split('=')
filmID = filmID[1]
// сюда получаем из след функции инфу о фильме
let film=[]

// вытаскиваем с сервера инфу о нужном фильме по filmID
async function getFilm(filmId){
    try{
        let url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`
        console.log (filmID)
        let response = await fetch(url, {
            headers:{
                'Content-Type': 'application/json',
                'X-API-KEY':'a7d976d9-db91-40e6-b42e-6e572168fedc',
                'Access-Control-Allow-Origin':"*"
            },
        })
        film = await response.json()
        console.log(film)
        showFilm(film)
    }
    catch(error){
        console.error(error)
    }
}
getFilm(filmID)
getComments(filmID)

function showFilm(film){ 
    let filmName = film.nameRu || film.nameOriginal
    filmNameId.innerHTML = `${filmName}`

    let rating1 = film.ratingImdb
    let rating2 = film.ratingKinopoisk
    if (film.ratingImdb === null){
        rating1 = ''
        filmRatingId1.innerHTML = ''
    }
    if (film.ratingKinopoisk === null){
        rating2 = ''
        filmRatingId2.innerHTML = ''
    }

    filmRatingId1.innerHTML += `<span style="font-weight:700; font-size:26px;">${rating1}</span>` 
    filmRatingId2.innerHTML += `<span style="font-weight:700; font-size:26px;">${rating2}</span>`

    let filmYear
    if (film.type == "TV_SERIES"){
        if (film.endYear === null){
            film.endYear = ''
        }
        filmYear = (`${film.startYear}  —  ${film.endYear} `)
    }
    else{
        filmYear = `${film.year}`
    }
    filmYearId.innerHTML = `${filmYear}`
    
    let filmLength = film.filmLength
    if (filmLength === null){
        filmLength = ' - '
    }
    filmLengthId.innerHTML += `${filmLength}`
    filmLengthId.innerHTML += ` мин`

    filmPoster.innerHTML = `<img class="poster" id="pos" 
    src="${film.posterUrl}" alt="Постер к фильму ${filmName}"
     width="300px" height="400px">` 
    
     if (film.description !== null){
        filmDescriptionId.innerHTML =`
    <p>${film.description}</p>
    `
    }
    let filmCountries = film.countries
    let countries = ``
    for (let i=0; i<filmCountries.length;i++){
        if (i == filmCountries.length-1){
             countries+=`${filmCountries[i].country} `
        }
        else{
            countries+=`${filmCountries[i].country}, `
        }
    }
    filmCountriesId.innerHTML += countries
    
    let filmGenres = film.genres
    let genres = ``
    for (let i=0; i<filmGenres.length;i++){
        if (i == filmGenres.length-1){
             genres+=`${filmGenres[i].genre} `
        }
        else{
            genres+=`${filmGenres[i].genre}, `
        }
    }
    filmGenresId.innerHTML += genres
}

let comments = []

async function getComments(filmId){
    url=`http://192.168.1.21:5000/comments/show/${filmId}`
    try{
        let response =await axios.get (url)
        console.log(response)
        comments = response.data.message
        showComments()
    }
    catch(error){
        console.error(error)
    }
}

let rating = []
function leaveRating(n){
    rating.push(n)
    for (let i=1; i<11;i++){
        let st = document.getElementById(`rating-${i}`)
        st.style.color = 'rgb(109, 109, 109)'
    }
    let s = document.getElementById(`rating-${n}`)
    console.log(n)
    s.style.color = 'white'
    console.log(rating)
}

async function postComment(){
    let commentText = commentTextId.value
    let commentRating = rating[rating.length-1]
    let comment = {
        filmId: filmID,
        filmRating:commentRating,
        commentText:commentText,
        userId:467 
    }
    console.log('sent')
    console.log(comment)
    commentTextId.value = ''
    
    // postim comment
    url = `http://192.168.1.21:5000/comments/add`
    try{
        let response = await axios.post (url,comment)
        console.log(response.data)
        comments.push(response.data.message)
    }
    catch(error){
        console.error(error)
    }
    
    showComments()
    
}

function showComments(){
    if (comments.length ==0){
        commentsId.innerHTML = `There're no comments yet`
    }
    else{
        commentsId.innerHTML=``
        for (let com of comments){
            t = `
            <div>${com.fio}</div>
            <div>${com.filmRating}</div>
            <div>${com.commentText}</div>`
            commentsId.innerHTML+=t
        }
    }
}

