import { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

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
    <div className="flex">
      {/* dashboard sidebar */}
      <div className="w-64 min-h-screen bg-purple-800 text-white font-bold">
        <ul className="menu">
          {isAdmin ? (
            <>
              <li>
                <NavLink to="/dashboard/organizerProfile">
                  Organizer Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/addACamp">Add A Camp</NavLink>
              </li>
              <li>
                <NavLink to={`/dashboard/manageCamps/${user.email}`}>
                  Manage Camps
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/manageRegisteredCamps">
                  Manage Registered Camps
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/dashboard/analytics">Analytics</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/participantProfile">
                  Participant Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/registeredCamps">
                  Registered Camps
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/paymentHistory">
                  Payment History
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
      {/* dashboard content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
