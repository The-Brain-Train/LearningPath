import React, { SetStateAction } from "react";
import DeleteIcon from '@mui/icons-material/Delete';


type deleteButtonProps = {
  deleteClick: () => void;
};

function DeleteButton({deleteClick }: deleteButtonProps) {
  const handleClick = () => {
    deleteClick();
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`width-1 bg-teal-600 fixed rounded-3xl p-3 z-30 bottom-3 left-3 transition-all duration-700"
        }`}
      >
        <DeleteIcon sx={{ fontSize: 35 }} />
      </button>
    </>
  );
}

export default DeleteButton;
