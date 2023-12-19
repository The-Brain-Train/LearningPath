
import React from "react";
import { Alert } from "@mui/material";

type AuthenticationFormErrorProps = {
  errorMessage: string;
};

const AuthenticationFormError: React.FC<AuthenticationFormErrorProps> = ({ errorMessage }) => {
  return (
    <Alert
      severity="error"
      variant="filled"
      sx={{
        marginY: "6px",
        padding: "0px",
        width: "100%",
        height: "24px",
        display: "inline-flex",
        "& .MuiAlert-icon": {
          padding: "0px 2px",
        },
        "& .MuiAlert-message": {
          padding: "0px",
        },
      }}
    >
      {errorMessage}
    </Alert>
  );
};

export default AuthenticationFormError;
