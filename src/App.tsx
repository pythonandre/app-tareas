import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './reducers/rootReducer';
import { fetchData } from './middleware/middleware';
import { ThunkDispatch } from 'redux-thunk';
import { DataActionTypes } from './actions/actions';

const App = () => {
  const data = useSelector((state: RootState) => state.data.data);
  const dispatch = useDispatch<ThunkDispatch<RootState, null, DataActionTypes>>();
  let obtainedData: any = [];

  useEffect(() => {
    if(obtainedData.length === 0){
    obtainedData = dispatch(fetchData());
  }
  }, []);

  console.log('Datos obtenidos:', data);

  return <div>Contenido de la aplicación</div>;
};

export default App;