import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import axios from 'axios'; // Corrected import statement

export default function Navbar() {
  const { user, logOut } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [participantInfo, setParticipantInfo] = useState(null);
  
  useEffect(() => {
    // Fetch user info when component mounts
    if (user) {
      axios.get(`http://localhost:5000/participantInfo/${user.email}`)
        .then(response => {
          // Handle successful response
          console.log('Response data:', response.data);
          setParticipantInfo(response.data); // Update state with fetched data
        })
        .catch(error => {
          // Handle error
          console.error('Error fetching data:', error);
        });
    }
  }, [user]);

  const handleLogout = () => {
    logOut()
      .then(() => console.log("logged out"))
      .catch((error) => console.error(error));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const navLinks = (
    <>
      <li>
        <NavLink to="/" activeClassName="font-bold">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/available-camps" activeClassName="font-bold">
          Available Camp
        </NavLink>
      </li>
      <li>
        <NavLink to="/login" activeClassName="font-bold">
          Join Us
        </NavLink>
      </li>
      {user && <></>}
    </>
  );

  return (
    <div className="navbar bg-base-100 py-4">
      <div className="flex justify-between items-center container mx-auto px-4">
        <div className="flex items-center">
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {navLinks}
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost text-xl">
            CampCare360
          </Link>
        </div>
        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navLinks}</ul>
        </div>
        <div className="flex items-center relative">
          {user && participantInfo && (
            <div className="relative" onClick={toggleDropdown}>
              <img
                src={participantInfo.photoURL}
                alt="User profile"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    {participantInfo.name}
                  </div>

                  <Link to="/dashboard/organizerProfile">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                      Dashboard
                    </button>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
