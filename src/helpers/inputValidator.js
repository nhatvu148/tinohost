/* eslint-disable no-plusplus */
/* eslint-disable radix */
/* eslint-disable consistent-return */
// TODO: Fix eslint

import {
  KEY_CODES,
  MAX_LENGTH,
  MAX_SALARY,
  SSN_WEIGHT,
} from 'constants/common';

import { intl } from 'containers/LanguageProviderContainer';

const REGEX_PASSWORD = /^(?!.*(\w)\1{2,})(?=.*[A-Za-z])(?=.*\d)(?=.*[-@#$!%*#?&(\\/)^_+|~=`{}\\[\]:";'<>?,.])[A-Za-z\d\\\-@#$!%*#?&(\\/)^_+|~=`{}\\[\]:";'<>?,.].{7,19}$/;
const REGEX_DUPLICATE = /^(?!.*(\w)\1{2,}).+$/;
const REGEX_EMAIL_FRONT = /(^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*)$/;
const REGEX_EMAIL_BACK = /(^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+)$/;

export const passwordValidator = async (rule, value) => {
  if (value) {
    if (REGEX_PASSWORD.test(value) && REGEX_DUPLICATE.test(value)) {
      return Promise.resolve();
    }
    if (REGEX_DUPLICATE.test(value)) {
      return Promise.reject(
        intl.formatMessage({
          id: 'common.form.validate.regexMessage',
        }),
      );
    }
    return Promise.reject(
      intl.formatMessage({
        id: 'common.form.validate.regexDuplicateChar',
      }),
    );
  }
  return Promise.reject(
    intl.formatMessage(
      {
        id: 'common.error.noInput',
      },
      {
        field: intl.formatMessage({
          id: `common.form.field.label.${rule.field}`,
        }),
      },
    ),
  );
};

export const customValidator = async (rule, value, callback) => {
  const result = await callback(rule, value); // return boolean
  if (result) return Promise.resolve();

  return Promise.reject(
    intl.formatMessage(
      {
        id: 'common.error.noInput',
      },
      {
        field: intl.formatMessage({
          id: `common.form.field.label.${rule.field}`,
        }),
      },
    ),
  );
};

export const lengthValidator = async (rule, value, label) => {
  if (value) {
    if (value.length === rule.len) return Promise.resolve();

    return Promise.reject(
      intl.formatMessage(
        { id: 'common.form.validate.incorrect' },
        {
          field: label,
        },
      ),
    );
  }
};

export const salaryValidator = async (rule, value) => {
  if (value) {
    if (value > MAX_SALARY) {
      return Promise.reject(
        intl.formatMessage(
          {
            id: 'common.form.validate.maximum',
          },
          {
            field: intl.formatMessage({
              id: 'employment.salaryDeduct.monthlyPayAmt',
            }),
            length: MAX_LENGTH.SPECIFIC_15,
          },
        ),
      );
    }
    return Promise.resolve();
  }
};
export const isValidSSN = (ssn) => {
  const bare =
    ssn &&
    ssn
      .replaceAll('-', '')
      .split('')
      .map((item) => parseInt(item));
  if (
    !bare ||
    bare.length !== 13 ||
    (bare[2] === 1 && bare[3] > 2) || // wrong month format
    (bare[4] === 3 && bare[5] > 1) || // wrong day format
    bare[6] > 4
  ) {
    return false;
  }
  let tmp = 0;
  for (let i = 0; i < bare.length - 1; i++) {
    tmp += bare[i] * SSN_WEIGHT[i];
  }
  if (bare[bare.length - 1] === 11 - (tmp % 11)) {
    return true;
  }
  return false;
};

export const emailValidator = async (value) => {
  if (value) {
    const chunks = value.split('@');

    if (chunks.length === 2 && chunks[0].length < 41 && chunks[1].length < 41) {
      if (
        REGEX_EMAIL_FRONT.test(chunks[0]) &&
        REGEX_EMAIL_BACK.test(chunks[1])
      ) {
        return Promise.resolve();
      }
    }

    return Promise.reject(
      intl.formatMessage(
        {
          id: 'common.form.validate.incorrect',
        },
        {
          field: intl.formatMessage({
            id: `common.form.field.label.email`,
          }),
        },
      ),
    );
  }
};

export const isBackspaceOrDelete = (e) =>
  e.keyCode === KEY_CODES.KEYCODE_BACKSPACE ||
  e.keyCode === KEY_CODES.KEYCODE_DELETE;

export const isArrows = (e) =>
  e.keyCode >= KEY_CODES.KEYCODE_LEFT && e.keyCode <= KEY_CODES.KEYCODE_DOWN;

export const isNumber = (e) =>
  (e.keyCode >= KEY_CODES.KEYCODE_0 && e.keyCode <= KEY_CODES.KEYCODE_9) ||
  (e.keyCode >= KEY_CODES.KEYCODE_PAD_0 &&
    e.keyCode <= KEY_CODES.KEYCODE_PAD_9);

export const isCtrlCVA = (e) =>
  (e.keyCode === KEY_CODES.KEYCODE_A ||
    e.keyCode === KEY_CODES.KEYCODE_C ||
    e.keyCode === KEY_CODES.KEYCODE_V) &&
  e.ctrlKey === true;

export const isHyphen = (e) => e.keyCode === KEY_CODES.KEYCODE_HYPHEN;

export const isShift = (e) => e.shiftKey === true;
