import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ApproveRiders = () => {
  const axiosSecure = useAxiosSecure();

  const { data: riders = [], refetch } = useQuery({
    queryKey: ["riders", "pending"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders");
      return res.data;
    },
  });

  const updateRiderStatus = (status, rider) => {
    const updateInfo = { status: status, email: rider.Email };
    axiosSecure.patch(`/riders/${rider._id}`, updateInfo).then((res) => {
      
      if (res.data.modifiedCount) {
        refetch();
        Swal.fire({
          title: "Updated!",
          text: `Your file has been ${status}.`,
          icon: "success",
        });
      }
    });
  };

  const handleApproval = (rider) => {
    updateRiderStatus("approved", rider);
  };

  const handleReject = (rider) => {
    updateRiderStatus("rejected", rider);
  };

  return (
    <div>
      Approve Riders : {riders.length}
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Region</th>
              <th>Application Status</th>
              <th>Work Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider, i) => (
              <tr key={rider._id}>
                <th>{i + 1}</th>
                <td>{rider.Name}</td>
                <td>{rider.Region}</td>
                <td>{rider.status}</td>
                <td>{rider.workStatus}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleApproval(rider)}
                    className="btn btn-primary"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => handleReject(rider)}
                    className="btn btn-primary"
                  >
                    Reject
                  </button>
                  <button className="btn btn-primary">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApproveRiders;
