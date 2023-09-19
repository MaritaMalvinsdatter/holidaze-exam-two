import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { API_BASE, API_REGISTER } from '../EndPoints';
import { useApiHelper } from '../ApiHelper';

const RegisterForm = () => {
  const { apiRequest, saveUserAndToken } = useApiHelper(); 

  const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required')
      .matches(/@(noroff\.no|stud\.noroff\.no)$/, 'Email must end with @noroff.no or @stud.noroff.no'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    avatar: yup.string().url('Invalid URL format'),
    venueManager: yup.boolean().required(),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      avatar: '',
      venueManager: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
        console.log('Form Values:', values);
      try {
        const registerURL = API_BASE + API_REGISTER;
        const response = await apiRequest(registerURL, {
          method: 'post',
          body: JSON.stringify(values),
        });

        if (response) {
          const { userData, authToken } = response;
          saveUserAndToken(userData, authToken);
        } else {
          console.log('ERROR');
        }
      } catch (error) {
        console.error('Registration Error:', error);
      }
    },
  });

  return (
    <div className="d-flex justify-content-center align-items-center vh-70">
      <div className="w-50"> 
      <h1 className="my-5 text-center">Register New User:</h1>
        <Form onSubmit={formik.handleSubmit}>
          <div className="form-outline mb-4">
            <Form.Label>Name:</Form.Label>
            <Form.Control
            type="text"
            name="name"
            placeholder="Write your name"
            {...formik.getFieldProps('name')}
          />
          {formik.touched.name && formik.errors.name ? (
          <Alert variant="danger">{formik.errors.name}</Alert>
        ) : null}
      </div>
      <div className="form-outline mb-4">
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="email"
          name="email"
          placeholder="Enter your email"
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
      <div className="form-outline mb-4">
        <Form.Label>Avatar URL (Optional):</Form.Label>
        <Form.Control
          type="url"
          name="avatar"
          placeholder="Enter your avatar URL"
          {...formik.getFieldProps('avatar')}
        />
        {formik.touched.avatar && formik.errors.avatar ? (
          <Alert variant="danger">{formik.errors.avatar}</Alert>
        ) : null}
      </div>
      <div className="form-check mb-4">
        <Form.Check 
         type="checkbox"
          label="Register as Venue Manager"
          name="venueManager"
          {...formik.getFieldProps('venueManager')}
        />
      </div>
      <Button type="submit">Register</Button>
    </Form>
      </div>
    </div>
    
  );
};

export default RegisterForm;
