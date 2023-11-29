export const checkEmptyFields = (
  name: string,
  email: string,
  password: string,
) => {
  if (name === "") {
    throw new Error("Enter your name.")
  }
  if (email === "") {
    throw new Error("Enter your email.");
  }
  if (password === "") {
    throw new Error("Enter your password.");
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

export const confirmPassword = (
  password: string,
  confirmPassword: string
) => {
  if (!(password === confirmPassword)) {
    throw new Error("Passwords don't match.");
  }
};