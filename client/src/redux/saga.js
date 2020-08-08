import { all } from 'redux-saga/effects';
import { saga as CountersSaga } from '../ducks/counters';

export default function* rootSaga() {
  yield all([CountersSaga()]);
}
