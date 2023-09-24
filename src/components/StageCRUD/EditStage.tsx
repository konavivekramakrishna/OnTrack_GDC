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
import { Stage, Errors, validate } from "../../types/types";
import { updateStageWithId } from "../../utils/apiutils";

export default function EditStage(props: {
  pStage: Stage;
  updateStage: (board: Stage) => void;
  open: boolean;
  handlerCB: () => void;
}) {
  const [open, setOpen] = useState(props.open);
  const [stage, setStage] = useState<Stage>(props.pStage);
  const [load, setLoad] = useState(false);
  const [errors, setErrors] = useState<Errors<Stage>>({});

  useEffect(() => {
    setOpen(props.open);
    setStage(props.pStage);
    setErrors({});
  }, [props.open, props.pStage]);

  const handleClose = () => {
    setOpen(false);
    props.handlerCB();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStage({ ...stage, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async () => {
    setLoad(true);
    const vErrors = validate(stage);

    if (Object.keys(vErrors).length > 0) {
      setErrors(vErrors);
      setLoad(false);
    } else {
      try {
        const res = await updateStageWithId(stage.id || 0, stage);
        if (res && res.id) {
          props.updateStage(stage);
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
    <Dialog open={open} onClose={handleClose}>
      <div className="min-w-[600px]">
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
                value={stage.title}
                onChange={handleChange}
              />
              {errors.title && <p className="text-red-500">{errors.title}</p>}
            </div>
            <Textarea
              label="Description"
              name="description"
              value={stage.description}
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
      </div>
    </Dialog>
  );
}
