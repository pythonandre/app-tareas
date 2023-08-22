import React, { useEffect, useState } from 'react';
import './taskStyles.css'
import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from '../middleware/middleware';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../reducers/rootReducer';
import { DataActionTypes } from '../actions/actions';
import cross from '../assets/cross.png'
import mark from '../assets/mark.png'

const Task = () => {
  const data = useSelector((state: RootState) => state.data.data);
  const dispatch = useDispatch<ThunkDispatch<RootState, null, DataActionTypes>>();

  const [obtainedData, setObtainedData] = useState<any[]>([]);

  useEffect(() => {
    if (obtainedData?.length === 0) {
      dispatch(fetchData()).then((fetchedData: any) => {
        setObtainedData(fetchedData);
      });
    }
  }, [obtainedData, dispatch]);

  const formatDate = (date: Date) => {
    const day = date.getDate();
    let month = date.getMonth() + 1;
    const year = date.getFullYear();
    return year + '-' + 0 + month.toString() + '-' + day;
  }

  return (
    <>
      <div>
        {data?.map(task => {
          // Parse the task fecha_vencimiento into a Date object
          const isOverdue = new Date(task.fecha_vencimiento) > new Date();
  
          return (
            <div key={task.id} className="shadowed-task">
              <p className="description">{task.descripcion}</p>
              <div className="inputs">
                <input type="checkbox" className="checkbox" />
                <input type="date" value={formatDate(new Date(task.fecha_creacion))}/>
                <img
                  src={isOverdue ? cross: mark} style={{width: '10%'}}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}


export default Task;