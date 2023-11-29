import { SignUpFormType } from "../signup/SignupForm";

export const validateSignUpForm = (
  formData: SignUpFormType,
  confirmPassword: string,
) => {
  checkEmptyFields(formData.name, formData.email, formData.password);
  validateEmail(formData.email);
  validatePassword(formData.password);
  validateConfirmPassword(formData.password, confirmPassword);
};

export const checkEmptyFields = (
  name: string,
  email: string,
  password: string,
) => {
  if (name.trim().length === 0) {
    throw new Error("Name cannot be empty.")
  }
  if (email.trim().length === 0) {
    throw new Error("Email cannot be empty.");
  }
  if (password.trim().length === 0) {
    throw new Error("Password cannot be empty.");
  }
};

export const validateEmail = (email: string) => {
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!regex.test(email)) {
    throw new Error("Invalid email format.");
  }
};

export const validatePassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;
  if (!regex.test(password)) {
    throw new Error("Invalid password.");
  }
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
) => {
  if (!(password === confirmPassword)) {
    throw new Error("Passwords don't match.");
  }
};