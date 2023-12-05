
import React from "react";
import TextField from "@mui/material/TextField";
import { Alert } from "@mui/material";
import { SignUpFormType } from "./SignupForm";

interface SignupFormFieldsProps {
  formData: SignUpFormType;
  nameError: string | null;
  emailError: string | null;
  passwordError: string | null;
  passwordConfirmation: string;
  passwordConfirmationError: string | null;
  handleInputChange: (e: { target: { name: any; value: any } }) => void;
  handlePasswordChange: (e: { target: { value: string } }) => void;
  handlePasswordConfirmationChange: (e: { target: { value: any } }) => void;
}

const SignupFormFields: React.FC<SignupFormFieldsProps> = ({
  formData,
  nameError,
  emailError,
  passwordError,
  passwordConfirmation,
  passwordConfirmationError,
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
        error={Boolean(nameError)}
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
      {nameError && <Alert severity="error" variant="filled">{nameError}</Alert>}

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
        error={Boolean(emailError)}
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
      {emailError && <Alert severity="error" variant="filled">{emailError}</Alert>}

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
        error={Boolean(passwordError)}
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
      {passwordError && <Alert severity="error" variant="filled">{passwordError}</Alert>}

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
        error={Boolean(passwordConfirmationError)}
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
      {passwordConfirmationError && <Alert severity="error" variant="filled">{passwordConfirmationError}</Alert>}
    </>
  );
};

export default SignupFormFields;
