import api from '../services/api_services';
import refs from '../services/refs';
import createPhotoMarkupList from '../templates/photoMarkup';
import BtnService from '../components/buttonClass';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
// Дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";

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
    const text = e.currentTarget.elements.searchQuery.value.trim();
    //console.log(text);
    if (!text) {
    alert('Enter the text!');
    return;
    }
    resetView();
    api.q = text;
    try {
        const photos = await api.fetchPhotos();
        printResult(photos);
    } catch (error) {
        handleError(error);
    }
    //api.fetchPhotos().then(printResult).catch(handleError);

};

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
    window.removeEventListener('scroll', onScroll);
  if (error.response.status === 400) {
    Notify.failure("We're sorry, but you've reached the end of search results.");
    return;
  }
  Notify.failure('Sorry, there is no response from server. Please try again.');

};

refs.form.addEventListener('submit', onSubmit);


async function onLoadMore () {
    // console.log('click');
    page = api.incrementPage();
    console.log(`Page No.: ${page}`);
    if (page >= Math.round(photoQuantity/arrayLength)) {
        loadMoreBtn.hide();
        setTimeout(() => {
          Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        }, 500);
        window.removeEventListener('scroll', onScroll);
        return;
    }
    try {
        const photos = await api.fetchPhotos();
        printResult(photos);
    } catch (error) {
        handleError(error);
    }
    //api.fetchPhotos().then(printResult).catch(handleError);
};


loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function resetView (){
  api.resetPage();
  refs.output.innerHTML = '';
  loadMoreBtn.hide();
}


function onScroll() {
    const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
    if (scrollTop + clientHeight >= scrollHeight - 15) {
   window.scrollBy({top: cardHeight * 2,  behavior: "smooth"});
   onLoadMore();
  }
}

window.addEventListener('scroll', onScroll);