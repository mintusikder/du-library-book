import { Navigate } from "react-router";
import useAuth from "../hook/useAuth";
import Loading from "../pages/Shared/Loading";
import useRole from "../hook/useRole";


const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isLoading } = useRole(user?.email);

  if (loading || isLoading) return <Loading />;

  if (user && role === "admin") {
    return children;
  }

  return <Navigate to="/" replace />;
};

export default AdminRoute;
