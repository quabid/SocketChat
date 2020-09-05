const initIoAddClient = () => {
  if (document.querySelector('.small-sidebar')) {
    const addClient = document.querySelector('.add-client');

    console.log(`\n\n\n\t\t\t\tFound the element to monitor\n\n\n\n`);

    if ('IntersectionObserver' in window) {
      console.log(
        '\n\n\n\t\t\t\tThe browser does support Intersection Observer\n\n\n\n'
      );

      let options = {
        root: null,
        rootMargin: '0px',
        threshold: [0],
      };

      console.clear();

      function callback(entries, observer) {
        entries.forEach(entry => {
          if (
            !entry.isIntersecting &&
            parseFloat(entry.intersectionRatio) < 1
          ) {
            console.clear();
            console.log(`Entry is Intersecting ${entry.isIntersecting}`);
            console.log(`--------------------------------------\n`);
            console.log(`Entry: ${entry}`);
            console.log(`Ratio: ${entry.intersectionRatio}`);
            entry.target.classList.add('make-visible');
          } else {
            console.clear();
            console.log(`Entry is Not Intersecting${!entry.isIntersecting}`);
            console.log(`--------------------------------------\n`);
            console.log(`Entry: ${entry}`);
            console.log(`Ratio: ${entry.intersectionRatio}`);
            entry.target.classList.remove('make-visible');
          }
          console.log(`\n\n`);
        });
      }

      let observer = new IntersectionObserver(callback, options);
      // observer.POLL_INTERVAL = 100;
      observer.observe(addClient);
    }
  }
};

initIoAddClient();
