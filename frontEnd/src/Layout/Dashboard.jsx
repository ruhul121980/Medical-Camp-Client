import { NavLink, Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="flex">
        {/* dashboard sidebar */}
      <div className="w-64 min-h-screen bg-purple-800 text-white font-bold">
        <ul className="menu">
            
            <li><NavLink to="/dashboard/organizerProfile">Organizer Profile</NavLink></li>
            <li><NavLink to="/dashboard/addACamp">Add A Camp</NavLink></li>
            <li><NavLink to="/dashboard/manageCamps">Manage Camps</NavLink></li>
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
