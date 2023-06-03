import axios from 'axios';

export class UnsplashAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '36908542-f1d7c98c12dc13d61a0b80cf6';
  #query = '';
  #page = Number;

  constructor() {
    this.per_page = 40;
  }

  getPhotosByQuery(page) {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.#query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: this.per_page,
      },
    });
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  get query() {
    return this.#query;
  }

  set page(newPage) {
    this.#page = newPage;
  }
  get page() {
    return this.#page;
  }
  incrementPage() {
    return (this.#page += 1);
  }
}
