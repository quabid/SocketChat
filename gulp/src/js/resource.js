const log = (arg = '') => console.log(arg);
/* const table = (arg = '') => console.table(arg);
const cls = () => console.clear(); */

/* const newElement = (arg = undefined) => {
  if (undefined !== arg) {
    return document.createElement(arg);
  }
  return null;
};

const newTextNode = (arg = 'text node') => document.createTextNode(arg);

const getElement = (arg = undefined) => {
  if (undefined !== arg) {
    // Check if arg contains a period or a pound
    if (arg.includes('.')) {
      if (document.querySelector(`${arg}`)) {
        return document.querySelector(`${arg}`);
      }
    } else if (arg.includes('#')) {
      if (document.querySelector(`${arg}`)) {
        return document.querySelector(`${arg}`);
      }
    }

    // arg does not contain a '.' nor '#'
    if (document.querySelector(`.${arg}`)) {
      return document.querySelector(`.${arg}`);
    } else if (document.querySelector(`#${arg}`)) {
      return document.querySelector(`#${arg}`);
    }
  }
  return null;
};

const getElements = (arg = undefined) => {
  if (undefined !== arg) {
    // Check if arg contains a period
    if (arg.includes('.')) {
      if (document.querySelectorAll(`${arg}`)) {
        return document.querySelectorAll(`${arg}`);
      }
    }

    // Check if arg contains a pound
    if (arg.includes('#')) {
      if (document.querySelectorAll(`${arg}`)) {
        return document.querySelectorAll(`${arg}`);
      }
    }

    // arg does not contain a '.' nor '#'
    if (document.querySelectorAll(`.${arg}`)) {
      return document.querySelectorAll(`.${arg}`);
    }

    if (document.querySelectorAll(`#${arg}`)) {
      return document.querySelectorAll(`#${arg}`);
    }
  }
  return null;
};

const appendElement = (parent, child) => {
  parent.appendChild(child);
};

const removeElement = (parent, child) => {
  parent.removeChild(child);
};

function disableElement(el) {
  addAttribute(el, 'disabled', true);
}

function enableElement(el) {
  removeAttribute(el, 'disabled');
}

const getChildrenCount = element => element.children.length;

const getChildElementCount = element => element.childElementCount; */

const getElement = (arg = undefined) => {
  if (undefined !== arg) {
    // Check if arg contains a period or a pound
    if (arg.includes('.')) {
      if (document.querySelector(`${arg}`)) {
        return document.querySelector(`${arg}`);
      }
    } else if (arg.includes('#')) {
      if (document.querySelector(`${arg}`)) {
        return document.querySelector(`${arg}`);
      }
    }

    // arg does not contain a '.' nor '#'
    if (document.querySelector(`.${arg}`)) {
      return document.querySelector(`.${arg}`);
    } else if (document.querySelector(`#${arg}`)) {
      return document.querySelector(`#${arg}`);
    }
  }
  return null;
};

const getElements = (arg = undefined) => {
  if (undefined !== arg) {
    // Check if arg contains a period
    if (arg.includes('.')) {
      if (document.querySelectorAll(`${arg}`)) {
        return document.querySelectorAll(`${arg}`);
      }
    }

    // Check if arg contains a pound
    if (arg.includes('#')) {
      if (document.querySelectorAll(`${arg}`)) {
        return document.querySelectorAll(`${arg}`);
      }
    }

    // arg does not contain a '.' nor '#'
    if (document.querySelectorAll(`.${arg}`)) {
      return document.querySelectorAll(`.${arg}`);
    }

    if (document.querySelectorAll(`#${arg}`)) {
      return document.querySelectorAll(`#${arg}`);
    }
  }
  return null;
};

const addListener = (element, event, listener) => {
  if (
    undefined !== element &&
    undefined !== event &&
    undefined !== listener &&
    typeof listener === 'function'
  ) {
    element.addEventListener(event, listener);
  }
};

const addAttribute = (element, attribute, value) => {
  element.setAttribute(attribute, value);
};

const removeAttribute = (element, attribute) => {
  element.removeAttribute(attribute);
};

const getAttribute = (element, attribute) => element.getAttribute(attribute);

const offset = el => {
  const rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};

const getCoordinates = element => offset(element);
