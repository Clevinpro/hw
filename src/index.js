import './sass/main.scss';
import './js/libs/notyf.min';
import './js/app';


MicroModal.init({
  onShow: modal => console.info(`${modal.id} is shown`), // [1]
  onClose: modal => console.info(`${modal.id} is hidden`), // [2]
  openTrigger: 'data-custom-open', // [3]
  closeTrigger: 'data-custom-close', // [4]
  disableScroll: true, // [5]
  disableFocus: false, // [6]
  awaitCloseAnimation: false, // [7]
  debugMode: true // [8]
});




