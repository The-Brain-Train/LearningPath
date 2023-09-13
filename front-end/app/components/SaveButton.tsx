import React, { SetStateAction } from "react";
import BookmarkIcon from '@mui/icons-material/Bookmark';

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
        className={`width-1 bg-teal-600 rounded-3xl p-3 z-30 bottom-3 right-3 transition-all duration-700 ${
          showButton ? "opacity-0" : "opacity-100"
        }`}
      >
        <BookmarkIcon sx={{ fontSize: 35 }} />
      </button>
    </>
  );
}

export default SaveButton;
