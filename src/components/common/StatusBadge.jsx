import * as lucideIcons from "lucide-react";

const StatusBadge = ({ value, icon, iconColor, iconSize = 10 }) => {
  const IconComponent = icon ? lucideIcons[icon] : null;

  const statusMap = {
    In: {
      text: "In",
      bg: "bg-green-50",
      textColor: "text-green-700",
      border: "border-green-200",
      icon: "LogIn",
    },
    Out: {
      text: "Out",
      bg: "bg-red-50",
      textColor: "text-red-700",
      border: "border-red-200",
      icon: "LogOut",
    },
    Reject: {
      text: "Reject",
      bg: "bg-gray-50",
      textColor: "text-gray-600",
      border: "border-gray-200",
      icon: "X",
    },
    New: {
      text: "Registered",
      bg: "bg-sky-50",
      textColor: "text-sky-700",
      border: "border-sky-200",
      icon: "UserPlus",
    },
    M: {
      text: "Missing",
      bg: "bg-yellow-50",
      textColor: "text-yellow-700",
      border: "border-yellow-200",
      icon: "AlertTriangle",
    },
    Complete: {
      text: "Complete",
      bg: "bg-emerald-50",
      textColor: "text-emerald-700",
      border: "border-emerald-200",
      icon: "CheckCircle",
    },
    A: {
      text: "Active",
      bg: "bg-blue-50",
      textColor: "text-blue-700",
      border: "border-blue-200",
      icon: "Activity",
    },
    E: {
      text: "Employee",
      bg: "bg-indigo-50",
      textColor: "text-indigo-700",
      border: "border-indigo-200",
      icon: "Briefcase",
    },
    K: {
      text: "Contractor",
      bg: "bg-purple-50",
      textColor: "text-purple-700",
      border: "border-purple-200",
      icon: "Wrench",
    },
    V: {
      text: "Visitor",
      bg: "bg-cyan-50",
      textColor: "text-cyan-700",
      border: "border-cyan-200",
      icon: "UserCheck",
    },
    Enter: {
      text: "Entered",
      bg: "bg-blue-50",
      textColor: "text-blue-700",
      border: "border-blue-200",
      icon: "ArrowRight",
    },
    ACard: {
      text: "Active",
      bg: "bg-blue-50",
      textColor: "text-blue-700",
      border: "border-blue-200",
      icon: "CreditCard",
    },
    Active: {
      text: "Active",
      bg: "bg-blue-50",
      textColor: "text-blue-700",
      border: "border-blue-200",
      icon: "Activity",
    },
    Inactive: {
      text: "Inactive",
      bg: "bg-red-50",
      textColor: "text-red-700",
      border: "border-red-200",
      icon: "Pause",
    },
    I: {
      text: "Inactive",
      bg: "bg-red-50",
      textColor: "text-red-700",
      border: "border-red-200",
      icon: "Pause",
    },
    D: {
      text: "Damaged",
      bg: "bg-red-50",
      textColor: "text-red-700",
      border: "border-red-200",
      icon: "AlertOctagon",
    },
    Approve: {
      text: "Approved",
      bg: "bg-emerald-50",
      textColor: "text-emerald-700",
      border: "border-emerald-200",
      icon: "Check",
    },
    Done: {
      text: "Completed",
      bg: "bg-gray-50",
      textColor: "text-gray-600",
      border: "border-gray-200",
      icon: "CheckCircle2",
    },
    U: {
      text: "In Use",
      bg: "bg-yellow-100",
      textColor: "text-yellow-800",
      border: "border-yellow-300",
      icon: "Clock",
    },
    "In Use": {
      text: "In Use",
      bg: "bg-yellow-100",
      textColor: "text-yellow-800",
      border: "border-yellow-300",
      icon: "Clock",
    },
    Z: {
      text: "Sign-off",
      bg: "bg-slate-100",
      textColor: "text-slate-600",
      border: "border-slate-300",
      icon: "PenTool",
    },
    Valid: {
      text: "Berhasil Diverifikasi",
      bg: "bg-teal-50",
      textColor: "text-teal-700",
      border: "border-teal-200",
      icon: "CheckCircle",
    },
    Invalid: {
      text: "Data Invalid",
      bg: "bg-red-50",
      textColor: "text-red-700",
      border: "border-red-200",
      icon: "XCircle",
    },
    "Sign-off": {
      text: "Sign-off",
      bg: "bg-slate-100",
      textColor: "text-slate-600",
      border: "border-slate-300",
      icon: "PenTool",
    },
    N: {
      text: "New",
      bg: "bg-blue-100",
      textColor: "text-blue-800",
      border: "border-blue-300",
      icon: "Plus",
    },
    C: {
      text: "Completed",
      bg: "bg-yellow-50",
      textColor: "text-yellow-700",
      border: "border-yellow-200",
      icon: "CheckCircle",
    },
    Completed: {
      text: "Completed",
      bg: "bg-yellow-50",
      textColor: "text-yellow-700",
      border: "border-yellow-200",
      icon: "CheckCircle",
    },
    Pending: {
      text: "Pending",
      bg: "bg-yellow-50",
      textColor: "text-yellow-700",
      border: "border-yellow-200",
      icon: "Clock",
    },
    R: {
      text: "Rejected",
      bg: "bg-red-50",
      textColor: "text-red-700",
      border: "border-red-200",
      icon: "X",
    },
    X: {
      text: "Rejected",
      bg: "bg-red-50",
      textColor: "text-red-700",
      border: "border-red-200",
      icon: "X",
    },
    Rejected: {
      text: "Rejected",
      bg: "bg-red-50",
      textColor: "text-red-700",
      border: "border-red-200",
      icon: "X",
    },
    InGate: {
      text: "In",
      bg: "bg-sky-50",
      textColor: "text-sky-700",
      border: "border-sky-300",
      icon: "LogIn",
    },
    OutGate: {
      text: "Out",
      bg: "bg-red-50",
      textColor: "text-red-700",
      border: "border-red-200",
      icon: "LogOut",
    },
    Grant: {
      text: "Access Granted",
      bg: "bg-emerald-50",
      textColor: "text-emerald-700",
      border: "border-emerald-200",
      icon: "ShieldCheck",
    },
    Revoke: {
      text: "Access Revoked",
      bg: "bg-red-50",
      textColor: "text-red-700",
      border: "border-red-200",
      icon: "ShieldX",
    },
    Locked: {
      text: "Locked",
      bg: "bg-red-50",
      textColor: "text-red-700",
      border: "border-red-200",
      icon: "Lock",
    },
    Unlocked: {
      text: "Unlocked",
      bg: "bg-green-50",
      textColor: "text-green-700",
      border: "border-green-200",
      icon: "Unlock",
    },
    L: {
      text: "Locked",
      bg: "bg-red-50",
      textColor: "text-red-700",
      border: "border-red-200",
      icon: "Lock",
    },
    UL: {
      text: "Unlocked",
      bg: "bg-green-50",
      textColor: "text-green-700",
      border: "border-green-200",
      icon: "Unlock",
    },
    Unlock: {
      text: "Unlocked",
      bg: "bg-green-50",
      textColor: "text-green-700",
      border: "border-green-200",
      icon: "Unlock",
    },
    Secured: {
      text: "Secured",
      bg: "bg-amber-50",
      textColor: "text-amber-700",
      border: "border-amber-200",
      icon: "Shield",
    },
    Unsecured: {
      text: "Unsecured",
      bg: "bg-orange-50",
      textColor: "text-orange-700",
      border: "border-orange-200",
      icon: "ShieldOff",
    },
    Yes: {
      text: "Yes",
      bg: "bg-green-50",
      textColor: "text-green-700",
      border: "border-green-200",
      icon: "Check",
    },
    No: {
      text: "No",
      bg: "bg-red-50",
      textColor: "text-red-700",
      border: "border-red-200",
      icon: "X",
    },
  };

  const status = statusMap[value] || {
    text: "Unknown",
    bg: "bg-gray-50",
    textColor: "text-gray-500",
    border: "border-gray-200",
    icon: "HelpCircle",
  };

  const FinalIconComponent =
    IconComponent || (status.icon ? lucideIcons[status.icon] : null);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-[5px] py-[2px] rounded-md text-[10px] font-medium border max-w-[180px] ${status.bg} ${status.textColor} ${status.border}`}
    >
      {FinalIconComponent && (
        <FinalIconComponent
          size={iconSize}
          color={iconColor}
          className="flex-shrink-0"
        />
      )}
      <span className="font-semibold truncate">{status.text}</span>
    </span>
  );
};

export default StatusBadge;
