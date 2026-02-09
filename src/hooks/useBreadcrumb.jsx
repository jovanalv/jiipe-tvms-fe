import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export const useBreadcrumb = () => {
  const menuGroups = useSelector((state) => state.menu.menuGroups);
  const location = useLocation();

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const menidFromUrl = pathSegments[0] || "";

  const allMenus = Array.isArray(menuGroups)
    ? menuGroups
    : Object.values(menuGroups).flat();

  const found = allMenus.find((menu) => menu.menuid === menidFromUrl);

  return {
    menuid: found?.menuid || "",
    name1: found?.name1 || "",
    group_name: found?.group_name || "",
  };
};
