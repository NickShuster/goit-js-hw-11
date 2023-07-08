import axios from 'axios';
import Notiflix from 'notiflix';
const BASE_URL = 'https://pixabay.com/api/';

axios.defaults.headers.common["x-api-key"] = "live_8MwsOkn3MOo7VnSQaDExTxH256t08mMl4kkvSIwqATPKQ0kfM7FPETs3DhtDNjVJ";

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let currentQuery = '';

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const query = formData.get('searchQuery');

  if (query.trim() === '') {
    return;
  }

  if (query !== currentQuery) {
    clearGallery();
    page = 1;
  }

  currentQuery = query;

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });

    const { data } = response;
    const { hits, totalHits } = data;

    if (hits.length === 0) {
      showNoImagesMessage();
      return;
    }

    renderImages(hits);

    if (hits.length < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }
  } catch (error) {
    console.error(error);
    showErrorNotification();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = 'Loading...';

  try {
    page++;

    const response = await axios.get(BASE_URL, {
      params: {
        q: currentQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });

    const { data } = response;
    const { hits, totalHits } = data;

    renderImages(hits);

    if (hits.length >= totalHits) {
      hideLoadMoreButton();
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.error(error);
    showErrorNotification();
  } finally {
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = 'Load more';
  }
});

function renderImages(images) {
  const cardsHTML = images.map((image) => {
    const { webformatURL, likes, views, comments, downloads } = image;
    const cardHTML = `
      <div class="photo-card">
        <img src="${webformatURL}" alt="" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${likes}</p>
          <p class="info-item"><b>Views:</b> ${views}</p>
          <p class="info-item"><b>Comments:</b> ${comments}</p>
          <p class="info-item"><b>Downloads:</b> ${downloads}</p>
        </div>
      </div>
    `;
    return cardHTML;
  });

  gallery.insertAdjacentHTML('beforeend', cardsHTML.join(''));
}

function clearGallery() {
  gallery.innerHTML = '';
}

function showLoadMoreButton() {
  loadMoreBtn.style.display = 'block';
}

function hideLoadMoreButton() {
  loadMoreBtn.style.display = 'none';
}

function showNoImagesMessage() {
  Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
}

function showErrorNotification() {
  Notiflix.Notify.failure('Something went wrong. Please try again later.');
}