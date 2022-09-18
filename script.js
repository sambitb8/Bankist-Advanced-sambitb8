'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const buttonScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.getElementById(`section--1`);
const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabsContent = document.querySelectorAll(`.operations__content`);
const nav = document.querySelector(`.nav`);
const header = document.querySelector(`.header`);
const navHeight = nav.getBoundingClientRect().height;
const sections = document.querySelectorAll(`.section`);
const imgTargets = document.querySelectorAll(`img[data-src]`);
const btnRight = document.querySelector(`.slider__btn--right`);
const btnLeft = document.querySelector(`.slider__btn--left`);
const slides = document.querySelectorAll(`.slide`);
const dotContainer = document.querySelector(`.dots`);

let currSlide = 0;
const maxSlide = slides.length - 1;

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener(`click`, openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

buttonScrollTo.addEventListener(`click`, e =>
  section1.scrollIntoView({ behavior: `smooth` })
);

document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  e.preventDefault();

  if (e.target.classList.contains(`nav__link`)) {
    const id = e.target.getAttribute(`href`);

    document.querySelector(id).scrollIntoView({ behavior: `smooth` });
  }
});

tabsContainer.addEventListener(`click`, function (e) {
  const clicked = e.target.closest(`.operations__tab`);

  if (!clicked) return;

  tabs.forEach(tab => tab.classList.remove(`operations__tab--active`));

  clicked.classList.add(`operations__tab--active`);

  tabsContent.forEach(content =>
    content.classList.remove(`operations__content--active`)
  );

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

const handleHover = function (e) {
  if (e.target.classList.contains(`nav__link`)) {
    const targetLink = e.target;
    const logo = targetLink.closest(`.nav`).querySelector(`img`);
    const sibLinks = targetLink.closest(`.nav`).querySelectorAll(`.nav__link`);
    sibLinks.forEach(sibling => {
      if (sibling !== targetLink) {
        sibling.style.opacity = this;
      }
      logo.style.opacity = this;
    });
  }
};

nav.addEventListener(`mouseover`, handleHover.bind(0.3));

nav.addEventListener(`mouseout`, handleHover.bind(1));

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add(`sticky`);
  } else {
    nav.classList.remove(`sticky`);
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove(`section--hidden`);

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sections.forEach(function (section) {
  section.classList.add(`section--hidden`);
  sectionObserver.observe(section);
});

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener(`load`, function () {
    entry.target.classList.remove(`lazy-img`);
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
});

imgTargets.forEach(function (img) {
  imgObserver.observe(img);
});

const goToSlide = function (curr) {
  slides.forEach((slide, idx) => {
    slide.style.transform = `translateX(${(idx - curr) * 100}%)`;
  });
};

const prevSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlide;
  } else {
    currSlide--;
  }
  goToSlide(currSlide);
  activateDots(currSlide);
};

const nextSlide = function () {
  if (currSlide === maxSlide) {
    currSlide = 0;
  } else {
    currSlide++;
  }
  goToSlide(currSlide);
  activateDots(currSlide);
};

btnLeft.addEventListener(`click`, prevSlide);

btnRight.addEventListener(`click`, nextSlide);

const createDots = function () {
  slides.forEach((slide, idx) => {
    let htmlCode = `<button class = 'dots__dot' data-slide = '${idx}'></button>`;
    dotContainer.insertAdjacentHTML(`beforeend`, htmlCode);
  });
};

const activateDots = function (curr) {
  dotContainer
    .querySelectorAll(`.dots__dot`)
    .forEach(dot => dot.classList.remove(`dots__dot--active`));

  dotContainer
    .querySelector(`.dots__dot[data-slide = '${curr}']`)
    .classList.add(`dots__dot--active`);
};

document.addEventListener(`keydown`, function (e) {
  e.key === `ArrowRight` && nextSlide();
  e.key === `ArrowLeft` && prevSlide();
});

dotContainer.addEventListener(`click`, function (e) {
  if (e.target.classList.contains(`dots__dot`)) {
    const cur = e.target.dataset.slide;

    goToSlide(cur);
    activateDots(cur);
  }
});

const init = function () {
  goToSlide(0);

  createDots();

  activateDots(0);
};

init();

// ********************** Practice ***********************
// window.addEventListener(`beforeunload`, function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = `hello`;
// });
// window.addEventListener(`load`, function (e) {
//   console.log(`page loaded`, e);
// });
// document.addEventListener(`DOMContentLoaded`, function (e) {
//   console.log(`DOMContentLoaded fired!!!`, e);
// });
// const callBack = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const options = {
//   root: null,
//   threshold: [0.2],
// };

// const observer = new IntersectionObserver(callBack, options);
// observer.observe(section1);

// const stickyCoords = section1.getBoundingClientRect();

// window.addEventListener(`scroll`, function () {
//   if (window.scrollY > stickyCoords.top) {
//     nav.classList.add(`sticky`);
//   } else {
//     nav.classList.remove(`sticky`);
//   }
// });
// const h1 = document.querySelector(`h1`);
// console.log(h1.querySelectorAll(`.highlight`));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.fontWeight = 100;
// h1.lastElementChild.style.fontSize = `10rem`;

// console.log(h1.parentNode);
// console.log(h1.parentElement);
// console.log(h1.closest(`.header`));
// document.querySelectorAll(`.nav__link`).forEach(function (link) {
//   link.addEventListener(`click`, function (e) {
//     e.preventDefault();
//     console.log(e);
//   });
// });

// const randomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document
//   .querySelector(`.nav__link`)
//   .addEventListener(
//     `click`,
//     e => (e.target.style.backgroundColor = randomColor())
//   );

// document.querySelector(`.nav__links`).addEventListener(`click`, function () {
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector(`.nav`).addEventListener(`click`, function () {
//   this.style.backgroundColor = randomColor();
// });

// function counter() {
//   var count = 0;
//   this.incrementCounter = function () {
//     ++count;
//     console.log(count);
//   };
//   this.decrementCounter = function () {
//     --count;
//     console.log(count);
//   };
// }

// let counter1 = new counter();
// counter1.incrementCounter();
// counter1.incrementCounter();
// counter1.incrementCounter();
// counter1.incrementCounter();
// counter1.incrementCounter();

// let counter2 = new counter();
// counter2.decrementCounter();
// counter2.decrementCounter();
// counter2.decrementCounter();

// const header = document.querySelector(`.header`);
// const message = document.createElement(`div`);
// message.classList.add(`cookie-message`);
// message.innerHTML = `We use cookies for improved functionality and analytics. <button class =
// 'btn btn--close-cookie'>Got it !</button>`;
// header.append(message);

// function removeNode() {
//   console.log(message);
//   message.remove();
// }

// const bt = document.querySelector(`.btn--close-cookie`);
// bt.addEventListener(`click`, removeNode);
// message.style.backgroundColor = `#37383d`;
// message.style.width = `120%`;
// console.log(getComputedStyle(message).padding);
// console.log(getComputedStyle(message).width);
// message.style.height = parseFloat(getComputedStyle(message).height) + 30 + `px`;

// document.documentElement.style.setProperty(`--color-primary`, `orange`);

// const logo = document.querySelector(`.nav__logo`);
// console.log(logo.src);
// console.log(logo.getAttribute(`src`));
// console.log(logo.alt);
// console.log(logo.id);
// const features = document.querySelector(`.nav__link`);
// console.log(features.href);
// console.log(features.getAttribute(`href`));
// const h1 = document.querySelector(`h1`);

// const showAlert = () => {
//   alert(`mouseenter event triggered :)`);
// };

// h1.addEventListener(`mouseenter`, showAlert);

// setTimeout(() => {
//   h1.removeEventListener(`mouseenter`, showAlert);
// }, 3000);
