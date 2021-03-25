/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-empty */
/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
/* eslint-disable no-bitwise */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
// TODO: Fix eslint

import { INPUT_MASK, YES, NO } from 'constants/common';

import React from 'react';
import dayjs from 'dayjs';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import _isInteger from 'lodash/isInteger';
import toNumber from 'lodash/toNumber';
import flattenDeep from 'lodash/flattenDeep';
import isArray from 'lodash/isArray';

import Select from 'components/BasicComponents/Select';
import { Radio } from 'components/BasicComponents/RadioGroup';

import { intl } from 'containers/LanguageProviderContainer';
import {
  isNumber,
  isCtrlCVA,
  isHyphen,
  isArrows,
  isShift,
  isBackspaceOrDelete,
} from 'helpers/inputValidator';

export const isIbSheetDirty = (ibsheet) =>
  ibsheet.getSaveJson({ saveMode: 2 }).data.length > 0;

export const isFormDirty = (originalData, form) =>
  !isEqual(originalData, form.getFieldsValue());

export const encodeToBase64 = (input) => btoa(input);
export const decodeFromBase64 = (input) => atob(input);

export const convertToBlob = (object) =>
  new Blob([JSON.stringify(object)], {
    type: 'application/json',
  });

export const convertToFormData = (data) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return formData;
};

export const getSheetById = (sheetId) => {
  if (!window.IBSheet) return null;
  return window.IBSheet.find(
    (item) => item !== null && String(item.id) === String(sheetId),
  );
};

export const getChangedSheets = ({ paneId = null, sheetIds = [] }) => {
  if (!window.IBSheet) return [];
  let sheetList = [];

  // If sheetIds is not null => check only the IBSheets which are contained in the sheetIds
  if (!isEmpty(sheetIds)) {
    sheetList = window.IBSheet.filter(
      (item) => item && sheetIds.indexOf(item.id) !== -1,
    );
  }

  // If paneId is not null => check only the IBSheets of the Pane that has paneId
  else if (!isEmpty(paneId)) {
    sheetList = window.IBSheet.filter(
      (item) => item?.id.split('-')[0] === paneId,
    );
  }

  // Else => check all IBSheets of all Panes
  else {
    sheetList = window.IBSheet.filter((item) => item !== null);
  }
  return sheetList.reduce((arr, grid) => {
    const { data, Message } = grid.getSaveJson();
    const dataRows = data.filter(
      (row) => row.id !== 'Header' && !~row.id.indexOf('HR'),
    );
    if (!(dataRows.length === 0 && (!Message || Message === 'NoTargetRows'))) {
      return [...arr, grid.id];
    }
    return arr;
  }, []);
};

export const flattenArrayList = (menus) => {
  if (isEmpty(menus)) return [];

  const flattened = [];
  menus.forEach((menu) => {
    if (menu.children.length > 0) {
      flattened.push({ ...menu });
      flattened.push(flattenArrayList(menu.children));
    } else {
      flattened.push({ ...menu });
    }
  });

  return flattenDeep(flattened);
};

export const trim = (field) => field.toString().trim();

export const isBlank = (field) =>
  field === null || field === undefined || field.toString().trim() === '';

export const isInteger = (str) => _isInteger(toNumber(str));

// This validator just return the first error field ( not all error fields )
export const checkRequiredField = (fields, changedData) => {
  for (const field of fields) {
    if (isArray(changedData)) {
      for (const item of changedData) {
        if (isBlank(item[field])) {
          return field;
        }
      }
    } else if (isBlank(changedData[field])) {
      return field;
    }
  }
};

// This validator all error fields
export const checkRequiredFields = (fields, changedData) => {
  const fieldsErr = [];
  for (const field of fields) {
    if (isArray(changedData)) {
      for (const item of changedData) {
        if (isBlank(item[field])) {
          fieldsErr.push(field);
        }
      }
    } else if (isBlank(changedData[field])) {
      fieldsErr.push(field);
    }
  }

  return fieldsErr;
};

// Set blank when incorrect value of useYN (Y, N)
export const setBlankUseYnField = (ibsheet, field, row) => {
  if (row[field] !== YES && row[field] !== NO) {
    ibsheet.setValue(row, field, '');
  }
};

export const getIBSheetRequiredFields = (sheet) => {
  if (isEmpty(sheet) || isEmpty(sheet.options) || isEmpty(sheet.options.Cols))
    return [];
  return sheet.options.Cols.filter(
    (col) => col.Required && (col.Required === 1 || col.Required === true),
  ).map(({ Name }) => Name);
};

export const mapIBSheetColName = (sheet, name) => {
  if (isEmpty(sheet) || isEmpty(sheet.options) || isEmpty(sheet.options.Cols))
    return name;
  const columns = sheet.options.Cols;
  return columns.find((col) => col.Name === name).Header;
};

/**
 * Get an array of column names which have attributes satisfying some conditions
 * @param {Object} sheet - IBSheet instance
 * @param {Object} attrObject - Object of attribute keys and their values, such as { CanEdit: 1 }
 */
export const getColNamesByAttr = (sheet, attrObject) =>
  sheet
    ? Object.keys(sheet.Cols).filter((col) =>
        Object.keys(attrObject).every(
          (k) => sheet.Cols[col][k] === attrObject[k],
        ),
      )
    : [];

export const trimSearchData = (value, excludedKeys = []) => {
  const mappedData = { ...value };

  Object.keys(mappedData).map((key) => {
    if (excludedKeys.includes(key)) return;
    const name = mappedData[key];
    if (name) {
      mappedData[key] = name.toString().trim().replace(/\s+/g, ' ');
    }
  });

  return mappedData;
};

export const convertTreeData = (root, id = 'key', path = []) => {
  if (root.length === 0) return [];

  return root.map((node) => ({
    ...node,
    keyPath: [...path, node[id]],
    children: convertTreeData(node.children, id, [...path, node[id]]),
  }));
};

export const convertInputMask = (input, mask) => {
  switch (mask) {
    case INPUT_MASK.DIGITS_67:
      return input.replace(/^(\d{6})(\d{7})$/g, '$1-$2');
    case INPUT_MASK.DIGITS_325:
      return input.replace(/^(\d{3})(\d{2})(\d{5})$/g, '$1-$2-$3');
    default:
      return input;
  }
};

export const sanitizeInputMask = (input) => input && input.replaceAll('-', '');

// add sequence number to data IBSheet
export const addSeqNumberToIbsheet = (data, pageOrder, pageSize) =>
  data.map((item, index) => ({
    ...item,
    seqNum: pageSize * pageOrder + index + 1,
  }));

export const resetBgAllCells = (sheet, rows, fields) => {
  for (const row of rows) {
    if (fields) {
      if (isArray(fields)) {
        for (const field of fields) {
          sheet.resetBackgroundCell(row, field);
        }
      } else {
        sheet.resetBackgroundCell(row, fields);
      }
    } else {
      for (const field in row) {
        sheet.resetBackgroundCell(sheet.getRowById(row.id), field);
      }
    }
  }
};

export const handleChangeBgCell = (sheet, rows, fieldError) => {
  for (const row of rows) {
    if (isBlank(row[fieldError])) {
      sheet.setErrorCell(sheet.getRowById(row.id), fieldError);
      return;
    }
    sheet.resetBackgroundCell(sheet.getRowById(row.id), fieldError);
  }
};

export const renderOptions = (options) =>
  options.map((option) => (
    // eslint-disable-next-line react/react-in-jsx-scope
    <Select.Option
      value={option.key ?? option.value}
      key={option.key ?? option.value}
    >
      {option.title ?? option.value}
    </Select.Option>
  ));

/**
 * Get checked rows of the IBSheet by column name
 * @param {Object} sheet - the sheet instance
 * @param {string} checkKey - checkbox column's name
 */
export const getSelectedRowsBySheet = (sheet, checkKey) => {
  if (sheet) {
    const currentSelected = sheet.getRowsByChecked(checkKey);

    return currentSelected;
  }
  return [];
};

export const mapSsnToDob = (ssn) => {
  const digit7 = ssn[6];
  const dob =
    digit7 === '1' || digit7 === '2'
      ? '19'.concat(ssn.slice(0, 6))
      : '20'.concat(ssn.slice(0, 6));

  return dob.replace(/^(\d{4})(\d{2})(\d{2})$/g, '$1-$2-$3');
};

/**
 * Fix dataArray to Enum list of an ibsheet column to create a dropdown
 * @param {import('lodash').Object} sheet - ibsheet instance
 * @param {string} colName - target column name
 * @param {Array} dataArray - list of data to be shown in dropdown
 * @param {string} title - the key of the dataArray's element that shows the label|title
 * @param {string} value - the key of the dataArray's element that shows the value
 */
export const setEnumToCol = (sheet, colName, dataArray, title, value) => {
  if (!sheet) return;

  if (!isEmpty(dataArray)) {
    const enums = `|${dataArray.map((type) => type[title]).join('|')}`;
    const enumKeys = `|${dataArray.map((type) => type[value]).join('|')}`;
    sheet.setAttribute(null, colName, 'Type', 'Enum');
    sheet.setAttribute(null, colName, 'Enum', enums);
    sheet.setAttribute(null, colName, 'EnumKeys', enumKeys);
  }
};

/**
 * Indicates the difference between two date-time in the specified unit
 * Based on dayjs#diff
 * https://day.js.org/docs/en/display/difference
 * @param {Date} date1 - the first date to be compared
 * @param {Date} date2 - the second date to be compared,
 * @param {string} unit - unit of measurement, default is 'day'
 * @param {boolean} floatingPoint
 */
export const compareDates = (
  date1,
  date2,
  unit = 'day',
  floatingPoint = false,
) => {
  const _date1 = dayjs(date1);
  // If date2 is null or undefined => set default to now
  const _date2 = date2 ? dayjs(date2) : dayjs();

  return _date1.diff(_date2, unit, floatingPoint);
};

/**
 *
 * @param {number} value - Value to be formatted
 * @param {number} beforeDecimal  - Number of digits before decimal
 * @param {number} afterDecimal - Number of digits after decimal
 * @return {number} Formatted Number
 */
export const formatFloat = (value, beforeDecimal, afterDecimal) => {
  let tmp = value;
  // while whole number has more digits than number of digits before decimals
  while (tmp >= 10 ** beforeDecimal) {
    tmp /= 10;
  }

  // If value is Integer, don't need fractional part
  return Number.isInteger(value)
    ? Math.floor(tmp)
    : Math.floor(tmp * 10 ** afterDecimal) / 10 ** afterDecimal;
};

export const isColTypeNumber = (ibsheet, row, field) =>
  ibsheet.getType(row, field) === ('Float' || 'Int');

export const getValueObjByKeys = (obj, keys) => {
  if (!obj) return {};
  return keys.reduce((acc, val) => {
    acc[val] = obj[val];
    return acc;
  }, {});
};

/**
 * Find a row instance by key-value
 * @param {*} sheet : IBSheet instance
 * @param {*} key
 * @param {*} value
 */
export const findIBSheetRowByKeyValue = (sheet, keys = null, values = null) => {
  if (
    !sheet ||
    !sheet.getDataRows() ||
    isEmpty(keys) ||
    isEmpty(values) ||
    // keys and values have to be or not to be Array as the same time
    !(isArray(keys) === isArray(values))
  )
    return null;

  // Get current row by selected employee no
  const rows = sheet.getDataRows();

  if (isArray(keys) && isArray(values)) {
    return rows.find((item) =>
      keys.every(
        (k, i) =>
          item[k] && values[i] && item[k].toString() === values[i].toString(),
      ),
    );
  }
  return rows
    ? rows.find((item) => item[keys].toString() === values.toString())
    : null;
};

export const convertToSafeNullObject = (obj) => {
  const newObj = {};
  for (const key in obj) {
    newObj[key] = obj[key] ?? '';
  }
  return newObj;
};

export const getImgBase64Url = (base64String, type) =>
  `data:image/${type};base64,${base64String}`;

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const mapFieldsCheckboxConfig = (val, fields) =>
  fields.reduce((acc, item) => {
    acc[item] = val;
    return acc;
  }, {});

// For datepicker
export const disabledWhen = (current, startBound, endBound) =>
  (startBound && current < startBound) || (endBound && endBound < current);

export const radioItemWithIntl = (item, index, type) => (
  <Radio value={item.value} key={index}>
    {intl.formatMessage({
      id: `payroll.${type}.${item.title}`,
    })}
  </Radio>
);

export const radioItem = (item, index) => (
  <Radio value={item.value} key={index}>
    {item.title}
  </Radio>
);

export const onlyNumberAndHyphen = (e) => {
  // allow only hyphen, numbers, ctrl C V A
  if (
    !isShift(e) &&
    (isBackspaceOrDelete(e) ||
      isArrows(e) ||
      isNumber(e) ||
      isCtrlCVA(e) ||
      isHyphen(e))
  ) {
  } else {
    e.preventDefault();
  }
};

export const onlyNumber = (e) => {
  // allow only hyphen, numbers, ctrl C V A
  if (isBackspaceOrDelete(e) || isArrows(e) || isNumber(e) || isCtrlCVA(e)) {
  } else {
    e.preventDefault();
  }
};
