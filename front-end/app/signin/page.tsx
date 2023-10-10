'use client'
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from "next/navigation";
// import Cookies from 'js-cookie'

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [cookies, setCookie] = useCookies(["user"]);
  const router = useRouter(); 

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8080/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        setCookie("user", token, {
          path: "/"
        });
        console.log('Form data submitted successfully:', formData);
        console.log(cookies.user);
        router.push('/');
      } else {

        console.error('Error submitting form data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className="mt-20" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit">Sign In</button>
    </form>
  );
};

export default Signin;