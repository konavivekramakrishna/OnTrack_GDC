import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Task } from "../../types/types";
import { CalendarIcon } from "@heroicons/react/outline";

export function TaskCard(props: {
  task: Task;
  onEditAndDeleteTaskCB: (tid: number) => void;
}) {
  const priority = props.task.description.priority;

  const priorityColor = () => {
    switch (priority) {
      case "High":
        return "red";
      case "Medium":
        return "yellow";
      default:
        return "green";
    }
  };

  return (
    <Card className="w-[22rem] group hover:bg-gray-50 transition duration-300 m-4">
      <CardBody className="p-3">
        <div className="mb-3 flex items-center justify-between">
          <Typography variant="h6" color="blue-gray" className="font-medium">
            {props.task.title}
          </Typography>
          <Typography
            onClick={()=>props.onEditAndDeleteTaskCB(props.task?.id || 0)}
            color="blue-gray"
            className="cursor-pointer hover:text-green-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
              />
            </svg>
          </Typography>
        </div>
        <Typography color="gray">
          {props.task.description.description}
        </Typography>
      </CardBody>
      <div className="p-3">
        <div className="flex items-center">
          <span className="text-gray-400 mr-2">
            <CalendarIcon className="h-6 w-6" />
          </span>
          <Typography color="gray">{props.task.description.dueDate}</Typography>
        </div>
        <div className={`text-${priorityColor()}-500`}>
          <Typography>{props.task.description.priority}</Typography>
        </div>
      </div>
    </Card>
  );
}
