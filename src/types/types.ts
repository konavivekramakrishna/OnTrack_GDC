export type Board = {
  id?: number;
  title: string;
  description: string;
};

export type PaginationParams = {
  offset: number;
  limit: number;
};

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type Task = {
  id?: number;
  title: string;
  description: {
    description: string;
    priority: "Low" | "Medium" | "High";
    dueDate: string;
  };
  status: number;
  status_object?: {
    id: number;
    
  };
  board?: number;
};

export type upTask = {
  id?: number;
  title: string;
  description: string;
  status: number;
  status_object?: {
    id: number;
  };
  board?: number;
};

export type Stage = {
  id: number;
  title: string;
  description: string;
};

export type Errors<T> = Partial<Record<keyof T, string>>;

export const validateTask = (task: Task) => {
  const errors: Errors<Task> = {};
  if (!task.title) {
    errors.title = "Title is required";
  }
  if (!task.description.description) {
    errors.description = "Description is required";
  }
  if (task.title.length > 100) {
    errors.title = "Title should be less than 100 characters";
  }
  return errors;
};

export const validate = (board: Board) => {
  const errors: Errors<Board> = {};
  if (!board.title) {
    errors.title = "Title is required";
  }
  if (!board.description) {
    errors.description = "Description is required";
  }
  if (board.title.length > 100) {
    errors.title = "Title should be less than 100 characters";
  }
  return errors;
};

export type User = {
  name: string;
  username: string | null;
  url: string;
};
