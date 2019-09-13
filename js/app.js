'use strict';

//*****GLOBAL VARIABLES*****
//DOM
var imageContainerEl = document.getElementById('image-container');
var itemsPerPageEl = document.getElementById('items-per-page');
var votesLeftEl = document.getElementById('votes-left');
var resultsEl = document.getElementById('results');
var progressBarEl = document.getElementById('progress-bar');
var progressBarEmptyEl = document.getElementById('progress-bar-empty');

//array with all image names
var IMAGE_NAMES_ARR = ['R2D2-bag', 'banana-cutter', 'bathroom-stand', 'rainboots-with-holes', 'breakfast-maker', 'meatball-flavored-bubblegum', 'convex-chair', 'cthulhu-toy', 'duck-styled-dog-muzzle', 'dragon-meat-can', 'cutlery-pen-tips', 'pet-sweep', 'pizza-scissors', 'shark-sleeping-bag', 'sweep-crawlers', 'tauntaun-sleeping-bag', 'unicorn-meat-can', 'usb-tentacle', 'water-can', 'wine-glass'];

//array with all image objects
var allImagesArr = [];

//array with last image indexes (length changes depending on itemsPerPage value)
var indexArr = [];

//defining number of user votes
var VOTES = 25;
var votesCount = 0;

//items per page (default value - 6)
var itemsPerPage = 6;

//*****FUNCTIONS*****
//object constructor function
function Picture(name) {
  this.src = `img/${name}.jpg`;
  this.name = name;
  this.votes = 0;
  this.views = 0;

  allImagesArr.push(this);
}

//object ptototype for rendering each image to the page
Picture.prototype.renderImage = function(parent) {
  var imageEl = document.createElement('img');
  imageEl.src = this.src;
  imageEl.alt = imageEl.title = capitalize(this.name);
  parent.appendChild(imageEl);
  this.views ++;
  return imageEl;
};

//object ptototype for calculating each image rating (votes to views ratio)
Picture.prototype.rating = function() {
  return (this.votes / this.views * 100).toFixed(2);
};

//function for generating random number between 0 and max (max not included)
function generateRandom(max) {
  return Math.floor(Math.random() * max);
}

//function for capitalizing the first letter of a string and replacing all dashes with spaces
function capitalize(string) {
  var capitalize = string.charAt(0).toUpperCase() + string.substring(1);
  return capitalize.split('-').join(' ');
}

//function for assigning unique random indexes
function uniqueIndex() {
  var index = generateRandom(allImagesArr.length);
  while (indexArr.includes(index)) {
    index = generateRandom(allImagesArr.length);
  }
  while (indexArr.length >= itemsPerPage * 2) {
    indexArr.shift();
  }
  indexArr.push(index);
  return index;
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
  var index = uniqueIndex();
  var newEl = allImagesArr[index].renderImage(imageContainerEl);
  return newEl;
}

//function for rendering all pictures
function renderAllPictures() {
  while(imageContainerEl.firstChild) {
    imageContainerEl.removeChild(imageContainerEl.firstChild);
  }
  for (var i = 0; i < itemsPerPage; i++) {
    var newEl = generatePicture();

    //if user out of votes add class 'shake' to the image, otherwise - 'zoom'
    if (votesCount < VOTES) {
      newEl.className = 'zoom';
    } else {
      newEl.className = 'shake';
    }
  }
  console.table(indexArr);
}

//function for rendering progress bar
function renderProgressBar() {
  var string = '';
  var stringEmpty = '';
  var votesLeft =  VOTES-votesCount;
  for (var i = 0; i < votesLeft; i++) {
    string += '|';
  }
  for (i = 0; i < votesCount; i++) {
    stringEmpty += '|';
  }
  progressBarEl.textContent = string;
  progressBarEmptyEl.textContent = stringEmpty;
  if (votesLeft > 0.5 * VOTES) {
    progressBarEl.className = 'green';
  } else if (votesLeft > 0.1 * VOTES) {
    progressBarEl.className = 'yellow';
  } else {
    progressBarEl.className = 'red';
  }
  votesLeftEl.textContent = votesLeft;
}

//function for rendering items with highest rating
function favoriteItem() {

  //get the maximum value of rating property for every object in array and return it with 2 decimals
  var maxRating = Math.max.apply(Math, allImagesArr.map(function(object) { return object.rating(); })).toFixed(2);

  renderEl('h4', resultsEl, 'YOUR FAVORITE ITEM: ');
  var favImageContainerEl = renderEl('div', resultsEl);
  favImageContainerEl.id = 'favimage-container';

  for (var i = 0; i < allImagesArr.length; i++) {
    if (allImagesArr[i].rating() === maxRating) {
      var divEl = renderEl('div', favImageContainerEl);
      renderEl('h3', divEl, capitalize(allImagesArr[i].name));
      var imgEl = allImagesArr[i].renderImage(divEl);
      imgEl.className = 'shake';
      allImagesArr[i].views--;
      renderEl('h3', divEl, '(rating: ' + allImagesArr[i].rating() + '%)');
    }
  }
}

//function for rendering list with items
function renderVotes() {
  resultsEl.style.paddingBottom = '30px';
  renderEl('h4', resultsEl, 'HERE\'S THE LIST OF ITEMS YOU VOTED FOR:');
  var ulEl = renderEl('ul', resultsEl);
  for (var i = 0; i < allImagesArr.length; i++) {
    if (allImagesArr[i].votes > 0) {
      var string = `${capitalize(allImagesArr[i].name)}: ${allImagesArr[i].votes} vote(s) / ${allImagesArr[i].views} view(s) (rating: ${allImagesArr[i].rating()}%)`;
      renderEl('li', ulEl, string);
    }
  }
  resultsEl.scrollIntoView();
}

//*****EVENT HANDLERS*****
//function for counting number of votes
function votesHandler(e) {
  votesCount++;
  for (var i = 0; i < allImagesArr.length; i++) {
    if (e.target.title === capitalize(allImagesArr[i].name)) {
      allImagesArr[i].votes++;
    }
  }

  //when user spends all votes - render list with results
  if (votesCount >= VOTES) {
    imageContainerEl.removeEventListener('click', votesHandler);
    favoriteItem();
    renderVotes();
  }
  //render new pictures
  renderAllPictures();
  renderProgressBar();
}

//function for changing items per page by user request
function changeDisplayedPictures(e) {
  itemsPerPage = parseInt(e.target.value);
  renderAllPictures();
  imageContainerEl.scrollIntoView();
}

//*****EXECUTION*****
//creating object instances for all pictures
for (var i = 0; i < IMAGE_NAMES_ARR.length; i++) {
  new Picture(IMAGE_NAMES_ARR[i]);
}

//rendering initial pictures
renderAllPictures();
renderProgressBar();

//*****EVENT LISTENERS*****
imageContainerEl.addEventListener('click', votesHandler);
itemsPerPageEl.addEventListener('change', changeDisplayedPictures);
