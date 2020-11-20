const key = 'yOa7uHLPdR8u51J3zHKs6WhGXNbmhh7w'

let varMax = 'cp'
const header = document.querySelector('header')
const searchNav = document.getElementById('searchNav')
const createGifoButton = document.querySelector('.create-gifo-button')
window.onscroll = function() {
    let y = window.scrollY
    if(y != 0 && screen.width > 767) {
        header.classList.add('header-shadow')
        searchNav.classList.remove('none')
        createGifoButton.classList.add('none')
    } else {
        header.classList.remove('header-shadow')
        searchNav.classList.add('none')
        createGifoButton.classList.remove('none')
    }
}

const logo = document.getElementById('logo')
logo.addEventListener('click', () => {
    window.location.reload()
})

//suggestions
const input = document.getElementById('searchText')
const searchActive = document.getElementById('searchActive')
const closeImage = document.getElementById('closeImage')
const searchImage = document.getElementById('searchImage')

input.addEventListener('keyup', event => getSuggestions(event))
async function getSuggestions(event) {
    if(input.value !== '') {
        closeImage.classList.remove('none')
        searchImage.classList.add('none')
        searchActive.classList.remove('none')
    } else {
        closeImage.classList.add('none')
        searchImage.classList.remove('none')
        searchActive.classList.add('none')
    }

    try{
        const response = await fetch(`https://api.giphy.com/v1/gifs/search/tags?api_key=${key}&q=${input.value.toLowerCase()}`)
        const arraySuggestions = await response.json()
        if(event.key !== 'Enter') {
            renderSuggestions(arraySuggestions.data)
        }
    } catch(reason) {
        return reason
    }
}

const list = document.getElementById('list')
function renderSuggestions(array) {
    list.innerHTML = ''
    if(array[0]) {
        list.innerHTML = `<li class="dividing-line"></li>`
    } else {
        list.innerHTML = ''
    }
    array.forEach(element => {
        const item = document.createElement('li')
        item.classList.add('suggestions')
        item.innerHTML = `<img class="search-suggestions" src="images/icon-search-grey.svg" alt="">${element.name}`
        list.classList.add('list')
        list.appendChild(item)
    })
    clickSuggestion()
}

let number
const results = document.getElementById('results')
const noResult = document.getElementById('noResult')
function clickSuggestion() {
    const selection = document.querySelectorAll('.suggestions')
    selection.forEach( li => li.addEventListener('click', (event) => {
        number = 0
        let wordSelected = event.target.innerText
        input.value = wordSelected
        list.innerHTML = ''
        search(wordSelected)
        results.innerHTML = ''
        noResult.innerHTML = ''
    }))
}

input.addEventListener('keyup', (event) => {
    if(event.key === 'Enter') {
        list.innerHTML = ''
        number = 0
        search(input.value)
        results.innerHTML = ''
        noResult.innerHTML = ''
    }
})

searchActive.addEventListener('click', () => {
    number = 0
    list.innerHTML = ''
    search(input.value)
    results.innerHTML = ''
    noResult.innerHTML = ''
})

const inputNav = document.getElementById('searchTextNav')
const searchImageNav = document.getElementById('searchImageNav')
inputNav.addEventListener('keyup', (event) => {
    if(event.key === 'Enter') {
        number = 0
        search(inputNav.value)
        results.innerHTML = ''
        noResult.innerHTML = ''
    }
})
searchImageNav.addEventListener('click', () => {
    number = 0
    search(inputNav.value)
    results.innerHTML = ''
    noResult.innerHTML = ''
})

//delete query
closeImage.addEventListener('click', () => {
    input.value = ''
    list.innerHTML = ''
    searchActive.classList.add('none')
    closeImage.classList.add('none')
    searchImage.classList.remove('none')
})

//trendings
trendings()
function trendings() {
    fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${key}`)
    .then(resp => resp.json())
    .then(object => createArray(object))
    .catch(error => console.error(error))
}

const carousel = document.getElementById('carousel')
const nCarousel = 20
function createArray(object) {
    const indexes = Array.from(Array(nCarousel).keys())
    indexes.map(element => {
        getInfo(element, object, carousel)
    })
}

//search
const resultLine = document.getElementById('resultLine')
function search(word) {
    resultLine.style.display = 'block'
    searchActive.classList.add('none')
    searchTitle.textContent = firstUppercase(word)
    fetch(`https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${word.toLowerCase()}&offset=${number}&limit=12`)
    .then(resp => resp.json())
    .then(object => {
        if(number === 0 && object.data.length == 0) {
            noResults()
            results.classList.add('none')
        } else {
            coverPage.classList.remove('none')
            fav.classList.add('none')
            favourites.classList.remove('active')
            myGifosSection.classList.add('none')
            myGif.classList.remove('active')
            createGifosSection.classList.add('none')
            createGifo.classList.add('img-create-gifo')
            createGifo.classList.remove('img-create-gifo-active')
            searchTitle.classList.remove('none')
            results.classList.remove('none')
            results.classList.remove('none')
            const min = Math.min(object.data.length, 12)
            createArraySearch(object, min)
            showMore(word)
        }
    })
    .catch(error => console.error(error))
}

function createArraySearch(object, min) {
    const indexes = Array.from(Array(min).keys())
    indexes.map(element => getInfo(element, object, results))
}

//trending words
const trendingWords = document.querySelectorAll('.trending-word')

trendingWords.forEach(item => item.addEventListener('click', (event) => {
    results.innerHTML = ''
    input.value = ''
    const word = event.target.textContent.slice(0, -2)
    number = 0
    searchTitle.textContent = firstUppercase(word)
    search(word)
}))

function firstUppercase(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getInfo(element, object, container) {
    const infoGif = {
        url: object.data[element].images.original.url,
        user: object.data[element].username,
        title: object.data[element].title,
        id: object.data[element].id
    }
    renderResult(infoGif, container)
    return infoGif
}


function renderResult(result, globalContainer) {
    const container = document.createElement('div')
    const card = document.createElement('img')

    card.src = result.url
    card.alt = result.title

    card.classList.add('card-gif')
    container.classList.add('container') //ver si repito este nombre

    container.appendChild(card)
    globalContainer.appendChild(container)

    addElements(result, container, card)
}

function addElements(result, container, card) {
    if(screen.width < 768) {
        card.addEventListener('click', () => {
            maxGif(result)
        })
    } else {
        const figMax = document.createElement('figure')
        const imgMax = document.createElement('img')
        const figDownload = document.createElement('figure')
        const imgDownload = document.createElement('img')
        const figFav = document.createElement('figure')
        const imgFav = document.createElement('img')
        const user = document.createElement('p')
        const title = document.createElement('p')
        const containerElements = document.createElement('div')
        const buttonsH = document.createElement('div')
        const utH = document.createElement('div')
        const elemH = document.createElement('div')
        
        user.textContent = result.user || 'User'
        title.textContent = result.title
        const id = result.id
        imgMax.src = 'images/icon-max-hover.svg'
        imgDownload.src = 'images/icon-download-hover.svg'
        imgFav.src = 'images/icon-fav-hover.svg'
    
        figMax.classList = 'fig-max icons-gif'
        imgMax.classList = 'img-max'
        figDownload.classList = 'fig-download icons-gif'
        imgDownload.classList = 'img-download'
        figFav.classList = 'fig-fav icons-gif'
        imgFav.classList = 'img-fav'
        user.classList = 'user'
        title.classList = 'title'
        containerElements.classList = 'container-elements none'
        elemH.classList.add('elem-h')
        utH.classList.add('ut-h')
        buttonsH.classList.add('buttons-h')

        figFav.appendChild(imgFav)
        figDownload.appendChild(imgDownload)
        figMax.appendChild(imgMax)
        buttonsH.appendChild(figFav)
        buttonsH.appendChild(figDownload)
        buttonsH.appendChild(figMax)
        utH.appendChild(user)
        utH.appendChild(title)
        elemH.appendChild(buttonsH)
        elemH.appendChild(utH)
        containerElements.appendChild(elemH)
        container.appendChild(containerElements)
    
        container.addEventListener('mouseover', () => mouseinContainer(containerElements, card))
        container.addEventListener('mouseout', () => mouseoutContainer(containerElements, card))

        figFav.addEventListener('click', () => favouritesFunction(result, imgFav, figFav))
        paintedHeart(result, imgFav, figFav)
        imgDownload.addEventListener('click', () => downloadGif(result, figDownload))
        figMax.addEventListener('click', () => maxGif(result))
    }
}

function mouseinContainer(containerElements, card) {
    card.style = 'opacity: 0.4'
    containerElements.classList.remove('none')
}

function mouseoutContainer(containerElements, card) {
    card.style = 'opacity: 1'
    containerElements.classList.add('none')
}

const showMoreButton = document.getElementById('showMore')
async function showMore(word) {
    try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${word.toLowerCase()}&offset=${number + 12}`)
        const result = await response.json()
        if(result.data[0]) {
            showMoreButton.classList.remove('none')
        } else {
            showMoreButton.classList.add('none')
        }
        return result
    } catch(reason) {
        return reason
    }
}

const searchTitle = document.getElementById('searchTitle')
showMoreButton.addEventListener('click', (event) => {
    event.preventDefault()
    if(input.value === '') {
        number += 12
        showMore(searchTitle.innerText)
        search(searchTitle.innerText)
    } else {
        number += 12
        showMore(input.value)
        search(input.value)
    }
})

const figOuch = document.createElement('figure')
const imgOuch = document.createElement('img')
const captionOuch = document.createElement('figcaption')
function noResults() {
    imgOuch.src = 'images/icon-busqueda-sin-resultado.svg'
    captionOuch.textContent = 'Intenta con otra búsqueda.'
    
    imgOuch.classList = 'img-ouch'
    captionOuch.classList = 'caption-ouch'
    figOuch.classList = 'fig-ouch'
    showMoreButton.classList.add('none')

    figOuch.appendChild(imgOuch)
    figOuch.appendChild(captionOuch)
    noResult.appendChild(figOuch)
}

//carousel scroll
const prev = document.getElementById('prev')
const next = document.getElementById('next')
position = 0
width = 26.74
count = 1
listElems = carousel.querySelectorAll('container')

prev.addEventListener('click', () => {
    position = Math.min(position + width * count, 0)
    carousel.style.marginLeft = position + 'vw'
})

next.addEventListener('click', () => {
    position = Math.max(position - width * count, width * (listElems.length - (nCarousel - 3)))
    carousel.style.marginLeft = position + 'vw'
})

prev.addEventListener('mouseover', () => hoverArrowLeft())
next.addEventListener('mouseover', () => hoverArrowRight())
prev.addEventListener('mouseout', () => arrowLeft())
next.addEventListener('mouseout', () => arrowRight())

function hoverArrowLeft() {
    if(localStorage.getItem('mode') === 'light') {
        prev.src = 'images/button-slider-left-hover.svg'
    } else {
        prev.src = 'images/button-slider-left-md-noct-hover.svg'
    }
}
function hoverArrowRight() {
    if(localStorage.getItem('mode') === 'light') {
        next.src = 'images/button-slider-right-hover.svg'
    } else {
        next.src = 'images/button-slider-right-md-noct-hover.svg'
    }
}
function arrowLeft() {
    if(localStorage.getItem('mode') === 'light') {
        prev.src = 'images/button-slider-left.svg'
    } else {
        prev.src = 'images/button-slider-left-md-noct.svg'
    }
}
function arrowRight() {
    if(localStorage.getItem('mode') === 'light') {
        next.src = 'images/button-slider-right.svg'
    } else {
        next.src = 'images/button-slider-right-md-noct.svg'
    }
}

const closeGifo = document.getElementById('closeGifo')
const nav = document.getElementById('navigator')
const coverPage = document.getElementById('coverPage')
const trendingGifos = document.getElementById('trendingGifos')
const footer = document.querySelector('footer')
const fav = document.getElementById('fav')
const maxGifo = document.getElementById('maxGifo')
function maxGif(result) {
    const gifoMax = document.createElement('img')
    const userMax = document.createElement('p')
    const titleMax = document.createElement('p')
    const figFavMax = document.createElement('figure')
    const imgFavMax = document.createElement('img')
    const figDownloadMax = document.createElement('figure')
    const imgDownloadMax = document.createElement('img')
    const containerMax = document.createElement('div')
    const buttons = document.createElement('div')
    const ut = document.createElement('div')
    const elem = document.createElement('div')

    gifoMax.src = result.url
    userMax.textContent = result.user || 'User'
    titleMax.textContent = result.title
    imgFavMax.src = 'images/icon-fav-hover.svg'
    imgDownloadMax.src = 'images/icon-download-hover.svg'

    gifoMax.classList.add('gifo-max')
    userMax.classList.add('user-max')
    titleMax.classList.add('title-max')
    imgFavMax.classList.add('img-fav-gif')
    imgDownloadMax.classList.add('img-download-gif')
    figFavMax.classList = 'fig-fav-max icons-max'
    figDownloadMax.classList = 'fig-download-max icons-max'
    containerMax.classList.add('container-max')
    elem.classList.add('elem')
    ut.classList.add('ut')
    buttons.classList.add('buttons')

    maxGifo.classList.remove('none')
    nav.classList.add('none')
    coverPage.classList.add('none')
    trendingGifos.classList.add('none')
    footer.classList.add('none')
    fav.classList.add('none')
    myGifosSection.classList.add('none')

    figFavMax.appendChild(imgFavMax)
    figDownloadMax.appendChild(imgDownloadMax)
    ut.appendChild(userMax)
    ut.appendChild(titleMax)
    buttons.appendChild(figFavMax)
    buttons.appendChild(figDownloadMax)
    elem.appendChild(ut)
    elem.appendChild(buttons)
    containerMax.appendChild(gifoMax)
    containerMax.appendChild(elem)
    maxGifo.appendChild(containerMax)
    
    figFavMax.addEventListener('click', () => favouritesFunction(result, imgFavMax, figFavMax))
    paintedHeart(result, imgFavMax, figFavMax)
    imgDownloadMax.addEventListener('click', () => downloadGif(result, figDownloadMax))

}

closeGifo.addEventListener('click', () => closeGif())

function closeGif() {
    const containerMax = document.querySelector('.container-max')
    containerMax.remove()
    maxGifo.classList.add('none')

    nav.classList.remove('none')
    footer.classList.remove('none')
    trendingGifos.classList.remove('none')

    if(varMax === 'cp') {
        coverPage.classList.remove('none')
    } else if(varMax === 'fav') {
        fav.classList.remove('none')
    } else if(varMax === 'mg') {
        myGifosSection.classList.remove('none')
        myGifs = JSON.parse(localStorage.getItem('MyGifs')) || []
            if(myGifs.length === 0) {
                noGifos.classList.remove('none')
            }
    }
}

async function downloadGif(item, container) {
    try{
        const a = document.createElement('a')
        let response = await fetch(item.url)
        let file = await response.blob()
        a.download = item.title
        a.href = window.URL.createObjectURL(file)
        a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':')
        container.appendChild(a)
        a.click()

    } catch(reason) {
        return reason
    }
}

//favourites
let numberFav
const showMoreFav = document.getElementById('showMoreFav')
function showMoreFavButton(numberFav) {
    arrayFavs = JSON.parse(localStorage.getItem('FavouritesList')) || []
    if(arrayFavs[numberFav + 12]) {
        showMoreFav.classList.remove('none')
    } else {
        showMoreFav.classList.add('none')
    }
}

showMoreFav.addEventListener('click', (event) => {
    event.preventDefault()
    showMoreFavFunction()
})

function showMoreFavFunction() {
    arrayFavs = JSON.parse(localStorage.getItem('FavouritesList')) || []
    numberFav += 12
    arrayFavsRender = arrayFavs.slice(numberFav, numberFav + 12)
    arrayFavsRender.forEach(item => renderResult(item, favouritesResults))
    showMoreFavButton(numberFav)
}

let arrayFavs = []
function favouritesFunction(result, imgFav, figFav) {
    arrayFavs = JSON.parse(localStorage.getItem('FavouritesList')) || []
    favouritesResults.innerHTML = ''

    if(arrayFavs.some(item => item.id === result.id)) {
        arrayFavs = arrayFavs.filter(item => item.id !== result.id)
        localStorage.setItem('FavouritesList', JSON.stringify(arrayFavs))
        imgFav.src = 'images/icon-fav-hover.svg'
        imgFav.classList = 'img-fav-gif'

        figFav.classList.remove('fig-fav-active')
        figFav.classList.add('fig-fav')

        let arrayFavsRender = arrayFavs.slice(0, 12)
        numberFav = 0
        arrayFavsRender.forEach(item => renderResult(item, favouritesResults))
        showMoreFavButton(numberFav)
    } else {
        arrayFavs = arrayFavs.concat(result)
        localStorage.setItem('FavouritesList', JSON.stringify(arrayFavs))
        imgFav.src = 'images/icon-fav-active.svg'
        imgFav.classList = 'img-fav-active'

        figFav.classList.add('fig-fav-active')
        figFav.classList.remove('fig-fav')

        let arrayFavsRender = arrayFavs.slice(0, 12)
        numberFav = 0
        arrayFavsRender.forEach(item => renderResult(item, favouritesResults))
        showMoreFavButton(numberFav)
    }
}

function paintedHeart(result, imgFav, figFav) {
    arrayFavs = JSON.parse(localStorage.getItem('FavouritesList')) || []
    if(arrayFavs.some(item => item.id === result.id)) {
        imgFav.src = 'images/icon-fav-active.svg'
        imgFav.classList = 'img-fav-active'

        figFav.classList.add('fig-fav-active')
        figFav.classList.remove('fig-fav')
    } else {
        imgFav.src = 'images/icon-fav-hover.svg'
        imgFav.classList = 'img-fav'

        figFav.classList.remove('fig-fav-active')
        figFav.classList.add('fig-fav')
    }
}

const favourites = document.getElementById('favourites')
const noFavourites = document.getElementById('noFavourites')
favourites.addEventListener('click', () => {
    createGifo.classList.remove('img-create-gifo-active')
    createGifo.classList.add('img-create-gifo')
    coverPage.classList.add('none')
    myGifosSection.classList.add('none')
    createGifosSection.classList.add('none')
    fav.classList.remove('none')
    trendingGifos.classList.remove('none')
    
    noFavourites.classList.add('none')
    favourites.classList.add('active')
    myGif.classList.remove('active')
    varMax = 'fav'
    favouritesResults.innerHTML = ''
    arrayFavs = JSON.parse(localStorage.getItem('FavouritesList')) || []
    
    if(arrayFavs.length === 0) {
        noFavourites.classList.remove('none')
        favouritesResults.classList.add('none')
    } else {
        favouritesResults.classList.remove('none')
        let arrayFavsRender = arrayFavs.slice(0, 12)
        numberFav = 0
        arrayFavsRender.forEach(item => renderResult(item, favouritesResults))
        showMoreFavButton(numberFav)
    }

})

//create gifo
const createGifo = document.getElementById('createGifo')
createGifo.addEventListener('click', () => {
    coverPage.classList.add('none')
    fav.classList.add('none')
    trendingGifos.classList.add('none')
    myGifosSection.classList.add('none')
    createGifo.classList.add('img-create-gifo-active')
    favourites.classList.remove('active')
    myGif.classList.remove('active')
    createGifo.classList.remove('img-create-gifo')
    createGifosSection.classList.remove('none')
})

let stream
const video = document.getElementById('video')
const starting = document.getElementById('starting')
const recording = document.getElementById('recording')
const finishing = document.getElementById('finishing')
const timing = document.getElementById('timing')
const repeat = document.getElementById('repeat')
const uploading = document.getElementById('uploading')
const textInsideCreate = document.getElementById('textInsideCreate')
const textInsideCreateOne = document.getElementById('textInsideCreateOne')
const step1 = document.getElementById('step-1')
const step2 = document.getElementById('step-2')
const step3 = document.getElementById('step-3')
const previewImage = document.getElementById('previewImage')

previewImage.classList.add('none')

starting.addEventListener('click', startingRecord)
recording.addEventListener('click', record)
finishing.addEventListener('click', finalize)
repeat.addEventListener("click", stepTwo)
uploading.addEventListener('click', uploadGifo)

function startingRecord() {
    step1.classList.add('step-active')
    starting.classList.add('none')
    textInsideCreate.classList.add('none')
    textInsideCreateOne.classList.remove('none')

    stream = navigator.mediaDevices
    .getUserMedia( { audio: false, video:  true } )
    .then(async function(mediaStream) {
        video.srcObject = mediaStream
        video.play()
        recording.classList.remove('none')
        video.classList.remove('none')
        step1.classList.remove('step-active')
        step2.classList.add('step-active')
        textInsideCreateOne.classList.add('none')

        stream = mediaStream
    })
    .then(setTimeout(function() { stepTwo()}, 1000)) 
}

function stepTwo() {
    previewImage.classList.add('none')
    uploading.classList.add('none')
    repeat.classList.add('none')
    finishing.classList.add('none')
    textInsideCreateOne.classList.add('none')
    step2.classList.add('step-active')
    step1.classList.remove('step-active')
    recording.classList.remove('none')
    video.classList.remove('none')
}

function record() {
    timer()
    recording.classList.add('none')
    recorder = RecordRTC(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        height: 370,
        width: 430,
        hidden: 240,
        onGifRecordingStarted: function() {
        console.log('started')
    },
    });
    recorder.startRecording() 
    recording.classList.add('none')
    finishing.classList.remove('none')
    timing.classList.remove('none')   
}

seconds = 0
minutes = 0
hours = 0
let t
function addTheChronometer() {
    seconds++;
    if(seconds >= 60) {
        seconds = 0
        minutes++
        if(minutes >= 60) {
            minutes = 0
            hours++
        }
    }

    timing.textContent =
    (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" +
    (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + 
    (seconds > 9 ? seconds : "0" + seconds)

    timer()
}

const timer = () => t = setTimeout(addTheChronometer, 1000)

function finalize() {
    finishing.classList.add('none')
    timing.classList.add('none')
    repeat.classList.remove('none')
    uploading.classList.remove('none')

    clearTimeout(t)
    timing.textContent = "00:00:00"
    seconds = 0; minutes = 0; hours = 0
   
    recorder.stopRecording()
    blob = recorder.getBlob()
    let urlCreator = window.URL || window.webkitURL
    let imageURL = urlCreator.createObjectURL(blob)
   
    video.classList.add('none')
    previewImage.src = imageURL
    previewImage.classList.remove('none')
}

function uploadGifo() {
    uploading.classList.add('none')
    repeat.classList.add('none')
    step3.classList.add('step-active')
    step2.classList.remove('step-active')

    let containerVideo = document.getElementById('containerVideo')
    let cardLoad = document.createElement('div')
    cardLoad.id = 'videoCardLoading'
    cardLoad.className = 'video-card'
    cardLoad.innerHTML = `<img class="loader" src="images/loader.svg" alt="loader"><br>
                          <h3 class="uploading-title">Estamos subiendo tu GIFO</h3>`
    containerVideo.appendChild(cardLoad)

    stream.getTracks().forEach(function(track) {
        track.stop();
    });
    
    const form = new FormData()
    form.append("file", blob, "myGif.gif")
    form.append("tags", "gif, person, funny")
    
    fetch(`https://upload.giphy.com/v1/gifs?api_key=${key}`, {
        method: "POST",
        body: form,
    })
    .then(response =>response.json())
    .then(response => saveMyGifo(response.data.id))
}

const saveMyGifo = async (id) => {
    const cardLoad = document.getElementById('videoCardLoading')
    cardLoad.innerHTML =    `<img class="success" src="images/ok.svg" alt="loader"><br>
                            <h3 class="success-title">GIFO subido con éxito</h3>
                            <figure id="figDownloadCamera" class="fig-download">
                                <img id="imgDownloadCamera" class="download" src="images/icon-download-hover.svg" alt="loader">
                            </figure>
                            <a id="link" target="_blank">
                                <img class="link" src="images/icon-link-hover.svg" alt="loader">
                            </a>`

    const figDownloadCamera = document.getElementById('figDownloadCamera')
    const imgDownloadCamera = document.getElementById('imgDownloadCamera')
    const resp = await searchId(id)
    const objInfo = getInfoMyGifos(resp.data)
    imgDownloadCamera.addEventListener('click', async ()  => {
        downloadGif(objInfo, figDownloadCamera)
    })

    const link = document.getElementById('link')
    link.href = resp.data.url
    
    url = `https://api.giphy.com/v1/gifs/${id}?api_key=${key}`
    fetch(url)
    .then(response =>response.json())
    .then(gif => addGifToMyList(gif.data))
}

const addGifToMyList = (gif) => {
    const myGifoList = JSON.parse(localStorage.getItem("MyGifs")) || []
    localStorage.setItem("MyGifs", JSON.stringify(myGifoList.concat(gif.id)))
}

//my Gifos
let numberMyGifos
const myGif = document.getElementById('myGif')
const myGifosSection = document.getElementById('myGifosSection')
const myGifos = document.getElementById('myGifos')
const noGifos = document.getElementById('noGifos')
let myGifsInfo = []
myGif.addEventListener('click', async () => {
    myGifsInfo = []
    let myGifs = []
    varMax = 'mg'
    myGifos.innerHTML = ''

    noGifos.classList.add('none')
    createGifo.classList.remove('img-create-gifo-active')
    createGifo.classList.add('img-create-gifo')
    coverPage.classList.add('none')
    fav.classList.add('none')
    createGifosSection.classList.add('none')
    trendingGifos.classList.remove('none')
    myGifosSection.classList.remove('none')
    favourites.classList.remove('active')
    myGif.classList.add('active')

    myGifs = JSON.parse(localStorage.getItem('MyGifs')) || []

    if(myGifs.length === 0) {
        noGifos.classList.remove('none')
        myGifos.classList.add('none')
    } else {
        myGifos.classList.remove('none')
        
        for(const iterator of myGifs) {
            let resp = await searchId(iterator)
            myGifsInfo = myGifsInfo.concat(resp.data)
        }
        
        myGifsInfo = myGifsInfo.map(object => getInfoMyGifos(object))
        let arrayMyGifosRender = myGifsInfo.slice(0, 12)
        numberMyGifos = 0
        arrayMyGifosRender.forEach(item => renderMyGifos(item, myGifos))
        showMoreMyGifosButton(numberMyGifos)
    }

})

function renderMyGifos(result, globalContainer) {
    const container = document.createElement('div')
    const card = document.createElement('img')

    card.src = result.url
    card.alt = result.title

    card.classList.add('card-gif')
    container.classList.add('container')

    container.appendChild(card)
    globalContainer.appendChild(container)

    addElementsMyGifos(result, container, card)
}

function addElementsMyGifos(result, container, card) {
    if(screen.width < 768) {
        card.addEventListener('click', () => {
            maxGifMyGifos(result)
        })
    } else {
        const figMax = document.createElement('figure')
        const imgMax = document.createElement('img')
        const figDownload = document.createElement('figure')
        const imgDownload = document.createElement('img')
        const figTrash = document.createElement('figure')
        const imgTrash = document.createElement('img')
        const user = document.createElement('p')
        const title = document.createElement('p')
        const containerElements = document.createElement('div')
        
        user.textContent = result.user || 'User'
        title.textContent = result.title
        const id = result.id
    
        figMax.classList = 'fig-max icons-gif'
        imgMax.classList = 'img-max'
        figDownload.classList = 'fig-download icons-gif'
        imgDownload.classList = 'img-download'
        figTrash.classList = 'fig-trash icons-gif'
        imgTrash.classList = 'img-trash'
        user.classList = 'user'
        title.classList = 'title'
        containerElements.classList = 'container-elements none'
    
        imgMax.src = 'images/icon-max-hover.svg'
        imgDownload.src = 'images/icon-download-hover.svg'
        imgTrash.src = 'images/icon-trash-hover.svg'
        
        const buttonsH = document.createElement('div')
        const utH = document.createElement('div')
        const elemH = document.createElement('div')

        elemH.classList.add('elem-h')
        utH.classList.add('ut-h')
        buttonsH.classList.add('buttons-h')

        figTrash.appendChild(imgTrash)
        figDownload.appendChild(imgDownload)
        figMax.appendChild(imgMax)
        buttonsH.appendChild(figTrash)
        buttonsH.appendChild(figDownload)
        buttonsH.appendChild(figMax)
        utH.appendChild(user)
        utH.appendChild(title)
        elemH.appendChild(buttonsH)
        elemH.appendChild(utH)
        containerElements.appendChild(elemH)
        container.appendChild(containerElements)
    
        container.addEventListener('mouseover', () => mouseinContainer(containerElements, card))
        container.addEventListener('mouseout', () => mouseoutContainer(containerElements, card))

        figTrash.addEventListener('click', () => {
            deleteGif(id, container)
            myGifs = JSON.parse(localStorage.getItem('MyGifs')) || []
            if(myGifs.length === 0) {
                noGifos.classList.remove('none')
            }
        })
        imgDownload.addEventListener('click', () => downloadGif(result, figDownload))
        figMax.addEventListener('click', () => maxGifMyGifos(result, container))
    }
}

function maxGifMyGifos(result, container) {
    const gifoMax = document.createElement('img')
    const userMax = document.createElement('p')
    const titleMax = document.createElement('p')
    const figTrashMax = document.createElement('figure')
    const imgTrashMax = document.createElement('img')
    const figDownloadMax = document.createElement('figure')
    const imgDownloadMax = document.createElement('img')
    const containerMax = document.createElement('div')
    const buttons = document.createElement('div')
    const ut = document.createElement('div')
    const elem = document.createElement('div')

    const id = result.id
    gifoMax.src = result.url
    userMax.textContent = result.user || 'User'
    titleMax.textContent = result.title
    imgTrashMax.src = 'images/icon-trash-hover.svg'
    imgDownloadMax.src = 'images/icon-download-hover.svg'

    gifoMax.classList.add('gifo-max')
    userMax.classList.add('user-max')
    titleMax.classList.add('title-max')
    imgTrashMax.classList.add('img-trash-gif')
    imgDownloadMax.classList.add('img-download-gif')
    figTrashMax.classList = 'fig-trash-max icons-max'
    figDownloadMax.classList = 'fig-download-max icons-max'
    containerMax.classList.add('container-max')
    elem.classList.add('elem')
    ut.classList.add('ut')
    buttons.classList.add('buttons')

    maxGifo.classList.remove('none')
    nav.classList.add('none')
    coverPage.classList.add('none')
    trendingGifos.classList.add('none')
    footer.classList.add('none')
    fav.classList.add('none')
    myGifosSection.classList.add('none')
    
    figTrashMax.appendChild(imgTrashMax)
    figDownloadMax.appendChild(imgDownloadMax)
    ut.appendChild(userMax)
    ut.appendChild(titleMax)
    buttons.appendChild(figTrashMax)
    buttons.appendChild(figDownloadMax)
    elem.appendChild(ut)
    elem.appendChild(buttons)
    containerMax.appendChild(gifoMax)
    containerMax.appendChild(elem)
    maxGifo.appendChild(containerMax)
    
    figTrashMax.addEventListener('click', () => deleteGif(id, container))
    imgDownloadMax.addEventListener('click', () => downloadGif(result, figDownloadMax))
}

function getInfoMyGifos(object) {
    const infoGif = {
        url: object.images.original.url,
        user: object.username,
        title: object.title,
        id: object.id
    }
    return infoGif
}

async function searchId(id) {
    try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/${id}?api_key=${key}`)
        const result = await response.json()
        return result
    } catch(reason) {
        return reason
    }
}

function deleteGif(id, container) {
    container.remove()
    let createdGifs = JSON.parse(localStorage.getItem('MyGifs'))
    createdGifs = createdGifs.filter(item => item !== id)
    localStorage.setItem('MyGifs', JSON.stringify(createdGifs))
}

const showMoreMyGifos = document.getElementById('showMoreMyGifos')
function showMoreMyGifosButton(numberMyGifos) {
    arrayMyGifos = JSON.parse(localStorage.getItem('MyGifs')) || []
    if(arrayMyGifos[numberMyGifos + 12]) {
        showMoreMyGifos.classList.remove('none')
    } else {
        showMoreMyGifos.classList.add('none')
    }
}

showMoreMyGifos.addEventListener('click', (event) => {
    event.preventDefault()
    showMoreMyGifosFunction()
})

function showMoreMyGifosFunction() {
    numberMyGifos += 12
    arrayMyGifosRender = myGifsInfo.slice(numberMyGifos, numberMyGifos + 12)

    arrayMyGifosRender.forEach(item => renderMyGifos(item, myGifos))
    showMoreMyGifosButton(numberMyGifos)
}

//dark and light mode
const head = document.querySelector('head')
const mode = document.getElementById('mode')
const faBars = document.querySelector('.fa-bars')
const faTimes = document.querySelector('.fa-times')
const camera = document.getElementById('camera')
const film = document.getElementById('film')
const linkMode = document.createElement('link')
linkMode.innerHTML = `<link rel="stylesheet" href="styles/dark-mode.css">`

if(localStorage.getItem('mode') === 'dark') {
    mode.textContent = 'Modo Diurno'
    head.appendChild(linkMode)
    darkMode()
} else {
    localStorage.setItem('mode', 'light')
    lightMode()
}

mode.addEventListener('click', () => {
    if(localStorage.getItem('mode') === 'light') {
        localStorage.setItem('mode', 'dark')
        mode.textContent = 'Modo Diurno'
        head.appendChild(linkMode)
        darkMode()
    } else if(localStorage.getItem('mode') === 'dark') {
        localStorage.setItem('mode', 'light')
        mode.textContent = 'Modo Nocturno'
        linkMode.remove()
        lightMode()
    }
})

function darkMode() {
    logo.src = 'images/Logo-modo-noc.svg'
    searchImage.src = 'images/icon-search-modo-noct.svg'
    searchImageNav.src = 'images/icon-search-modo-noct.svg'
    createGifo.src = 'images/CTA-crear-gifo-modo-noc.svg'
    faBars.src = 'images/burger-modo-noct.svg'
    faTimes.src = 'images/close-modo-noct.svg'
    camera.src = 'images/camara-modo-noc.svg'
    film.src = 'images/pelicula-modo-noc.svg'
    prev.src = 'images/button-slider-left-md-noct.svg'
    next.src = 'images/button-slider-right-md-noct.svg'
    closeImage.src = 'images/close-modo-noct.svg'
    closeGifo.src = 'images/close-modo-noct.svg'
}

function lightMode() {
    logo.src = 'images/logo-mobile.svg'
    searchImage.src = 'images/icon-search.svg'
    searchImageNav.src = 'images/icon-search.svg'
    createGifo.src = 'images/button-crear-gifo.svg'
    faBars.src = 'images/burger.svg'
    faTimes.src = 'images/close.svg'
    camera.src = 'images/camara.svg'
    film.src = 'images/pelicula.svg'
    prev.src = 'images/button-slider-left.svg'
    next.src = 'images/button-slider-right.svg'
    closeImage.src = 'images/close.svg'
    closeGifo.src = 'images/close.svg'
}