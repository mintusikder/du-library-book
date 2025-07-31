import { createBrowserRouter } from "react-router";
import MainLayout from "../pages/layout/MainLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import AdminRoute from "./AdminRoute";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import AdminLayout from "../pages/layout/AdminLayout";
import AddBook from "../pages/AdminDashboard/AddBook";
import AllBook from "../pages/AdminDashboard/AllBook";
import BorrowedBook from "../pages/AdminDashboard/BorrowedBook";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { path: "home", element: <AdminDashboard /> },
      { path: "add-book", element: <AddBook /> },
      { path: "all-book", element: <AllBook /> },
      { path: "borrowed-book", element: <BorrowedBook></BorrowedBook> },
    ],
  },
]);
