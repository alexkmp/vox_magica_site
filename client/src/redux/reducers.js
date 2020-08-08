import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import countersReducer, { moduleName } from '../ducks/counters';

const rootReducer = (history) =>
  combineReducers({
    [moduleName]: countersReducer,
    router: connectRouter(history),
  });

export default rootReducer;
