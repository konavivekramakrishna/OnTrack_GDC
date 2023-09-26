import React, { useState, useEffect, useReducer } from "react";
import {
  getAllBoards,
  getAllStages,
  getTaskWithBoardIdForPrintPage,
} from "../utils/apiutils";
import { Chip } from "@material-tailwind/react";
import { Board, Stage } from "../types/types";
import CenteredLoader from "../components/CenteredLoader";
import { Sidebar } from "../components/Sidebar";
import {
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";

interface Task {
  id?: number;
  title: string;
  description: {
    description: string;
    priority: "Low" | "Medium" | "High";
    dueDate: string;
  };
  status_object: {
    id: number;
    title: string;
  };
  board?: number;
}

interface State {
  boards: Board[];
  stages: Stage[];
  tasks: Task[];
  selectedBoard: string;
  isLoading: boolean;
}

type Action =
  | { type: "setBoardsAndStages"; boards: Board[]; stages: Stage[] }
  | { type: "setTasks"; tasks: Task[] }
  | { type: "setSelectedBoard"; board: string }
  | { type: "setLoading"; isLoading: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setBoardsAndStages":
      return { ...state, boards: action.boards, stages: action.stages };
    case "setTasks":
      return { ...state, tasks: action.tasks, isLoading: false };
    case "setSelectedBoard":
      return { ...state, selectedBoard: action.board, isLoading: true };
    case "setLoading":
      return { ...state, isLoading: action.isLoading };
    default:
      return state;
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options = {
    day: "numeric" as const,
    month: "long" as const,
  };
  return date.toLocaleDateString(undefined, options);
};

export default function PrintPage() {
  const [state, dispatch] = useReducer(reducer, {
    boards: [],
    stages: [],
    tasks: [],
    selectedBoard: "",
    isLoading: true,
  });
  const [filter, setFilter] = useState<string[]>([]);

  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedBoards, fetchedStages] = await Promise.all([
          getAllBoards(),
          getAllStages(),
        ]);
        dispatch({
          type: "setBoardsAndStages",
          boards: fetchedBoards.results,
          stages: fetchedStages.results,
        });
        dispatch({ type: "setLoading", isLoading: false });
      } catch (error) {
        console.error("Error fetching data:", error);
        dispatch({ type: "setLoading", isLoading: false });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterTasks = () => {
      let filtered = selectedTasks;
      const today = new Date();

      if (filter.length > 0) {
        filtered = filtered.filter((task) => {
          const priorityMatch =
            filter.includes(task.description.priority) ||
            (!filter.includes("Low") &&
              !filter.includes("Medium") &&
              !filter.includes("High"));

          const dueDate = new Date(task.description.dueDate);

          const todayMatch =
            filter.includes("Due Today") &&
            dueDate.toDateString() === today.toDateString();
          const dueLaterMatch = filter.includes("Due Later") && dueDate > today;

          const overdueMatch = filter.includes("Overdue") && dueDate < today;

          return priorityMatch && (todayMatch || dueLaterMatch || overdueMatch);
        });
      }

      setFilteredTasks(filtered);
    };

    filterTasks();
  }, [filter, selectedTasks]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (state.selectedBoard === "") {
          return;
        }
        const board = state.boards.find(
          (board) => board.title === state.selectedBoard
        );
        if (!board) {
          return;
        }

        dispatch({ type: "setLoading", isLoading: true });

        const tasksForBoard = await getTaskWithBoardIdForPrintPage(
          board.id as number
        );

        const modifiedTasks = tasksForBoard.map((task) => ({
          ...task,
          status_object: task.status_object || { id: 0, title: "" },
        }));

        dispatch({ type: "setTasks", tasks: modifiedTasks });
        setSelectedTasks(modifiedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        dispatch({ type: "setLoading", isLoading: false });
      }
    };

    fetchTasks();
  }, [state.boards, state.selectedBoard]);

  const handleChange = (
    event: SelectChangeEvent<string[]>,
    child: React.ReactNode
  ) => {
    const selectedNames = event.target.value as string[];
    setFilter(selectedNames);
  };

  const handleChangeBoard = async (event: SelectChangeEvent) => {
    const selectedBoardName = event.target.value as string;
    dispatch({ type: "setSelectedBoard", board: selectedBoardName });
  };

  const names = ["Medium", "High", "Low", "Overdue", "Due Later", "Due Today"];

  const tableHeaders = [
    "S.No",
    "Task Title",
    "Task Description",
    "Stage Title",
    "Priority",
    "Due Date",
  ];

  return (
    <div>
      {state.isLoading ? (
        <CenteredLoader />
      ) : (
        <div className="flex">
          <Sidebar Active="Todo" />
          <Container>
            <div>
              <div className="flex-grow p-4 mt-5">
                <Typography variant="h4" className="mt-2" gutterBottom>
                  All Boards
                </Typography>
                <div className="flex items-center mb-3 p-1">
                  <Typography variant="body1" className="text-gray-600 pt-1">
                    Manage Tasks by Boards
                  </Typography>
                </div>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <div className="flex space-x-4">
                      <FormControl sx={{ m: 1, width: 200 }}>
                        <InputLabel id="Board">Board</InputLabel>
                        <Select
                          labelId="Board"
                          id="Board"
                          value={state.selectedBoard}
                          onChange={handleChangeBoard}
                          input={<OutlinedInput label="Board" />}
                        >
                          {state.boards.map((board: Board) => (
                            <MenuItem
                              key={board.id as number}
                              value={board.title}
                            >
                              {board.title}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl sx={{ m: 1, width: 200 }}>
                        <InputLabel id="filter-label-2">Filter</InputLabel>
                        <Select
                          labelId="filter-label-2"
                          id="filter-select-2"
                          multiple
                          value={filter}
                          onChange={handleChange}
                          input={<OutlinedInput label="Filter" />}
                        >
                          {names.map((name) => (
                            <MenuItem key={name} value={name}>
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
                {!state.isLoading && state.selectedBoard && (
                  <Container>
                    <div className="mt-4 ">
                      <table className="w-full min-w-max table-auto text-left border border-blue-gray-200">
                        <thead>
                          <tr>
                            {tableHeaders.map((header, index) => (
                              <th
                                key={index}
                                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                              >
                                <Typography
                                  color="blue-gray"
                                  className="font-normal leading-none opacity-70"
                                >
                                  {header}
                                </Typography>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTasks.map((task, index) => (
                            <tr
                              key={task.id}
                              className={`${
                                index % 2 === 0 ? "" : "bg-blue-gray-50 "
                              } border-b border-blue-gray-200`}
                            >
                              <td className="p-4">{index + 1}</td>
                              <td className="p-4">{task.title}</td>
                              <td className="p-4">
                                {task.description.description}
                              </td>
                              <td className="p-4">
                                {task.status_object.title}
                              </td>
                              <td className="p-4">
                                {task.description.priority && (
                                  <Chip
                                    className="mt-2 w-16 items-center justify-center"
                                    size="sm"
                                    variant="ghost"
                                    value={task.description.priority}
                                    color={
                                      task.description.priority === "Low"
                                        ? "green"
                                        : task.description.priority === "Medium"
                                        ? "amber"
                                        : "red"
                                    }
                                  />
                                )}
                              </td>
                              <td className="p-4">
                                {formatDate(task.description.dueDate)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Container>
                )}
              </div>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}
