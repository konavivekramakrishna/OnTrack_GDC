import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Stage, Task } from "../../types/types";
import { TaskCard } from "../TaskCRUD/TaskCard";
import { Droppable } from "react-beautiful-dnd";

export function StageCard(props: {
  key: number;
  stage: Stage;
  onEditCB: () => void;
  onDeleteCB: () => void;
  AddTaskCB: () => void;
  tasks: Task[];
  onEditAndDeleteTaskCB: (tid: number) => void;
}) {
  return (
    <Card className="w-full ml-2 p-1 min-w-[15rem] group hover:bg-blue-50 transition duration-300">
      <CardBody className="p-3">
        <div className="mb-3 flex items-center justify-between">
          <Typography
            variant="h3"
            color="blue-gray"
            className="font-medium p-4"
          >
            {props.stage.title}
          </Typography>
          <div className="flex items-center justify-between">
            <Typography
              onClick={props.onEditCB}
              color="blue-gray"
              className="cursor-pointer m-4 hover:text-green-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 group-hover:block hidden text-green-300 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </Typography>
            <Typography
              color="blue-gray"
              onClick={props.onDeleteCB}
              className="cursor-pointer hover:text-red-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 hidden group-hover:block text-red-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </Typography>
          </div>
        </div>
        <Typography className="p-2 ml-2" color="gray">
          {props.stage.description}
        </Typography>
        <CardFooter className="pt-3">
          <Button size="sm" onClick={props.AddTaskCB} fullWidth={true}>
            Add Task
          </Button>
        </CardFooter>
      </CardBody>

      <Droppable
        droppableId={props.stage.id?.toString() || ""}
        key={props.stage.id}
      >
        {(provided) => (
          <div
            className="p-3"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.tasks.map((task, index) => (
              <TaskCard
                key={(task.id as number) + 1}
                onEditAndDeleteTaskCB={props.onEditAndDeleteTaskCB}
                task={task}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Card>
  );
}
