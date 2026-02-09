import {
  BarChart2,
  Settings,
  ChevronDown,
  Users,
  Database,
  ArrowRightLeft,
  Dot,
  AlarmClock,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { rehydrateMenu } from "../../store/menuSlice/menuSlice";
import SidebarSkeleton from "../skeleton/SidebarSkeleton";
import { getMenu } from "../../services/sidebar/sidebarService";
import mainLogo from "../../../public/logo/main-logo.png";
import { setSidebar } from "../../store/sidebarSlice/sidebarSlice";

const GROUP_ICONS = {
  MST: Database,
  TRN: ArrowRightLeft,
  REP: BarChart2,
  SET: Settings,
};

const animations = {
  sidebar: {
    open: { width: 240 },
    closed: { width: 70 },
  },
  fadeSlide: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
    transition: { duration: 0.2 },
  },
  dropdown: {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.2 },
  },
  chevron: {
    initial: { opacity: 0, rotate: 0 },
    animate: (isOpen) => ({
      opacity: 1,
      rotate: isOpen ? 180 : 0,
    }),
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
};

// Menu item component
const MenuItem = ({ item, isActive, isLast }) => (
  <Link to={item.menuid}>
    <motion.div
      className={`flex items-center px-2 py-[5px] my-1 mr-[15px] rounded-xl transition-all ${
        isLast ? "mb-[15px]" : ""
      } ${
        isActive
          ? "bg-blue-500/10 font-bold font-medium"
          : "text-gray-600 hover:bg-blue-100/30"
      }`}
      whileHover={{ x: 4 }}
    >
      <div className="flex items-center justify-center w-5 h-5">
        {isActive ? (
          <div className="w-2 h-2 font-bold rounded-full bg-primary" />
        ) : (
          <Dot size={16} color="#212121" />
        )}
      </div>
      <motion.span
        {...animations.fadeSlide}
        className="ml-2 text-sm font-medium"
      >
        {item.name1}
      </motion.span>
    </motion.div>
  </Link>
);

// Menu group component
const MenuGroup = ({
  group,
  items,
  isOpen,
  onToggle,
  isSidebarOpen,
  hoveredGroup,
  onHover,
  onLeave,
  isActive,
}) => {
  const Icon = GROUP_ICONS[group.id] || Database;
  const shouldShowDropdown =
    (isSidebarOpen && isOpen) || (!isSidebarOpen && hoveredGroup === group.id);

  return (
    <div
      className={`relative mt-2 rounded-lg ${
        isOpen ? "bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.1)]" : ""
      }`}
      onMouseEnter={() => !isSidebarOpen && onHover(group.id)}
      onMouseLeave={() => !isSidebarOpen && onLeave()}
    >
      <motion.div
        onClick={() => onToggle(group.id)}
        className={`flex items-center px-3 py-2 mt-1 cursor-pointer rounded-xl transition-all ${
          isOpen
            ? "bg-white font-bold"
            : "hover:bg-blue-100/50 font-bold"
        }`}
      >
        <div className="flex items-center justify-center w-6 h-6 font-bold">
          <Icon size={18} className="" />
        </div>

        <AnimatePresence>
          {isSidebarOpen && (
            <motion.span
              {...animations.fadeSlide}
              className="flex-grow ml-3 font-medium"
            >
              {group.label}
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              {...animations.chevron}
              custom={isOpen}
              className="font-bold text-primary"
            >
              <ChevronDown size={16} className="text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {shouldShowDropdown && (
          <motion.div
            {...animations.dropdown}
            className={`overflow-hidden ${
              !isSidebarOpen
                ? "absolute left-full top-0 ml-2 bg-white rounded-xl shadow-lg px-3 pt-3 pb-[-100px] min-w-[220px] z-10 border border-white"
                : "ml-6 pl-1 border-l-2 border-white"
            }`}
          >
            {items.map((item, index) => (
              <MenuItem
                key={item.menuid}
                item={item}
                isActive={isActive(item.menuid)}
                isLast={index === items.length - 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Sidebar() {
  const location = useLocation();
  const menuItems = useSelector((state) => state.menu.menuGroups);
  const currApp = useSelector((state) => state.user.app);
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const dispatch = useDispatch();

  const [openMenuGroups, setOpenMenuGroups] = useState({});
  const [hoveredGroup, setHoveredGroup] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        dispatch(setSidebar(false));
      } else {
        dispatch(setSidebar(true));
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchMenuData = useCallback(async () => {
    try {
      let result = await getMenu({
        app: currApp,
      });

      dispatch(rehydrateMenu(result.data));
    } catch (error) {
      console.error("Error fetching menu data:", error.message);
    }
  }, [dispatch, currApp]);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  const groupConfig = useMemo(() => {
    if (!menuItems || menuItems.length === 0) return [];

    const uniqueGroups = menuItems?.reduce((acc, item) => {
      if (!acc.find((group) => group.id === item.groupid)) {
        acc.push({
          id: item.groupid,
          label: item.group_name,
          sort: item.group_sort || "1",
        });
      }
      return acc;
    }, []);

    return uniqueGroups.sort((a, b) => parseInt(a.sort) - parseInt(b.sort));
  }, [menuItems]);

  useEffect(() => {
    if (groupConfig.length > 0) {
      setOpenMenuGroups((prevState) => {
        const newState = { ...prevState };

        groupConfig.forEach((group) => {
          if (!(group.id in newState)) {
            newState[group.id] = false;
          }
        });

        return newState;
      });
    }
  }, [groupConfig]);

  const isActive = useCallback(
    (href) => {
      const base = `/${href}`;
      return (
        location.pathname === base || location.pathname.startsWith(`${base}/`)
      );
    },
    [location.pathname]
  );

  const isDashboardActive = location.pathname === "/";

  const handleGroupClick = useCallback(
    (groupId) => {
      if (isSidebarOpen) {
        setOpenMenuGroups((prev) => ({
          ...prev,
          [groupId]: !prev[groupId],
        }));
      }
    },
    [isSidebarOpen]
  );

  const handleGroupHover = useCallback((groupId) => {
    setHoveredGroup(groupId);
  }, []);

  const handleGroupLeave = useCallback(() => {
    setHoveredGroup(null);
  }, []);

  const getGroupItems = useCallback(
    (groupId) => {
      return (
        menuItems
          ?.filter((item) => item.groupid === groupId)
          .sort((a, b) => parseInt(a.sort1) - parseInt(b.sort1)) || []
      );
    },
    [menuItems]
  );

  const hasMenuItems = menuItems?.length > 0;

  if (!hasMenuItems) {
    return <SidebarSkeleton isSidebarOpen={isSidebarOpen} />;
  }

  return (
    <motion.div
      className={`relative transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64 z-10" : "w-20 z-10"
      }`}
      animate={animations.sidebar[isSidebarOpen ? "open" : "closed"]}
    >
      <div className="relative flex flex-col h-full p-3 border-r border-gray-300 shadow-lg rounded-r-xl">
        <div className="absolute inset-0 z-0 bg-center bg-no-repeat bg-contain blur-[7px]" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                src={mainLogo}
                alt="Logo"
                className="object-contain w-[100%] h-[57px] pl-[0px] my-[5px]"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-grow mt-2">
          {/* Dashboard Link */}
          <Link to="/" className="relative">
            <motion.div
              className={`flex items-center px-3 py-2 my-1 rounded-lg transition-all text font-bold ${
                isDashboardActive
                  ? "bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.1)]"
                  : ""
              }`}
              whileHover={{ x: 4 }}
            >
              <Users size={20} className="font-bold ml-[1px]" />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    {...animations.fadeSlide}
                    className="ml-3 font-medium"
                  >
                    Dashboard
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>

          {groupConfig
            .filter((group) => group.id === "DSB")
            .map((group, index) => {
              const items = getGroupItems(group.id);

              return (
                <div key={index}>
                  {items.map((item, index) => (
                    <div key={index}>
                      <Link key={item.id} to={item.menuid} className="relative">
                        <motion.div
                          className={`flex items-center px-3 py-2 my-1 rounded-lg transition-all font-bold ${
                            isActive(item.menuid)
                              ? "bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.1)]"
                              : ""
                          }`}
                          whileHover={{ x: 4 }}
                        >
                          <AlarmClock
                            size={20}
                            className="font-bold ml-[1px]"
                          />

                          <AnimatePresence>
                            {isSidebarOpen && (
                              <motion.span
                                {...animations.fadeSlide}
                                className="ml-3 font-medium"
                              >
                                {item.name1}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </Link>
                    </div>
                  ))}
                </div>
              );
            })}

          {/* Menu Groups */}
          {groupConfig
            .filter((group) => group.id !== "DSB")
            .map((group) => {
              const items = getGroupItems(group.id);

              return (
                <MenuGroup
                  key={group.id}
                  group={group}
                  items={items}
                  isOpen={openMenuGroups[group.id]}
                  onToggle={handleGroupClick}
                  isSidebarOpen={isSidebarOpen}
                  hoveredGroup={hoveredGroup}
                  onHover={handleGroupHover}
                  onLeave={handleGroupLeave}
                  isActive={isActive}
                />
              );
            })}
        </nav>
      </div>
    </motion.div>
  );
}