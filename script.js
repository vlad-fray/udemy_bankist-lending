'use strict';

//DOM elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector(
	'.btn--close-modal'
);
const btnsOpenModal = document.querySelectorAll(
	'.btn--show-modal'
);

const btnScrollTo = document.querySelector(
	'.btn--scroll-to'
);
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector(
	'.operations__tab-container'
);
const tabsContent = document.querySelectorAll(
	'.operations__content'
);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const imgTargets =
	document.querySelectorAll('img[data-src]');

const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const sliderBtnLeft = document.querySelector(
	'.slider__btn--left'
);
const sliderBtnRight = document.querySelector(
	'.slider__btn--right'
);
const dotContainer = document.querySelector('.dots');

//Variables
const navHeight = nav.getBoundingClientRect().height;
let currentSlide = 0;

//Functions
const openModal = (e) => {
	e.preventDefault();
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
};
const closeModal = () => {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
};
const handleHover = (e, opacity) => {
	if (e.target.classList.contains('nav__link')) {
		const link = e.target;
		const siblings = link
			.closest('.nav')
			.querySelectorAll('.nav__link');
		const logo = link.closest('.nav').querySelector('img');
		siblings.forEach((sib) => {
			if (sib !== link) sib.style.opacity = opacity;
		});
		logo.style.opacity = opacity;
	}
};
const stickyNav = (entries) => {
	const [entry] = entries;
	if (!entry.isIntersecting) nav.classList.add('sticky');
	else nav.classList.remove('sticky');
};
const revealSection = (entries, observer) => {
	const [entry] = entries;
	if (!entry.isIntersecting) return;
	entry.target.classList.remove('section--hidden');
	observer.unobserve(entry.target);
};
const loadImg = (entries) => {
	const [entry] = entries;
	if (!entry.isIntersecting) return;
	entry.target.src = entry.target.dataset.src;
	entry.target.addEventListener('load', function () {
		entry.target.classList.remove('lazy-img');
	});
};
const toggleSlider = (slideNum) => {
	if (slideNum >= 0) currentSlide %= slides.length;
	else currentSlide = slides.length - 1;

	slides.forEach((slide, ind) => {
		slide.style.transform = `translateX(${
			100 * (ind - currentSlide)
		}%)`;
	});
	toggleActiveDot(currentSlide);
};
const createDots = () => {
	slides.forEach((_, ind) => {
		dotContainer.insertAdjacentHTML(
			'beforeend',
			`
			<button class="dots__dot" data-slide="${ind}"></button>
			`
		);
	});
};
const toggleActiveDot = () => {
	const dots = document.querySelectorAll('.dots__dot');
	dots.forEach((dot) => {
		dot.classList.remove('dots__dot--active');
		if (+dot.dataset.slide === currentSlide)
			dot.classList.add('dots__dot--active');
	});
};

//Variables with callbacks
const headerObserver = new IntersectionObserver(stickyNav, {
	root: null,
	rootMargin: `-${navHeight}px`,
	threshold: 0,
}).observe(header);

const sectionObserver = new IntersectionObserver(
	revealSection,
	{
		root: null,
		threshold: 0.15,
	}
);
allSections.forEach((sec) => {
	sectionObserver.observe(sec);
	sec.classList.add('section--hidden');
});

const imgObserver = new IntersectionObserver(loadImg, {
	root: null,
	threshold: 0,
	rootMargin: '200px',
});
imgTargets.forEach((img) => {
	imgObserver.observe(img);
});

//Onload function`s start
toggleSlider(0);
createDots();
toggleActiveDot();

//Event listeners
// Modal window
btnsOpenModal.forEach(function (btn) {
	btn.addEventListener('click', openModal);
});
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
	if (
		e.key === 'Escape' &&
		!modal.classList.contains('hidden')
	) {
		closeModal();
	}
});

// Page navigation
btnScrollTo.addEventListener('click', function () {
	section1.scrollIntoView({ behavior: 'smooth' });
});
navLinks.addEventListener('click', function (e) {
	e.preventDefault();
	// do it to avoid too many event listeners
	if (e.target.classList.contains('nav__link')) {
		const id = e.target.getAttribute('href');
		if (id === '#') return;
		document
			.querySelector(id)
			.scrollIntoView({ behavior: 'smooth' });
	}
});

//Tabbed component
tabsContainer.addEventListener('click', function (e) {
	e.preventDefault();
	//closest is to avoid troubles with children in button
	const clicked = e.target.closest('.operations__tab');

	//Guard clause
	if (!clicked) return;

	//Activate tabs
	tabs.forEach((tab) =>
		tab.classList.remove('operations__tab--active')
	);
	clicked.classList.add('operations__tab--active');

	//Activate content area
	tabsContent.forEach((tabC) =>
		tabC.classList.remove('operations__content--active')
	);
	document
		.querySelector(
			`.operations__content--${clicked.dataset.tab}`
		)
		.classList.add('operations__content--active');
});

//Menu fade animation
nav.addEventListener('mouseover', (e) =>
	handleHover(e, 0.5)
);
nav.addEventListener('mouseout', (e) => handleHover(e, 1));

// Slider
sliderBtnLeft.addEventListener('click', () =>
	toggleSlider(--currentSlide)
);
sliderBtnRight.addEventListener('click', () =>
	toggleSlider(++currentSlide)
);
dotContainer.addEventListener('click', function (e) {
	if (e.target.classList.contains('dots__dot')) {
		currentSlide = e.target.dataset.slide;
		toggleSlider(currentSlide);
	}
});
