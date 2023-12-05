import { SignInFormType } from "../signin/SigninForm";
import { SignUpFormType } from "../signup/SignupForm";

export const validateSignUpForm = (
  formData: SignUpFormType,
  confirmPassword: string
) => {
  validateName(formData.name);
  validateEmail(formData.email);
  validatePassword(formData.password);
  validateConfirmPassword(formData.password, confirmPassword);
};

export const validateSignInForm = (formData: SignInFormType) => {
  validateEmail(formData.email);
  if (formData.password.trim().length === 0) {
    throw new Error("password|Invalid password.");
  }
};

export const validateName = (name: string) => {
  if (name.trim().length === 0) {
    throw new Error("name|Name cannot be empty.");
  }
};

export const validateEmail = (email: string) => {
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!regex.test(email) || email.trim().length === 0) {
    throw new Error("email|Invalid email address.");
  }
};

export const validatePassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=*!-]).{8,}$/;

  if (!regex.test(password) || password.trim().length === 0) {
    throw new Error("password|Invalid password.");
  }
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
) => {
  if (!(password === confirmPassword)) {
    throw new Error("passwordConfirmation|Passwords don't match.");
  }
};