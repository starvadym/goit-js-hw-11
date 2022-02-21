import api from '../services/api_services';
import refs from '../services/refs';
import createPhotoMarkupList from '../templates/photoMarkup';
import BtnService from '../components/buttonClass';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const observer = new IntersectionObserver(onObserve, { threshold: 0.7 });
let isObserving = false;

const loadMoreBtn = new BtnService({ selector: '.load-more', hidden: true });

let photoQuantity = null;
let page = null;
let arrayLength = null;

const lightBoxOptions = {
 captions: true,
  captionSelector: "img",
  captionType: "attr",
  captionsData: "alt",
  captionDelay: 250,
};

let lightbox = new SimpleLightbox('.gallery__item', lightBoxOptions)


async function onSubmit(e) {
  e.preventDefault();
  if (isObserving) {
    observer.unobserve(refs.gallery.lastElementChild);
  }
    const text = e.currentTarget.elements.searchQuery.value.trim();
    if (!text) {
    alert('Enter the text!');
    return;
    }
    resetView();
    api.q = text;
    await onSearch();
};
refs.form.addEventListener('submit', onSubmit);

function printResult(photos) {
    loadMoreBtn.disable();
    const photoArray = photos.data.hits;
    arrayLength = photoArray.length;
    photoQuantity = photos.data.totalHits;
    loadMoreBtn.show();
    loadMoreBtn.enable();

  if (photoArray.length === 0) {
        loadMoreBtn.hide();
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
    const markup = createPhotoMarkupList(photoArray);
    refs.output.insertAdjacentHTML("beforeend", markup);
    if (page < 1 && photoArray.length!==0) {
        Notiflix.Notify.success(`Hooray! We found ${photoQuantity} images.`)
    }
  lightbox.refresh();
  observer.observe(refs.output.lastElementChild);
  isObserving = true;
};


async function onSearch() {
   try {
     const photos = await api.fetchPhotos();
       printResult(photos);
    } catch (error) {
        handleError(error);
    }
};

function handleError (error) {
    resetView();
   if (error.status === 400) {
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    return;
  }
  Notiflix.Notify.failure('Sorry, there is no response from server. Please try again.');
};

async function onLoadMore () {
    page = api.incrementPage();
    if (page >= Math.round(photoQuantity/arrayLength)) {
        loadMoreBtn.hide();
        setTimeout(() => {
          Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        }, 500);
        return;
    }
    await onSearch();
};

loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function resetView (){
  api.resetPage();
  refs.output.innerHTML = '';
  loadMoreBtn.hide();
}

function onObserve(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      onLoadMore();
    }
  });
}

