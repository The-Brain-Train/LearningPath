import React from "react";
import TextField from "@mui/material/TextField";
import { Alert } from "@mui/material";
import { SignUpFormType } from "./SignupForm";

type SignUpErrorProps = {
  name: string | null;
  email: string | null;
  password: string | null;
  passwordConfirmation: string | null;
};

interface SignupFormFieldsProps {
  formData: SignUpFormType;
  validationErrors: SignUpErrorProps;
  passwordConfirmation: string;
  handleInputChange: (e: { target: { name: any; value: any } }) => void;
  handlePasswordChange: (e: { target: { value: string } }) => void;
  handlePasswordConfirmationChange: (e: { target: { value: any } }) => void;
}

const SignupFormFields: React.FC<SignupFormFieldsProps> = ({
  formData,
  validationErrors,
  passwordConfirmation,
  handleInputChange,
  handlePasswordChange,
  handlePasswordConfirmationChange,
}) => {
  return (
    <>
      <TextField
        margin="normal"
        autoComplete="given-name"
        name="name"
        required
        fullWidth
        id="name"
        label="Name"
        onChange={handleInputChange}
        autoFocus
        value={formData.name}
        error={Boolean(validationErrors.name)}
        InputProps={{
          style: { color: "white" },
        }}
        InputLabelProps={{
          style: { color: "white" },
        }}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
        }}
      />
      {validationErrors.name && (
        <Alert
          severity="error"
          variant="filled"
          sx={{
            width: "100%",
            display: "inline-flex",
          }}
        >
          {validationErrors.name}
        </Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        onChange={handleInputChange}
        value={formData.email}
        error={Boolean(validationErrors.email)}
        InputProps={{
          style: { color: "white" },
        }}
        InputLabelProps={{
          style: { color: "white" },
        }}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
        }}
      />
      {validationErrors.email && (
        <Alert
          severity="error"
          variant="filled"
          sx={{
            width: "100%",
            display: "inline-flex",
          }}
        >
          {validationErrors.email}
        </Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        onChange={handlePasswordChange}
        value={formData.password}
        error={Boolean(validationErrors.password)}
        InputProps={{
          style: { color: "white" },
        }}
        InputLabelProps={{
          style: { color: "white" },
        }}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
        }}
      />
      {validationErrors.password && (
        <Alert
          severity="error"
          variant="filled"
          sx={{
            width: "100%",
            display: "inline-flex",
          }}
        >
          {validationErrors.password}
        </Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        name="passwordConfirmation"
        label="Confirm Password"
        type="password"
        id="passwordConfirmation"
        autoComplete="new-password"
        onChange={handlePasswordConfirmationChange}
        value={passwordConfirmation}
        error={Boolean(validationErrors.passwordConfirmation)}
        InputProps={{
          style: { color: "white" },
        }}
        InputLabelProps={{
          style: { color: "white" },
        }}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
        }}
      />
      {validationErrors.passwordConfirmation && (
        <Alert
          severity="error"
          variant="filled"
          sx={{
            width: "100%",
            display: "inline-flex",
          }}
        >
          {validationErrors.passwordConfirmation}
        </Alert>
      )}
    </>
  );
};

export default SignupFormFields;
