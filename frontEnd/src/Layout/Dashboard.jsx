import { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import Navbar from './../components/Shared/Navbar';

export default function Dashboard() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading user information...</div>;
  }

  if (!user || !user.email) {
    return <div>Please log in to access the dashboard.</div>;
  }

  const isAdmin = user.email === 'admin@gmail.com';

  return (
    <div>
      <Navbar />
      <div className="flex flex-col lg:flex-row">
        
        {/* dashboard sidebar */}
        <div className="w-full lg:w-64 lg:min-h-screen bg-purple-800 text-white font-bold">
          <ul className="menu flex flex-col lg:block">
            {isAdmin ? (
              <>
                <li className="py-2 px-4 lg:py-2">
                  <NavLink to="/dashboard/organizerProfile">
                    Organizer Profile
                  </NavLink>
                </li>
                <li className="py-2 px-4 lg:py-2">
                  <NavLink to="/dashboard/addACamp">Add A Camp</NavLink>
                </li>
                <li className="py-2 px-4 lg:py-2">
                  <NavLink to={`/dashboard/manageCamps/${user.email}`}>
                    Manage Camps
                  </NavLink>
                </li>
                <li className="py-2 px-4 lg:py-2">
                  <NavLink to="/dashboard/manageRegisteredCamps">
                    Manage Registered Camps
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="py-2 px-4 lg:py-2">
                  <NavLink to="/dashboard/analytics">Analytics</NavLink>
                </li>
                <li className="py-2 px-4 lg:py-2">
                  <NavLink to="/dashboard/participantProfile">
                    Participant Profile
                  </NavLink>
                </li>
                <li className="py-2 px-4 lg:py-2">
                  <NavLink to="/dashboard/registeredCamps">
                    Registered Camps
                  </NavLink>
                </li>
                <li className="py-2 px-4 lg:py-2">
                  <NavLink to="/dashboard/paymentHistory">
                    Payment History
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
        {/* dashboard content */}
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
