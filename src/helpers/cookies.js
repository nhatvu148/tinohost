import Cookies from 'universal-cookie';

const cookies = new Cookies();

function setItem(key, item, expireInSec) {
  if (item === undefined) {
    cookies.remove(key);
  } else if (expireInSec) {
    cookies.set(key, item, {
      path: '/',
      expires: new Date(expireInSec * 1000),
    });
  } else {
    cookies.set(key, item);
  }
}

function getItem(key) {
  return cookies.get(key);
}

function removeItem(key) {
  cookies.remove(key);
}

export default {
  setItem,
  getItem,
  removeItem,
};
