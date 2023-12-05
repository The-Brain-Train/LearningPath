"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";
import { validateSignUpForm } from "../functions/validations";
import { signUp } from "../functions/httpRequests";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Alert } from "@mui/material";

export type SignUpFormType = {
  name: string;
  email: string;
  password: string;
};

const SignupForm = () => {
  const [formData, setFormData] = useState<SignUpFormType>({
    name: "",
    email: "",
    password: "",
  });
  const [genericError, setGenericError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfirmationError, setPasswordConfirmationError] = useState<
    string | null
  >(null);

  const router = useRouter();
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [validationChecks, setValidationChecks] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    minLength: false,
  });

  const passwordRequirementsCheck = (password: string): void => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[@#$%^&+=*!-]/.test(password);

    setValidationChecks({
      uppercase: hasUppercase,
      lowercase: hasLowercase,
      number: hasDigit,
      specialChar: hasSpecialChar,
      minLength: password.length >= 8,
    });
  };

  const handlePasswordChange = (e: { target: { value: string } }) => {
    const { value } = e.target;
    setFormData({ ...formData, password: value });
    passwordRequirementsCheck(value);
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordConfirmationChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    setPasswordConfirmation(value);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setPasswordConfirmationError(null);

    try {
      validateSignUpForm(formData, passwordConfirmation);
      await signUp(formData);
      toast.success("Successful! Being redirected to the login page", {
        position: "top-center",
        autoClose: 3000,
        onClose: () => {
          router.push("/signin?source=signup");
        },
      });
    } catch (error: any) {
      if (error.message.includes("|")) {
        const [fieldName, errorMessage] = error.message.split("|");
        switch (fieldName) {
          case "name":
            setNameError(errorMessage);
            break;
          case "email":
            setEmailError(errorMessage);
            break;
          case "password":
            setPasswordError(errorMessage);
            break;
          case "passwordConfirmation":
            setPasswordConfirmationError(errorMessage);
            break;
          default:
            setGenericError(errorMessage);
            break;
        }
        setTimeout(() => {
          setNameError(null);
          setEmailError(null);
          setPasswordError(null);
          setPasswordConfirmationError(null);
          setGenericError(null);
        }, 5000);
      } else {
        setGenericError(error.message);
        setTimeout(() => {
          setGenericError(null);
        }, 5000);
      }
      return;
    }
  };

  return (
    <Container className="main-background m-0 min-w-full " component="main">
      <CssBaseline />
      <Box className="mt-20 flex flex-col items-center">
        <Avatar sx={{ m: 1, bgcolor: "#141832" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography className="text-white" component="h2" variant="h5">
          Register / Create Account
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 1, maxWidth: 520 }}
        >
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
          {nameError && (
            <Alert severity="error" variant="filled" className="min-w-full inline-flex">
              {nameError}
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
          {emailError && (
            <Alert severity="error" variant="filled" className="min-w-full inline-flex">
              {emailError}
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
          {passwordError && (
            <Alert severity="error" variant="filled" className="min-w-full inline-flex">
              {passwordError}
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
          {passwordConfirmationError && (
            <Alert severity="error" variant="filled" className="min-w-full inline-flex">
              {passwordConfirmationError}
            </Alert>
          )}
          <div>
            <Typography variant="body2" className="text-white font-semibold">
              Password Requirements
            </Typography>
            <ul className="text-white text-xs">
              <li>
                {validationChecks.uppercase ? (
                  <>
                    <CheckCircleIcon sx={{ color: "#0e9f6e", fontSize: 15 }} />{" "}
                    At least one Uppercase letter
                  </>
                ) : (
                  <>
                    <CheckCircleIcon sx={{ color: "gray", fontSize: 15 }} /> At
                    least one Uppercase letter
                  </>
                )}
              </li>
              <li>
                {validationChecks.lowercase ? (
                  <>
                    <CheckCircleIcon sx={{ color: "#0e9f6e", fontSize: 15 }} />{" "}
                    At least one Lowercase letter
                  </>
                ) : (
                  <>
                    <CheckCircleIcon sx={{ color: "gray", fontSize: 15 }} /> At
                    least one Lowercase letter
                  </>
                )}
              </li>
              <li>
                {validationChecks.number ? (
                  <>
                    <CheckCircleIcon sx={{ color: "#0e9f6e", fontSize: 15 }} />{" "}
                    At least one Number
                  </>
                ) : (
                  <>
                    <CheckCircleIcon sx={{ color: "gray", fontSize: 15 }} /> At
                    least one Number
                  </>
                )}
              </li>
              <li>
                {validationChecks.specialChar ? (
                  <>
                    <CheckCircleIcon sx={{ color: "#0e9f6e", fontSize: 15 }} />{" "}
                    At least one Special character e.g.: @#$%^&+=*!-
                  </>
                ) : (
                  <>
                    <CheckCircleIcon sx={{ color: "gray", fontSize: 15 }} /> At
                    least one Special character e.g.: @#$%^&+=*!-
                  </>
                )}
              </li>
              <li>
                {validationChecks.minLength ? (
                  <>
                    <CheckCircleIcon sx={{ color: "#0e9f6e", fontSize: 15 }} />{" "}
                    At least 8 characters
                  </>
                ) : (
                  <>
                    <CheckCircleIcon sx={{ color: "gray", fontSize: 15 }} /> At
                    least 8 characters
                  </>
                )}
              </li>
            </ul>
          </div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: "#1976d2 !important" }}
          >
            Sign Up
          </Button>
          {genericError && (
            <Alert severity="error" variant="filled">
              {genericError}
            </Alert>
          )}
          <ToastContainer />
          <Grid container justifyContent="flex-start">
            <Grid item>
              <Link
                href="/signin?source=signup"
                className="text-lg hover:underline text-white"
                sx={{
                  color: "white !important",
                  fontSize: "1.125rem !important",
                  lineHeight: "1.75rem !important",
                }}
              >
                Already have an account?{" "}
                <span className="text-blue-500 font-bold">Sign in</span>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupForm;
