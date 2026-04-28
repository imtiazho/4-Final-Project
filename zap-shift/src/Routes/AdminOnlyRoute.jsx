import React from "react";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import Forbidden from "../Components/Forbidden/Forbidden";

const AdminOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isLoading } = useRole();
    console.log(role);
  if (loading || isLoading) {
    return (
      <p className="flex justify-center items-center w-full h-screen">
        Loading...
      </p>
    );
  }
  
  if(role.role !== 'admin')
  {
    return <Forbidden></Forbidden>
  }

  return children;
};

export default AdminOnlyRoute;
