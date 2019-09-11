'use strict';

//*****GLOBAL VARIABLES*****
//DOM
var imageContainerEl = document.getElementById('image-container');
var displayImgEl = document.getElementById('display-img');
var votesLeftEl = document.getElementById('votes-left');

//array with all image names
var IMAGE_NAMES_ARR = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];

//array with all image objects
var allImagesArr = [];

//array with last image indexes (length changes depending on displayImg value)
var indexArr = [];

//defining number of user selections
var NUMBER_OF_SELECTIONS = 25;
var selectionCount = 0;

//how many pictures are displayed at a time (page loads with 3)
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

//function for assigning 6 unique random numbers
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

//function for rendering image to the page
function renderImage(object) {
  var imageEl = document.createElement('img');
  imageEl.src = object.src;
  imageEl.alt = imageEl.title = object.name;
  imageContainerEl.appendChild(imageEl);
  object.views ++;
}

//function for generating 3 random pictures and rendering them to the page
function generatePicture() {
  var index = uniqueIndex(index);
  renderImage(allImagesArr[index]);
}

//function for rendering all pictures
function renderAllPictures() {
  while(imageContainerEl.firstChild) {
    imageContainerEl.removeChild(imageContainerEl.firstChild);
  }
  for (var i = 0; i < displayImg; i++) {
    generatePicture();
  }

  console.table(indexArr);
  // console.table(allImagesArr);
}

//*****EVENT HANDLERS*****
//function for counting number of votes
function votesCounter(e) {
  for (var i = 0; i < allImagesArr.length; i++) {
    if (e.target.title === allImagesArr[i].name) {
      allImagesArr[i].votes++;
    }
  }

  renderAllPictures();

  selectionCount++;
  votesLeftEl.textContent = NUMBER_OF_SELECTIONS-selectionCount;
  if (selectionCount >= NUMBER_OF_SELECTIONS) {
    imageContainerEl.removeEventListener('click', votesCounter);
  }
}

function changeDisplayedPictures(e) {
  displayImg = parseInt(e.target.value);
  renderAllPictures();
}

//*****EXECUTION*****
//creating object instances for all pictures
for (var i = 0; i < IMAGE_NAMES_ARR.length; i++) {
  new Picture(IMAGE_NAMES_ARR[i]);
}

//rendering 3 first pictures
renderAllPictures();

//*****EVENT LISTENERS*****
imageContainerEl.addEventListener('click', votesCounter);
displayImgEl.addEventListener('change', changeDisplayedPictures);
