import api from '../services/api_services';
import refs from '../services/refs';
import createPhotoMarkupList from '../templates/photoMarkup';
import BtnService from '../components/buttonClass';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
// Дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";
import throttle from 'lodash.throttle';


const loadMoreBtn = new BtnService({ selector: '.load-more', hidden: true });
const onScrollThrottled = throttle(onScroll, 250);

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

async function onSearch() {
   try {
        const photos = await api.fetchPhotos();
        printResult(photos);
    } catch (error) {
        handleError(error);
    }
};

async function onSubmit(e) {
    e.preventDefault();
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
    photoQuantity =  photos.data.totalHits;

    if (photoArray.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
    const markup = createPhotoMarkupList(photoArray);
    refs.output.insertAdjacentHTML("beforeend", markup);
    if (page < 1 && photoArray.length!==0) {
        Notiflix.Notify.success(`Hooray! We found ${photoQuantity} images.`)
    }
    loadMoreBtn.show();
    loadMoreBtn.enable();
    lightbox.refresh();
};

function handleError (error) {
    resetView();
    window.removeEventListener('scroll', onScrollThrottled);
  if (error.response.status === 400) {
    Notify.failure("We're sorry, but you've reached the end of search results.");
    return;
  }
  Notify.failure('Sorry, there is no response from server. Please try again.');
};

async function onLoadMore () {
    page = api.incrementPage();
    if (page >= Math.round(photoQuantity/arrayLength)) {
        loadMoreBtn.hide();
        setTimeout(() => {
          Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        }, 500);
        window.removeEventListener('scroll', onScrollThrottled);
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

async function onScroll() {
    const {
            scrollTop,
            scrollHeight,
            clientHeight
    } = document.documentElement;
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
    if (scrollTop + clientHeight >= scrollHeight - 50) {
   window.scrollBy({top: cardHeight * 2,  behavior: "smooth"});
   await onLoadMore();
  }
}

window.addEventListener('scroll', onScrollThrottled);