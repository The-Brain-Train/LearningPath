import React, { useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

type saveButtonProps = {
  saveClick: () => void;
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: '#cbd5e1',
  boxShadow: 24,
  p: 2,
  borderRadius: '5px'
};

function SaveButton({saveClick }: saveButtonProps) {
  const [clicked, setClicked] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClick = () => {
    saveClick();
    setClicked(true);
  };

  return (
    <>
      {!clicked && (
        <div>
        <button 
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded ml-4"
        onClick={handleOpen}>Save</button>
        <Modal
          open={open}
          onClose={handleClose}
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Are you sure you want to Save?
            </Typography>
            <div className='flex justify-between'>
              <Button onClick={handleClose}>no</Button>
              <Button className='text-green-500	' onClick={handleClick}>yes</Button>
            </div>
          </Box>
        </Modal>
      </div>
      )}
    </>
  );
}

export default SaveButton;
