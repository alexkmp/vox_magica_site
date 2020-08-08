import { take, call, put, all } from 'redux-saga/effects';
import axios from 'axios';
import { push } from 'connected-react-router';

export const moduleName = 'counters';

export const FETCH_COUNTERS = `FETCH_COUNTERS`;
export const FETCH_COUNTERS_SUCCESS = `FETCH_COUNTERS_SUCCESS`;
export const FETCH_COUNTERS_FAILURE = `FETCH_COUNTERS_FAILURE`;

export const ADD_COUNTERS_REQUEST = `ADD_COUNTERS_REQUEST`;
export const ADD_COUNTERS_SUCCESS = `ADD_COUNTERS_SUCCESS`;
export const ADD_COUNTERS_FAILURE = `ADD_COUNTERS_FAILURE`;

const INITIAL_STATE = {
  counter: { count: null, error: null, loading: false },
};
export default function reducer(state = INITIAL_STATE, action) {
  let error;
  const { type, payload } = action;
  switch (type) {
    case FETCH_COUNTERS:
      return {
        ...state,
        counter: { count: null, loading: true, error: payload },
      };
    case FETCH_COUNTERS_SUCCESS:
      console.log('red', payload);
      return {
        ...state,
        counter: {
          count: payload,
          error: null,
          loading: false,
        },
      };
    case FETCH_COUNTERS_FAILURE:
      error = payload;
      return {
        ...state,
        counter: { count: null, error: error, loading: false },
      };

    default:
      return state;
  }
}

export const fetchAllCounter = function () {
  return {
    type: FETCH_COUNTERS,
  };
};

export const fetchCounters = () =>
  axios
    .get(`api/`, {
      headers: [],
    })
    .then((response) => response.data);

export function fetchCountersSuccess(articles) {
  return {
    type: FETCH_COUNTERS_SUCCESS,
    payload: articles,
  };
}

export function fetchCountersFailure(error) {
  return {
    type: FETCH_COUNTERS_FAILURE,
    payload: error,
  };
}

export const addCount = function (data) {
  return {
    type: ADD_COUNTERS_REQUEST,
  };
};

export function fetchCountSuccess(articles) {
  return {
    type: ADD_COUNTERS_SUCCESS,
    payload: articles,
  };
}

export function fetchCountFailure(error) {
  return {
    type: ADD_COUNTERS_FAILURE,
    payload: error,
  };
}

export const fetchCountersSaga = function* () {
  while (true) {
    try {
      yield take(FETCH_COUNTERS);
      console.log('1-1');
      const resp = yield call(fetchCounters);
      console.log('2', resp.data.counters);
      yield put(fetchCountersSuccess(resp.data.counters));
    } catch (error) {
      yield put({ type: FETCH_COUNTERS_FAILURE, payload: error });
    }
  }
};

export const addCountSaga = function* () {
  while (true) {
    const action = yield take(ADD_COUNTERS_REQUEST);
    console.log('5-1');
    try {
      const response = yield axios.post(`api/book`, action.payload);
      console.log('5-2', response);
      yield put({
        type: ADD_COUNTERS_SUCCESS,
        payload: { response },
      });

      yield put(push('/book'));
    } catch (err) {
      yield put({ type: ADD_COUNTERS_FAILURE, payload: err.response });
    }
  }
};

export function* saga() {
  yield all([fetchCountersSaga(), addCountSaga()]);
}
