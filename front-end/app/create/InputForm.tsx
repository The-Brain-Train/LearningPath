import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box, Switch, TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import Slider from "@mui/material/Slider";
import { InputFormProps } from "../util/types";
import { modalStyle } from "./createModalStyle";

type FormValidationErrors = {
  topicError: string | null;
  experienceError: string | null;
};

function valuetext(value: number) {
  return `${value}`;
}

const InputForm = ({
  data,
  setRoadmapInputData,
  resetForm,
}: InputFormProps) => {
  const [open, setOpen] = useState(false);
  const [formValidationErrors, setFormValidationErrors] =
    useState<FormValidationErrors>({
      topicError: null,
      experienceError: null,
    });
  const [inputDataForm, setInputDataForm] = useState({
    userTopic: "",
    hours: 30,
    experience: "",
    resources: false,
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleExperienceChange = (event: SelectChangeEvent) => {
    setInputDataForm({
      ...inputDataForm,
      experience: event.target.value,
    });
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const capitalizedText =
      e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
    setInputDataForm({
      ...inputDataForm,
      userTopic: capitalizedText,
    });
  };

  const handleHoursChange = (event: Event, newValue: number | number[]) => {
    setInputDataForm({
      ...inputDataForm,
      hours: newValue as number,
    });
  };

  const handleResourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputDataForm({
      ...inputDataForm,
      resources: event.target.checked,
    });
  };

  const handleErrorsOnSubmit = (
    inputDataField: string,
    dataFieldError: string,
    errorMessage: string
  ) => {
    if (!inputDataField) {
      setFormValidationErrors((prevErrors) => ({
        ...prevErrors,
        [dataFieldError]: errorMessage,
      }));
      setTimeout(() => {
        setFormValidationErrors((prevErrors) => ({
          ...prevErrors,
          [dataFieldError]: null,
        }));
      }, 3000);
    }
  };

  const handleSubmit = () => {
    handleErrorsOnSubmit(
      inputDataForm.userTopic,
      "topicError",
      "Topic is required"
    );
    handleErrorsOnSubmit(
      inputDataForm.experience,
      "experienceError",
      "Experience level is required"
    );

    if (inputDataForm.userTopic && inputDataForm.experience) {
      setRoadmapInputData({
        topic: inputDataForm.userTopic,
        hours: inputDataForm.hours,
        experienceLevel: inputDataForm.experience,
        resources: inputDataForm.resources,
      });
      setInputDataForm({
        userTopic: "",
        hours: 30,
        experience: "",
        resources: false,
      });
      handleClose();
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      {data === null && (
        <>
          <h1 className="text-white text-4xl md:text-5xl mt-8 mb-3 max-w-sm md:max-w-lg font-bold text-center mx-3">
            Create your Roadmap
          </h1>
          <div className="mt-5 max-w-xs">
            <div className="flex justify-center">
              <button
                className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-bold rounded-lg text-xl px-5 py-2.5 text-center me-2 mb-2"
                onClick={() => {
                  handleOpen();
                  resetForm();
                }}
              >
                Create
              </button>
            </div>
            <p className="text-white text-xs pt-5 px-4">
              <span className="underline">Note:</span> You must have an account
              and be signed in to save roadmaps
            </p>
          </div>
        </>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <div>
            <InputLabel
              className="ml-3 form-control"
              id="demo-simple-topic-autowidth-label"
            >
              Topic:
            </InputLabel>
            <TextField
              type="text"
              value={inputDataForm.userTopic}
              onChange={handleTopicChange}
              placeholder="Enter Topic!"
              sx={{ m: 1, minWidth: "90%", marginBottom: "25px"}}
              className="pt-0 rounded-l-md focus:outline-none focus:placeholder-gray-400 text-center placeholder-gray-60 form-control"
            />
            {formValidationErrors.topicError && (
              <div className="text-red-500 ml-2 -mt-6">
                {formValidationErrors.topicError}
              </div>
            )}
            <FormControl sx={{ m: 1, minWidth: "90%" }}>
              <InputLabel id="demo-simple-select-autowidth-label">
                Experience Level
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={inputDataForm.experience}
                onChange={handleExperienceChange}
                autoWidth
                label="Experience Level"
                className="border-white"
                sx={{marginBottom: "15px"}}
              >
                <MenuItem value={"beginner"}>Beginner</MenuItem>
                <MenuItem value={"intermediate"}>Intermediate</MenuItem>
                <MenuItem value={"expert"}>Expert</MenuItem>
              </Select>
            </FormControl>
            {formValidationErrors.experienceError && (
              <div className="text-red-500 ml-2 -mt-6">
                {formValidationErrors.experienceError}
              </div>
            )}
            <div>
              <InputLabel
                className="mt-5 pb-2 text-sm font-black"
                id="demo-simple-box-autowidth-label"
              >
                Total hours
              </InputLabel>
              <Box sx={{ minWidth: "80%" }}>
                <Slider
                  aria-label="Hours"
                  value={inputDataForm.hours}
                  onChange={handleHoursChange}
                  defaultValue={30}
                  getAriaValueText={valuetext}
                  valueLabelDisplay="auto"
                  step={10}
                  marks
                  min={10}
                  max={500}
                />
              </Box>
            </div>
            <div className="mt-2 flex justify-start flex-row">
              <InputLabel className="mt-2 pb-2 text-sm font-black">
                Add resources
              </InputLabel>
              <Switch
                checked={inputDataForm.resources}
                onChange={handleResourceChange}
                inputProps={{ "aria-label": "Toggle" }}
              />
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="w-3/6 bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 border border-blue-700 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default InputForm;
