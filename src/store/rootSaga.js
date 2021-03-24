import { all } from 'redux-saga/effects';
import errorHandlerSaga from './errorHandlerSaga';

export default function* rootSaga() {
  yield all([errorHandlerSaga()]);
}
