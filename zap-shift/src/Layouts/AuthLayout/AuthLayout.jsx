import React from "react";
import { Outlet } from "react-router";
import authImg from "../../assets/authImage.png";

const AuthLayout = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-12">
        <div className="flex-1">
        <Outlet></Outlet>
      </div>
      <div className="flex-1">
        <img src={authImg} alt="" />
      </div>
      </div>
    </div>
  );
};

export default AuthLayout;
