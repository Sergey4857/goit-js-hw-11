import { UnsplashAPI } from './js/UnsplashAPI';
import { createMarkup } from './js/createMarkup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import refs from './js/refs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createScroll } from './js/scroll';

const unsplashapi = new UnsplashAPI();
let page;
let totalPage;

refs.formEL.addEventListener('submit', onSearchFormSubmit);

async function onSearchFormSubmit(evt) {
  evt.preventDefault();

  const searchQuery = evt.currentTarget.elements.searchQuery.value.trim();

  unsplashapi.query = searchQuery;
  page = 1;

  try {
    makeStartEmptySearch();

    const response = await unsplashapi.getPhotosByQuery(page);

    if (response.data.hits.length === 0 || unsplashapi.query === '') {
      madeButtonInvisible();
      makeStartEmptySearch();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        { clickToClose: true }
      );
      return;
    }

    testOnComplitedREquest(response);

    await createMarkup(response.data.hits);

    madeButtonVisible();

    if (response.data.totalHits < 40) {
      madeButtonInvisible();
      refs.buttonLoadMore.removeEventListener('click', onBtnLoadMoreClick);
    } else {
      refs.buttonLoadMore.addEventListener('click', onBtnLoadMoreClick);
    }

    addSimpleLightBox();
  } catch (error) {
    console.log(error);
  }
}

async function onBtnLoadMoreClick() {
  page += 1;

  try {
    const response = await unsplashapi.getPhotosByQuery(page);

    totalPage = response.data.totalHits;

    createMarkup(response.data.hits);

    createScroll();

    addSimpleLightBox();

    testEndOfResult(response);
  } catch (error) {
    console.log(error);
  }
}

function makeStartEmptySearch() {
  refs.galleryInfo.innerHTML = '';
}

function madeButtonVisible() {
  refs.buttonLoadMore.classList.remove('hidden');
}

function madeButtonInvisible() {
  refs.buttonLoadMore.classList.add('hidden');
}

function testOnComplitedREquest(response) {
  if (response.data.hits.length > 0) {
    Notify.info(`Hooray! We found ${response.data.totalHits} images.`, {
      clickToClose: true,
    });
  }
}

function addSimpleLightBox() {
  return new SimpleLightbox('.gallery a').refresh();
}

function testEndOfResult(response) {
  if (response.data.hits.length < unsplashapi.per_page) {
    madeButtonInvisible();

    Notify.info("We're sorry, but you've reached the end of search results.", {
      clickToClose: true,
    });
    return;
  }
}
