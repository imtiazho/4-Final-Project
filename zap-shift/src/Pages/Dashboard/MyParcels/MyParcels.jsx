import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: parcels = [] } = useQuery({
    queryKey: ["myParcels", user],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email${user.email}`);
      return res.data;
    },
  });
  return <div>MyParcels : {parcels.length}</div>;
};

export default MyParcels;
