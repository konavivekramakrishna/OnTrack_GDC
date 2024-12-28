import {
  Board,
  Method,
  PaginationParams,
  Stage,
  Task,
  upTask,
} from "../types/types";

const getToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token || "";
};

const BASE_URL = "https://reactforall.onrender.com/api/";

export const apiCall = async (
  endpoint: string,
  method: Method = "GET",
  data: object = {}
) => {
  let link = BASE_URL + endpoint;
  let payload = "";

  if (method === "GET") {
    const params = data
      ? `?${Object.entries(data)
          .map((entry) => `${entry[0]}=${entry[1]}`)
          .join("&")}`
      : "";
    link += params;
  } else {
    payload = data ? JSON.stringify(data) : "";
  }

  const token = getToken();

  const auth = token ? "Token " + token : "";

  const res = await fetch(link, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
    body: method !== "GET" ? payload : null,
  });

  if (!res.ok) {
    console.error("Request failed with status:", res.status);
    return null;
  }

  try {
    const text = await res.text();
    if (text) {
      return JSON.parse(text);
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
};

// auth
export const login = async (username: string, password: string) => {
  return await apiCall("auth-token/", "POST", { username, password });
};

export const signup = (
  username: string,
  email: string,
  password1: string,
  password2: string
) => {
  return apiCall("auth/registration/", "POST", {
    username,
    email,
    password1,
    password2,
  });
};

export const me = () => {
  return apiCall("users/me/", "GET", {});
};

// tasks CRUD

export const createNewTask = (bid: number, task: Task) => {
  const stingifiedTask = {
    ...task,
    description: JSON.stringify(task.description),
  };
  return apiCall(`boards/${bid}/tasks/`, "POST", stingifiedTask);
};

export const getTaskWithBoardId = async (bid: number) => {
  const { results }: { results: upTask[] } = await apiCall(
    `boards/${bid}/tasks/`,
    "GET"
  );
  return results.map((task) => {
    return {
      ...task,
      description: JSON.parse(task.description),
    };
  });
};

export const getTaskWithBoardIdForPrintPage = async (bid: number) => {
  const { results }: { results: upTaskprintPage[] } = await apiCall(
    `boards/${bid}/tasks/`,
    "GET"
  );
  return results.map((task) => {
    return {
      ...task,
      description: JSON.parse(task.description),
    };
  });
};

export type upTaskprintPage = {
  id?: number;
  title: string;
  description: string;
  status: number;
  status_object?: {
    id: number;
    title: string;
  };
  board?: number;
};

 

export const updateTaskWithBoardId = (bid: number, id: number, task: Task) => {
  const stingifiedTask = {
    ...task,
    description: JSON.stringify(task.description),
  };
  return apiCall(`boards/${bid}/tasks/${id}/`, "PATCH", stingifiedTask);
};

export const moveTaskWithInBoard = (bid: number, tid: number, sid: number) => {
  return apiCall(`boards/${bid}/tasks/${tid}/`, "PATCH", { status: sid });
};

export const deleteTaskWithBoardId = (bid: number, tid: number) => {
  return apiCall(`boards/${bid}/tasks/${tid}/`, "DELETE");
};

// stages CRUD

export const createNewStage = (stage: Partial<Stage>) => {
  return apiCall("status/", "POST", stage);
};

export const deleteStageWithId = (id: number) => {
  return apiCall(`status/${id}/`, "DELETE");
};

export const getAllStages = () => {
  return apiCall("status/", "GET");
};

export const updateStageWithId = (id: number, stage: Stage) => {
  return apiCall(`status/${id}/`, "PATCH", stage);
};

// boards CRUD

export const createNewBoard = (board: Board) => {
  return apiCall("boards/", "POST", board);
};

export const deleteBoardWithId = (id: number) => {
  return apiCall(`boards/${id}/`, "DELETE");
};

export const getAllBoards = (pageParams?: PaginationParams) => {
  return apiCall("boards/", "GET", pageParams);
};

export const getBoard = (id: number) => {
  return apiCall(`boards/${id}/`, "GET");
};

export const updateBoardWithId = (id: number, board: Partial<Board>) => {
  return apiCall(`boards/${id}/`, "PATCH", board);
};
