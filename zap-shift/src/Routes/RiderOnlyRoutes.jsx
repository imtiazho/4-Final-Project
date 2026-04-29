import React from "react";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import Forbidden from "../Components/Forbidden/Forbidden";

const RiderOnlyRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isLoading } = useRole();
  console.log(role.role);
  if (loading || isLoading) {
    return (
      <p className="flex justify-center items-center w-full h-screen">
        Loading...
      </p>
    );
  }

  if (role.role !== "rider") {
    return <Forbidden></Forbidden>;
  }

  return children;
};

export default RiderOnlyRoutes;
