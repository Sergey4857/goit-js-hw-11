import { UnsplashAPI } from './js/UnsplashAPI';
import { createMarkup } from './js/createMarkup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import refs from './js/refs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const unsplashapi = new UnsplashAPI(40);
let page = 1;
let totalPage;

refs.formEL.addEventListener('submit', onSearchFormSubmit);

async function onSearchFormSubmit(evt) {
  evt.preventDefault();

  const searchQuery = evt.currentTarget.elements.searchQuery.value.trim();

  if (searchQuery === '') {
    refs.galleryInfo.innerHTML = '';
    madeButtonInvisible();
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  unsplashapi.query = searchQuery;
  page = 1;

  try {
    makeStartEmptySearch();

    const response = await unsplashapi.getPhotosByQuery(page);

    if (response.data.hits.length === 0) {
      madeButtonInvisible();
      refs.galleryInfo.innerHTML = '';
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        { clickToClose: true }
      );
    }

    Notify.info(`Hooray! We found ${response.data.totalHits} images.`, {
      clickToClose: true,
    });
    const creationMarkup = await createMarkup(response.data.hits);

    madeButtonVisible();

    if (response.data.totalHits < 40) {
      madeButtonInvisible();
      refs.buttonLoadMore.removeEventListener('click', onBtnLoadMoreClick);
    } else {
      refs.buttonLoadMore.addEventListener('click', onBtnLoadMoreClick);
    }

    let simpleLightBox = new SimpleLightbox('.gallery a').refresh();
  } catch (error) {
    console.log(error);
  }
}

async function onBtnLoadMoreClick() {
  page += 1;

  try {
    const response = await unsplashapi.getPhotosByQuery(page);

    totalPage = response.data.totalHits;

    refs.galleryInfo.insertAdjacentHTML(
      'beforeend',
      createMarkup(response.data.hits)
    );

    simpleLightBox = new SimpleLightbox('.gallery a').refresh();

    if (totalPage < page) {
      madeButtonInvisible();

      Notify.info(
        "We're sorry, but you've reached the end of search results.",
        { clickToClose: true }
      );
      return;
    }
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
