import { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex">
        {/* dashboard sidebar */}
      <div className="w-64 min-h-screen bg-purple-800 text-white font-bold">
        <ul className="menu">
            
            <li><NavLink to="/dashboard/organizerProfile">Organizer Profile</NavLink></li>
            <li><NavLink to="/dashboard/addACamp">Add A Camp</NavLink></li>
            <li><NavLink to={`/dashboard/manageCamps/${user.email}`}>Manage Camps</NavLink></li>
            <li><NavLink to="/dashboard/manageRegisteredCamps">Manage Registered Camps</NavLink></li>
        </ul>
      </div>
      {/* dashboard content */}
      <div className="flex-1">
        <Outlet></Outlet>
      </div>
    </div>
  )
}
