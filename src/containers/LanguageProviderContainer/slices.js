import { createSlice } from '@reduxjs/toolkit';

import { DEFAULT_LOCALE } from '../../i18n';

const selectSliceName = 'i18n';

const initialState = {
  locale: DEFAULT_LOCALE,
};

const selectSlice = createSlice({
  name: selectSliceName,
  initialState,
  reducers: {
    changeLocale: (state, action) => ({
      ...state,
      locale: action.payload,
    }),
  },
});

const { actions: selectActions, reducer: selectReducer } = selectSlice;

export { selectSliceName, selectActions, selectReducer, initialState };
