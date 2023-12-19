"use client";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";
import { validateSignUpForm } from "../functions/validations";
import { signUp } from "../functions/httpRequests";
import { Alert } from "@mui/material";
import PasswordRequirements from "./PasswordRequirements";
import SignupFormFields from "./SignupFormFields";
import { useCookies } from "react-cookie";

export type SignUpFormType = {
  name: string;
  email: string;
  password: string;
};

type SignUpErrorsType = {
  name: string | null;
  email: string | null;
  password: string | null;
  passwordConfirmation: string | null;
  generic: string | null;
};

const SignupForm = () => {
  const [cookies, setCookie] = useCookies(["user"]);
  const router = useRouter();
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [formData, setFormData] = useState<SignUpFormType>({
    name: "",
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState<SignUpErrorsType>({
    name: null,
    email: null,
    password: null,
    passwordConfirmation: null,
    generic: null,
  });
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

    try {
      validateSignUpForm(formData, passwordConfirmation);
      const token: string = await signUp(formData);
      const expirationDate = new Date();

      expirationDate.setDate(expirationDate.getDate() + 1);
      setCookie("user", token, {
        path: "/",
        sameSite: "none",
        secure: true, 
        expires: expirationDate
      });
      router.push("/");
    } catch (error: any) {
      if (error.message.includes("|")) {
        const [fieldName, errorMessage] = error.message.split("|");
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [fieldName]: errorMessage,
        }));

        setTimeout(() => {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: null,
          }));
        }, 3000);
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          generic: error.message,
        }));
        setTimeout(() => {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            generic: null,
          }));
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
          sx={{ mt: 1, width:"100%", maxWidth: 575 }}
        >
          <SignupFormFields
            formData={formData}
            validationErrors={validationErrors}
            passwordConfirmation={passwordConfirmation} 
            handleInputChange={handleInputChange}
            handlePasswordChange={handlePasswordChange}
            handlePasswordConfirmationChange={handlePasswordConfirmationChange}
          />
          <PasswordRequirements
            validationChecks={validationChecks}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: "#1976d2 !important" }}
          >
            Sign Up
          </Button>
          {validationErrors.generic && (
            <Alert severity="error" variant="filled">
              {validationErrors.generic}
            </Alert>
          )}
          <Grid container justifyContent="flex-start">
            <Grid item>
              <Link
                href="/signin"
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
