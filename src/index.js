const API_KEY = '38138051-81d00d61410ef793a2f891f68';
const BASE_URL = 'https://pixabay.com/api/';
const ITEMS_PER_PAGE = 20;

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let page = 1;
let totalHits = 0;

loadMoreBtn.classList.add('hide');

searchForm.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', loadMoreImages);

async function handleSubmit(event) {
  event.preventDefault();
  searchQuery = event.target.elements.searchQuery.value.trim();
  if (searchQuery === '') return;

  page = 1;
  totalHits = 0;
  clearGallery();
  await fetchImages();
}

async function fetchImages() {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: ITEMS_PER_PAGE
      }
    });

    const { hits, totalHits: newTotalHits } = response.data;
    totalHits = newTotalHits;

    if (hits.length === 0) {
      showError('Sorry, there are no images matching your search query. Please try again.');
      clearGallery();
      return;
    }

    appendImages(hits);
    checkLoadMoreButton();
  } catch (error) {
    console.log(error);
    showError('Something went wrong. Please try again later.');
    notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
}

function appendImages(images) {
  const fragment = document.createDocumentFragment();

  images.forEach(image => {
    const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;

    const card = document.createElement('div');
    card.classList.add('photo-card');

    const img = document.createElement('img');
    img.src = webformatURL;
    img.alt = tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.classList.add('info');

    const likesElem = createInfoItem('Likes', likes);
    const viewsElem = createInfoItem('Views', views);
    const commentsElem = createInfoItem('Comments', comments);
    const downloadsElem = createInfoItem('Downloads', downloads);

    info.append(likesElem, viewsElem, commentsElem, downloadsElem);
    card.append(img, info);
    fragment.appendChild(card);
  });

  gallery.appendChild(fragment);
}

function createInfoItem(label, value) {
  const p = document.createElement('p');
  p.classList.add('info-item');
  p.innerHTML = `<b>${label}:</b> ${value}`;
  return p;
}

function clearGallery() {
  gallery.innerHTML = '';
}

function checkLoadMoreButton() {
  if (page * ITEMS_PER_PAGE < totalHits) {
    loadMoreBtn.classList.remove('hide');
  } else {
    loadMoreBtn.classList.add('hide');
    showError("We're sorry, but you've reached the end of search results.");
    notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  }
}

async function loadMoreImages() {
  page++;
  await fetchImages();
}

function showError(message) {
  const errorElement = document.querySelector('.error');
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  notiflix.Notify.failure(message);
}

// notiflix.Notify.init({ position: 'center-bottom', distance: '15px', timeout: 3000 });