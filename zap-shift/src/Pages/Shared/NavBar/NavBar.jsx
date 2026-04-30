import React, { useContext } from "react";
import { Link, NavLink } from "react-router";
import useAuth from "../../../Hooks/useAuth";

const NavBar = () => {
  const { user, handleLogOut } = useAuth();
  const handleSignOut = () => {
    handleLogOut()
      .then(() => {
        console.log("SignOut");
      })
      .then((err) => console.log(err));
  };

  const list = (
    <>
      <li>
        <NavLink>Item 1</NavLink>
      </li>
      <li>
        <NavLink to="/coverage">Coverage</NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink to="/send-parcel">Send Parcel</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/actual">Dashboard</NavLink>
          </li>
        </>
      )}
    </>
  );
  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {list}
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">daisyUI</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{list}</ul>
        </div>
        <div className="navbar-end">
          {user ? (
            <button onClick={handleSignOut} className="btn btn-primary">
              SignOut
            </button>
          ) : (
            <div>
              <Link className="btn btn-primary" to="/login">
                Login
              </Link>
            </div>
          )}

          <Link className="btn btn-primary mx-2" to="/be-a-rider">
            Be a rider
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
