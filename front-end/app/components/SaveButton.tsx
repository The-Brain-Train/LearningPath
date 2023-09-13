import React, { SetStateAction } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

type saveButtonProps = {
  showButton: boolean;
  setShowButton: React.Dispatch<React.SetStateAction<boolean>>;
};

function SaveButton({ showButton, setShowButton }: saveButtonProps) {
  const handleClick = () => {
    setShowButton(!showButton);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`width-1 bg-teal-600 fixed rounded-3xl p-3 z-30 bottom-3 left-3 transition-all duration-700"
        }`}
      >
        <CloudUploadIcon sx={{ fontSize: 35 }} />
      </button>
    </>
  );
}

export default SaveButton;
