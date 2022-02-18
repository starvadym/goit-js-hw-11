const  createPhotoMarkupList = photoArray => photoArray.map(createPhotoMarkup).join('');
const createPhotoMarkup = ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads })=>
   `
  <div class="photo-card">
  <a class="gallery__item" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
  </div>`

export default createPhotoMarkupList;