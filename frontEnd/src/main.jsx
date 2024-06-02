import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './components/Root';
import Login from './components/Login';
import Register from './components/Register';
import AuthProvider from './providers/AuthProvider';
import NotFound from './components/NotFound';
import Home from './components/Home/Home';
import Dashboard from './Layout/Dashboard';
import AddACamp from './pages/DashboardPage/AddACamp';
import OrganizerProfile from './pages/DashboardPage/OrganizerProfile';
import ManageCamps from './pages/DashboardPage/ManageCamps';
import ManageRegisteredCamps from './pages/DashboardPage/ManageRegisteredCamps';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './providers/queryClient';
import AvailableCamps from './pages/AvailableCamp/AvailableCamps';
import DetailsPopularCamp from './components/Home/DetailsPopularCamp';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        path: '/',
        element: <Home></Home>
      },
      {
        path: '/login',
        element: <Login></Login>
      },
      {
        path: '/register',
        element: <Register></Register>
      },
      {
        path: '/available-camps',
        element: <AvailableCamps></AvailableCamps>
      },
      {
        path:'/popularDetails/:id',
        element:<DetailsPopularCamp></DetailsPopularCamp>
      },
      {
        path: '*',
        element: <NotFound></NotFound>
      }
    ]
  },
  {
    path: 'dashboard',
    element: <Dashboard></Dashboard>,
    children: [
      {
        path: 'organizerProfile',
        element: <OrganizerProfile></OrganizerProfile>
      },
      {
        path: 'addACamp',
        element: <AddACamp></AddACamp>
      },
      {
        path: 'manageCamps',
        element: <ManageCamps></ManageCamps>
      },
      {
        path: 'manageRegisteredCamps',
        element: <ManageRegisteredCamps></ManageRegisteredCamps>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
