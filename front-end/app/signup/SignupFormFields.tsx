import React from "react";
import TextField from "@mui/material/TextField";
import { SignUpFormType } from "./SignupForm";
import AuthenticationFormError from "../components/AuthenticationFormError";

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

  const hasError = (fieldName: keyof SignUpErrorProps) => Boolean(validationErrors[fieldName]);


  return (
    <div >
      <TextField
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
          marginBottom: hasError('name') ? '0' : '36px',
        }}
      />
      {hasError('name') && (
        <AuthenticationFormError errorMessage={validationErrors.name || ""}/>
      )}
      <TextField
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
          marginBottom: hasError('email') ? '0' : '36px',
        }}
      />
      {hasError('email') && (
        <AuthenticationFormError errorMessage={validationErrors.email || ""}/>
      )}
      <TextField
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
          marginBottom: hasError('password') ? '0' : '36px',
        }}
      />
      {hasError('password') && (
       <AuthenticationFormError errorMessage={validationErrors.password || ""}/>
      )}
      <TextField
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
          marginBottom: hasError('passwordConfirmation') ? '0' : '36px',
        }}
      />
      {hasError('passwordConfirmation') && (
        <AuthenticationFormError errorMessage={validationErrors.passwordConfirmation || ""}/>
      )}
    </div>
  );
};

export default SignupFormFields;
