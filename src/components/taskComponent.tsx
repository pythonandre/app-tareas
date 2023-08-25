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
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [filterType, setFilterType] = useState<string>('creation'); // 'creation', 'due', 'status'
  const [filterOrder, setFilterOrder] = useState<string>('desc'); // 'desc', 'asc'
  const [originalData, setOriginalData] = useState<any[]>([]);


  useEffect(() => {
    if (obtainedData?.length === 0) {
      dispatch(fetchData()).then((fetchedData: any) => {
        setObtainedData(fetchedData);
        setOriginalData(fetchedData); // Guardar una copia de los datos originales
      });
    }
  }, [obtainedData, dispatch]);

  const formatDate = (date: Date) => {
    const day = date.getDate() + 1;
    let month = date.getMonth() + 1;
    const year = date.getFullYear();
    return year + '-' + 0 + month.toString() + '-' + day;
  }

  const handleFilterChange = (type: string) => {
    if (type === filterType) {
      setFilterOrder(filterOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setFilterType(type);
      setFilterOrder('desc'); // Restablecer el orden al cambiar el tipo de filtro
    }
  };

  const handleAddTask = async () => {
    const newDueDate = new Date();
    newDueDate.setMonth(newDueDate.getMonth() + 12);

    const response = await fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        descripcion: newTaskDescription,
        fecha_creacion: new Date(newTaskDueDate),
        fecha_vencimiento: newDueDate,
        isDone: false,
      }),
    });
    if (response.ok) {
      dispatch(fetchData()).then((fetchedData: any) => {
        setObtainedData(fetchedData);
      });
      setNewTaskDescription('');
      setNewTaskDueDate('');
    }
  };

  const handleCheckboxChange = (taskId: number) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const handleCleanSelection = async () => {
    for (const taskId of selectedTasks) {
      const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        dispatch(fetchData()).then((fetchedData: any) => {
          setObtainedData(fetchedData);
        });
      }
    }

    setSelectedTasks([]);
  };

  const switchStatus = async (taskId: number) => {
    const fetchResponse = await fetch(`http://localhost:3001/tasks/${taskId}`);
    const taskData = await fetchResponse.json();

    const updatedTask = { ...taskData, isDone: !taskData.isDone };

    const updateResponse = await fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });

    if (updateResponse.ok) {
      // Si la actualización fue exitosa, obtener los datos actualizados
      const fetchDataResponse = await fetch(`http://localhost:3001/tasks`);
      const fetchedData = await fetchDataResponse.json();

      // Actualizar el estado local con los nuevos datos
      setObtainedData(fetchedData);
      dispatch(fetchData()).then((fetchedData: any) => {
        setObtainedData(fetchedData);
      });
    }
  }

  return (
    <>
      <div>
        <div>
        <div>
          <br></br>
            <label htmlFor="sortDropdown" className="dropdown">Sort by:</label>
            <select
              id="sortDropdown"
              value={filterType}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="creation">
                Creation Date {filterType === 'creation' && (filterOrder === 'desc' ? '▼' : '▲')}
              </option>
              <option value="due">
                Due Date {filterType === 'due' && (filterOrder === 'desc' ? '▼' : '▲')}
              </option>
              <option value="status">
                Status {filterType === 'status' && (filterOrder === 'desc' ? '▼' : '▲')}
              </option>
            </select>
          </div>
          <button onClick={handleCleanSelection}>Clean selection</button>
        </div>
        <br></br>
        {data
          .sort((a, b) => {
            if (filterType === 'creation') {
              return filterOrder === 'desc'
                ? new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
                : new Date(a.fecha_creacion).getTime() - new Date(b.fecha_creacion).getTime();
            } else if (filterType === 'due') {
              return filterOrder === 'desc'
                ? new Date(a.fecha_vencimiento).getTime() - new Date(b.fecha_vencimiento).getTime()
                : new Date(b.fecha_vencimiento).getTime() - new Date(a.fecha_vencimiento).getTime();
            } else if (filterType === 'status') {
              return filterOrder === 'asc'
                ? (b.isDone ? 1 : 0) - (a.isDone ? 1 : 0)
                : (a.isDone ? 1 : 0) - (b.isDone ? 1 : 0);
            }
            return 0;
          })
          .map(task => {
            const taskIsDone = task.isDone;
            const taskCreationDate = new Date(task.fecha_creacion);
            const taskDueDate = new Date(task.fecha_vencimiento);
            const isTheSameYear = (taskCreationDate.getFullYear() >= taskDueDate.getFullYear());
            return (
              <>
                <div key={task.id} className="shadowed-task">
                  <p className="description">{task.descripcion}</p>
                  <div className="inputs">
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={() => handleCheckboxChange(task.id)}
                      checked={selectedTasks.includes(task.id)}
                    />
                    <input type="date" className="date" value={formatDate(new Date(task.fecha_creacion))} />
                    <img src={taskIsDone ? mark : (isTheSameYear ? clock : cross)} style={{ width: '10%' }} />
                    <button style={{ width: "10%" }} onClick={() => switchStatus(task.id)}><span style={{ fontSize: "12px" }}>✓</span>/<span style={{ fontSize: "14px" }}>🗴</span></button>
                  </div>
                </div>
                <br />
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