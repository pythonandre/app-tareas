import React, { useEffect, useState } from 'react';
import './taskStyles.css'
import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from '../middleware/middleware';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../reducers/rootReducer';
import { DataActionTypes } from '../actions/actions';
import cross from '../assets/cross.png'
import mark from '../assets/mark.png'
import clock from '../assets/clock.png'

const Task = () => {
  const data = useSelector((state: RootState) => state.data.data);
  const dispatch = useDispatch<ThunkDispatch<RootState, null, DataActionTypes>>();

  const [obtainedData, setObtainedData] = useState<any[]>([]);
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');

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

  const handleAddTask = async () => {
    const response = await fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        descripcion: newTaskDescription,
        fecha_vencimiento: newTaskDueDate,
        // You might need to adjust other properties as needed
      }),
    });
    if (response.ok) {
      // Refetch the data to update the list
      dispatch(fetchData()).then((fetchedData: any) => {
        setObtainedData(fetchedData);
      });

      // Clear the form fields
      setNewTaskDescription('');
      setNewTaskDueDate('');
    }
  };

  return (
    <>
      <div>
        {data?.map(task => {
          // Parse the task fecha_vencimiento into a Date object
          const isOverdue = new Date(task.fecha_vencimiento) > new Date();
          const isWithinSixMonths = new Date(task.fecha_vencimiento).getMonth() <= new Date().getMonth() + 6 && new Date (task.fecha_vencimiento).getFullYear() === new Date(task.fecha_creacion).getFullYear();
  
          return (
            <>
            <div key={task.id} className="shadowed-task">
              <p className="description">{task.descripcion}</p>
              <div className="inputs">
                <input type="checkbox" className="checkbox" />
                <input type="date" className="date" value={formatDate(new Date(task.fecha_creacion))}/>
                <img
                  src={isOverdue ? cross : (isWithinSixMonths ? clock : mark)} style={{width: '10%'}}
                />
              </div>
            </div>
            <br/>
            </>
          );
        })}
        <div className="shadowed-task">
          <input
            type="text"
            placeholder="Task description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
          <input
            type="date"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
          />
          <button onClick={handleAddTask}>Add Task</button>
        </div>
        <br></br>
      </div>
    </>
  );
}


export default Task;