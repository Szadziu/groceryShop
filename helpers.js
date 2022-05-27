export function createElement(tagName, classList) {
  const element = document.createElement(tagName);

  if (Array.isArray(classList)) {
    classList.forEach((el) => element.classList.add(el));
  } else {
    element.classList.add(classList);
  }

  return element;
}

export function getElementByClass(cls) {
  const element = document.querySelector(cls);

  return element;
}
