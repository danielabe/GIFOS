"use strict";

var key = 'yOa7uHLPdR8u51J3zHKs6WhGXNbmhh7w';
var varMax = 'cp';
var header = document.querySelector('header');
var searchNav = document.getElementById('searchNav');
var createGifoButton = document.querySelector('.create-gifo-button');

window.onscroll = function () {
  var y = window.scrollY;

  if (y != 0 && screen.width > 767) {
    header.classList.add('header-shadow');
    searchNav.classList.remove('none');
    createGifoButton.classList.add('none');
  } else {
    header.classList.remove('header-shadow');
    searchNav.classList.add('none');
    createGifoButton.classList.remove('none');
  }
};

var logo = document.getElementById('logo');
logo.addEventListener('click', function () {
  window.location.reload();
}); //suggestions

var input = document.getElementById('searchText');
var searchActive = document.getElementById('searchActive');
var closeImage = document.getElementById('closeImage');
var searchImage = document.getElementById('searchImage');
input.addEventListener('keyup', function (event) {
  return getSuggestions(event);
});

function getSuggestions(event) {
  var response, arraySuggestions;
  return regeneratorRuntime.async(function getSuggestions$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (input.value !== '') {
            closeImage.classList.remove('none');
            searchImage.classList.add('none');
            searchActive.classList.remove('none');
          } else {
            closeImage.classList.add('none');
            searchImage.classList.remove('none');
            searchActive.classList.add('none');
          }

          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch("https://api.giphy.com/v1/gifs/search/tags?api_key=".concat(key, "&q=").concat(input.value.toLowerCase())));

        case 4:
          response = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(response.json());

        case 7:
          arraySuggestions = _context.sent;

          if (event.key !== 'Enter') {
            renderSuggestions(arraySuggestions.data);
          }

          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          return _context.abrupt("return", _context.t0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 11]]);
}

var list = document.getElementById('list');

function renderSuggestions(array) {
  list.innerHTML = '';

  if (array[0]) {
    list.innerHTML = "<li class=\"dividing-line\"></li>";
  } else {
    list.innerHTML = '';
  }

  array.forEach(function (element) {
    var item = document.createElement('li');
    item.classList.add('suggestions');
    item.innerHTML = "<img class=\"search-suggestions\" src=\"images/icon-search-grey.svg\" alt=\"\">".concat(element.name);
    list.classList.add('list');
    list.appendChild(item);
  });
  clickSuggestion();
}

var number;
var results = document.getElementById('results');
var noResult = document.getElementById('noResult');

function clickSuggestion() {
  var selection = document.querySelectorAll('.suggestions');
  selection.forEach(function (li) {
    return li.addEventListener('click', function (event) {
      number = 0;
      var wordSelected = event.target.innerText;
      input.value = wordSelected;
      list.innerHTML = '';
      search(wordSelected);
      results.innerHTML = '';
      noResult.innerHTML = '';
    });
  });
}

input.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    list.innerHTML = '';
    number = 0;
    search(input.value);
    results.innerHTML = '';
    noResult.innerHTML = '';
  }
});
searchActive.addEventListener('click', function () {
  number = 0;
  list.innerHTML = '';
  search(input.value);
  results.innerHTML = '';
  noResult.innerHTML = '';
});
var inputNav = document.getElementById('searchTextNav');
var searchImageNav = document.getElementById('searchImageNav');
inputNav.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    number = 0;
    search(inputNav.value);
    results.innerHTML = '';
    noResult.innerHTML = '';
  }
});
searchImageNav.addEventListener('click', function () {
  number = 0;
  search(inputNav.value);
  results.innerHTML = '';
  noResult.innerHTML = '';
}); //delete query

closeImage.addEventListener('click', function () {
  input.value = '';
  list.innerHTML = '';
  searchActive.classList.add('none');
  closeImage.classList.add('none');
  searchImage.classList.remove('none');
}); //trendings

trendings();

function trendings() {
  fetch("https://api.giphy.com/v1/gifs/trending?api_key=".concat(key)).then(function (resp) {
    return resp.json();
  }).then(function (object) {
    return createArray(object);
  })["catch"](function (error) {
    return console.error(error);
  });
}

var carousel = document.getElementById('carousel');
var nCarousel = 20;

function createArray(object) {
  var indexes = Array.from(Array(nCarousel).keys());
  indexes.map(function (element) {
    getInfo(element, object, carousel);
  });
} //search


var resultLine = document.getElementById('resultLine');

function search(word) {
  resultLine.style.display = 'block';
  searchActive.classList.add('none');
  searchTitle.textContent = firstUppercase(word);
  fetch("https://api.giphy.com/v1/gifs/search?api_key=".concat(key, "&q=").concat(word.toLowerCase(), "&offset=").concat(number, "&limit=12")).then(function (resp) {
    return resp.json();
  }).then(function (object) {
    if (number === 0 && object.data.length == 0) {
      noResults();
      results.classList.add('none');
    } else {
      coverPage.classList.remove('none');
      fav.classList.add('none');
      favourites.classList.remove('active');
      myGifosSection.classList.add('none');
      myGif.classList.remove('active');
      createGifosSection.classList.add('none');
      createGifo.classList.add('img-create-gifo');
      createGifo.classList.remove('img-create-gifo-active');
      searchTitle.classList.remove('none');
      results.classList.remove('none');
      results.classList.remove('none');
      var min = Math.min(object.data.length, 12);
      createArraySearch(object, min);
      showMore(word);
    }
  })["catch"](function (error) {
    return console.error(error);
  });
}

function createArraySearch(object, min) {
  var indexes = Array.from(Array(min).keys());
  indexes.map(function (element) {
    return getInfo(element, object, results);
  });
} //trending words


var trendingWords = document.querySelectorAll('.trending-word');
trendingWords.forEach(function (item) {
  return item.addEventListener('click', function (event) {
    results.innerHTML = '';
    input.value = '';
    var word = event.target.textContent.slice(0, -2);
    number = 0;
    searchTitle.textContent = firstUppercase(word);
    search(word);
  });
});

function firstUppercase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getInfo(element, object, container) {
  var infoGif = {
    url: object.data[element].images.original.url,
    user: object.data[element].username,
    title: object.data[element].title,
    id: object.data[element].id
  };
  renderResult(infoGif, container);
  return infoGif;
}

function renderResult(result, globalContainer) {
  var container = document.createElement('div');
  var card = document.createElement('img');
  card.src = result.url;
  card.alt = result.title;
  card.classList.add('card-gif');
  container.classList.add('container'); //ver si repito este nombre

  container.appendChild(card);
  globalContainer.appendChild(container);
  addElements(result, container, card);
}

function addElements(result, container, card) {
  if (screen.width < 768) {
    card.addEventListener('click', function () {
      maxGif(result);
    });
  } else {
    var figMax = document.createElement('figure');
    var imgMax = document.createElement('img');
    var figDownload = document.createElement('figure');
    var imgDownload = document.createElement('img');
    var figFav = document.createElement('figure');
    var imgFav = document.createElement('img');
    var user = document.createElement('p');
    var title = document.createElement('p');
    var containerElements = document.createElement('div');
    var buttonsH = document.createElement('div');
    var utH = document.createElement('div');
    var elemH = document.createElement('div');
    user.textContent = result.user || 'User';
    title.textContent = result.title;
    var id = result.id;
    imgMax.src = 'images/icon-max-hover.svg';
    imgDownload.src = 'images/icon-download-hover.svg';
    imgFav.src = 'images/icon-fav-hover.svg';
    figMax.classList = 'fig-max icons-gif';
    imgMax.classList = 'img-max';
    figDownload.classList = 'fig-download icons-gif';
    imgDownload.classList = 'img-download';
    figFav.classList = 'fig-fav icons-gif';
    imgFav.classList = 'img-fav';
    user.classList = 'user';
    title.classList = 'title';
    containerElements.classList = 'container-elements none';
    elemH.classList.add('elem-h');
    utH.classList.add('ut-h');
    buttonsH.classList.add('buttons-h');
    figFav.appendChild(imgFav);
    figDownload.appendChild(imgDownload);
    figMax.appendChild(imgMax);
    buttonsH.appendChild(figFav);
    buttonsH.appendChild(figDownload);
    buttonsH.appendChild(figMax);
    utH.appendChild(user);
    utH.appendChild(title);
    elemH.appendChild(buttonsH);
    elemH.appendChild(utH);
    containerElements.appendChild(elemH);
    container.appendChild(containerElements);
    container.addEventListener('mouseover', function () {
      return mouseinContainer(containerElements, card);
    });
    container.addEventListener('mouseout', function () {
      return mouseoutContainer(containerElements, card);
    });
    figFav.addEventListener('click', function () {
      return favouritesFunction(result, imgFav, figFav);
    });
    paintedHeart(result, imgFav, figFav);
    imgDownload.addEventListener('click', function () {
      return downloadGif(result, figDownload);
    });
    figMax.addEventListener('click', function () {
      return maxGif(result);
    });
  }
}

function mouseinContainer(containerElements, card) {
  card.style = 'opacity: 0.4';
  containerElements.classList.remove('none');
}

function mouseoutContainer(containerElements, card) {
  card.style = 'opacity: 1';
  containerElements.classList.add('none');
}

var showMoreButton = document.getElementById('showMore');

function showMore(word) {
  var response, result;
  return regeneratorRuntime.async(function showMore$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(fetch("https://api.giphy.com/v1/gifs/search?api_key=".concat(key, "&q=").concat(word.toLowerCase(), "&offset=").concat(number + 12)));

        case 3:
          response = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(response.json());

        case 6:
          result = _context2.sent;

          if (result.data[0]) {
            showMoreButton.classList.remove('none');
          } else {
            showMoreButton.classList.add('none');
          }

          return _context2.abrupt("return", result);

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", _context2.t0);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
}

var searchTitle = document.getElementById('searchTitle');
showMoreButton.addEventListener('click', function (event) {
  event.preventDefault();

  if (input.value === '') {
    number += 12;
    showMore(searchTitle.innerText);
    search(searchTitle.innerText);
  } else {
    number += 12;
    showMore(input.value);
    search(input.value);
  }
});
var figOuch = document.createElement('figure');
var imgOuch = document.createElement('img');
var captionOuch = document.createElement('figcaption');

function noResults() {
  imgOuch.src = 'images/icon-busqueda-sin-resultado.svg';
  captionOuch.textContent = 'Intenta con otra búsqueda.';
  imgOuch.classList = 'img-ouch';
  captionOuch.classList = 'caption-ouch';
  figOuch.classList = 'fig-ouch';
  showMoreButton.classList.add('none');
  figOuch.appendChild(imgOuch);
  figOuch.appendChild(captionOuch);
  noResult.appendChild(figOuch);
} //carousel scroll


var prev = document.getElementById('prev');
var next = document.getElementById('next');
position = 0;
width = 26.74;
count = 1;
listElems = carousel.querySelectorAll('container');
prev.addEventListener('click', function () {
  position = Math.min(position + width * count, 0);
  carousel.style.marginLeft = position + 'vw';
});
next.addEventListener('click', function () {
  position = Math.max(position - width * count, width * (listElems.length - (nCarousel - 3)));
  carousel.style.marginLeft = position + 'vw';
});
prev.addEventListener('mouseover', function () {
  return hoverArrowLeft();
});
next.addEventListener('mouseover', function () {
  return hoverArrowRight();
});
prev.addEventListener('mouseout', function () {
  return arrowLeft();
});
next.addEventListener('mouseout', function () {
  return arrowRight();
});

function hoverArrowLeft() {
  if (localStorage.getItem('mode') === 'light') {
    prev.src = 'images/button-slider-left-hover.svg';
  } else {
    prev.src = 'images/button-slider-left-md-noct-hover.svg';
  }
}

function hoverArrowRight() {
  if (localStorage.getItem('mode') === 'light') {
    next.src = 'images/button-slider-right-hover.svg';
  } else {
    next.src = 'images/button-slider-right-md-noct-hover.svg';
  }
}

function arrowLeft() {
  if (localStorage.getItem('mode') === 'light') {
    prev.src = 'images/button-slider-left.svg';
  } else {
    prev.src = 'images/button-slider-left-md-noct.svg';
  }
}

function arrowRight() {
  if (localStorage.getItem('mode') === 'light') {
    next.src = 'images/button-slider-right.svg';
  } else {
    next.src = 'images/button-slider-right-md-noct.svg';
  }
}

var closeGifo = document.getElementById('closeGifo');
var nav = document.getElementById('navigator');
var coverPage = document.getElementById('coverPage');
var trendingGifos = document.getElementById('trendingGifos');
var footer = document.querySelector('footer');
var fav = document.getElementById('fav');
var maxGifo = document.getElementById('maxGifo');

function maxGif(result) {
  var gifoMax = document.createElement('img');
  var userMax = document.createElement('p');
  var titleMax = document.createElement('p');
  var figFavMax = document.createElement('figure');
  var imgFavMax = document.createElement('img');
  var figDownloadMax = document.createElement('figure');
  var imgDownloadMax = document.createElement('img');
  var containerMax = document.createElement('div');
  var buttons = document.createElement('div');
  var ut = document.createElement('div');
  var elem = document.createElement('div');
  gifoMax.src = result.url;
  userMax.textContent = result.user || 'User';
  titleMax.textContent = result.title;
  imgFavMax.src = 'images/icon-fav-hover.svg';
  imgDownloadMax.src = 'images/icon-download-hover.svg';
  gifoMax.classList.add('gifo-max');
  userMax.classList.add('user-max');
  titleMax.classList.add('title-max');
  imgFavMax.classList.add('img-fav-gif');
  imgDownloadMax.classList.add('img-download-gif');
  figFavMax.classList = 'fig-fav-max icons-max';
  figDownloadMax.classList = 'fig-download-max icons-max';
  containerMax.classList.add('container-max');
  elem.classList.add('elem');
  ut.classList.add('ut');
  buttons.classList.add('buttons');
  maxGifo.classList.remove('none');
  nav.classList.add('none');
  coverPage.classList.add('none');
  trendingGifos.classList.add('none');
  footer.classList.add('none');
  fav.classList.add('none');
  myGifosSection.classList.add('none');
  figFavMax.appendChild(imgFavMax);
  figDownloadMax.appendChild(imgDownloadMax);
  ut.appendChild(userMax);
  ut.appendChild(titleMax);
  buttons.appendChild(figFavMax);
  buttons.appendChild(figDownloadMax);
  elem.appendChild(ut);
  elem.appendChild(buttons);
  containerMax.appendChild(gifoMax);
  containerMax.appendChild(elem);
  maxGifo.appendChild(containerMax);
  figFavMax.addEventListener('click', function () {
    return favouritesFunction(result, imgFavMax, figFavMax);
  });
  paintedHeart(result, imgFavMax, figFavMax);
  imgDownloadMax.addEventListener('click', function () {
    return downloadGif(result, figDownloadMax);
  });
}

closeGifo.addEventListener('click', function () {
  return closeGif();
});

function closeGif() {
  var containerMax = document.querySelector('.container-max');
  containerMax.remove();
  maxGifo.classList.add('none');
  nav.classList.remove('none');
  footer.classList.remove('none');
  trendingGifos.classList.remove('none');

  if (varMax === 'cp') {
    coverPage.classList.remove('none');
  } else if (varMax === 'fav') {
    fav.classList.remove('none');
  } else if (varMax === 'mg') {
    myGifosSection.classList.remove('none');
    myGifs = JSON.parse(localStorage.getItem('MyGifs')) || [];

    if (myGifs.length === 0) {
      noGifos.classList.remove('none');
    }
  }
}

function downloadGif(item, container) {
  var a, response, file;
  return regeneratorRuntime.async(function downloadGif$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          a = document.createElement('a');
          _context3.next = 4;
          return regeneratorRuntime.awrap(fetch(item.url));

        case 4:
          response = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(response.blob());

        case 7:
          file = _context3.sent;
          a.download = item.title;
          a.href = window.URL.createObjectURL(file);
          a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
          container.appendChild(a);
          a.click();
          _context3.next = 18;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", _context3.t0);

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 15]]);
} //favourites


var numberFav;
var showMoreFav = document.getElementById('showMoreFav');

function showMoreFavButton(numberFav) {
  arrayFavs = JSON.parse(localStorage.getItem('FavouritesList')) || [];

  if (arrayFavs[numberFav + 12]) {
    showMoreFav.classList.remove('none');
  } else {
    showMoreFav.classList.add('none');
  }
}

showMoreFav.addEventListener('click', function (event) {
  event.preventDefault();
  showMoreFavFunction();
});

function showMoreFavFunction() {
  arrayFavs = JSON.parse(localStorage.getItem('FavouritesList')) || [];
  numberFav += 12;
  arrayFavsRender = arrayFavs.slice(numberFav, numberFav + 12);
  arrayFavsRender.forEach(function (item) {
    return renderResult(item, favouritesResults);
  });
  showMoreFavButton(numberFav);
}

var arrayFavs = [];

function favouritesFunction(result, imgFav, figFav) {
  arrayFavs = JSON.parse(localStorage.getItem('FavouritesList')) || [];
  favouritesResults.innerHTML = '';

  if (arrayFavs.some(function (item) {
    return item.id === result.id;
  })) {
    arrayFavs = arrayFavs.filter(function (item) {
      return item.id !== result.id;
    });
    localStorage.setItem('FavouritesList', JSON.stringify(arrayFavs));
    imgFav.src = 'images/icon-fav-hover.svg';
    imgFav.classList = 'img-fav-gif';
    figFav.classList.remove('fig-fav-active');
    figFav.classList.add('fig-fav');

    var _arrayFavsRender = arrayFavs.slice(0, 12);

    numberFav = 0;

    _arrayFavsRender.forEach(function (item) {
      return renderResult(item, favouritesResults);
    });

    showMoreFavButton(numberFav);
  } else {
    arrayFavs = arrayFavs.concat(result);
    localStorage.setItem('FavouritesList', JSON.stringify(arrayFavs));
    imgFav.src = 'images/icon-fav-active.svg';
    imgFav.classList = 'img-fav-active';
    figFav.classList.add('fig-fav-active');
    figFav.classList.remove('fig-fav');

    var _arrayFavsRender2 = arrayFavs.slice(0, 12);

    numberFav = 0;

    _arrayFavsRender2.forEach(function (item) {
      return renderResult(item, favouritesResults);
    });

    showMoreFavButton(numberFav);
  }
}

function paintedHeart(result, imgFav, figFav) {
  arrayFavs = JSON.parse(localStorage.getItem('FavouritesList')) || [];

  if (arrayFavs.some(function (item) {
    return item.id === result.id;
  })) {
    imgFav.src = 'images/icon-fav-active.svg';
    imgFav.classList = 'img-fav-active';
    figFav.classList.add('fig-fav-active');
    figFav.classList.remove('fig-fav');
  } else {
    imgFav.src = 'images/icon-fav-hover.svg';
    imgFav.classList = 'img-fav';
    figFav.classList.remove('fig-fav-active');
    figFav.classList.add('fig-fav');
  }
}

var favourites = document.getElementById('favourites');
var noFavourites = document.getElementById('noFavourites');
favourites.addEventListener('click', function () {
  createGifo.classList.remove('img-create-gifo-active');
  createGifo.classList.add('img-create-gifo');
  coverPage.classList.add('none');
  myGifosSection.classList.add('none');
  createGifosSection.classList.add('none');
  fav.classList.remove('none');
  trendingGifos.classList.remove('none');
  noFavourites.classList.add('none');
  favourites.classList.add('active');
  myGif.classList.remove('active');
  varMax = 'fav';
  favouritesResults.innerHTML = '';
  arrayFavs = JSON.parse(localStorage.getItem('FavouritesList')) || [];

  if (arrayFavs.length === 0) {
    noFavourites.classList.remove('none');
    favouritesResults.classList.add('none');
  } else {
    favouritesResults.classList.remove('none');

    var _arrayFavsRender3 = arrayFavs.slice(0, 12);

    numberFav = 0;

    _arrayFavsRender3.forEach(function (item) {
      return renderResult(item, favouritesResults);
    });

    showMoreFavButton(numberFav);
  }
}); //create gifo

var createGifo = document.getElementById('createGifo');
createGifo.addEventListener('click', function () {
  coverPage.classList.add('none');
  fav.classList.add('none');
  trendingGifos.classList.add('none');
  myGifosSection.classList.add('none');
  createGifo.classList.add('img-create-gifo-active');
  favourites.classList.remove('active');
  myGif.classList.remove('active');
  createGifo.classList.remove('img-create-gifo');
  createGifosSection.classList.remove('none');
});
var stream;
var video = document.getElementById('video');
var starting = document.getElementById('starting');
var recording = document.getElementById('recording');
var finishing = document.getElementById('finishing');
var timing = document.getElementById('timing');
var repeat = document.getElementById('repeat');
var uploading = document.getElementById('uploading');
var textInsideCreate = document.getElementById('textInsideCreate');
var textInsideCreateOne = document.getElementById('textInsideCreateOne');
var step1 = document.getElementById('step-1');
var step2 = document.getElementById('step-2');
var step3 = document.getElementById('step-3');
var previewImage = document.getElementById('previewImage');
previewImage.classList.add('none');
starting.addEventListener('click', startingRecord);
recording.addEventListener('click', record);
finishing.addEventListener('click', finalize);
repeat.addEventListener("click", stepTwo);
uploading.addEventListener('click', uploadGifo);

function startingRecord() {
  step1.classList.add('step-active');
  starting.classList.add('none');
  textInsideCreate.classList.add('none');
  textInsideCreateOne.classList.remove('none');
  stream = navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  }).then(function _callee(mediaStream) {
    return regeneratorRuntime.async(function _callee$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            video.srcObject = mediaStream;
            video.play();
            recording.classList.remove('none');
            video.classList.remove('none');
            step1.classList.remove('step-active');
            step2.classList.add('step-active');
            textInsideCreateOne.classList.add('none');
            stream = mediaStream;

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    });
  }).then(setTimeout(function () {
    stepTwo();
  }, 1000));
}

function stepTwo() {
  previewImage.classList.add('none');
  uploading.classList.add('none');
  repeat.classList.add('none');
  finishing.classList.add('none');
  textInsideCreateOne.classList.add('none');
  step2.classList.add('step-active');
  step1.classList.remove('step-active');
  recording.classList.remove('none');
  video.classList.remove('none');
}

function record() {
  timer();
  recording.classList.add('none');
  recorder = RecordRTC(stream, {
    type: 'gif',
    frameRate: 1,
    quality: 10,
    height: 370,
    width: 430,
    hidden: 240,
    onGifRecordingStarted: function onGifRecordingStarted() {
      console.log('started');
    }
  });
  recorder.startRecording();
  recording.classList.add('none');
  finishing.classList.remove('none');
  timing.classList.remove('none');
}

seconds = 0;
minutes = 0;
hours = 0;
var t;

function addTheChronometer() {
  seconds++;

  if (seconds >= 60) {
    seconds = 0;
    minutes++;

    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }
  }

  timing.textContent = (hours ? hours > 9 ? hours : "0" + hours : "00") + ":" + (minutes ? minutes > 9 ? minutes : "0" + minutes : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
  timer();
}

var timer = function timer() {
  return t = setTimeout(addTheChronometer, 1000);
};

function finalize() {
  finishing.classList.add('none');
  timing.classList.add('none');
  repeat.classList.remove('none');
  uploading.classList.remove('none');
  clearTimeout(t);
  timing.textContent = "00:00:00";
  seconds = 0;
  minutes = 0;
  hours = 0;
  recorder.stopRecording();
  blob = recorder.getBlob();
  var urlCreator = window.URL || window.webkitURL;
  var imageURL = urlCreator.createObjectURL(blob);
  video.classList.add('none');
  previewImage.src = imageURL;
  previewImage.classList.remove('none');
}

function uploadGifo() {
  uploading.classList.add('none');
  repeat.classList.add('none');
  step3.classList.add('step-active');
  step2.classList.remove('step-active');
  var containerVideo = document.getElementById('containerVideo');
  var cardLoad = document.createElement('div');
  cardLoad.id = 'videoCardLoading';
  cardLoad.className = 'video-card';
  cardLoad.innerHTML = "<img class=\"loader\" src=\"images/loader.svg\" alt=\"loader\"><br>\n                          <h3 class=\"uploading-title\">Estamos subiendo tu GIFO</h3>";
  containerVideo.appendChild(cardLoad);
  stream.getTracks().forEach(function (track) {
    track.stop();
  });
  var form = new FormData();
  form.append("file", blob, "myGif.gif");
  form.append("tags", "gif, person, funny");
  fetch("https://upload.giphy.com/v1/gifs?api_key=".concat(key), {
    method: "POST",
    body: form
  }).then(function (response) {
    return response.json();
  }).then(function (response) {
    return saveMyGifo(response.data.id);
  });
}

var saveMyGifo = function saveMyGifo(id) {
  var cardLoad, figDownloadCamera, imgDownloadCamera, resp, objInfo, link;
  return regeneratorRuntime.async(function saveMyGifo$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          cardLoad = document.getElementById('videoCardLoading');
          cardLoad.innerHTML = "<img class=\"success\" src=\"images/ok.svg\" alt=\"loader\"><br>\n                            <h3 class=\"success-title\">GIFO subido con \xE9xito</h3>\n                            <figure id=\"figDownloadCamera\" class=\"fig-download\">\n                                <img id=\"imgDownloadCamera\" class=\"download\" src=\"images/icon-download-hover.svg\" alt=\"loader\">\n                            </figure>\n                            <a id=\"link\" target=\"_blank\">\n                                <img class=\"link\" src=\"images/icon-link-hover.svg\" alt=\"loader\">\n                            </a>";
          figDownloadCamera = document.getElementById('figDownloadCamera');
          imgDownloadCamera = document.getElementById('imgDownloadCamera');
          _context6.next = 6;
          return regeneratorRuntime.awrap(searchId(id));

        case 6:
          resp = _context6.sent;
          objInfo = getInfoMyGifos(resp.data);
          imgDownloadCamera.addEventListener('click', function _callee2() {
            return regeneratorRuntime.async(function _callee2$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    downloadGif(objInfo, figDownloadCamera);

                  case 1:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          });
          link = document.getElementById('link');
          link.href = resp.data.url;
          url = "https://api.giphy.com/v1/gifs/".concat(id, "?api_key=").concat(key);
          fetch(url).then(function (response) {
            return response.json();
          }).then(function (gif) {
            return addGifToMyList(gif.data);
          });

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  });
};

var addGifToMyList = function addGifToMyList(gif) {
  var myGifoList = JSON.parse(localStorage.getItem("MyGifs")) || [];
  localStorage.setItem("MyGifs", JSON.stringify(myGifoList.concat(gif.id)));
}; //my Gifos


var numberMyGifos;
var myGif = document.getElementById('myGif');
var myGifosSection = document.getElementById('myGifosSection');
var myGifos = document.getElementById('myGifos');
var noGifos = document.getElementById('noGifos');
var myGifsInfo = [];
myGif.addEventListener('click', function _callee3() {
  var myGifs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, iterator, resp, _arrayMyGifosRender;

  return regeneratorRuntime.async(function _callee3$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          myGifsInfo = [];
          myGifs = [];
          varMax = 'mg';
          myGifos.innerHTML = '';
          noGifos.classList.add('none');
          createGifo.classList.remove('img-create-gifo-active');
          createGifo.classList.add('img-create-gifo');
          coverPage.classList.add('none');
          fav.classList.add('none');
          createGifosSection.classList.add('none');
          trendingGifos.classList.remove('none');
          myGifosSection.classList.remove('none');
          favourites.classList.remove('active');
          myGif.classList.add('active');
          myGifs = JSON.parse(localStorage.getItem('MyGifs')) || [];

          if (!(myGifs.length === 0)) {
            _context7.next = 20;
            break;
          }

          noGifos.classList.remove('none');
          myGifos.classList.add('none');
          _context7.next = 54;
          break;

        case 20:
          myGifos.classList.remove('none');
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context7.prev = 24;
          _iterator = myGifs[Symbol.iterator]();

        case 26:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context7.next = 35;
            break;
          }

          iterator = _step.value;
          _context7.next = 30;
          return regeneratorRuntime.awrap(searchId(iterator));

        case 30:
          resp = _context7.sent;
          myGifsInfo = myGifsInfo.concat(resp.data);

        case 32:
          _iteratorNormalCompletion = true;
          _context7.next = 26;
          break;

        case 35:
          _context7.next = 41;
          break;

        case 37:
          _context7.prev = 37;
          _context7.t0 = _context7["catch"](24);
          _didIteratorError = true;
          _iteratorError = _context7.t0;

        case 41:
          _context7.prev = 41;
          _context7.prev = 42;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 44:
          _context7.prev = 44;

          if (!_didIteratorError) {
            _context7.next = 47;
            break;
          }

          throw _iteratorError;

        case 47:
          return _context7.finish(44);

        case 48:
          return _context7.finish(41);

        case 49:
          myGifsInfo = myGifsInfo.map(function (object) {
            return getInfoMyGifos(object);
          });
          _arrayMyGifosRender = myGifsInfo.slice(0, 12);
          numberMyGifos = 0;

          _arrayMyGifosRender.forEach(function (item) {
            return renderMyGifos(item, myGifos);
          });

          showMoreMyGifosButton(numberMyGifos);

        case 54:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[24, 37, 41, 49], [42,, 44, 48]]);
});

function renderMyGifos(result, globalContainer) {
  var container = document.createElement('div');
  var card = document.createElement('img');
  card.src = result.url;
  card.alt = result.title;
  card.classList.add('card-gif');
  container.classList.add('container');
  container.appendChild(card);
  globalContainer.appendChild(container);
  addElementsMyGifos(result, container, card);
}

function addElementsMyGifos(result, container, card) {
  if (screen.width < 768) {
    card.addEventListener('click', function () {
      maxGifMyGifos(result);
    });
  } else {
    var figMax = document.createElement('figure');
    var imgMax = document.createElement('img');
    var figDownload = document.createElement('figure');
    var imgDownload = document.createElement('img');
    var figTrash = document.createElement('figure');
    var imgTrash = document.createElement('img');
    var user = document.createElement('p');
    var title = document.createElement('p');
    var containerElements = document.createElement('div');
    user.textContent = result.user || 'User';
    title.textContent = result.title;
    var id = result.id;
    figMax.classList = 'fig-max icons-gif';
    imgMax.classList = 'img-max';
    figDownload.classList = 'fig-download icons-gif';
    imgDownload.classList = 'img-download';
    figTrash.classList = 'fig-trash icons-gif';
    imgTrash.classList = 'img-trash';
    user.classList = 'user';
    title.classList = 'title';
    containerElements.classList = 'container-elements none';
    imgMax.src = 'images/icon-max-hover.svg';
    imgDownload.src = 'images/icon-download-hover.svg';
    imgTrash.src = 'images/icon-trash-hover.svg';
    var buttonsH = document.createElement('div');
    var utH = document.createElement('div');
    var elemH = document.createElement('div');
    elemH.classList.add('elem-h');
    utH.classList.add('ut-h');
    buttonsH.classList.add('buttons-h');
    figTrash.appendChild(imgTrash);
    figDownload.appendChild(imgDownload);
    figMax.appendChild(imgMax);
    buttonsH.appendChild(figTrash);
    buttonsH.appendChild(figDownload);
    buttonsH.appendChild(figMax);
    utH.appendChild(user);
    utH.appendChild(title);
    elemH.appendChild(buttonsH);
    elemH.appendChild(utH);
    containerElements.appendChild(elemH);
    container.appendChild(containerElements);
    container.addEventListener('mouseover', function () {
      return mouseinContainer(containerElements, card);
    });
    container.addEventListener('mouseout', function () {
      return mouseoutContainer(containerElements, card);
    });
    figTrash.addEventListener('click', function () {
      deleteGif(id, container);
      myGifs = JSON.parse(localStorage.getItem('MyGifs')) || [];

      if (myGifs.length === 0) {
        noGifos.classList.remove('none');
      }
    });
    imgDownload.addEventListener('click', function () {
      return downloadGif(result, figDownload);
    });
    figMax.addEventListener('click', function () {
      return maxGifMyGifos(result, container);
    });
  }
}

function maxGifMyGifos(result, container) {
  var gifoMax = document.createElement('img');
  var userMax = document.createElement('p');
  var titleMax = document.createElement('p');
  var figTrashMax = document.createElement('figure');
  var imgTrashMax = document.createElement('img');
  var figDownloadMax = document.createElement('figure');
  var imgDownloadMax = document.createElement('img');
  var containerMax = document.createElement('div');
  var buttons = document.createElement('div');
  var ut = document.createElement('div');
  var elem = document.createElement('div');
  var id = result.id;
  gifoMax.src = result.url;
  userMax.textContent = result.user || 'User';
  titleMax.textContent = result.title;
  imgTrashMax.src = 'images/icon-trash-hover.svg';
  imgDownloadMax.src = 'images/icon-download-hover.svg';
  gifoMax.classList.add('gifo-max');
  userMax.classList.add('user-max');
  titleMax.classList.add('title-max');
  imgTrashMax.classList.add('img-trash-gif');
  imgDownloadMax.classList.add('img-download-gif');
  figTrashMax.classList = 'fig-trash-max icons-max';
  figDownloadMax.classList = 'fig-download-max icons-max';
  containerMax.classList.add('container-max');
  elem.classList.add('elem');
  ut.classList.add('ut');
  buttons.classList.add('buttons');
  maxGifo.classList.remove('none');
  nav.classList.add('none');
  coverPage.classList.add('none');
  trendingGifos.classList.add('none');
  footer.classList.add('none');
  fav.classList.add('none');
  myGifosSection.classList.add('none');
  figTrashMax.appendChild(imgTrashMax);
  figDownloadMax.appendChild(imgDownloadMax);
  ut.appendChild(userMax);
  ut.appendChild(titleMax);
  buttons.appendChild(figTrashMax);
  buttons.appendChild(figDownloadMax);
  elem.appendChild(ut);
  elem.appendChild(buttons);
  containerMax.appendChild(gifoMax);
  containerMax.appendChild(elem);
  maxGifo.appendChild(containerMax);
  figTrashMax.addEventListener('click', function () {
    return deleteGif(id, container);
  });
  imgDownloadMax.addEventListener('click', function () {
    return downloadGif(result, figDownloadMax);
  });
}

function getInfoMyGifos(object) {
  var infoGif = {
    url: object.images.original.url,
    user: object.username,
    title: object.title,
    id: object.id
  };
  return infoGif;
}

function searchId(id) {
  var response, result;
  return regeneratorRuntime.async(function searchId$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(fetch("https://api.giphy.com/v1/gifs/".concat(id, "?api_key=").concat(key)));

        case 3:
          response = _context8.sent;
          _context8.next = 6;
          return regeneratorRuntime.awrap(response.json());

        case 6:
          result = _context8.sent;
          return _context8.abrupt("return", result);

        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](0);
          return _context8.abrupt("return", _context8.t0);

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

function deleteGif(id, container) {
  container.remove();
  var createdGifs = JSON.parse(localStorage.getItem('MyGifs'));
  createdGifs = createdGifs.filter(function (item) {
    return item !== id;
  });
  localStorage.setItem('MyGifs', JSON.stringify(createdGifs));
}

var showMoreMyGifos = document.getElementById('showMoreMyGifos');

function showMoreMyGifosButton(numberMyGifos) {
  arrayMyGifos = JSON.parse(localStorage.getItem('MyGifs')) || [];

  if (arrayMyGifos[numberMyGifos + 12]) {
    showMoreMyGifos.classList.remove('none');
  } else {
    showMoreMyGifos.classList.add('none');
  }
}

showMoreMyGifos.addEventListener('click', function (event) {
  event.preventDefault();
  showMoreMyGifosFunction();
});

function showMoreMyGifosFunction() {
  numberMyGifos += 12;
  arrayMyGifosRender = myGifsInfo.slice(numberMyGifos, numberMyGifos + 12);
  arrayMyGifosRender.forEach(function (item) {
    return renderMyGifos(item, myGifos);
  });
  showMoreMyGifosButton(numberMyGifos);
} //dark and light mode


var head = document.querySelector('head');
var mode = document.getElementById('mode');
var faBars = document.querySelector('.fa-bars');
var faTimes = document.querySelector('.fa-times');
var camera = document.getElementById('camera');
var film = document.getElementById('film');
var linkMode = document.createElement('link');
linkMode.innerHTML = "<link rel=\"stylesheet\" href=\"styles/dark-mode.css\">";

if (localStorage.getItem('mode') === 'dark') {
  mode.textContent = 'Modo Diurno';
  head.appendChild(linkMode);
  darkMode();
} else {
  localStorage.setItem('mode', 'light');
  lightMode();
}

mode.addEventListener('click', function () {
  if (localStorage.getItem('mode') === 'light') {
    localStorage.setItem('mode', 'dark');
    mode.textContent = 'Modo Diurno';
    head.appendChild(linkMode);
    darkMode();
  } else if (localStorage.getItem('mode') === 'dark') {
    localStorage.setItem('mode', 'light');
    mode.textContent = 'Modo Nocturno';
    linkMode.remove();
    lightMode();
  }
});

function darkMode() {
  logo.src = 'images/Logo-modo-noc.svg';
  searchImage.src = 'images/icon-search-modo-noct.svg';
  searchImageNav.src = 'images/icon-search-modo-noct.svg';
  createGifo.src = 'images/CTA-crear-gifo-modo-noc.svg';
  faBars.src = 'images/burger-modo-noct.svg';
  faTimes.src = 'images/close-modo-noct.svg';
  camera.src = 'images/camara-modo-noc.svg';
  film.src = 'images/pelicula-modo-noc.svg';
  prev.src = 'images/button-slider-left-md-noct.svg';
  next.src = 'images/button-slider-right-md-noct.svg';
  closeImage.src = 'images/close-modo-noct.svg';
  closeGifo.src = 'images/close-modo-noct.svg';
}

function lightMode() {
  logo.src = 'images/logo-mobile.svg';
  searchImage.src = 'images/icon-search.svg';
  searchImageNav.src = 'images/icon-search.svg';
  createGifo.src = 'images/button-crear-gifo.svg';
  faBars.src = 'images/burger.svg';
  faTimes.src = 'images/close.svg';
  camera.src = 'images/camara.svg';
  film.src = 'images/pelicula.svg';
  prev.src = 'images/button-slider-left.svg';
  next.src = 'images/button-slider-right.svg';
  closeImage.src = 'images/close.svg';
  closeGifo.src = 'images/close.svg';
}