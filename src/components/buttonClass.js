export default class BtnService {
  constructor({ selector, hidden = false, text = 'Load more' }) {
    this.refs = this.getRefs(selector);
    this.text = text;
    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};
    refs.button = document.querySelector(selector);
    refs.label = refs.button.querySelector('.label');

    return refs;
  }

  enable() {
    this.refs.button.disabled = false;
    this.refs.label.textContent = this.text;

  }

  disable() {
    this.refs.button.disabled = true;
    this.refs.label.textContent = 'Loading...';

  }

  show() {
    this.refs.button.classList.remove('is-hidden');
  }

  hide() {
    this.refs.button.classList.add('is-hidden');
  }
}
