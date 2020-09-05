const initDashboard = () => {
  if (document.querySelectorAll('accordion-card')) {
    const buttons = getElements('accordion-card');
    let display = false;

    buttons.forEach(button => {
      addListener(button, 'click', e => {
        const nthChild = button.childNodes[1];

        if (!display) {
          nthChild.classList.add('showcardinfo');
          display = true;
        } else {
          nthChild.classList.remove('showcardinfo');
          display = false;
        }
      });
    });
  }
};
