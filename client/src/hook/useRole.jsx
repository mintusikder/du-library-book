import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "./useAxiosSecure";

const useRole = (email) => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userRole", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${email}`);
      return res.data.role || "user";
    },
  });

  return {
    role: data || "user",
    isLoading,
    isError,
    error,
  };
};

export default useRole;
