import { SIGNIN_URL } from 'constants/routes';

import {
  INVALID_SESSION,
  EXISTING_SESSION,
  INVALID_SESSION_TIMEOUT,
  HAVE_BEEN_KICKED_OUT,
} from 'features/auth/LoginPage/constants';
import { intl } from 'containers/LanguageProviderContainer';
import { put, takeLatest } from 'redux-saga/effects';
import { notificationActions } from 'containers/NotificationContainer/slices';
import {
  ERROR_TYPE,
  WARNING_TYPE,
} from 'components/BasicComponents/Notification';
import * as authHelper from 'helpers/authHelper';
import get from 'lodash/get';

const ERROR_HANDLER = 'ERROR_HANDLER';

export const errorHandler = (payload) => ({
  type: ERROR_HANDLER,
  payload,
});

function* handler(action) {
  const error = get(action, 'payload', {});

  // Add ModalContainer on the page that required modal
  if (error) {
    switch (error.messageCode) {
      case INVALID_SESSION:
        yield put(
          notificationActions.showNotification({
            type: ERROR_TYPE,
            message: intl.formatMessage({
              id: 'login.error.existedSession',
            }),
          }),
        );
        setTimeout(() => {
          authHelper.clearUserCredential();
          window.location.href = SIGNIN_URL;
        }, INVALID_SESSION_TIMEOUT);
        break;
      case HAVE_BEEN_KICKED_OUT: {
        yield put(
          notificationActions.showNotification({
            type: WARNING_TYPE,
            message: intl.formatMessage({
              id: 'login.error.youHaveBeenKickOut',
            }),
          }),
        );
        setTimeout(() => {
          authHelper.clearUserCredential();
          window.location.href = SIGNIN_URL;
        }, INVALID_SESSION_TIMEOUT);

        break;
      }
      // Show no Toast on existing session when login
      case EXISTING_SESSION:
        break;
      default: {
        yield put(
          notificationActions.showNotification({
            type: ERROR_TYPE,
            message: error.messageContent,
          }),
        );
        break;
      }
    }
  }
}
export default function* errorHandlerSaga() {
  yield takeLatest(ERROR_HANDLER, handler);
}
