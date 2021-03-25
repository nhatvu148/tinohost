/* eslint-disable consistent-return */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-throw-literal */
// TODO: fix eslint
import {
  BASE_API_URL,
  API_TIMEOUT,
  DOWNLOAD_FILE_TIMEOUT,
} from 'constants/appConfig';

import {
  ACCEPT_LANGUAGE_HEADER,
  NETWORK_ERROR,
  FILENAME_REGEX,
  FILE_EXTENSION_REGEX,
} from 'constants/common';

import axios from 'axios';
import { ResponseHeader } from 'models/ResponseHeaderModel';

import mime from 'mime-types';
import unescape from 'lodash/unescape';

const apiClient = axios.create({
  baseURL: BASE_API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept-Language': ACCEPT_LANGUAGE_HEADER.KO,
  },
});

const downloadClient = axios.create({
  baseURL: BASE_API_URL,
  timeout: DOWNLOAD_FILE_TIMEOUT,
  responseType: 'blob',
});

const multipartConfig = {
  headers: {
    'content-type': 'multipart/form-data',
  },
};

// RESPONSE INTERCEPTOR
downloadClient.interceptors.response.use(
  async (response) => {
    const { headers, data } = response;
    if (headers['content-disposition']) {
      let filename = '';
      const contentDisposition = headers['content-disposition'];

      const matches = FILENAME_REGEX.exec(contentDisposition);
      if (matches !== null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }

      // Get extension of the file
      const extension = FILE_EXTENSION_REGEX.exec(filename)[1];
      const mimeType = mime.lookup(extension);

      // convert to Blob
      const blob = new Blob([data], {
        // Convert Extension to Mime
        type: mimeType,
      });
      return { blob, filename };
    }
    await data.text().then((text) => {
      const jsonData = JSON.parse(text);

      const resHeader = ResponseHeader.toClass(jsonData.responseHeadVo);
      const messageContent = resHeader?.messageContents;
      const messageCode = resHeader?.messageCode;

      // Use `unescape` Convert HTML entities
      if (!resHeader.isSuccess) {
        throw { messageContent: unescape(messageContent), messageCode };
      }
    });
  },
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  (error) => Promise.reject(error),
);

// REQUEST INTERCEPTOR
// TODO: Will update later
apiClient.interceptors.request.use(
  (config) => config,
  (error) => {
    Promise.reject(error);
  },
);

// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  (response) => {
    const { headers, data } = response;
    const resHeader = ResponseHeader.toClass(data.responseHeadVo);
    // Use `unescape` Convert HTML entities
    const messageContent = unescape(resHeader.messageContents);
    const { messageCode } = resHeader;
    if (resHeader.isSuccess) {
      return { headers, data, messageContent, messageCode };
    }
    // The message will translate from BE, so we will throw message content here
    throw { messageContent, messageCode };
  },
  // error converter
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status >= 400 && status <= 499) {
        return Promise.reject({
          messageContent: {
            id: 'error.api.resourceNotFound',
          },
        });
      }
      if (status >= 500 && status <= 599) {
        return Promise.reject({
          messageContent: {
            id: 'error.api.internalServerError',
          },
        });
      }
    } else if (error.message === NETWORK_ERROR) {
      return Promise.reject({
        messageContent: {
          id: 'error.api.networkError',
        },
      });
    } else {
      return Promise.reject(error);
    }
  },
);

export { downloadClient, multipartConfig };

export default apiClient;
