import { useSelector } from "react-redux";

const useHasAdmin = () => {
  const userRoles = useSelector((state) => state?.user?.profile?.roleid);

  console.log(userRoles, "userrOLES");

  if (!Array.isArray(userRoles)) return false;

  return userRoles.some((role) => role === "ADMIN");
};

export default useHasAdmin;
