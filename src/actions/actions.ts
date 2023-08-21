import { Action } from 'redux';

export enum ActionTypes {
  FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST',
  FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS',
  FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE',
}

export interface Task {
  id: number;
  descripcion: string;
  fecha_creacion: Date;
  fecha_vencimiento: Date;
}

interface FetchDataRequestAction extends Action<ActionTypes.FETCH_DATA_REQUEST> {}

interface FetchDataSuccessAction extends Action<ActionTypes.FETCH_DATA_SUCCESS> {
  payload: Task[];
}

interface FetchDataFailureAction extends Action<ActionTypes.FETCH_DATA_FAILURE> {
  error: string;
}

export type DataActionTypes = FetchDataRequestAction | FetchDataSuccessAction | FetchDataFailureAction;