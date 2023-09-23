import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { Board, Errors, validate } from "../../types/types";
import { updateBoardWithId } from "../../utils/apiutils";

export default function EditBoard(props: {
  pBoard: Board;
  updateBoard: (board: Board) => void;
  open: boolean;
  handlerCB: () => void;
}) {
  const [open, setOpen] = useState(props.open);
  const [board, setBoard] = useState<Board>(props.pBoard);
  const [load, setLoad] = useState(false);
  const [errors, setErrors] = useState<Errors<Board>>({});

  useEffect(() => {
    setOpen(props.open);
    setBoard(props.pBoard);  
    setErrors({}); 
  }, [props.open, props.pBoard]);

  const handleClose = () => {
    setOpen(false);
    props.handlerCB();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBoard({ ...board, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async () => {
    setLoad(true);
    const vErrors = validate(board);

    if (Object.keys(vErrors).length > 0) {
      setErrors(vErrors);
      setLoad(false);
    } else {
      try {
        const res = await updateBoardWithId(board.id || 0, board);
        if (res && res.id) {
          props.updateBoard(res);
          setLoad(false);
          handleClose();
        }
      } catch (error) {
        console.error(error);
        setLoad(false);
      }
    }
  };

  return (
    <Dialog open={open} handler={handleClose}>
      <div className="flex items-center justify-between">
        <DialogHeader>Edit Board</DialogHeader>
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
          <div>
            <Input
              crossOrigin={""}
              label="Title"
              name="title"
              value={board.title}
              onChange={handleChange}
            />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
          </div>
          <Textarea
            label="Description"
            name="description"
            value={board.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </div>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button variant="outlined" color="red" onClick={handleClose}>
          Close
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
    </Dialog>
  );
}
