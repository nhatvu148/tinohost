import { combineReducers } from '@reduxjs/toolkit';
import {
  mainTabsSliceName,
  mainTabsReducer,
} from 'features/frameBody/MainTabs/slices';
import { authSliceName, authReducer } from 'features/auth/slices';
import {
  dirtyManagementName,
  dirtyManagementReducer,
} from 'features/dirtyManagement/slices';
import {
  modalSlicesName,
  modalReducer,
} from 'containers/ModalContainer/slices';
import {
  commonCodeSliceName,
  commonCodeReducer,
} from 'features/common/CommonCode/slices';
import {
  helpFileSliceName,
  helpFileReducer,
} from 'containers/HelpContainer/slices';

function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    [mainTabsSliceName]: mainTabsReducer,
    [authSliceName]: authReducer,
    [dirtyManagementName]: dirtyManagementReducer,
    [modalSlicesName]: modalReducer,
    [commonCodeSliceName]: commonCodeReducer,
    [helpFileSliceName]: helpFileReducer,
    ...injectedReducers,
  });
  return rootReducer;
}

export default createReducer;
