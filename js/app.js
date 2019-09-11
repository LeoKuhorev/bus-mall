'use strict';

//*****GLOBAL VARIABLES*****
//DOM
var imageContainerEl = document.getElementById('image-container');
var displayImgEl = document.getElementById('display-img');
var votesLeftEl = document.getElementById('votes-left');
var resultsEl = document.getElementById('results');

//array with all image names
var IMAGE_NAMES_ARR = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];

//array with all image objects
var allImagesArr = [];

//array with last image indexes (length changes depending on displayImg value)
var indexArr = [];

//defining number of user votes
var VOTES = 25;
var votesCount = 0;

//items per page (default value - 6)
var displayImg = 6;

//*****FUNCTIONS*****
//object constructor function
function Picture(name) {
  this.src = `img/${name}.jpg`;
  this.name = name;
  this.votes = 0;
  this.views = 0;

  allImagesArr.push(this);
}

//function for generating random number 0 to max (max not inluded)
function generateRandom (max) {
  return Math.floor(Math.random() * max);
}

//function for assigning unique random numbers
function uniqueIndex(index) {
  index = generateRandom(allImagesArr.length);
  while (indexArr.includes(index)) {
    index = generateRandom(allImagesArr.length);
  }
  while (indexArr.length >= displayImg * 2) {
    indexArr.shift();
  }
  indexArr.push(index);
  return index;
}

//function for rendering each image to the page
function renderImage(object) {
  var imageEl = document.createElement('img');
  imageEl.src = object.src;
  imageEl.alt = imageEl.title = object.name;
  imageContainerEl.appendChild(imageEl);
  object.views ++;
  return imageEl;
}

//function for rendering any element
function renderEl(element, parent, textContent) {
  var newEl = document.createElement(element);
  if (textContent) {
    newEl.textContent = textContent;
  }
  parent.appendChild(newEl);
  return newEl;
}

//function for generating unique random pictures and rendering them to the page
function generatePicture() {
  var index = uniqueIndex(index);
  var newEl = renderImage(allImagesArr[index]);
  return newEl;
}

//function for rendering all pictures
function renderAllPictures() {
  while(imageContainerEl.firstChild) {
    imageContainerEl.removeChild(imageContainerEl.firstChild);
  }
  for (var i = 0; i < displayImg; i++) {
    var newEl = generatePicture();

    //if user out of votes apply class 'shake' when changing page layout
    if (votesCount >= VOTES) {
      newEl.className = 'shake';
    }
  }

  console.table(indexArr);
  // console.table(allImagesArr);
}

//function for rendering list with items with votes
function renderVotes() {
  var ulEl = renderEl('ul',resultsEl);
  for (var i = 0; i < allImagesArr.length; i++) {
    if (allImagesArr[i].votes > 0) {
      var string = `for  item ${allImagesArr[i].name} - ${allImagesArr[i].votes} votes out of ${allImagesArr[i].views} views`;
      renderEl('li', ulEl, string);
    }
  }
}

//*****EVENT HANDLERS*****
//function for counting number of votes
function votesHandler(e) {
  for (var i = 0; i < allImagesArr.length; i++) {
    if (e.target.title === allImagesArr[i].name) {
      allImagesArr[i].votes++;
    }
  }

  //render new pictures
  renderAllPictures();

  //when user spends all votes - render list with results
  votesCount++;
  votesLeftEl.textContent = VOTES-votesCount;
  if (votesCount >= VOTES) {
    imageContainerEl.removeEventListener('click', votesHandler);
    renderVotes();

    //assign class 'shake' to all images
    var imgEls = imageContainerEl.children;
    for (i = 0; i < imgEls.length; i++) {
      imgEls[i].className = 'shake';
    }
  }
}

//function for changing items per page by user request
function changeDisplayedPictures(e) {
  displayImg = parseInt(e.target.value);
  renderAllPictures();
}

//*****EXECUTION*****
//creating object instances for all pictures
for (var i = 0; i < IMAGE_NAMES_ARR.length; i++) {
  new Picture(IMAGE_NAMES_ARR[i]);
}

//rendering initial pictures
renderAllPictures();

//*****EVENT LISTENERS*****
imageContainerEl.addEventListener('click', votesHandler);
displayImgEl.addEventListener('change', changeDisplayedPictures);
