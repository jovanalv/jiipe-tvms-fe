import { motion } from "framer-motion";
import { Eye, Trash2 } from "lucide-react";

const StatCard = ({
  regid,
  name,
  icon: Icon,
  value,
  color,
  accessname,
  bgColor,
  textColor,
  stats,
  onEdit,
  onDelete,
  dats,
  display,
  bgCard,
  bukrs,
}) => {
  return (
    <motion.div
      className="w-full"
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
    >
      <div className="overflow-hidden transition-all duration-200 bg-white border shadow-sm rounded-xl hover:shadow-lg hover:border-blue-200">
        <div className="relative">
          {/* Decorative blue accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />

          <div className="space-y-2">
            {/* Header */}
            <div className="relative p-3 bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={18} className="text-white" />
                  <span className="font-medium text-white">{name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-white/20 text-white rounded-full text-xs">
                    {stats}
                  </span>
                  <div className={`${display} flex gap-1`}>
                    <button
                      onClick={onEdit}
                      className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={onDelete}
                      className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Content */}
            <div className="pb-3 px-3 flex gap-[30px] rounded-lg ">
              {" "}
              {/* Kurangi padding dan spasi */}
              <div>
                <p className="text-xs font-medium text-blue-600">
                  No Registrasi
                </p>
                <p className="text-sm font-medium text-blue-900">{regid}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-blue-600">Tujuan</p>
                <p className="text-xs font-medium text-blue-900">{value}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-blue-600">Perusahaan</p>
                <p className="text-xs font-medium text-blue-900">{bukrs}</p>
              </div>
            </div>
            {/* Footer */}
            <div className="pt-1 space-y-1 border-t border-blue-100 bg-slate-100">
              {" "}
              {/* Kurangi padding dan spasi */}
              <div className="flex flex-col items-start justify-between px-3 pt-1 pb-3">
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-blue-600">
                    Waktu Kunjungan :
                  </span>
                  <span className="text-xs font-medium text-blue-900">
                    {(() => {
                      if (!dats) return "-";

                      const [datePart, timePart] = dats.split(" ");
                      if (!datePart || !timePart) return "-";

                      const [year, month, day] = datePart
                        .split("-")
                        .map(Number);
                      const formattedDate = new Date(
                        year,
                        month - 1,
                        day
                      ).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      });

                      const [hour, minute] = timePart.split(":").map(Number);
                      const period = hour >= 12 ? "PM" : "AM";
                      const formattedHour = hour % 12 || 12;

                      return `${formattedDate}, ${formattedHour}:${minute
                        .toString()
                        .padStart(2, "0")} ${period}`;
                    })()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-blue-600">Akses :</span>
                  <span
                    className={`text-xs font-medium ${
                      accessname ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {accessname || "Belum diberi Akses"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
