"use client";
import React, { useState } from "react";
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
import { signIn } from "../functions/httpRequests";
import { validateSignInForm } from "../functions/validations";
import { Alert } from "@mui/material";

export type SignInFormType = {
  email: string;
  password: string;
};

const SigninForm = () => {
  const [formData, setFormData] = useState<SignInFormType>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [cookies, setCookie] = useCookies(["user"]);
  const router = useRouter();

  const searchParams = useSearchParams();
  const directedFromSignup = searchParams.get("source");

  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      validateSignInForm(formData);
      const token = await signIn(formData);
      setError(null);
      setCookie("user", token, {
        path: "/",
      });
      if (directedFromSignup) {
        router.push("/");
      } else {
        router.back();
      }
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
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
          <div>
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
            {error && (
              <Alert severity="error">{error}</Alert>
            )}
          </div>
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
                sx={{
                  color: "white !important",
                  fontSize: "1.125rem !important",
                  lineHeight: "1.75rem !important",
                }}
              >
                Don&apos;t have an account?{" "}
                <span className="text-blue-500 font-bold">Sign up</span>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SigninForm;
