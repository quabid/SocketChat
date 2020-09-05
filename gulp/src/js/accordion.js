const initAccordion = () => {
  let h3;

  if (document.querySelector('.heading_3')) {
    h3 = document.querySelector('.heading_3');
    h3.innerHTML = `<span class="text-justify font-weight-bold">Accordion Is Not Configured"`;
    return;
  }
  return;

  /* if (getElements('accordion-button')) {
    const buttons = getElements('accordion-button');
    let display = false;

    buttons.forEach(button => {
      addListener(button, 'mouseover', e => {
        button.focus();
        button.click();
      });

      addListener(button, 'click', e => {
        const sibling = button.nextElementSibling;

        if (!display) {
          sibling.style.display = 'grid';
          display = true;
        } else {
          sibling.style.display = 'none';
          display = false;
        }
      });
    });
  } */
};
