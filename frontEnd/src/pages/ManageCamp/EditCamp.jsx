import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../../providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const EditCamp = () => {
  const { user } = useContext(AuthContext);
  const email = user.email;

  const fetchCamps = async (userEmail) => {
    const { data } = await axios.get(`http://localhost:5000/allCamp/${userEmail}`);
    return data;
  };

  const { data: camps, error, isLoading } = useQuery({
    queryKey: ["camps", email],
    queryFn: () => fetchCamps(email),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading camps</div>;
  }

  const camp = camps[0] || {}; // Assuming you're editing the first camp

  const initialValues = {
    name: camp.name || '',
    image: camp.image || '',
    fees: camp.fees || '',
    dateTime: camp.dateTime || '',
    location: camp.location || '',
    healthcareProfessional: camp.healthcareProfessional || '',
    participantCount: camp.participantCount || 0,
    description: camp.description || '',
    email,
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

  const onSubmit =async (values, { resetForm }) => {
    try {
      const response = await axios.put(`http://localhost:5000/updateCamp/${camp._id}`, values);
      console.log(response.data);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Camp details updated successfully!',
      });
      resetForm();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again.',
      });
    }
    resetForm();
      
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-slate-300 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Camp</h1>
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

export default EditCamp;
