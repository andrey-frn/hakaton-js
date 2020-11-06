import findAndReplaceDamagedImage from './findAndReplaceDamagedImage';
import filmPagination from './pagination.js';
import filmService from './search-section';
import createHomepageFilmGalleryMarkup from './homepageFilmGalleryMarkup';
import savedFocus from './home-library-btns-service';
import { createHomepageMarkup } from './navigation';

let filmsArray = [];

createHomepageMarkup();
filmPagination();
savedFocus();
const formRef = document.querySelector('.search-form');

function showFilms() {
  const wrongInputNotification = document.querySelector(
    '.wrong-input-notification',
  );
  const incrementBtnRef = document.querySelector(
    "button[data-counter='increment']",
  );
  filmService
    .fetchFilms()
    .then(data => {
      filmsArray = data.results;
      findAndReplaceDamagedImage(data);
      createHomepageFilmGalleryMarkup(data.results);
      const counterRef = document.querySelector('#counter');
      counterRef.classList.remove('display-none');

      window.history.pushState(
        '',
        '',
        `?query=${filmService.query}&page=${filmService.pageStatus}`,
      );

      wrongInputNotification.textContent = '';

      if (
        (data.total_results === 0) &
        !counterRef.classList.contains('display-none')
      ) {
        counterRef.classList.add('display-none');
        wrongInputNotification.textContent =
          'Please enter a more specific query';
        return;
      }
      if (data.total_pages === 1) {
        incrementBtnRef.classList.add('not-visible');
        return;
      }
      counterRef.classList.remove('display-none');
    })
    .catch(error => console.log(error));
}

function searchFilm(event) {
  event.preventDefault();

  const filmsRef = document.querySelector('.gallery-list');
  const incrementBtnRef = document.querySelector(
    "button[data-counter='increment']",
  );

  const form = event.currentTarget;
  filmService.query = form.elements.query.value.trim();

  window.history.pushState(
    '',
    '',
    `?query=${filmService.query}&page=${filmService.pageStatus}`,
  );

  if (filmService.searchQuery === '') {
    wrongInputNotification.textContent =
      'The field is empty. Please type your query';
    counterRef.classList.add('display-none');
    return;
  }

  filmService.resetPage();

  if (
    (filmService.pageStatus === 1) &
    incrementBtnRef.classList.contains('not-visible')
  ) {
    incrementBtnRef.classList.remove('not-visible');
    incrementBtnRef.classList.add('visible');
  }

  if (filmService.resetPage) {
    const valueRef = document.getElementById('value');
    const decrementBtnRef = document.querySelector(
      "button[data-counter='decrement']",
    );

    valueRef.textContent = filmService.page;
    decrementBtnRef.classList.remove('visible');
    decrementBtnRef.classList.add('not-visible');
  }

  filmsRef.innerHTML = ' ';
  showFilms();
  formRef.reset();
}

formRef.addEventListener('submit', searchFilm);

export { filmsArray, searchFilm, showFilms };
