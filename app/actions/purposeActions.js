import { arrayOf } from 'normalizr';
import { CALL_API } from 'redux-api-middleware';

import { API_URL } from 'constants/AppConstants';
import types from 'constants/ActionTypes';
import { purposeSchema } from 'middleware/Schemas';
import { createTransformFunction } from 'utils/APIUtils';

export default {
  fetchPurposes,
};

function fetchPurposes() {
  return {
    [CALL_API]: {
      types: [
        types.FETCH_PURPOSES_START,
        types.FETCH_PURPOSES_SUCCESS,
        types.FETCH_PURPOSES_ERROR,
      ],
      endpoint: `${API_URL}/purpose`,
      method: 'GET',
      transform: createTransformFunction(arrayOf(purposeSchema)),
      bailout: (state) => {
        return !state.api.shouldFetchPurposes;
      },
    },
  };
}
