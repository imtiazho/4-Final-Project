import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const AssignRider = () => {
  const [selectedParcel, setSelectedParcel] = useState(null);
  const axiosSecure = useAxiosSecure();
  const modalRef = useRef();
  const { data: parcels = [] } = useQuery({
    queryKey: ["parcels", "pending-pickup"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/parcels?deliveryStatus=pending-pickup",
      );
      return res.data;
    },
  });

  const { data: riders = [] } = useQuery({
    queryKey: ["riders", selectedParcel?.senderDistrict, "available"],
    enabled: !!selectedParcel,
    queryFn: async () => {
      const res = axiosSecure.get(
        `/riders?status=approved&district=${selectedParcel?.senderDistrict}&workStatus=available`,
      );
      return (await res).data;
    },
  });

  const openAssignRiderModal = (parcel) => {
    setSelectedParcel(parcel);
    modalRef.current.showModal();
  };

  const handleAssignRider = (rider) => {
    const riderAssignInfo = {
      riderID: rider._id,
      riderEmail: rider.email,
      riderName: rider.name,
      parcelID: selectedParcel._id,
    };

    axiosSecure.patch(``, riderAssignInfo);
  };

  return (
    <div>
      Assign Rider
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {" "}
            {riders.length} riders are available on targeted locations
          </h3>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {riders.map((rider, i) => (
                  <tr key={rider._id}>
                    <th>{i + 1}</th>
                    <td>{rider.Name}</td>
                    <td>
                      <button
                        onClick={() => handleAssignRider(rider)}
                        className="btn btn-primary"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>NO</th>
              <th>Name</th>
              <th>Cost</th>
              <th>Pick Up District</th>
              <th>Tracking ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, i) => (
              <tr key={parcel._id}>
                <th>{i + 1}</th>
                <td>{parcel.parcelName}</td>
                <td>$ {parcel.cost}</td>
                <td>{parcel.senderDistrict}</td>
                <td>{parcel.trackingID}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => openAssignRiderModal(parcel)}
                    className="btn btn-primary"
                  >
                    Find Rider
                  </button>
                  {/* <button className="btn btn-primary">View</button>
                  <button className="btn btn-primary">Delete</button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignRider;
