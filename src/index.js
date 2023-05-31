import { UnsplashAPI } from './js/UnsplashAPI';
import { createMarkup } from './js/createMarkup';
import refs from './js/refs';

const unsplashapi = new UnsplashAPI(40);

async function onRenderPage(page) {
  try {
    const response = await unsplashapi.getPhotosByQuery(page);
    if (response.data.hits.length === 0) {
      return alert('server error');
    }

    const creationMarkup = await createMarkup(response.data.hits);

    refs.buttonLoadMore.classList.remove('hidden');
  } catch (error) {
    console.log(error);
  }
}

onRenderPage();

let page = 1;

refs.formEL.addEventListener('submit', onSearchFormSubmit);
async function onSearchFormSubmit(evt) {
  evt.preventDefault();

  const searchQuery = evt.currentTarget.elements.searchQuery.value.trim();

  unsplashapi.query = searchQuery;

  if (searchQuery === '') {
    return alert('Введіть запит');
  }

  try {
    const response = await unsplashapi.getPhotosByQuery();

    const creationMarkup = await createMarkup(response.data.hits);

    refs.buttonLoadMore.classList.remove('hidden');
  } catch (error) {
    console.log(error);
  }
}
refs.buttonLoadMore.addEventListener('click', onBtnLoadMoreClick);

async function onBtnLoadMoreClick() {
  page += 1;

  try {
    const response = await unsplashapi.getPhotosByQuery(page);

    refs.divForInfo.insertAdjacentHTML(
      'beforeend',
      createMarkup(response.data.hits)
    );
  } catch (error) {
    console.log(error);
  }
}
