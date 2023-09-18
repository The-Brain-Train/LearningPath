import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteRoadmap } from '../httpRequests';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface DeleteModalProps {
  id: string;
  onDelete: (id: string) => void; 
}

export default function DeleteModal({ id, onDelete }: DeleteModalProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    await deleteRoadmap(id);
    onDelete(id); // Call the onDelete callback to remove the item from the list
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen}><DeleteIcon className="text-black "/></Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete?
          </Typography>
          <Button onClick={handleDelete}>yes</Button>
          <Button onClick={handleClose}>no</Button>
        </Box>
      </Modal>
    </div>
  );
}
