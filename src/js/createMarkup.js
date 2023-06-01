import refs from './refs';
export { createMarkup };

function createMarkup(photos) {
  const markup = photos
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        comments,
        downloads,
        likes,
        views,
      }) => {
        return `<div class="photo-card">
         <a class='gallery-link link' href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width = "406" height = "300" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b> 
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
  </a>
</div>`;
      }
    )
    .join('');

  refs.galleryInfo.insertAdjacentHTML('beforeend', markup);
  return markup;
}
