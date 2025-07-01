// main variables that used in code
const slideContainer = document.querySelector('.slide__container')
const rotateBlock = document.querySelector('.rotate__block');
const agreementButton = document.querySelector('.agree');
const nextSlideButton = document.querySelector('.arrow--next');
const prevSlideButton = document.querySelector('.arrow--prev');

// additional variables for timeout Ids
let nextButtonTimeout;
let prevButtonTimeout;
let lastSlideActionTimeout;

// additional variables for arrows
const hiddenArrowClass = 'hidden';
let nextArrowDelay = 2.5;

// additional varibles for slides
const totalSlideAmount = 22;
const pathNames = Array.from(
  { length: totalSlideAmount }, (_, i) => ({ count: i + 1, pathName:`./slides/slide--${i + 1}.html` })
);

// additional function for detecting correct font-size
function heightDetect(percent) {
  const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  return (percent * (height - 6)) / 100;
}
function widthDetect(percent) {
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  return (percent * width) / 100;
}
function setResponsiveFontSize() {
  $('.slide__container').css({
    'font-size': `clamp(1px, ${heightDetect(0.925925)}px,${widthDetect(0.520833)}px)`
  });
  $('.arrows').css({
    'font-size': `clamp(1px, ${heightDetect(0.925925)}px,${widthDetect(0.520833)}px)`
  });
}

// function for action after last slide
function lastSlideAction() {
  let id = $('#presentation', window.parent.document).attr('data-id');
  let $url = $('#presentation', window.parent.document).attr('data-request-url');
  let href = $('#presentation', window.parent.document).attr('data-href');
  let $token = $('meta[name="csrf-token"]', window.parent.document).attr('content');
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $token
    }
  });
  $.ajax({
    type: "POST",
    url: $url,
    data: {"id": id},
    success: function (data) {
      if (data !== false) {
        parent.location.href = href;
      }
    },
    error: function (data) {
      console.log(data);
    }
  });
}

// function that animate number from 0 to correct num
function animateNumber(delay, className) {
  const allElements = document.querySelectorAll(`${className}[data-number]`);

  allElements.forEach(el => {
    const targetNumber = Number(el.getAttribute('data-number'));

    gsap.to(el, {
      duration: 2,
      innerHTML: targetNumber,
      delay,
      onUpdate: () => {
        el.innerHTML = Math.round(el.innerHTML);
      },
      onComplete: () => {
        el.innerHTML = targetNumber;
      }
    });
  });
}

// function that type text from scretch
function typewriterEffect(selector, duration, delay) {
  const el = document.querySelector(selector);
  const innerText = el.getAttribute('data-text');

  gsap.to(el, {
    duration: duration,
    text: innerText,
    ease: 'none',
    delay,
  });
}

// object that store manipulations with slides
const slideActions = {
  1: () => {
    $('.arrow--next').addClass('arrow--white');
    gsap.from('.slide--1__center h1', { opacity: 0, duration: 0.65, delay: 1, y: '15%' });
    gsap.from('.slide--1__center h2', { opacity: 0, duration: 0.75, delay: 1.5, y: '15%' });
    nextArrowDelay = 2.5;
  },
  2: () => {
    $('.arrow--next').addClass('arrow--white');
    $('.arrow--prev').removeClass('arrow--white');
    gsap.from('.slide--2__title', { opacity: 0, duration: 0.65, delay: 1, y: '15%' });
    gsap.from('.slide--2__center-decorator', { opacity: 0, duration: 0.65, delay: 1.5 });
    gsap.from('.slide--2__left-content', { opacity: 0, duration: 0.75, delay: 2, x: '-25%' });
    gsap.from('.slide--2__right-content', { opacity: 0, duration: 0.75, delay: 2, x: '25%' });
    
    $('.slide--2__left img, .slide--2__right img').on('click', function() {
      const container = $(this).closest('.slide--2__left, .slide--2__right');
      container.addClass('active');

      gsap.to(container.find('h3'), { opacity: 1, duration: 0.75, delay: 0.5, y: 0 });
      gsap.to(container.find('.percent'), { opacity: 1, duration: 0.75, delay: 1, y: 0 });
      gsap.to(container.find('p.conclusion'), { opacity: 1, duration: 0.75, delay: 1.5, y: 0 });

      if ($('.slide--2__left').hasClass('active') && $('.slide--2__right').hasClass('active')) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2.5 * 1000);
      }
    })
  },
  3: () => {
    $('.arrow--next').removeClass('arrow--white');
    $('.arrow--prev').addClass('arrow--white');

    $('.slide--3__block img').on('click', function() {
      $(this).parent().addClass('active');

      gsap.to($(this).parent().find('div.text'), { opacity: 1, duration: 0.75, delay: 0.5, x: 0 });

      if ($('.slide--3__block.active').length === 3) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1.5 * 1000);
      }
    })
  },
  4: () => {
    $('.arrow--next').removeClass('arrow--white');
    $('.arrow--prev').removeClass('arrow--white');

    $('.slide--4__card').on('click', function() {
      $(this).addClass('flipped');

      if ($('.slide--4__card.flipped').length === 6) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1 * 1000);
      }
    });
  },
  5: () => {
    $('.arrow--next').addClass('arrow--white');
    $('.arrow--prev').addClass('arrow--white');

    $('.slide--5__click').on('click', function() {
      $(this).addClass('active');
      const prefix = $(this).attr('class').split(' ')[1].split('--').pop();

      gsap.to($('.slide--5__content').find(`.slide--5__text--${prefix}`), { opacity: 1, duration: 0.75, delay: 0.5 });

      if ($('.slide--5__click.active').length === 3) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1.5 * 1000);
      }
    })

  },
  6: () => {
    $('.arrow--next').removeClass('arrow--white');
    $('.arrow--prev').removeClass('arrow--white');
    gsap.from('.slide--6 h2', { opacity: 0, duration: 0.65, delay: 1, x: '-25%' });
    gsap.from('.slide--6__top-icon', { opacity: 0, duration: 0.75, delay: 1, x: '45%' });
    gsap.from('.slide--6__left', { opacity: 0, duration: 0.65, delay: 1.6, x: '-35%' });
    gsap.from('.slide--6__right', { opacity: 0, duration: 0.75, delay: 1.6, x: '35%' });
    nextArrowDelay = 2.6;
  },
  7: () => {
    gsap.from('.slide--7__skin--1, .slide--7__block--1', { opacity: 0, duration: 0.75, delay: 1, x: '30%' });
    gsap.from('.slide--7__skin--2, .slide--7__block--2', { opacity: 0, duration: 0.65, delay: 1.6, x: '-30%' });
    nextArrowDelay = 2.6;
  },
  8: () => {
    $('.arrow--prev').removeClass('arrow--white');
    
    $('.slide--8__block p').on('click', function() {
      $(this).parent().addClass('active');

      gsap.to($(this).parent().find('.line--1'), { opacity: 1, duration: 0.5, delay: 0.5, scaleX: 1 });
      gsap.to($(this).parent().find('.line--2'), { opacity: 1, duration: 0.5, delay: 1, scaleY: 1 });
      gsap.to($(this).parent().find('.line--3'), { opacity: 1, duration: 0.5, delay: 1.5, scaleX: 1 });
      gsap.to($(this).parent().find('.triangle'), { opacity: 1, duration: 0.5, delay: 2 });

      if ($('.slide--8__block.active').length === 2) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 3 * 1000);
      }
    })
  },
  9: () => {
    $('.arrow--next').removeClass('arrow--white');
    $('.arrow--prev').addClass('arrow--white');
    
    gsap.from('.slide--9__icon--1', { opacity: 0, duration: 0.65, delay: 1, x: '-25%' });
    gsap.from('.slide--9__icon--2', { opacity: 0, duration: 0.65, delay: 1.5, x: '-25%' });
    gsap.from('.slide--9__icon--3', { opacity: 0, duration: 0.65, delay: 2, x: '-25%' });
    gsap.from('.slide--9__arrow', { opacity: 0, duration: 0.65, delay: 2.5 });
    gsap.from('.slide--9__icon--4', { opacity: 0, duration: 0.65, delay: 3, x: '-25%' });
    gsap.from('.slide--9__icon--5', { opacity: 0, duration: 0.65, delay: 3.5, x: '-25%' });
    gsap.from('.slide--9__icon--6', { opacity: 0, duration: 0.65, delay: 4, x: '-25%' });
    nextArrowDelay = 5;
  },
  10: () => {
    $('.arrow--next').addClass('arrow--white');
    $('.arrow--prev').addClass('arrow--white');
    
    gsap.from('.slide--10__right-content p.num--1, .slide--10__right-content p.text--1', { opacity: 0, duration: 0.65, delay: 1, y: '30%' });
    gsap.from('.slide--10__right-content p.num--2, .slide--10__right-content p.text--2', { opacity: 0, duration: 0.65, delay: 1.5, y: '30%' });
    gsap.from('.slide--10__left-content', { opacity: 0, duration: 0.65, delay: 2.5, x: '35%' });
    nextArrowDelay = 3.5;
  },
  11: () => {
    $('.arrow--next').removeClass('arrow--white');
    $('.arrow--prev').removeClass('arrow--white');

    $('.slide--11__card img').on('click', function() {
      $(this).parent().addClass('active');

      gsap.to($(this).parent().find('p.title'), { opacity: 1, duration: 0.75, delay: 0.5 });
      gsap.to($(this).parent().find('p.subtitle'), { opacity: 1, duration: 0.75, delay: 1, y: 0 });

      if ($('.slide--11__card.active').length === 4) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2 * 1000);
      }
    })
  },
  12: () => {
    $('.arrow--next').addClass('arrow--white');
    $('.arrow--prev').addClass('arrow--white');

    $('.slide--12__left').on('click', function() {
      $(this).addClass('active');

      gsap.to('.slide--12__left-content', { opacity: 1, duration: 0.75, delay: 0.5 });
      gsap.to('.slide--12__right-content', { opacity: 1, duration: 0.75, delay: 1.25, y: 0, x: 0 });

      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, 2.25 * 1000);
    })
  },
  13: () => {
    $('.arrow--prev').removeClass('arrow--white');
    $('.slide--13__left p.formula').on('click', function() {
      $(this).addClass('active');

      gsap.to($(this).find('span'), { opacity: 1, duration: 0.75, delay: 0.5 });
      gsap.to('.slide--13__right-content', { opacity: 1, duration: 0.75, delay: 1.25, y: 0 });

      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, 2.25 * 1000);
    })
  },
  14: () => {
    $('.arrow--prev').addClass('arrow--white');
    gsap.from('.slide--14__right h2', { opacity: 0, duration: 0.65, delay: 1, x: '25%' });
    gsap.from('.slide--14__right p', { opacity: 0, duration: 0.65, delay: 1.5, x: '25%' });
    gsap.from('.slide--14__right ul', { opacity: 0, duration: 0.65, delay: 2, x: '25%' });
    nextArrowDelay = 3;
  },
  15: () => {
    $('.arrow--next').addClass('arrow--white');
    $('.arrow--prev').addClass('arrow--white');
    gsap.from('.slide--15__right h2', { opacity: 0, duration: 0.65, delay: 1, x: '25%' });
    gsap.from('.slide--15__right p:not(.note)', { opacity: 0, duration: 0.65, delay: 1.5, x: '25%' });
    gsap.from('.slide--15__right ul', { opacity: 0, duration: 0.65, delay: 2, x: '25%' });
    nextArrowDelay = 3;
  },
  16: () => {
    $('.arrows').removeClass('to-top');
    $('.arrow--next').removeClass('arrow--white');
    $('.arrow--prev').removeClass('arrow--white');
    $('.slide--16__num').on('click', function() {
      $(this).addClass('active');

      gsap.to($(this).find('p'), { opacity: 1, duration: 0.75, delay: 0.5 });

      if ($('.slide--16__num.active').length === 3) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1.5 * 1000);
      }
    })
  },
  17: () => {
    $('.arrows').addClass('to-top');
    $('.arrow--next').addClass('arrow--white');
    $('.arrow--prev').addClass('arrow--white');

    $('.slide--17__bottle img').on('click', function() {
      $(this).parent().addClass('active');

      gsap.to($(this).parent().find('p.description'), { opacity: 1, duration: 0.75, delay: 0.5, y: 0 });
      gsap.to($(this).parent().find('p.plus'), { opacity: 1, duration: 0.75, delay: 0.5, y: 0 });

      if ($('.slide--17__bottle.active').length === 3) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1.5 * 1000);
      }
    })
  },
  18: () => {
    $('.arrows').removeClass('to-top');
    $('.arrow--next').removeClass('arrow--white');
    $('.arrow--prev').removeClass('arrow--white');

    $('.slide--18__bottle img').on('click', function() {
      $(this).parent().addClass('active');

      gsap.to('.slide--18__cards, .slide--18__right-content', { opacity: 1, duration: 0.75, delay: 0.5, x: 0 });

      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, 1.5 * 1000);
    })
  },
  19: () => {
    $('.arrow--next').addClass('arrow--white');
    $('.arrow--prev').addClass('arrow--white');
    gsap.from('.slide--19__right-content', { opacity: 0, duration: 0.65, delay: 1, y: '-25%' });
    gsap.from('.slide--19__left-content', { opacity: 0, duration: 0.65, delay: 1.5, y: '25%' });
    nextArrowDelay = 2.5;
  },
  20: () => {
    $('.arrow--next').removeClass('arrow--white');
    $('.arrow--prev').addClass('arrow--white');
    $('.slide--20__left img').on('click', function() {
      $(this).parent().addClass('active');

      gsap.to('.slide--20__right-content', { opacity: 1, duration: 0.75, delay: 0.5, x: 0 });

      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, 1.5 * 1000);
    })
  },
  21: () => {
    $('.arrow--prev').removeClass('arrow--white');
    clearTimeout(lastSlideActionTimeout);
    animateNumber(0.75, '.slide--21__percent p.num span');
    nextArrowDelay = 3.25;
  },
  22: () => {
    $('.arrow--prev').addClass('arrow--white');

    $('.slide--22__bottles-wrapper').on('click', function() {
      $(this).addClass('active');

      gsap.to($(this).find('.slide--22__bottle'), { opacity: 1, duration: 0.75, delay: 0.5, scale: 1 });
      gsap.to($(this).parent().find('.decorator'), { opacity: 1, duration: 0.75, delay: 1, scale: 1 });
      gsap.to($(this).parent().find('> p'), { opacity: 1, duration: 0.75, delay: 1.5 });

      if ($('.slide--22__bottles-wrapper.active').length === 5) {
        nextButtonTimeout = setTimeout(() => {
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2.5 * 1000);

        lastSlideActionTimeout = setTimeout(() => {
          lastSlideAction();
        }, 8.5 * 1000);
      }
    })
  },
}
// function that add animation for element
function animateSlide(slideNum = 1) {
  gsap.from('.slide', { opacity: 0, duration: 0.75 });

  slideActions[slideNum]();
}
// function that detect oriental of device
function updateRotateBlockVisibility() {
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;

  $(rotateBlock).toggleClass('visible', isPortrait);
}
// function that load slide without reloading page
async function loadComponent(componentPathName, slideNum) {
  const response = await fetch(componentPathName);
  const data = await response.text();

  slideContainer.innerHTML = data;
  animateSlide(slideNum);
}
// function that update info about prev/next button
function updateNavigationButtons(currentSlide) {
  clearTimeout(nextButtonTimeout);
  clearTimeout(prevButtonTimeout);

  $(nextSlideButton).addClass(hiddenArrowClass);
  $(prevSlideButton).addClass(hiddenArrowClass);

  switch (currentSlide) {
    case 0:
      break;
    case 1:
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
      }, nextArrowDelay * 1000);
      break;
    case 2:
    case 3:
    case 4:
    case 5:
    case 8:
    case 11:
    case 12:
    case 13:
    case 16:
    case 17:
    case 18:
    case 20:
    case 22:
      break;
    case totalSlideAmount:
      $(prevSlideButton).removeClass(hiddenArrowClass);
      break;
    default:
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, nextArrowDelay * 1000);
  }
}
// function that change slide on the screen
async function changeSlide(direction) {
  const currentSlideNum = slideContainer.getAttribute('data-current-slide');

  let newSlideNum;

  if (direction === 'next') {
    newSlideNum = Number(currentSlideNum) + 1;
  } else if (direction === 'prev') {
    newSlideNum = Number(currentSlideNum) - 1;
  }

  const { pathName } = pathNames.find(pathNameInfo => pathNameInfo.count === +newSlideNum);

  await loadComponent(pathName, newSlideNum);

  slideContainer.setAttribute('data-current-slide', newSlideNum);
  updateNavigationButtons(newSlideNum);
}

//window and document listeners
$(document).ready(function () {
  setResponsiveFontSize();
  updateRotateBlockVisibility();
});
$(window).on('resize', function () {
  setResponsiveFontSize();
  updateRotateBlockVisibility();
});
$(window).on('orientationchange', function () {
  updateRotateBlockVisibility();
});

// button listeners
$(agreementButton).on('click', () => {
  loadComponent(pathNames[0].pathName);
  slideContainer.setAttribute('data-current-slide', 1);
  updateNavigationButtons(1);
});
$(nextSlideButton).on('click', () => {
  changeSlide('next')
})
$(prevSlideButton).on('click', () => {
  changeSlide('prev')
});
