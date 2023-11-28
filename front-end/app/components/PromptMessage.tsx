import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

type PromptMessageProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmText: string;
  cancelText: string;
}

export const PromptMessage = (props: PromptMessageProps) => {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 bg-white rounded shadow-lg p-6 rounded-5 text-center">
        <Typography variant="h6" component="h2">
          {props.message}
        </Typography>
        <div className="flex justify-evenly mt-7">
          <button className="text-green-500" onClick={props.onConfirm}>
            {props.confirmText}
          </button>
          {props.cancelText !== "" && (
            <button className="text-blue-500" onClick={props.onClose}>
              {props.cancelText}
            </button>
          )}
        </div>
      </Box>
    </Modal>
  )
}
