import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const AddACamp = () => {
  const initialValues = {
    name: '',
    image: '',
    fees: '',
    dateTime: '',
    location: '',
    healthcareProfessional: '',
    participantCount: 0,
    description: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    image: Yup.string().url('Invalid URL').required('Required'),
    fees: Yup.number().required('Required'),
    dateTime: Yup.string().required('Required'),
    location: Yup.string().required('Required'),
    healthcareProfessional: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
  });

  const onSubmit = (values, { resetForm }) => {
    axios.post('http://localhost:5000/addCamp', values)
      .then(response => {
        console.log(response.data);
        resetForm();
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-slate-300 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Camp</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {formik => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Camp Name</label>
              <Field
                type="text"
                name="name"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <Field
                type="text"
                name="image"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="image" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Camp Fees</label>
              <Field
                type="number"
                name="fees"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="fees" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date & Time</label>
              <Field
                type="text"
                name="dateTime"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="dateTime" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <Field
                type="text"
                name="location"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="location" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Healthcare Professional Name</label>
              <Field
                type="text"
                name="healthcareProfessional"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="healthcareProfessional" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <Field
                as="textarea"
                name="description"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddACamp;
