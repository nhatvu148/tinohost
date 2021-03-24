function setItem(key, item) {
  localStorage.setItem(key, item);
}

function getItem(key) {
  return localStorage.getItem(key);
}

function removeItem(key) {
  localStorage.removeItem(key);
}

export default {
  setItem,
  getItem,
  removeItem,
};
