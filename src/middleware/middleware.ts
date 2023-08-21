import { Dispatch } from 'redux';
import axios from 'axios';
import { RootState } from '../reducers/rootReducer';
import { ActionTypes, DataActionTypes } from '../actions/actions';

const API_URL = 'http://localhost:3001';

export const fetchData = () => {
  return async (dispatch: Dispatch<DataActionTypes>, getState: () => RootState) => {
    dispatch({ type: ActionTypes.FETCH_DATA_REQUEST });

    try {
      const response = await axios.get(`http://localhost:3001/tasks`);
      const data = response.data;

      dispatch({
        type: ActionTypes.FETCH_DATA_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.FETCH_DATA_FAILURE,
        error: 'Error al cargar los datos.',
      });
    }
  };
};