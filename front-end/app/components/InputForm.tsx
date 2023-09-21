import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box, Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import Slider from "@mui/material/Slider";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
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
    handleClose();
  };

  return (
    <>
      <div>
        <Button onClick={handleOpen}>Open modal</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div>
              <FormControl sx={{ m: 1, minWidth: 80 }}>
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Enter Topic!"
                  className="rounded-l-md	 w-full focus:outline-none focus:placeholder-gray-400 text-center text-gray-600 placeholder-gray-60 py-3"
                />
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
                >
                  <MenuItem value={"beginner"}>Beginner</MenuItem>
                  <MenuItem value={"intermediate"}>Intermediate</MenuItem>
                  <MenuItem value={"experienced"}>Experienced</MenuItem>
                </Select>
                <Box sx={{ width: 300 }}>
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
                <Button onClick={handleSubmit}>Submit</Button>
              </FormControl>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default InputForm;
