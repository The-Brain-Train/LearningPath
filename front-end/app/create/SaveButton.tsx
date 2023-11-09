import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

type saveButtonProps = {
  saveClick: () => void;
};

function SaveButton({ saveClick }: saveButtonProps) {
  const [clicked, setClicked] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [saveErrorMessage, setSaveErrorMessage] = React.useState("");
  const [saveError, setSaveError] = React.useState(false);
  const handleSaveErrorOpen = () => setSaveError(true);
  const handleSaveErrorClose = () => setSaveError(false);

  const handleClick = async () => {
    try {
      saveClick();
    } catch (e: any) {
      const errMessage = JSON.parse(e.message);
      setSaveErrorMessage(errMessage.message);
      handleSaveErrorOpen();
    }
    setClicked(true);
  };

  return (
    <>
      {!clicked && (
        <div>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded my-3"
            onClick={handleOpen}
          >
            Save
          </Button>
          <Modal open={open} onClose={handleClose}>
            <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 bg-white rounded shadow-lg p-4 rounded-5">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to save?
              </Typography>
              <div className="flex justify-between">
              <Button className="text-green-500	" onClick={handleClick}>
                  Yes
                </Button>
                <Button onClick={handleClose}>No</Button>
              </div>
            </Box>
          </Modal>
        </div>
      )}
      <Modal open={saveError} onClose={handleSaveErrorClose}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 bg-white rounded shadow-lg p-4 rounded-5">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {saveErrorMessage}
          </Typography>
          <div className="flex justify-center">
            <Button onClick={handleSaveErrorClose}>OK</Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default SaveButton;
