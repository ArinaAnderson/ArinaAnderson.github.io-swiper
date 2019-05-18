
var TABLET_WIDTH = 768;
var devWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var sliderBox = document.querySelector('.slider');
var slider = document.querySelector('.slides');
var slidesList = document.querySelectorAll('.slide');
var activeSlide = slidesList[0];
var slideCount;
var slidesLeft = 0;

var togglersBox = document.querySelector('.slider__togglers');
var togglerTemplate = document.querySelector('#toggler').content.querySelector('.slider__btn');
var togglersNum = devWidth < TABLET_WIDTH ? slidesList.length : slidesList.length - 2;
var togglers = [];
var togglerActive;
var togglerActiveIndex = 0;

var sWidth = devWidth < TABLET_WIDTH ? 280 : Math.floor(0.333333333333333333333 * sliderBox.offsetWidth);
var originalPos = sliderBox.offsetWidth * 0.5 - sWidth * 0.5;
var min = devWidth < TABLET_WIDTH ? ((sliderBox.offsetWidth * 0.5 - sWidth * 0.5) + (-1) * (sWidth * (slidesList.length - 1))) : Math.floor((-1) * sWidth * (slidesList.length - 3));
var max = devWidth < TABLET_WIDTH ? sliderBox.offsetWidth * 0.5 - sWidth * 0.5 : 0; 
var slidesPerView = devWidth < TABLET_WIDTH ? 1 : 3;
var minSlidesLeft = 0;
var maxSlidesLeft = devWidth < TABLET_WIDTH ? slidesList.length - 1 : slidesList.length - 3;//2;//4;//devWidth < TABLET_WIDTH ? 1 : slidesList.length - 3;
slider.style.left = originalPos + 'px';//(sliderBox.offsetWidth * 0.5 - sWidth * 0.5) + 'px';

function renderToggler() {
  var toggler = togglerTemplate.cloneNode(true);
  toggler.addEventListener('click', function (evt) {
    togglerActive.classList.remove('slider__btn--active');
    slidesLeft = togglers.indexOf(evt.target);
    togglerActive = togglers[slidesLeft];
    activeSlide = slidesList[slidesLeft];
    //togglerActive = togglers[slidesLeft];
    slider.classList.add('slides--animated');
    positionSlider();
  });
  return toggler;
}
function renderTogglers() {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < togglersNum; i++) {
    var btn = renderToggler();
    fragment.appendChild(btn);
    togglers.push(btn);
  }
  togglersBox.appendChild(fragment);
  //console.log(togglers);
  //togglerActive = togglers[togglerActiveIndex];
  togglerActive = togglers[slidesLeft];
  togglerActive.classList.add('slider__btn--active');
}

function calculateSlideWidth() {
  sWidth = devWidth < TABLET_WIDTH ? 280 : Math.floor(0.333333333333333333333 * sliderBox.offsetWidth);
	slidesList.forEach(function (item) {
	  item.style.width = sWidth + 'px';
	});
}

function defineOriginalPosition() {
  originalPos = devWidth < TABLET_WIDTH ? sliderBox.offsetWidth * 0.5 - sWidth * 0.5 : 0;
}

function positionSlider() {
  var positionLeft = devWidth < TABLET_WIDTH ? ((sliderBox.offsetWidth * 0.5 - sWidth * 0.5) + (-1) * (sWidth * slidesLeft)) : ((-1) * (sWidth * slidesLeft));
  slider.style.left = positionLeft + 'px';
}

function recalcualateMaxMin() {
  min = devWidth < TABLET_WIDTH ? (sliderBox.offsetWidth * 0.5 - sWidth * 0.5) + (-1) * sWidth * (slidesList.length - 1) : Math.floor((-1) * sWidth * (slidesList.length - 3));
  max = devWidth < TABLET_WIDTH ? sliderBox.offsetWidth * 0.5 - sWidth * 0.5 : 0;

  minSlidesLeft = 0;
  maxSlidesLeft = devWidth < TABLET_WIDTH ? slidesList.length - 1 : slidesList.length - 3;      }

function validateCoord(coord, minValue, maxValue) {//, maxValue) {
  coord = coord < minValue ? minValue : coord;
  coord = coord > maxValue ? maxValue : coord;
  return coord;
}


function slidesMouseDownHandler(evt) {
  slider.classList.remove('slides--animated');
  var initilaCoords = {
    x: evt.clientX
  };
  evt.preventDefault();
  var startX = initilaCoords.x;
  var startSlide = slidesList[0];
  var startIndex = 0;
  var startPosition = slider.offsetLeft;
  var slideWidth = slidesList[0].offsetWidth;

  function slidesMoveHandler(moveEvt) {
    var shiftCoords = {
      x: initilaCoords.x - moveEvt.clientX
    };

    var validatedX = validateCoord(slider.offsetLeft - shiftCoords.x, min, max);
    slider.style.left = validatedX + 'px';

    initilaCoords.x = moveEvt.clientX;
  }

  function slidesMouseUpHandler(upEvt) {
    upEvt.preventDefault();
    var finalX = upEvt.clientX;
    var deltaX = startX - finalX;
    
    slideCount = Math.floor((deltaX + sWidth * 0.5) / sWidth);
    if (slideCount + slidesLeft < 0) {
      slideCount = 0 - slidesLeft;
    } 
    if (slideCount + slidesLeft > maxSlidesLeft) {
      slideCount = maxSlidesLeft - slidesLeft;

    }
    slidesLeft = slidesLeft + slideCount;
    
    activeSlide = slidesList[slidesLeft];/*ADD*/

    var newPosition = startPosition - sWidth * slideCount;          

    slider.classList.add('slides--animated');

    slider.style.left = newPosition + 'px';
    console.log(togglerActive);
    togglerActive.blur();
    togglerActive.classList.remove('slider__btn--active');
    //togglers[slidesLeft].classList.add('slider__btn--active');
    //togglerActiveIndex = slidesLeft;
    togglerActive = togglers[slidesLeft];
    togglerActive.classList.add('slider__btn--active');

    document.removeEventListener('mousemove', slidesMoveHandler);
    document.removeEventListener('mouseup', slidesMouseUpHandler);
  }

  document.addEventListener('mousemove', slidesMoveHandler);
  document.addEventListener('mouseup', slidesMouseUpHandler);
}


function slidesTouchStartHandler(evt) {
  slider.classList.remove('slides--animated');
  var initilaCoords = {
    x: evt.clientX
  };
  evt.preventDefault();
  var startX = initilaCoords.x;
  var startSlide = slidesList[0];
  var startIndex = 0;
  var startPosition = slider.offsetLeft;
  var slideWidth = slidesList[0].offsetWidth;

  function slidesTouchMoveHandler(moveEvt) {
    var shiftCoords = {
      x: initilaCoords.x - moveEvt.clientX
    };

    var validatedX = validateCoord(slider.offsetLeft - shiftCoords.x, min, max);
    slider.style.left = validatedX + 'px';

    initilaCoords.x = moveEvt.clientX;
  }

  function slidesTouchEndHandler(upEvt) {
    upEvt.preventDefault();
    var finalX = upEvt.clientX;
    var deltaX = startX - finalX;
    
    slideCount = Math.floor((deltaX + sWidth * 0.5) / sWidth);
    if (slideCount + slidesLeft < 0) {
      slideCount = 0 - slidesLeft;
    } 
    if (slideCount + slidesLeft > maxSlidesLeft) {
      slideCount = maxSlidesLeft - slidesLeft;

    }
    slidesLeft = slidesLeft + slideCount;
    
    activeSlide = slidesList[slidesLeft];/*ADD*/

    var newPosition = startPosition - sWidth * slideCount;          

    slider.classList.add('slides--animated');

    slider.style.left = newPosition + 'px';
    console.log(togglerActive);
    togglerActive.blur();
    togglerActive.classList.remove('slider__btn--active');
    //togglers[slidesLeft].classList.add('slider__btn--active');
    //togglerActiveIndex = slidesLeft;
    togglerActive = togglers[slidesLeft];
    togglerActive.classList.add('slider__btn--active');

    document.removeEventListener('touchmove', slidesTouchMoveHandler);
    document.removeEventListener('touchend', slidesTouchEndHandler);
  }

  document.addEventListener('touchmove', slidesTouchMoveHandler);
  document.addEventListener('touchend', slidesTouchEndHandler);
}
/*ACTION:*/

calculateSlideWidth();
positionSlider();
renderTogglers();

slider.addEventListener('mousedown', slidesMouseDownHandler);
slider.addEventListener('touchstart', slidesTouchStartHandler);


/*togglers.forEach(function (btn) {
  btn.addEventListener('click', function (evt) {
    slidesLeft = togglers.indexOf(evt.target);
    activeSlide = slidesList[slidesLeft];
    togglerActive = togglers[slidesLeft];
    slider.classList.add('slides--animated');
    positionSlider();
  });
});*/


window.addEventListener('resize', function () {
  devWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  if (devWidth >= TABLET_WIDTH) {
    slidesLeft = slidesLeft <= slidesList.length - 1 ? slidesList.length - 3 : slidesLeft;
    //togglerActive.classList.remove('slider__btn--active');
    //togglerActive = togglers[slidesLeft];
    //togglerActive.classList.add('slider__btn--active');
  }
  togglersNum = devWidth < TABLET_WIDTH ? slidesList.length : slidesList.length - 2;
  togglers = [];
  togglersBox.innerHTML = '';
  console.log(togglerActive);
  renderTogglers();
  defineOriginalPosition();
  recalcualateMaxMin();
	calculateSlideWidth();
  positionSlider();
});


/*window.addEventListener('resize', function () {
	var devWidth; // calculation of it
	calling function here that is written above (not yet): if mobWidth then calling another not
	written yet function with arguments (centre?, fixedWidth 280px) else the same function with
	other arguments (not centre, responsive width)
});*/



