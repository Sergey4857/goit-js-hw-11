export async function onRenderPage() {
  try {
    refs.galleryInfo.innerHTML = '';

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
