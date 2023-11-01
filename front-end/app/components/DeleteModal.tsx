import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteRoadmap } from '../functions/httpRequests';
import { RoadmapMeta } from '../util/types';

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
    onDelete(id);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen}><DeleteIcon className="text-black "/></Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-300 bg-white rounded shadow-lg p-4 rounded-5">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete?
          </Typography>
          <div className='flex justify-between'>
            <Button onClick={handleClose}>no</Button>
            <Button className='text-red-600	' onClick={handleDelete}>yes</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
