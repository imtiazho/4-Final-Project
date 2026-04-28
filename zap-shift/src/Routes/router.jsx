import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout/RootLayout";
import HomePage from "../Pages/HomePage/HomePage";
import Coverage from "../Pages/Coverage/Coverage";
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";
import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";
import PrivateRoute from "./PrivateRoute";
import Rider from "../Pages/Rider/Rider";
import SendPercel from "../Pages/SendPercel/SendPercel";
import DashBoardLayout from "../Layouts/DashBoardLayout";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";
import Payment from "../Pages/Dashboard/Payment";
import PaymentSuccess from "../Pages/Dashboard/PaymentSuccess/PaymentSuccess";
import PaymentCancelled from "../Pages/Dashboard/PaymentCancelled/PaymentCancelled";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import ApproveRiders from "../Pages/Dashboard/ApproveRiders/ApproveRiders";
import UsersManagement from "../Pages/Dashboard/UsersManagement/UsersManagement";
import AdminOnlyRoute from "./AdminOnlyRoute";
import AssignRider from "../Pages/Dashboard/AssignRider/AssignRider";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      {
        path: "/be-a-rider",
        loader: () => fetch("warehouses.json").then((res) => res.json()),
        element: (
          <PrivateRoute>
            <Rider></Rider>
          </PrivateRoute>
        ),
      },
      {
        path: "send-parcel",
        loader: () => fetch("warehouses.json").then((res) => res.json()),
        element: (
          <PrivateRoute>
            <SendPercel></SendPercel>
          </PrivateRoute>
        ),
      },
      {
        path: "/coverage",
        loader: () => fetch("warehouses.json").then((res) => res.json()),
        Component: Coverage,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "/login", Component: Login },
      { path: "/register", Component: Register },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashBoardLayout></DashBoardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: "my-parcel",
        element: <MyParcels></MyParcels>,
      },
      {
        path: "payment/:parcelId",
        Component: Payment,
      },
      {
        path: "payment-success",
        Component: PaymentSuccess,
      },
      {
        path: "payment-cancelled",
        Component: PaymentCancelled,
      },
      {
        path: "payment-history",
        Component: PaymentHistory,
      },
      {
        path: "approve-riders",
        element: (
          <AdminOnlyRoute>
            <ApproveRiders></ApproveRiders>
          </AdminOnlyRoute>
        ),
      },
      {
        path: "users-management",
        element: (
          <AdminOnlyRoute>
            <UsersManagement></UsersManagement>
          </AdminOnlyRoute>
        ),
      },
      {
        path: "assign-riders",
        element: (
          <AdminOnlyRoute>
            <AssignRider></AssignRider>
          </AdminOnlyRoute>
        ),
      },
    ],
  },
]);
