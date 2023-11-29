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
import {
  checkEmptyFields,
  validatePassword,
  validateEmail,
  confirmPassword,
} from "../functions/validations";
import { signUp } from "../functions/httpRequests";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

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

    try {
      checkEmptyFields(formData.name, formData.email, formData.password);
      validateEmail(formData.email);
      validatePassword(formData.password);
      confirmPassword(formData.password, passwordConfirmation);
      await signUp(formData);
      setError(null);
      toast.success("Successful! Being redirected to the login page", {
        position: "top-center",
        autoClose: 3000,
        onClose: () => {
          router.push('/signin?source=signup');
        },
      });
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 2000);
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
          className="max-w-xl "
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            onChange={handleInputChange}
            value={formData.password}
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
          {error && (
            <Typography className="text-red-500 text-center font-semibold font-xs">
              {error}
            </Typography>
          )}
          <p className="text-white text-xs text-center pt-4">
            <span className="underline">Note:</span> Please choose a stronger password.
            Password should be at least 8 characters long. Try a mix of uppercase and
            lowercase letters, numbers, and symbols.
          </p>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: "#1976d2 !important" }}
          >
            Sign Up
          </Button>
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