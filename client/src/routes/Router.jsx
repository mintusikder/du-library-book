import { createBrowserRouter } from "react-router";
import MainLayout from "../pages/layout/MainLayout";
import Home from "../pages/Home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children:[
        {
            index : true,
            element: <Home></Home>
        }
    ]
  },
]);