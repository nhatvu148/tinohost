import localStorageService from 'helpers/localStorage';
import { EXPIRE_IN, COOKIE, USER_SAVED_EMPNO } from 'constants/common';
import cookies from 'helpers/cookies';

// cookie
export const setCookie = (cookie) => {
  cookies.setItem(COOKIE, cookie);
};

export const getCookie = () => cookies.getItem(COOKIE);

export const clearCookie = () => {
  cookies.removeItem(COOKIE);
};

// expire
export const setExpireIn = (expireIn) => {
  localStorageService.setItem(EXPIRE_IN, JSON.stringify(expireIn));
};

export const getExpireIn = () => {
  const expireIn = localStorageService.getItem(EXPIRE_IN);
  if (expireIn) {
    return JSON.parse(expireIn);
  }
  return null;
};

export const clearExpireIn = () => {
  localStorageService.removeItem(EXPIRE_IN);
};

export const setSavedEmpNo = (savedEmp) => {
  localStorageService.setItem(USER_SAVED_EMPNO, JSON.stringify(savedEmp));
};

export const getSavedEmpNo = () => {
  const savedEmp = localStorageService.getItem(USER_SAVED_EMPNO);
  if (savedEmp) {
    return JSON.parse(savedEmp);
  }
  return null;
};

export const clearUserCredential = () => {
  clearCookie();
  clearExpireIn();
};
