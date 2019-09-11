'use strict';

//*****GLOBAL VARIABLES*****
//DOM
var imageContainerEl = document.getElementById('image-container');
var img1El = document.getElementById('img-1');
var img2El = document.getElementById('img-2');
var img3El = document.getElementById('img-3');

//array with all image names
var IMAGE_NAMES_ARR = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];

//array with all image objects
var allImagesArr = [];

//array with last 6 image indexes
var indexArr = [];

//*****FUNCTIONS*****
//object constructor function
function Picture(name) {
  this.src = `img/${name}.jpg`;
  this.name = name;

  allImagesArr.push(this);
}

//function for generating random number 0 to max (max not inluded)
function generateRandom (max) {
  return Math.floor(Math.random() * max);
}

//function for assigning 6 unique random numbers
function uniqueIndex(index) {
  index = generateRandom(allImagesArr.length);
  for (var i = 0; i < indexArr.length; i++) {
    while (index === indexArr[i]) {
      index = generateRandom(allImagesArr.length);
    }
  }
  if (indexArr.length >= 6) {
    indexArr.shift();
  }
  indexArr.push(index);
  return index;
}

//function for rendering image to the page
function renderImage(image, object) {
  image.src = object.src;
  image.alt = object.name;
  image.title = object.name;
}

//function for generating 3 random pictures and rendering them to the page
function generatePicture(element) {
  var index = uniqueIndex(index);
  renderImage(element, allImagesArr[index]);
}

//function for rendering all pictures
function renderAllPictures() {
  generatePicture(img1El);
  generatePicture(img2El);
  generatePicture(img3El);

  console.table(indexArr);
}

//*****EXECUTION*****
//creating object instances for all pictures
for (var i = 0; i < IMAGE_NAMES_ARR.length; i++) {
  new Picture(IMAGE_NAMES_ARR[i]);
}

//rendering 3 first pictures
renderAllPictures();

//*****EVENT LISTENERS*****
imageContainerEl.addEventListener('click', renderAllPictures);
