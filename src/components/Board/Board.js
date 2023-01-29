import React, { useState, useEffect, useReducer, createContext } from "react";
import NewTask from "./New Task/NewTask";
import BoardLanes from "./BoardLanes";
import "./Board.css";
import Button from 'react-bootstrap/Button';
import LocalStorage from "localstorage";


const stagesData = [
  { name: "To-do", id: 1 },
  { name: "In Progress", id: 2 },
  { name: "Completed", id: 3 },
  { name: "Draft", id: 4 },
];
const taskData = [
  {
    id: 1,
    title: "node.js course",
    description: "Complete node.js with express course, and make a full stack schedule classes website",
    stage: 1,
    startDate: new Date(2023, 2, 10),
    endDate: new Date(2023, 2, 20),
  },
  {
    id: 2,
    title: "react.js course",
    description: "Complete react.js course, and create Kanban Board project.",
    stage: 2,
    startDate: new Date(2023, 1, 30),
    endDate: new Date(2023, 2, 10),
  },
  {
    id: 3,
    title: "client website",
    description: "Finish the laravel website to the client",
    stage: 3,
    startDate: new Date(2023, 1, 5),
    endDate: new Date(2023, 1, 25),
  },
  {
    id: 4,
    title: "draft task",
    description: "It's just a draft task before delete (if you don't want to do it but you are not totally sure)",
    stage: 4,
    startDate: new Date(2023, 1, 5),
    endDate: new Date(2023, 1, 6),
  },
];

export const BoardContext = createContext({});

function reducer(state, action) {
  switch (action.type) {
    case "ON_DROP":
      const droppedTask = action.payload;
      const updatedTasks = state.map((task) => {
        if (task.id === droppedTask.id) {
          return droppedTask;
        }
        return task;
      });
      return updatedTasks;
    case "LOAD_DATA":
      return action.payload;
    case "ADD_NEW":
      return [...state, action.payload];
    case "ON_DELETE":
      return state.filter((task) => task.id !== action.payload);
    default:
      return state;
  }
}
function Board() {
  const [mode, setMode] = useState('light');
  function toggleMode() {
    setMode(mode === 'light' ? 'dark' : 'light');
  }

  let obj=JSON.stringify(taskData);
  localStorage.setItem("taskData", obj);
  let objd=JSON.parse(localStorage.getItem("taskData"));
  console.log(objd);


  const [taskState, dispatch] = useReducer(reducer, taskData);
  const [stages, setStage] = useState(stagesData);

  useEffect(() => {
    dispatch({ type: "LOAD_DATA", payload: taskState });
  }, [taskState, stages]);

  const onDragStartHandler = (
    event,
    taskId,
    stageId
  ) => {
    var data = {
      taskId: taskId,
      stageId: stageId,
    };
    event.dataTransfer.setData("text/plain", JSON.stringify(data));
    event.dataTransfer.effectAllowed = "move";
  };

  const onTaskContainerDragStartHandler = (event, laneId) => {
    let fromBox = JSON.stringify({ laneId: laneId });
    event.dataTransfer.setData("laneId", fromBox);
  };
  const onTaskContainerDragOverHandler = (event) => {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
    }
  };

  const onTaskContainerDropHandler = (event, droppedLaneId) => {
  };

  const swapStages = (fromLane, toLane) => {

  };

  const onDragOverHandler = (event) => {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
    }
  };

  const onDropHandler = (event, droppedStageId) => {
    let droppedData = event.dataTransfer.getData("text/plain");
    droppedData = JSON.parse(droppedData);
    const filterTask = taskState.filter((x) => x.id === droppedData.taskId);
    filterTask[0].stage = droppedStageId;
    dispatch({ type: "ON_DROP", payload: filterTask[0] });
  };

  const onAddingNewTask = (dataFromChild) => {
    dataFromChild.stage = 1;
    dataFromChild.id = taskState.length + 1;
    dispatch({ type: "ADD_NEW", payload: dataFromChild });
  };

  const onUpdatingTask = (dataFromChild) => {
    console.log(dataFromChild)
    dispatch({ type: "ON_DROP", payload: dataFromChild });
  };

  const onDeletingTask = (taskId) => {
    dispatch({ type: "ON_DELETE", payload: taskId });
  };

  const ContextData = {
    taskState,
    onDragStartHandler,
    onDragOverHandler,
    onDropHandler,
    onUpdatingTask,
    onDeletingTask,
    onTaskContainerDragStartHandler,
    onTaskContainerDropHandler,
    onTaskContainerDragOverHandler
  };

  return (
    <div className={`App ${mode}`}>
      <div className="">
        <Button onClick={toggleMode} variant="" size="lg">{mode} Mode</Button>

        <div className="container-fluid pt-3">
          <div className="row">
            <div className="col-12">
              <NewTask addNewTask={onAddingNewTask} />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12">
              <BoardContext.Provider value={ContextData}>
                <BoardLanes stages={stages}></BoardLanes>
              </BoardContext.Provider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Board;