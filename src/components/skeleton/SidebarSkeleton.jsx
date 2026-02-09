import { motion, AnimatePresence } from "framer-motion";

const BackgroundPattern = () => (
  <div
    className="absolute inset-0 z-0 bg-center bg-no-repeat bg-contain blur-[7px]"
    style={{
      backgroundImage: "url('/bg-login-pattern.webp')",
      backgroundSize: "190%",
      backgroundPosition: "-80px 90px",
      opacity: "40%",
    }}
  />
);

const SkeletonItem = ({ isSidebarOpen }) => (
  <div className="flex items-center p-3 my-1 bg-blue-100 rounded-xl animate-pulse">
    <div className="w-5 h-5 bg-blue-100 rounded" />
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="flex-1 h-4 ml-3 bg-blue-100 rounded"
        />
      )}
    </AnimatePresence>
  </div>
);

const SkeletonGroup = ({ item, isSidebarOpen }) => (
  <div className="mt-2">
    <SkeletonItem isSidebarOpen={isSidebarOpen} />
    {item <= 2 && isSidebarOpen && (
      <div className="pl-1 mt-1 ml-6 space-y-1 border-l-2 border-gray-200">
        {[1, 2, 3].map((subItem) => (
          <div
            key={subItem}
            className="flex items-center p-2 my-1 mr-[15px] rounded-xl animate-pulse"
          >
            <div className="w-3 h-3 bg-blue-100 rounded-full" />
            <div className="flex-1 h-3 ml-2 rounded bg-blue-50" />
          </div>
        ))}
      </div>
    )}
  </div>
);

const SkeletonHeader = ({ isSidebarOpen }) => (
  <div className="flex items-center justify-between">
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="w-20 h-20 p-[10px] bg-blue-100 rounded-lg animate-pulse"
        />
      )}
    </AnimatePresence>
    <div className="relative p-2 bg-blue-100 rounded-full shadow-sm animate-pulse">
      <div className="w-[22px] h-[22px] bg-blue-100 rounded" />
    </div>
  </div>
);

const SkeletonNavigation = ({ isSidebarOpen }) => (
  <nav className="flex-grow mt-2 space-y-2">
    <SkeletonItem isSidebarOpen={isSidebarOpen} />
    {[1, 2, 3, 4].map((item) => (
      <SkeletonGroup key={item} item={item} isSidebarOpen={isSidebarOpen} />
    ))}
  </nav>
);

export default function SidebarSkeleton({ isSidebarOpen }) {
  const animations = {
    sidebar: {
      open: { width: 240 },
      closed: { width: 70 },
    },
  };

  return (
    <motion.div
      className={`relative transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64 z-10" : "w-20 z-10"
      }`}
      animate={animations.sidebar[isSidebarOpen ? "open" : "closed"]}
    >
      <div className="relative flex flex-col h-full p-3 border-r border-gray-300 shadow-lg rounded-r-xl">
        <BackgroundPattern />
        <SkeletonHeader isSidebarOpen={isSidebarOpen} />
        <SkeletonNavigation isSidebarOpen={isSidebarOpen} />
      </div>
    </motion.div>
  );
}
