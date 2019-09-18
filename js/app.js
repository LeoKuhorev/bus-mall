'use strict';

//*****GLOBAL VARIABLES*****
//DOM
var imageContainerEl = document.getElementById('image-container');
var itemsPerPageEl = document.getElementById('items-per-page');
var votesLeftEl = document.getElementById('votes-left');
var resultsEl = document.getElementById('results');
var progressBarEl = document.getElementById('progress-bar');
var progressBarEmptyEl = document.getElementById('progress-bar-empty');
var welcomeEl = document.getElementById('welcome');

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
      renderEl('h3', divEl, 'views: ' + allImagesArr[i].views + ', votes: ' + allImagesArr[i].votes);
      renderEl('h3', divEl, '(rating: ' + allImagesArr[i].rating() + '%)');

      //create an array with items with votes and specify favorite items
      itemsWithVotesArr.push({index: i, favorite: true});
    } else if (allImagesArr[i].votes > 0) {
      itemsWithVotesArr.push({index: i, favorite: false});
    }
  }
  resultsEl.scrollIntoView();
}

//function for rendering chart to the page
function renderChart() {

  //creating object literal with chart settings
  var chartSetting = {
    namesArr: [],
    votesArr: [],
    viewsArr: [],
    ratingArr: [],
    colorsViewsArr: [],
    colorsVotesArr: [],
    borderViewsArr: [],
    borderVotesArr: [],
    dotColorArr: []
  };

  //for all elements with votes create chart settings
  for (var i = 0; i < itemsWithVotesArr.length; i++) {
    chartSetting.namesArr.push(capitalize(allImagesArr[itemsWithVotesArr[i].index].name));
    chartSetting.votesArr.push(allImagesArr[itemsWithVotesArr[i].index].votes);
    chartSetting.viewsArr.push(allImagesArr[itemsWithVotesArr[i].index].views);
    chartSetting.ratingArr.push(allImagesArr[itemsWithVotesArr[i].index].rating());

    //assign different color for favorite items
    if (itemsWithVotesArr[i].favorite) {
      chartSetting.colorsViewsArr.push('rgba(121, 224, 68, 0.6)');
      chartSetting.colorsVotesArr.push('rgba(255, 0, 0, 0.9)');
      chartSetting.borderViewsArr.push('rgba(28, 135, 197, 1.0)');
      chartSetting.borderVotesArr.push('rgba(138, 5, 5, 1.0)');
      chartSetting.dotColorArr.push('rgba(255, 0, 0, 1.0)');
    } else {
      chartSetting.colorsViewsArr.push('rgba(97, 198, 255, 0.5)');
      chartSetting.colorsVotesArr.push('rgba(255, 0, 0, 0.6)');
      chartSetting.borderViewsArr.push('rgba(97, 198, 255, 1.0)');
      chartSetting.borderVotesArr.push('rgba(255, 0, 0, 1.0)');
      chartSetting.dotColorArr.push('rgba(97, 14, 255, 1.0)');
    }
  }

  //render <canvas> element to the page and build the chart
  var divEl = renderEl('div', resultsEl);
  renderEl('h4', divEl, 'PLEASE SEE THE ITEMS YOU PICKED:');
  divEl.className = 'chart-container';
  var chartEl = renderEl('canvas', divEl);
  // chartEl.getContext('2d'); - why do we need this at all?

  // eslint-disable-next-line no-undef
  Chart.defaults.global.defaultFontFamily = 'Poiret One';
  // eslint-disable-next-line no-undef
  new Chart(chartEl, {
    type: 'bar',
    data: {
      labels: chartSetting.namesArr,
      datasets: [
        {
          type: 'line',
          label: 'rating',
          backgroundColor: 'rgba(97, 14, 255, 1.0)',
          borderColor: chartSetting.dotColorArr,
          fill: false,
          borderWidth: 2,
          yAxisID: 'rating',
          data: chartSetting.ratingArr
        },
        {
          label: 'votes',
          backgroundColor: chartSetting.colorsVotesArr,
          borderColor: chartSetting.borderVotesArr,
          borderWidth: 1,
          yAxisID: 'views/votes',
          data: chartSetting.votesArr
        },
        {
          label: 'views',
          backgroundColor: chartSetting.colorsViewsArr,
          borderColor: chartSetting.borderViewsArr,
          borderWidth: 1,
          yAxisID: 'views/votes',
          data: chartSetting.viewsArr
        }
      ]
    },

    //chart options
    options: {
      legend: {
        display: false
      },
      tooltips: {
        mode: 'label',
        titleFontSize: 18,
        bodyFontSize: 16
      },
      scales: {
        yAxes: [{
          id: 'views/votes',
          position: 'left',
          stacked: false,
          ticks: {
            beginAtZero: true,
            fontSize: 18,
            max: Math.max.apply(Math, chartSetting.viewsArr) + 1
          },
          scaleLabel: {
            display: true,
            labelString: 'VIEWS/VOTES',
            fontSize: 24,
            fontStyle: 'bold'
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
            labelString: 'RATING',
            fontSize: 24,
            fontStyle: 'bold'
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

  //render button for showing list results
  var buttonEl = renderEl('button', divEl, 'DISPLAY LIST');
  buttonEl.className = 'results-button';
  buttonEl.addEventListener('click', renderList);
}

//function for rendering list with items
function renderList() {

  //removing button element
  var buttonEl = document.getElementsByClassName('results-button')[0];
  buttonEl.remove();

  resultsEl.style.paddingBottom = '30px';
  var h4El = renderEl('h4', resultsEl, 'HERE\'S THE LIST OF ITEMS YOU VOTED FOR:');
  var ulEl = renderEl('ul', resultsEl);

  for (var i = 0; i < itemsWithVotesArr.length; i++) {
    var string = `${capitalize(allImagesArr[itemsWithVotesArr[i].index].name)}: ${allImagesArr[itemsWithVotesArr[i].index].votes} vote(s) / ${allImagesArr[itemsWithVotesArr[i].index].views} view(s) (rating: ${allImagesArr[itemsWithVotesArr[i].index].rating()}%)`;
    renderEl('li', ulEl, string);
  }
  h4El.scrollIntoView();
}

//function for saving settings
function saveSettings() {

  //object that holds all settings
  var savedSettings = {
    savedItemsArr: [],
    savedVotesCount: 0,
    savedItemsPerPage: 0
  };

  //save all items with their views and votes and push them into the object above
  for (var i = 0; i < allImagesArr.length; i++) {
    var savedItem = {
      // name: allImagesArr[i].name,
      views: allImagesArr[i].views,
      votes: allImagesArr[i].votes,
    };
    savedSettings.savedItemsArr[i] = savedItem;
  }
  savedSettings.savedVotesCount = votesCount;
  savedSettings.savedItemsPerPage = itemsPerPage;

  //stringify and save the settings object in local storage
  var savedSettingsStringified = JSON.stringify(savedSettings);
  localStorage.setItem('savedSettings', savedSettingsStringified);
}

//function for restoring settings
function restoreSettings() {
  var restoredSettings = localStorage.getItem('savedSettings');
  var savedSettings = JSON.parse(restoredSettings);

  welcomeEl.textContent = 'WELCOME BACK TO THE BUS MALL SURVEY';

  for (var i = 0; i < allImagesArr.length; i++) {
    allImagesArr[i].views = savedSettings.savedItemsArr[i].views;
    allImagesArr[i].votes = savedSettings.savedItemsArr[i].votes;
  }
  votesCount = savedSettings.savedVotesCount;
  itemsPerPage = itemsPerPageEl.value = savedSettings.savedItemsPerPage;

}

//*****EVENT HANDLERS*****
//function for counting number of votes
function votesHandler(e) {
  if (e.target.tagName === 'IMG') {
    votesCount++;
    for (var i = 0; i < allImagesArr.length; i++) {
      if (e.target.title === capitalize(allImagesArr[i].name)) {
        allImagesArr[i].votes++;
      }
    }

    //save settings
    saveSettings();

    //when user spends all votes - render list with results
    if (votesCount >= VOTES) {
      imageContainerEl.removeEventListener('click', votesHandler);
      favoriteItem();
      renderChart();
      localStorage.clear();
    }

    //render new pictures and progress bar
    renderAllPictures();
    renderProgressBar();
  }
}

//function for changing items per page by user request
function changeDisplayedPictures(e) {

  //reduce views count for items that are going to be replaced
  for (var i = (indexArr.length - itemsPerPage); i < indexArr.length; i++) {
    allImagesArr[indexArr[i]].views --;
  }
  itemsPerPage = parseInt(e.target.value);
  renderAllPictures();
  imageContainerEl.scrollIntoView();

  //save settings
  if ((VOTES - votesCount) > 0) {
    saveSettings();
  } else {
    localStorage.clear();
  }
}

//*****EXECUTION*****
//creating object instances for all pictures
for (var i = 0; i < IMAGE_NAMES_ARR.length; i++) {
  new Item(IMAGE_NAMES_ARR[i]);
}

//if local storage contains information about current user, change settings
if (localStorage['savedSettings']) {
  restoreSettings();
}

//rendering initial pictures and progress bar
renderAllPictures();
renderProgressBar();

//*****EVENT LISTENERS*****
imageContainerEl.addEventListener('click', votesHandler);
itemsPerPageEl.addEventListener('change', changeDisplayedPictures);
