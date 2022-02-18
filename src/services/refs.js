const refs = {
    input: document.querySelector('[name="searchQuery"]'),
    button: document.querySelector('[type="submit"]'),
    form: document.querySelector('#search-form'),
    output: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),

}

export default refs;

// try {
    //     const photos = await api.fetchPhotos();
    //     printResult(photos);
    // } catch (error) {
    //     handleError(error);
    // }
    //api.fetchPhotos().then(printResult).catch(handleError);

    // const AUTH_TOKEN = '25731318-a5aff5cabfc9fb1e491efef59';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

// fetchPhotos() {
    //     const queryParams = new URLSearchParams({
    //         page: this.#page,
    //         per_page: this.#perPage,
    //         image_type: this.#image_type,
    //         orientation: this.#orientation,
    //         safesearch: this.#safesearch,
    //     });
    //     // console.log(this.#page);
    //     return fetch(`${ApiService.BASE_URL}/?key=${this.API_KEY}&q=${this.#q}&${queryParams}`).then(res => {
    //         if (res.status === 404) {
    //             return Promise.reject(new Error('Not found'));
    //         }
    //         return res.json();
    //     });

    // }
    // fetchPhotos = async () => {
    //     const queryParams = new URLSearchParams({
    //         page: this.#page,
    //         per_page: this.#perPage,
    //         image_type: this.#image_type,
    //         orientation: this.#orientation,
    //         safesearch: this.#safesearch,
    //     });
    //         const res = await fetch(`${ApiService.BASE_URL}/?key=${this.API_KEY}&q=${this.#q}&${queryParams}`);
    //         const photos = await res.json();
    //         return photos;
    // };