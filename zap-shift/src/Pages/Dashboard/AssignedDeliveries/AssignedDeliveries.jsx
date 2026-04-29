import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AssignedDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["parcels", user.email, "Rider_Assigned"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/rider?riderEmail=${user.email}&deliveryStatus=Rider_Assigned`,
      );
      return res.data;
    },
  });

  const handleAcceptDelivery = (parcel) => {
    const statusInfo = { deliveryStatus: "Rider_on_the_way" };
    axiosSecure
      .patch(`/parcels/${parcel._id}/status`, statusInfo)
      .then((res) => {
        if (res.data.modifiedCount) {
          refetch();
          Swal.fire({
            title: "Accepted!",
            text: "Thanks",
            icon: "success",
          });
        }
      });
  };

  const handleMarkedPickedUp = (parcel) => {
    const statusInfo = { deliveryStatus: "Picked_Up" };
    axiosSecure
      .patch(`/parcels/${parcel._id}/status`, statusInfo)
      .then((res) => {
        if (res.data.modifiedCount) {
          refetch();
          Swal.fire({
            title: "Picked Up!",
            text: "Thanks",
            icon: "success",
          });
        }
      });
  };

  const handleMarkedDelivered = (parcel) => {
    const statusInfo = { deliveryStatus: "parcel_delivered", riderID: parcel.riderID };
    axiosSecure
      .patch(`/parcels/${parcel._id}/status`, statusInfo)
      .then((res) => {
        if (res.data.modifiedCount) {
          refetch();
          Swal.fire({
            title: "Delivered!",
            text: "Thanks",
            icon: "success",
          });
        }
      });
  };

  return (
    <div>
      parcel : {parcels.length}
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Action</th>
              <th>Other Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, i) => (
              <tr key={parcel._id}>
                <th>{i + 1}</th>
                <td>{parcel.parcelName}</td>
                <td>
                  {parcel.deliveryStatus == "Rider_Assigned" ? (
                    <td className="flex gap-2">
                      <button
                        onClick={() => handleAcceptDelivery(parcel)}
                        className="btn btn-primary"
                      >
                        Accept
                      </button>
                      <button className="btn btn-primary">Reject</button>
                    </td>
                  ) : (
                    <p>Confirmed</p>
                  )}
                </td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleMarkedPickedUp(parcel)}
                    className="btn btn-primary"
                  >
                    Picked Up
                  </button>
                  <button
                    onClick={() => handleMarkedDelivered(parcel)}
                    className="btn btn-primary"
                  >
                    Delivered
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedDeliveries;
