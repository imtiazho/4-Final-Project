import React, { useEffect } from "react";
import { useSearchParams } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionID = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure();
  console.log(sessionID);
  
  useEffect(() => {
    if (sessionID) {
      axiosSecure
        .patch(`/verify-payment?session_id=${sessionID}`)
        .then((res) => console.log(res.data));
    }
  }, [sessionID, axiosSecure]);

  return <div>Payment Successful</div>;
};

export default PaymentSuccess;
