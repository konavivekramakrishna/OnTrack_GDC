import React, { useState, useEffect } from "react";
import {
  Button,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
} from "@material-tailwind/react";
import Dialog from "@mui/material/Dialog";
import { Task, Errors, validateTask } from "../../types/types";
import {
  deleteTaskWithBoardId,
  updateTaskWithBoardId,
} from "../../utils/apiutils";

import { Select, Option } from "@material-tailwind/react";

export default function TaskEditAndDelete(props: {
  task: Task;
  boardId: number;
  deleteTaskCB: (id: number) => void;
  open: boolean;
  handlerCB: () => void;
  editTaskCB: (task: Task) => void;
}) {
  const [open, setOpen] = useState(props.open);
  const [task, setTask] = useState<Task>(props.task);
  const [load, setLoad] = useState(false);
  const [errors, setErrors] = useState<Errors<Task>>({});

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleClose = () => {
    setOpen(false);
    props.handlerCB();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handlePriorityChange = (value: string) => {
    setTask({
      ...task,
      description: {
        ...task.description,
        priority: value as Task["description"]["priority"],
      },
    });
  };

  const handleSubmit = async () => {
    const errors = validateTask(task);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    setLoad(true);
    const res = await updateTaskWithBoardId(
      props.boardId,
      props.task.id || 0,
      task
    );
    if (res) {
      props.editTaskCB({
        title: res.title,
        description: task.description,
        id: res.id,
        status: res.status_object.id,
        status_object: {
          id: res.status_object.id,
        },
      });
      handleClose();
    }
    setLoad(false);
  };

  const handleDescriptionChange = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      description: {
        ...task.description,
        [name]: value,
      },
    });
  };

  <Textarea
    label="Description"
    name="description.description"
    value={task.description.description}
    onChange={handleDescriptionChange}
  />;

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className="min-w-[600px]">
        <div className="flex items-center justify-between">
          <DialogHeader>Edit And Task</DialogHeader>
          <button
            onClick={handleClose}
            className="mr-3 focus:outline-none hover:text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <DialogBody divider>
          <div className="grid gap-6">
            <Input
              crossOrigin={""}
              label="Title"
              name="title"
              value={task.title}
              onChange={handleChange}
            />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
            <Textarea
              label="Description"
              name="description"
              value={task.description.description}
              onChange={handleDescriptionChange}
            />

            <Select
              label="Select Priority"
              value={task.description.priority}
              onChange={(e) => handlePriorityChange(e as string)}
            >
              <Option value="Low">Low</Option>
              <Option value="Medium">Medium</Option>
              <Option value="High">High</Option>
            </Select>

            <Input
              crossOrigin={""}
              label="Due Date"
              name="dueDate"
              type="date"
              value={task.description.dueDate}
              onChange={handleDescriptionChange}
            />
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="outlined" color="red" onClick={props.handlerCB}>
            Close
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={async () => {
              props.deleteTaskCB(props.task.id as number);
              await deleteTaskWithBoardId(props.boardId, props.task?.id || 0);
              handleClose();
            }}
          >
            Delete
          </Button>

          <Button
            variant="gradient"
            color="green"
            onClick={handleSubmit}
            disabled={load}
          >
            {load ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}
