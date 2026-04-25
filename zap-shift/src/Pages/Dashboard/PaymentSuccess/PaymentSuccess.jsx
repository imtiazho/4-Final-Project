import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const [paymentInfo, setPaymentInfo] = useState({});
  const [searchParams] = useSearchParams();
  const sessionID = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure();
  // console.log(sessionID);

  useEffect(() => {
    if (sessionID) {
      axiosSecure
        .patch(`/verify-payment?session_id=${sessionID}`)
        .then((res) => {
          console.log(res.data);
          setPaymentInfo({
            transactionId: res.data.transactionId,
            trackingID: res.data.trackingID,
          });
        });
    }
  }, [sessionID, axiosSecure]);

  return (
    <div>
      Payment Successful!
      <br /> Transaction ID:{" "}
      <span className="text-red-700">{paymentInfo.transactionId}</span> and Tracking
      ID: <span className="text-red-700"> {paymentInfo.trackingID}</span>
    </div>
  );
};

export default PaymentSuccess;
