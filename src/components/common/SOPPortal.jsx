import { AlertCircle } from "lucide-react";

export default function SOPPortal({
  isOut = false,
  isUnplanned = false,
  context = "Visitor",
}) {
  // Determine the current state
  const getVisitorState = () => {
    if (isUnplanned) return "unplanned";
    if (isOut) return "checkout";
    return "checkin";
  };

  const currentState = getVisitorState();

  const getBackgroundColor = () => {
    switch (currentState) {
      case "unplanned":
        return "bg-[#313957]";
      case "checkout":
        return "bg-[linear-gradient(115deg,_#DA0000_0%,_#740000_100.1%)]";
      case "checkin":
      default:
        return "bg-[linear-gradient(248.93deg,_#1F36C7_36.09%,_#001F82_100%)]";
    }
  };

  const getContent = () => {
    switch (currentState) {
      case "unplanned":
        return (
          <>
            <li className="flex items-start text-sm font-light text-white">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#1E858E] mr-2 text-xs font-bold">
                1
              </span>
              {context} fills in the registration form with personal details
              such as name, phone number, company, and purpose of visit.
            </li>
            <li className="flex items-start text-sm font-light text-white">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#1E858E] mr-2 text-xs font-bold">
                2
              </span>
              Security officer reviews the form and {context.toLowerCase()}{" "}
              information.
            </li>
            <li className="flex items-start text-sm font-light text-white">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#1E858E] mr-2 text-xs font-bold">
                3
              </span>
              Security officer exchanges {context.toLowerCase()}'s ID card with{" "}
              {context.toLowerCase()} card for entry access.
            </li>
            <li className="flex items-start text-sm font-light text-white">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#1E858E] mr-2 text-xs font-bold">
                4
              </span>
              {context.toLowerCase()}'s ID card is temporarily stored by
              security during the visit.
            </li>
          </>
        );

      case "checkout":
        return (
          <>
            <li className="flex items-start text-sm font-light text-white">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#1E858E] mr-2 text-xs font-bold">
                1
              </span>
              Visitor scans QR code or taps visitor card to security device.
            </li>
            <li className="flex items-start text-sm font-light text-white">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#1E858E] mr-2 text-xs font-bold">
                2
              </span>
              Security officer confirms the checkout request and verifies
              visitor identity.
            </li>
            <li className="flex items-start text-sm font-light text-white">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#1E858E] mr-2 text-xs font-bold">
                3
              </span>
              If confirmed, security officer returns the visitor's ID card.
            </li>
            <li className="flex items-start text-sm font-light text-white">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#1E858E] mr-2 text-xs font-bold">
                4
              </span>
              Visitor's departure is logged automatically in the system.
            </li>
          </>
        );

      case "checkin":
      default:
        return (
          <>
            <li className="flex items-start text-sm font-light text-white">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#1E858E] mr-2 text-xs font-bold">
                1
              </span>
              {context} scans QR Code to security officer or receptionist.
            </li>
            <li className="flex items-start text-sm font-light text-white">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#1E858E] mr-2 text-xs font-bold">
                2
              </span>
              Security officer confirms the visit data and appointment details.
            </li>
            <li className="flex items-start text-sm font-light text-white">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#1E858E] mr-2 text-xs font-bold">
                3
              </span>
              Optional: Security officer takes photo of {context.toLowerCase()}
              's ID card for documentation.
            </li>
            <li className="flex items-start text-sm font-light text-white">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#1E858E] mr-2 text-xs font-bold">
                4
              </span>
              Optional: Security officer provides {context.toLowerCase()} card
              by exchanging with {context.toLowerCase()}'s ID card.
            </li>
          </>
        );
    }
  };

  return (
    <div className={`col-span-3 p-7 rounded-s-lg ${getBackgroundColor()}`}>
      <p className="flex items-center mb-5 text-xl font-bold text-left text-white">
        Unilever {context} SOP
      </p>

      <ol className="mb-5 space-y-2">{getContent()}</ol>

      <p className="flex items-center mb-2 font-bold text-left text-white text-md">
        <AlertCircle className="w-5 h-5 mr-2" />
        Need Help?
      </p>
      <p className="mb-5 text-sm font-light text-white">
        If you encounter problems, please contact IT staff.
      </p>
      <div className="border-b-2 border-[#AAE5EA]"></div>
    </div>
  );
}
