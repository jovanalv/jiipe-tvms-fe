import { lazy, Suspense } from "react";
import Loader from "../components/common/Loader";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import NotFound from "../pages/error/NotFound";

// Fallback Suspense wrapper
const withSuspense = (LazyComponent) => (
  <Suspense fallback={<Loader screen={true} />}>
    <LazyComponent />
  </Suspense>
);

const lazyRetry = (componentImport) =>
  lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.error(
        "Chunk load failed, possibly an application update. Reloading...",
        error,
      );

      window.location.reload();

      throw error;
    }
  });
// ==============================
// PUBLIC ROUTES
// ==============================
const Login = lazyRetry(() => import("../pages/auth/Login"));

// ==============================
// PROTECTED ROUTES
// ==============================

// Dashboard
const Dashboard = lazyRetry(() => import("../pages/dashboard/Dashboard"));

// Master
const MasterArea = lazyRetry(() => import("../pages/master/Area"));
const MasterVendor = lazyRetry(() => import("../pages/master/Vendor"));
const MasterRfid = lazyRetry(() => import("../pages/master/Rfid"));
const MasterTruck = lazyRetry(() => import("../pages/master/Truck"));

// Transaction
// ...

// Report
const TableLogs = lazyRetry(() => import("../pages/report/TableLog"));

// Settings
const SettingUsers = lazyRetry(() => import("../pages/settings/User"));
const SettingRoles = lazyRetry(() => import("../pages/settings/Role"));
const SettingMenus = lazyRetry(() => import("../pages/settings/Menu"));
const SettingParam = lazyRetry(() => import("../pages/settings/Parameter"));
const UploadApp = lazyRetry(() => import("../pages/settings/UploadApp"));

// Other
const Unauthorized = lazyRetry(() => import("../pages/error/Unauthorized"));
const MyProfile = lazyRetry(() => import("../pages/profile/MyProfile"));
const Forbidden = lazyRetry(() => import("../pages/error/Forbidden"));

export const appRoutes = [
  // Public Routes
  {
    element: <PublicLayout />,
    children: [{ path: "/login", element: withSuspense(Login) }],
  },

  // Protected Routes
  {
    element: <ProtectedLayout />,
    children: [
      // Dashboard
      { path: "/", element: withSuspense(Dashboard) },

      // Master
      { path: "/AREA", element: withSuspense(MasterArea) },
      { path: "/VENDOR", element: withSuspense(MasterVendor) },
      { path: "/TRUCK", element: withSuspense(MasterTruck) },
      { path: "/RFID", element: withSuspense(MasterRfid) },

      // Transaction
      // ...

      // Report
      { path: "/TABLE_LOGS", element: withSuspense(TableLogs) },

      // Settings
      { path: "/ROLE", element: withSuspense(SettingRoles) },
      { path: "/MENU", element: withSuspense(SettingMenus) },
      { path: "/USER", element: withSuspense(SettingUsers) },
      { path: "/PARAM", element: withSuspense(SettingParam) },
      { path: "/UPLOAD", element: withSuspense(UploadApp) },

      // Other
      { path: "/E_UNAUTH", element: withSuspense(Unauthorized) },
      { path: "/FORBIDDEN", element: withSuspense(Forbidden) },
      { path: "/MY_PROFILE", element: withSuspense(MyProfile) },
    ],
  },

  // Not Found
  { path: "*", element: <NotFound /> },
];
