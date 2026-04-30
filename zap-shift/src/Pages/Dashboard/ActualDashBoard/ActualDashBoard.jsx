import React from "react";
import useRole from "../../../Hooks/useRole";
import Admin from "../Admin/Admin";
import RiderDash from "../RiderDash/RiderDash";
import Merchant from "../Merchant/Merchant";

const ActualDashBoard = () => {
  const { role, isLoading } = useRole();
  console.log(role.role, isLoading);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (role.role === "admin") {
    return <Admin></Admin>;
  } else if (role.role === "rider") {
    return <RiderDash></RiderDash>;
  } else {
    return <Merchant></Merchant>;
  }
};

export default ActualDashBoard;
