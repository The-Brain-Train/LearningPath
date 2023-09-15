import React, { SetStateAction, useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

type saveButtonProps = {
  saveClick: () => void;
};

function SaveButton({saveClick }: saveButtonProps) {
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    saveClick();
    setClicked(true);
  };

  return (
    <>
      {!clicked && (
        <button
          onClick={handleClick}
          className={`width-1 border-black border-2 fixed rounded-3xl p-3 z-30 bottom-3 left-3 transition-all duration-700"
        }`}
        >
          <CloudUploadIcon sx={{ fontSize: 35 }} />
        </button>
      )}
    </>
  );
}

export default SaveButton;
