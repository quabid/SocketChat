const initMenuObserver = () => {
  const divsTrigger = document.querySelector('.divs-trigger');
  document.title = 'Reached It!!';
  const options = {
    root: null,
    rootMargins: '0px',
    threshold: 0.5,
  };

  /* const observer = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) {
      console.log(entries[0]);
    } else {
      console.log('nothing');
    }
  }, options);

  observer.observe(divsTrigger); */
};
