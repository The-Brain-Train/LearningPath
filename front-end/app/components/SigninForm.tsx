"use client";
import * as React from "react";
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
import { useRouter } from "next/navigation";
import { useState } from "react";

const SigninForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [cookies, setCookie] = useCookies(["user"]);
  const router = useRouter();
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);


  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    if (name === "email") {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      setIsEmailValid(emailRegex.test(value));
    }
    setIsFormValid(isEmailValid && formData.password.trim() !== "");
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const BACKEND_URL = process.env.BACKEND_URL;

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
        router.push("/");
      } else {
        console.error("Error submitting form data:", response.statusText);
      }

      if (response.status === 403) {
        setError("Invalid email or password. Please try again.");
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    } catch (error) {
      setError("An error occurred while signing in.");
    }
  };

  return (
    <Container component="main" className="main-background">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
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
          />
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: "#1976d2 !important" }}
            disabled={!isFormValid}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SigninForm;
