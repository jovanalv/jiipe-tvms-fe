import { useState } from "react";
import Loader from "../../components/common/Loader";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className="min-h-screen mx-auto p-7 max-w-screen-2xl lg:p-7 bg-gray-50/20">
      {isLoading ? (
        <Loader screen={true} />
      ) : (
        <motion.div
          className="flex flex-col w-full h-full mx-auto space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Dashboard Content */}
        </motion.div>
      )}
    </main>
  );
}
