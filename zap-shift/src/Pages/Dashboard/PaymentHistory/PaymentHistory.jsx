import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: payments = [] } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);

      return res.data;
    },
  });
  return (
    <div>
      Payment History : {payments.length}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Parcel Name</th>
              <th>Transaction</th>
              <th>Tracking Id</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, i) => (
              <tr key={payment._id}>
                <th>{i + 1}</th>
                <td>{payment?.parcelName}</td>
                <td>{payment?.transactionId}</td>
                <td>{payment?.trackingID || "Ei functionality bananor agei data entry hoise boss"}</td>
                <td>$ {payment?.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
