import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';

export default function Navbar() {
    const { user, logOut } = useContext(AuthContext);
    const [isHovered, setIsHovered] = useState(false);

    const handleLogout = () => {
        logOut()
            .then(() => console.log('logged out'))
            .catch(error => console.error(error));
    };

    const userPhotoURL = user && user.photoURL;

    const navLinks = (
        <>
            <li><NavLink to="/" activeClassName="font-bold">Home</NavLink></li>
            <li><NavLink to="/allArt" activeClassName="font-bold">All Art & craft Items</NavLink></li>
            {
                user && (
                    <>
                       
                        <li><NavLink to="/addCraft" activeClassName="font-bold">Add Craft Item</NavLink></li>
                        <li> <Link to="/myARt" className="btn btn-sm ">My Art&Craft List</Link></li>
                    </>
                )
            }
        </>
    );

    return (
        <div className="navbar bg-base-100 py-4">
            <div className="flex justify-between items-center container mx-auto px-4">
                <div className="flex items-center">
                    <div className="dropdown lg:hidden">
                        <div tabIndex={0} role="button" className="btn btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {navLinks}
                        </ul>
                    </div>
                    <Link to="/" className="btn btn-ghost text-xl">R.A.H Art & Craft</Link>
                </div>
                <div className="hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {navLinks}
                    </ul>
                </div>
                <div className="flex items-center relative">
                    {user ? (
                        <>
                       

                            <span
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                className="relative"
                            >
                                <img src={userPhotoURL} alt="User profile" className="w-8 h-8 rounded-full mr-2" />
                                {isHovered && <span className="absolute top-0 left-0 bg-white p-1 rounded">{user.displayName}</span>}
                            </span>
                            <button onClick={handleLogout} className="btn btn-sm">Log Out</button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-sm">Login</Link>
                    )}
                </div>
            </div>
        </div>
    );
}
