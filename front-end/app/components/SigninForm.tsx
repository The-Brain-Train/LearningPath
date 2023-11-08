"use client";
import React, { useEffect, useState } from "react";
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
import { useCookies } from "react-cookie";
import { useRouter, useSearchParams } from "next/navigation";

const SigninForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [cookies, setCookie] = useCookies(["user"]);
  const router = useRouter();
  const [isEmailValid, setIsEmailValid] = useState(true);
  
  const searchParams = useSearchParams();
  const directedFromSignup = searchParams.get("source");

  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      setIsEmailValid(emailRegex.test(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEmailValid && formData.password.trim() !== "") {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const data = await response.json();
          const token = data.token;
          setCookie("user", token, {
            path: "/",
          });
          if (directedFromSignup) {
            router.push("/");
          } else {
            router.back();
          }
        } else {
          console.error("Error submitting form data:", response.statusText);
        }
        if (response.status === 403) {
          setError("Incorrect password. Please try again.");
        }
        if (response.status === 401) {
          setError("Invalid Email. Please try again or sign up.");
        }
      } catch (error) {
        setError("An error occurred while signing in.");
      }
    } else {
      setError("Please fill out the form correctly.");
    }
  };

  return (
    <Container component="main" className="main-background m-0 min-w-full">
      <CssBaseline />
      <Box className="mt-20 flex flex-col items-center">
        <Avatar sx={{ m: 1, bgcolor: "#141832" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography className="text-white" component="h2" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            autoFocus
            error={!isEmailValid}
            helperText={!isEmailValid ? "Invalid email format" : ""}
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
            onChange={handleInputChange}
            value={formData.password}
            autoComplete="current-password"
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: "#1976d2 !important" }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link
                href="/signup"
                className="text-lg hover:underline text-white"
              >
                Don&apos;t have an account?{" "}
                <span className="text-blue-500 font-bold">Sign up</span>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {error && (
        <Typography className=" text-red-500 text-center font-semibold font-xs">
          {error}
        </Typography>
      )}
    </Container>
  );
};

export default SigninForm;
