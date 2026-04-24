import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Link } from "react-router";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["myParcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  const handleParcelDelete = (id) => {
    Swal.fire({
      title: "Are you agree ?",
      text: `You will be deleted`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.isConfirmed)
        // Send it to database via server
        axiosSecure.delete(`/parcels/${id}`).then((res) => {
          if (res.data.deletedCount) {
            // Refresh the data
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        });
    });
  };
  return (
    <div>
      MyParcels : {parcels?.length}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Cost</th>
              <th>Payment Status</th>
              <th>Delivery Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels?.map((parcel, index) => (
              <tr key={parcel._id}>
                <th>{index + 1}</th>
                <td>{parcel?.parcelName}</td>
                <td>{parcel?.cost || "None"}</td>
                <td>
                  {parcel?.paymentStatus == "paid" ? (
                    <span className="text-green-400">Paid</span>
                  ) : (
                    <Link
                      to={`/dashboard/payment/${parcel._id}`}
                      className="btn btn-primary"
                    >
                      Pay
                    </Link>
                  )}
                </td>
                <td>{parcel?.deliverStatus}</td>
                <td className="flex gap-2">
                  <button className="btn btn-primary">Edit</button>
                  <button className="btn btn-primary">View</button>
                  <button
                    onClick={() => handleParcelDelete(parcel._id)}
                    className="btn btn-primary"
                  >
                    Delete
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

export default MyParcels;
