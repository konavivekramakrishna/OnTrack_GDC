import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Task } from "../../types/types";
import { CalendarIcon } from "@heroicons/react/outline";
import { Draggable } from "react-beautiful-dnd";
import { Chip } from "@material-tailwind/react";

export function TaskCard(props: {
  task: Task;
  onEditAndDeleteTaskCB: (tid: number) => void;
  index: number;
  selectedTaskIds: number[];
  toggleSelection: (taskId: number) => void;
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

  const isTaskSelected = props.selectedTaskIds.includes(props.task.id || 0);

  const handleClick = (event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      props.toggleSelection(props.task.id || 0);
    }
  };

  return (
    <Draggable
      draggableId={`${props.task.id}`}
      key={`${props.task.id}`}
      index={props.index}
    >
      {(provided, snapshot) => (
        <div
          className={`relative z-0 ${
            snapshot.isDragging ? "border border-blue-gray-300" : ""
          }`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
        >
          <div
            className={`flex flex-col w-full m-1 rounded-lg ${
              isTaskSelected ? "bg-blue-100" : ""
            }`}
          >
            <Card
              className={`w-[20rem] group hover:bg-gray-50   transition duration-300 m-2 ${
                isTaskSelected ? "border border-blue-500" : ""
              }`}
            >
              <CardBody className="p-3">
                <div className="mb-3 flex items-center justify-between">
                  {props.task.title && (
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {props.task.title}
                    </Typography>
                  )}
                  <Typography
                    onClick={() =>
                      props.onEditAndDeleteTaskCB(props.task.id || 0)
                    }
                    color="blue-gray"
                    className="cursor-pointer hover:text-green-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 0100 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                      />
                    </svg>
                  </Typography>
                </div>
                {props.task.description.description && (
                  <Typography color="gray">
                    {props.task.description.description}
                  </Typography>
                )}
              </CardBody>
              <div className="p-3">
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">
                    <CalendarIcon className="h-6 w-6" />
                  </span>
                  {props.task.description.dueDate && (
                    <Typography color="gray">
                      {props.task.description.dueDate}
                    </Typography>
                  )}
                </div>
                {props.task.description.priority && (
                  <Chip
                    className="mt-2 p-2 w-16 items-center justify-center"
                    size="sm"
                    variant="ghost"
                    value={props.task.description.priority}
                    color={
                      props.task.description.priority === "Low"
                        ? "green"
                        : props.task.description.priority === "Medium"
                        ? "amber"
                        : "red"
                    }
                  />
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </Draggable>
  );
}
