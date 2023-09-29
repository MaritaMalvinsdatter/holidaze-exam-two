import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { API_BASE, API_LOGIN } from '../EndPoints';
import { useApiHelper } from '../ApiHelper'; 

const LoginForm = () => {
  const { saveUserAndToken, token } = useApiHelper(); 
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      // If token exists, navigate to /profile
      navigate('/profile');
    }
  }, [token, navigate]);

  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Invalid email format')
      .test(
        'is-noroff-domain',
        'Email must end with @noroff.no or @stud.noroff.no',
        value => {
          return value && (value.endsWith('@noroff.no') || value.endsWith('@stud.noroff.no'));
        }
      )
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const authenticationUrl = API_BASE + API_LOGIN;
        const response = await fetch(authenticationUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
  
        if (response.ok) {
          const data = await response.json();
          const { name, email, avatar, venueManager, accessToken } = data;
  
          const userData = { name, email, avatar, venueManager };
  
          saveUserAndToken(userData, accessToken); 
          setTimeout(() => {
            navigate('/profile');
          }, 100);
  
          console.log('User logged in:', userData);
        } else {
          setError('Something went wrong, please try again');
        }
      } catch (error) {
        console.error('Registration Error:', error);
        setError('Something went wrong, please try again'); 
      }
    },
  });

  return (
    <div className="d-flex justify-content-center align-items-center vh-70">
      <div className="w-50"> 
        <h1 className="my-5 text-center">Login</h1>
        <Form onSubmit={formik.handleSubmit}>
          <div className="form-outline mb-4">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="e.g user@stud.noroff.no"
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email ? (
              <Alert variant="danger">{formik.errors.email}</Alert>
            ) : null}
          </div>
          <div className="form-outline mb-4">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password ? (
              <Alert variant="danger">{formik.errors.password}</Alert>
            ) : null}
          </div>
          <Button type="submit">Login</Button>
          {error && <Alert variant="danger">{error}</Alert>}
        </Form>
        <p className="mt-3 text-center">
          Don't have an account yet? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
