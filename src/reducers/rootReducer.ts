import { combineReducers } from 'redux';
import { ActionTypes, DataActionTypes, Task } from '../actions/actions';

interface DataState {
  data: Task[];
  loading: boolean;
  error: string | null;
}

const initialDataState: DataState = {
  data: [],
  loading: false,
  error: null,
};

const dataReducer = (state = initialDataState, action: DataActionTypes): DataState => {
  switch (action.type) {
    case ActionTypes.FETCH_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ActionTypes.FETCH_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case ActionTypes.FETCH_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  data: dataReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;