import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';

class ApiService{
    // static BASE_URL = 'https://pixabay.com/api/';
    API_KEY = '25731318-a5aff5cabfc9fb1e491efef59';

    #q = '';
    #page = 1;
    #perPage = 40;
    #image_type = 'photo';
    #orientation = 'all';
    #safesearch = true;

    fetchPhotos = async () => {
        const queryParams = new URLSearchParams({
            page: this.#page,
            per_page: this.#perPage,
            image_type: this.#image_type,
            orientation: this.#orientation,
            safesearch: this.#safesearch,
        });
        try {
            const photos = await axios.get(`/?key=${this.API_KEY}&q=${this.#q}&${queryParams}`);
            return photos;
        } catch (error) {
           console.error(error);
        }

    };
    set q(value) {
      this.#q = value;
    }

  incrementPage() {
    this.#page += 1;
    return this.#page;
  }

  resetPage() {
    this.#page = 1;
  }
}

const api = new ApiService();

export default api;


