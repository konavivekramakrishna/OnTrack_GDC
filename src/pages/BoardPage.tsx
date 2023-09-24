import { useEffect, useState } from "react";
import { Button, Container, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { navigate } from "raviger";
import { Sidebar } from "../components/Sidebar";
import CreateStage from "../components/StageCRUD/CreateStage";
import { StageCard } from "../components/StageCRUD/StageCard";
import EditStage from "../components/StageCRUD/EditStage";

import {
  deleteStageWithId,
  getAllStages,
  getBoard,
  getTaskWithBoardId,
} from "../utils/apiutils";
import { Board, Stage, Task } from "../types/types";
import Loader from "../components/Loader";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import AddTask from "../components/TaskCRUD/AddTask";

import TaskEditAndDelete from "../components/TaskCRUD/TaskEditAndDelete";

interface Props {
  id: number;
}

export default function BoardPage(props: Props) {
  const [board, setBoard] = useState<Board>({
    title: "",
    description: "",
  });
  const [load, setLoad] = useState(true);
  const [stages, setStages] = useState<Stage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editStage, setEditStage] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [newStage, setNewStage] = useState(false);
  const [newTask, setNewTask] = useState(false);
  const [taskId, setTaskId] = useState(0);
  const [editAndDeleteTask, setEditAndDeleteTask] = useState(false);

  const toggleNewTask = () => {
    setNewTask(!newTask);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setEditAndDeleteTask(false);
  };

  const deleteTask = (id: number) => {
    const deletedTaskIndex = tasks.findIndex((t) => t.id === id);
    if (deletedTaskIndex !== -1) {
      tasks.splice(deletedTaskIndex, 1);
    }
    setTasks([...tasks]);
    setEditAndDeleteTask(false);
  };

  const toggleCreateStage = () => {
    setNewStage(!newStage);
  };

  const toggleEditStage = () => {
    setEditStage(!editStage);
  };

  const handleEditStage = (stage: Stage) => {
    setSelectedStage(stage);
    setEditStage(true);
  };

  const updateStageCB = (updatedStage: Stage) => {
    setStages((prevStages) =>
      prevStages.map((s) => (s.id === updatedStage.id ? updatedStage : s))
    );
    setEditStage(false);
    setSelectedStage(null);
  };

  const handleDeleteStage = async (id: number | undefined) => {
    try {
      if (id) {
        const deletedStageIndex = stages.findIndex((s) => s.id === id);
        if (deletedStageIndex !== -1) {
          stages.splice(deletedStageIndex, 1);
        }
        setStages([...stages]);

        await deleteStageWithId(id);

        toast.success("Stage deleted successfully", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting Stage", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleEditAndDeleteTask = (id: number) => {
    setTaskId(id);
    setEditAndDeleteTask(true);
  };

  useEffect(() => {
    const getData = async () => {
      if (Number.isNaN(props.id)) {
        navigate("/Home");
        return;
      }

      const stagesData = await getAllStages();
      setStages(stagesData.results);

      const boardData = await getBoard(props.id);
      if (!boardData) {
        navigate("/Home");
        return;
      }
      setBoard(boardData);

      const taskData = await getTaskWithBoardId(props.id);
      setTasks(taskData);
      setLoad(false);
    };

    getData();
  }, [props.id]);

  return (
    <div>
      <div className="flex">
        <Sidebar />
        {load ? (
          <div className="flex items-center justify-center h-screen w-full">
            <Loader />
          </div>
        ) : (
          <div className="w-full md:w-1/4 mt-8">
            <div>
              <Container>
                <div className="ml-24">
                  <Typography variant="h4" className="mt-2" gutterBottom>
                    {board.title}
                  </Typography>
                  <div className="flex items-center mb-3 p-1">
                    <Typography variant="body1" className="text-gray-600 pt-1">
                      {board.description}
                    </Typography>
                  </div>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<AddIcon />}
                        onClick={() => setNewStage(true)}
                      >
                        Add New Stage
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </Container>
              <div className="flex p-4 mt-5">
                {stages.map((stage) => (
                  <div key={stage.id} className="mx-2">
                    <StageCard
                      onDeleteCB={() => handleDeleteStage(stage.id)}
                      tasks={tasks.filter(
                        (t) => t.status_object?.id === stage.id
                      )}
                      stage={stage}
                      onEditAndDeleteTaskCB={handleEditAndDeleteTask}
                      onEditCB={() => handleEditStage(stage)}
                      AddTaskCB={() => {
                        setSelectedStage(stage);
                        toggleNewTask();
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {newTask && (
          <div id="modal-root">
            <AddTask
              statusID={selectedStage?.id as number}
              boardId={props.id}
              addTaskCB={(task: Task) => {
                setTasks([...tasks, task]);
              }}
              open={newTask}
              handlerCB={toggleNewTask}
            />
          </div>
        )}

        {editAndDeleteTask && (
          <div id="modal-root">
            <TaskEditAndDelete
              deleteTaskCB={deleteTask}
              boardId={props.id}
              task={tasks.find((t) => t.id === taskId) as Task}
              editTaskCB={updateTask}
              open={editAndDeleteTask}
              handlerCB={() => setEditAndDeleteTask(false)}
            />
          </div>
        )}

        {editStage && (
          <EditStage
            pStage={selectedStage as Stage}
            updateStage={updateStageCB}
            open={editStage}
            handlerCB={toggleEditStage}
          />
        )}

        {newStage && (
          <div id="modal">
            <CreateStage
              addStageCB={(stage: Stage) => {
                setStages([...stages, stage]);
              }}
              open={newStage}
              handlerCB={toggleCreateStage}
            />
          </div>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
