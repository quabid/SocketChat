const init = () => {
  const divsTrigger = document.querySelector('.divs-trigger');
  document.title = 'Reached It!!';
  const options = {
    root: null,
    rootMargins: '0px',
    threshold: 0.5,
  };
};

window.onload = () => {
  if (document.hasFocus()) {
    init();
  }
};
