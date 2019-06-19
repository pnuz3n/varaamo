import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { intlReducer } from 'react-intl-redux';

import apiReducers from './reducers/api';
import authReducer from './reducers/authReducer';
import dataReducer from './reducers/dataReducer';
import notificationsReducer from './reducers/notificationsReducer';
import uiReducers from './reducers/ui';
import recurringReservations from './recurringReservations';
import accessReducer from './reducers/accessReducer';

export default combineReducers({
  api: apiReducers,
  auth: authReducer,
  data: dataReducer,
  form: formReducer,
  intl: intlReducer,
  notifications: notificationsReducer,
  recurringReservations: recurringReservations.reducer,
  ui: uiReducers,
  acc: accessReducer,
});
