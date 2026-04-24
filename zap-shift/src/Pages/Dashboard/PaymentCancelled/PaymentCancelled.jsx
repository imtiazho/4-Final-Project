import React from 'react';
import { Link } from 'react-router';

const PaymentCancelled = () => {
    return (
        <div>
            Payment Cancelled
            <Link to='/dashboard/my-parcel'>Try Again</Link>
        </div>
    );
};

export default PaymentCancelled;