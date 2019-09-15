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

//array with indexes of items with votes greater than 0
var itemsWithVotesArr = [];

//defining number of user votes
var VOTES = 25;
var votesCount = 0;

//items per page (default value - 6)
var itemsPerPage = 6;

//*****FUNCTIONS*****
//object constructor function
function Item(name) {
  this.src = `img/${name}.jpg`;
  this.name = name;
  this.votes = 0;
  this.views = 0;

  allImagesArr.push(this);
}

//object ptototype for rendering each image to the page
Item.prototype.renderImage = function(parent) {
  var imageEl = document.createElement('img');
  imageEl.src = this.src;
  imageEl.alt = imageEl.title = capitalize(this.name);
  parent.appendChild(imageEl);
  this.views ++;
  return imageEl;
};

//object ptototype for calculating each image rating (votes to views ratio)
Item.prototype.rating = function() {
  if (this.views > 0) {
    return (this.votes / this.views * 100).toFixed(2);
  } else {
    return 0;
  }
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
  while (indexArr.length >= itemsPerPage * 2) {
    indexArr.shift();
  }
  while (indexArr.includes(index)) {
    index = generateRandom(allImagesArr.length);
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
  var votesLeft =  VOTES - votesCount;

  //draw '|' for every vote that user has left (will get green, yellow and red later)
  for (var i = 0; i < votesLeft; i++) {
    string += '|';
  }

  //draw '|' for every vote user spent (will be gray)
  for (i = 0; i < votesCount; i++) {
    stringEmpty += '|';
  }

  //render number of votes left and progress bar to the page
  votesLeftEl.textContent = votesLeft;
  progressBarEl.textContent = string;
  progressBarEmptyEl.textContent = stringEmpty;

  //assign colors to the votes left (over 50% - green, 10%..50% - yellow, under 10% - red)
  if (votesLeft > 0.5 * VOTES) {
    progressBarEl.className = 'green';
  } else if (votesLeft > 0.1 * VOTES) {
    progressBarEl.className = 'yellow';
  } else {
    progressBarEl.className = 'red';
  }
}

//function for rendering items with highest rating
function favoriteItem() {

  //get the maximum value of rating property for every object in array and return it with 2 decimals
  var maxRating = Math.max.apply(Math, allImagesArr.map(function(object) { return object.rating(); })).toFixed(2);
  console.log(maxRating);

  itemsWithVotesArr.length = 0;

  //render heading and image container
  renderEl('h4', resultsEl, 'YOUR FAVORITE ITEM: ');
  var favImageContainerEl = renderEl('div', resultsEl);
  favImageContainerEl.id = 'favimage-container';


  //check how many pictures have the highest rating and render those to the page with their names and rating
  for (var i = 0; i < allImagesArr.length; i++) {
    if (allImagesArr[i].rating() === maxRating) {
      var divEl = renderEl('div', favImageContainerEl);
      renderEl('h3', divEl, capitalize(allImagesArr[i].name));
      var imgEl = allImagesArr[i].renderImage(divEl);
      imgEl.className = 'shake';
      allImagesArr[i].views--;
      renderEl('h3', divEl, '(rating: ' + allImagesArr[i].rating() + '%)');
    }

    //while we're in the loop push all items with votes into itemsWithVotesArr
    if (allImagesArr[i].votes > 0) {
      itemsWithVotesArr.push(i);
    }
  }
  resultsEl.scrollIntoView();
}

//function for rendering chart to the page
function renderChart() {

  //getting the names, views and votes for items with votes only for chart settings
  var namesArr = [], votesArr = [], viewsArr = [], ratingArr = [];
  for (var i = 0; i < itemsWithVotesArr.length; i++) {
    namesArr.push(capitalize(allImagesArr[itemsWithVotesArr[i]].name));
    votesArr.push(allImagesArr[itemsWithVotesArr[i]].votes);
    viewsArr.push(allImagesArr[itemsWithVotesArr[i]].views);
    ratingArr.push(allImagesArr[itemsWithVotesArr[i]].rating());
  }

  //render <canvas> element to the page and build the chart
  var divEl = renderEl('div', resultsEl);
  renderEl('h4', divEl, 'PLEASE SEE THE ITEMS YOU PICKED:');
  divEl.className = 'chart-container';
  var chartEl = renderEl('canvas', divEl);
  chartEl.getContext('2d');

  // eslint-disable-next-line no-undef
  Chart.defaults.global.defaultFontFamily = 'Poiret One';
  // eslint-disable-next-line no-undef
  new Chart(chartEl, {
    type: 'bar',
    data: {
      labels: namesArr,
      datasets: [
        {
          type: 'line',
          label: 'rating',
          borderColor: 'rgba(97, 14, 255, 1.0)',
          borderWidth: 2,
          yAxisID: 'rating',
          data: ratingArr
        },
        {
          label: 'votes',
          backgroundColor: 'rgba(255, 0, 0, 0.6)',
          borderColor: 'rgba(255, 0, 0, 1.0)',
          borderWidth: 1,
          yAxisID: 'views',
          data: votesArr
        },
        {
          label: 'views',
          backgroundColor: 'rgba(97, 198, 255, 0.5)',
          borderColor: 'rgba(97, 198, 255, 1.0)',
          borderWidth: 1,
          yAxisID: 'views',
          data: viewsArr
        }
      ]
    },

    options: {
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          id: 'views',
          position: 'left',
          stacked: false,
          ticks: {
            beginAtZero: true,
            fontSize: 18,
            max: Math.max.apply(Math, viewsArr) + 1
          },
          scaleLabel: {
            display: true,
            labelString: 'views/votes',
            fontSize: 24
          }
        },
        {
          id: 'rating',
          position: 'right',
          stacked: false,
          ticks: {
            beginAtZero: true,
            fontSize: 18,
            callback: function(value) {
              return value + '%';
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'rating',
            fontSize: 24
          },
          gridLines: {
            display: false,
          }
        }],
        xAxes: [{
          stacked: true,
          ticks: {
            fontSize: 18
          }
        }]
      }
    }
  });
}

//function for rendering list with items
function renderVotes() {
  resultsEl.style.paddingBottom = '30px';
  renderEl('h4', resultsEl, 'HERE\'S THE LIST OF ITEMS YOU VOTED FOR:');
  var ulEl = renderEl('ul', resultsEl);

  for (var i = 0; i < itemsWithVotesArr.length; i++) {
    var string = `${capitalize(allImagesArr[itemsWithVotesArr[i]].name)}: ${allImagesArr[itemsWithVotesArr[i]].votes} vote(s) / ${allImagesArr[itemsWithVotesArr[i]].views} view(s) (rating: ${allImagesArr[itemsWithVotesArr[i]].rating()}%)`;
    renderEl('li', ulEl, string);
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
    renderChart();
    renderVotes();
  }

  //render new pictures and progress bar
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
  new Item(IMAGE_NAMES_ARR[i]);
}

//rendering initial pictures and progress bar
renderAllPictures();
renderProgressBar();

//*****EVENT LISTENERS*****
imageContainerEl.addEventListener('click', votesHandler);
itemsPerPageEl.addEventListener('change', changeDisplayedPictures);
