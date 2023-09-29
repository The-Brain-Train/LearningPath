import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box, TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import Slider from "@mui/material/Slider";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: 430,
  width: 350,
  bgcolor: "#141832",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  color: "white",
  "& .MuiInputLabel-root": {
    color: "white",
  },
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiSelect-icon": {
    color: "white", 
  },
  "& .MuiSlider-root": {
    color: "white", 
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
  },
  "& .MuiSelect-root": {
    "& fieldset": {
      borderColor: "white",
    },
  },
};

function valuetext(value: number) {
  return `${value}`;
}

type InputFormProps = {
  setTopic: React.Dispatch<React.SetStateAction<string | null>>;
  setHours: React.Dispatch<React.SetStateAction<number | null>>;
  setExperienceLevel: React.Dispatch<React.SetStateAction<string | null>>;
};

const InputForm = ({
  setTopic,
  setHours,
  setExperienceLevel,
}: InputFormProps) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [experience, setExperience] = useState("");
  const [userMessage, setUserMessage] = useState<string>("");
  const [sliderValue, setSliderValue] = useState<number>(30);

  const handleChange = (event: SelectChangeEvent) => {
    setExperience(event.target.value);
  };

  const handleSubmit = () => {
    setTopic(userMessage);
    setExperienceLevel(experience);
    setHours(sliderValue);
    setUserMessage("");
    setExperience("");
    setSliderValue(30);

    handleClose();
  };

  return (
    <>
      <div>
        <h1 className="flex justify-center p-5 text-white">
          What would you want to create?
        </h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            className="bg-transparent hover:bg-emerald-600text-lg text-white font-bold border-2 p-2 border-white rounded "
            style={{ backgroundColor: "#141832" }}
            onClick={handleOpen}
          >
            Create Roadmap
          </button>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div>
              <InputLabel
                className="ml-3 form-control"
                id="demo-simple-topic-autowidth-label"
              >
                Topic:
              </InputLabel>
              <TextField
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Enter Topic!"
                sx={{ m: 1, minWidth: "90%" }}
                className="pt-0 rounded-l-md focus:outline-none focus:placeholder-gray-400 text-center placeholder-gray-60 py-3 form-control"
              />
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
              <div>
                <InputLabel
                  className="mt-10 pb-2 text-sm font-black"
                  id="demo-simple-box-autowidth-label"
                >
                  How many hours do you want to spend?
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
    </>
  );
};

export default InputForm;
