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

function valuetext(value: number) {
  return `${value}`;
}

const InputForm = ({
  data,
  setRoadmapInputData,
  resetForm,
}: InputFormProps) => {
  const [open, setOpen] = useState(false);
  const [experience, setExperience] = useState("");
  const [userTopic, setUserTopic] = useState<string>("");
  const [sliderValue, setSliderValue] = useState<number>(30);
  const [topicError, setTopicError] = useState<string | null>(null);
  const [experienceError, setExperienceError] = useState<string | null>(null);
  const [toggleValue, setToggleValue] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event: SelectChangeEvent) => {
    setExperience(event.target.value);
  };

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleSubmit = () => {
    if (!userTopic) {
      setTopicError("Topic is required");
      setTimeout(() => setTopicError(null), 3000);
    }

    if (!experience) {
      setExperienceError("Experience level is required");
      setTimeout(() => setExperienceError(null), 3000);
    }

    if (userTopic && experience) {
      setRoadmapInputData({
        topic: userTopic,
        hours: sliderValue,
        experienceLevel: experience,
        resources: toggleValue,
      });
      setUserTopic("");
      setExperience("");
      setSliderValue(30);
      setToggleValue(false);
      handleClose();
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-white text-4xl md:text-5xl mt-8 mb-3 max-w-sm md:max-w-lg font-bold text-center mx-3">
        Create Your Roadmap
      </h1>
      {data === null && (
        <div className="mt-5 max-w-xs">
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xl"
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
              value={userTopic}
              onChange={(e) =>
                setUserTopic(capitalizeFirstLetter(e.target.value))
              }
              placeholder="Enter Topic!"
              sx={{ m: 1, minWidth: "90%" }}
              className="pt-0 rounded-l-md focus:outline-none focus:placeholder-gray-400 text-center placeholder-gray-60 form-control"
            />
            {topicError && (
              <div className="text-red-500 ml-2">{topicError}</div>
            )}
            <FormControl sx={{ m: 1, minWidth: "90%" }}>
              <InputLabel id="demo-simple-select-autowidth-label">
                Experience Level
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={experience}
                onChange={handleChange}
                autoWidth
                label="Experience Level"
                className="border-white"
              >
                <MenuItem value={"beginner"}>Beginner</MenuItem>
                <MenuItem value={"intermediate"}>Intermediate</MenuItem>
                <MenuItem value={"expert"}>Expert</MenuItem>
              </Select>
            </FormControl>
            {experienceError && (
              <div className="text-red-500 ml-2">{experienceError}</div>
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
                  value={sliderValue}
                  onChange={(event, newValue) =>
                    setSliderValue(newValue as number)
                  }
                  defaultValue={30}
                  getAriaValueText={valuetext}
                  valueLabelDisplay="auto"
                  step={10}
                  marks
                  min={0}
                  max={500}
                />
              </Box>
            </div>
            <div className="mt-2 flex justify-start flex-row">
              <InputLabel className="mt-2 pb-2 text-sm font-black">
                Add resources
              </InputLabel>
              <Switch
                checked={toggleValue}
                onChange={() => setToggleValue(!toggleValue)}
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
