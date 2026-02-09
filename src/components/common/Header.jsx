import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../../store/userSlice/userSlice";
import { clearUserProfile } from "../../store/userSlice/userSlice";
import { useSelector } from "react-redux";
import { persistor } from "../../store/store";
import ProfileAvatar from "./ProfileAvatar";
import {
  LogOut, ChevronDown, User, PanelRightClose,
  PanelLeftClose,
} from "lucide-react";
import { getUser } from "../../services/navbar/navbarService";
import { logout } from "../../services/auth/authService";
import Breadcrumbs from "./Breadcrumbs";
import { setSidebar } from "../../store/sidebarSlice/sidebarSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();

  const userProfile = useSelector((state) => state.user.profile);

  const fetchData = useCallback(async () => {
    try {
      let result = await getUser();

      dispatch(setUserProfile(result.data));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      localStorage.removeItem("printerThermal");
      dispatch(clearUserProfile());
      await persistor.purge();
      navigate("/login");
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleNavigate = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  const manualItems =
    location.pathname == "/MY_PROFILE"
      ? [{ name: "My Profile" }, { name: "Edit" }]
      : null;

  return (
    <>
      <header className="bg-white shadow-[0px_0px_10px_4px_#0000000F] mx-[16px] mt-[17px] rounded-[10px]">
        <div className="px-2 mx-auto max-w-screen-2xl">
          <div className="flex items-center justify-between">
            {/* Left side - Mobile Menu Button */}
            <div className="flex items-center gap-2 sm:gap-4">
              {isSidebarOpen ? (
                <div
                  className="transition-all duration-200 rounded-full cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    dispatch(setSidebar(false));
                  }}
                >
                  <PanelLeftClose className="text-dark p-[5px]" size={30} />
                </div>
              ) : (
                <div
                  className="transition-all duration-200 rounded-full cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    dispatch(setSidebar(true));
                  }}
                >
                  <PanelRightClose className="text-dark p-[5px]" size={30} />
                </div>
              )}
              <div className="hidden sm:block">
                <Breadcrumbs
                  isCreate={id == 0}
                  isDetailParam={id !== "0" ? id : undefined}
                  manualItems={manualItems}
                />
              </div>
            </div>

            {/* Center - Title */}
            <h1 className="hidden text-1xl font-bold text-gray-800 md:block">
              {import.meta.env.VITE_APP_NAME}
            </h1>

            {/* Right side - User Controls */}
            <div className="flex items-center space-x-8">
              {/* Notifications */}
              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center p-2 space-x-3 transition-colors rounded-lg hover:bg-gray-50"
                >
                  <div className="hidden text-left md:block">
                    <p className="text-sm font-semibold text-gray-800">
                      Hello, {userProfile?.name1}
                    </p>
                    {/* Department Tags */}
                    <div className="hidden space-x-2 md:flex">
                      <span className="text-xs font-medium text-blue-700 rounded-full">
                        <span className="text-xs font-medium text-blue-700 rounded-full">
                          {userProfile?.roleid[0]}
                        </span>
                      </span>
                    </div>
                  </div>
                  <ProfileAvatar userProfile={userProfile} />
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 z-50 w-64 py-2 mt-2 bg-white border border-gray-100 shadow-xl rounded-xl">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {userProfile?.name1}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {userProfile.roleid.map((role, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs font-medium text-blue-700 rounded-full bg-blue-50"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleNavigate("/MY_PROFILE")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <User size={16} className="mr-3 text-gray-500" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm animate-overlayShow"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-modalFadeIn">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4 ">
                <div className="sm:flex sm:items-start">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                    <LogOut className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Logout Confirmation
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to get out? You will need to log
                        in again to access your account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Logout
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
