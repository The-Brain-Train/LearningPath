import React, { useState } from "react";
import { PromptMessage } from "../components/PromptMessage";

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
      await saveClick();
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
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded my-2"
            onClick={handleOpen}
          >
            Save
          </button>
          <PromptMessage
            type="confirmation"
            open={open}
            onClose={handleClose}
            onConfirm={handleClick}
            message="Save this roadmap?"
            confirmText="YES"
            cancelText="NO"
          />
        </div>
      )}
      <PromptMessage 
        type="error"
        open={saveError}
        onClose={handleSaveErrorClose}
        onConfirm={handleSaveErrorClose}
        message={saveErrorMessage}
        confirmText="OK"
        cancelText=""
      />
    </>
  );
}

export default SaveButton;
