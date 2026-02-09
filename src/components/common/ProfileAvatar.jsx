import { User } from "lucide-react";

const ProfileAvatar = ({ userProfile, setShowDropdown, showDropdown }) => {
  return userProfile?.img ? (
    <img
      className="w-10 h-10 rounded-full cursor-pointer"
      src={userProfile?.img}
      alt="Rounded avatar"
      onClick={() => setShowDropdown(!showDropdown)}
    />
  ) : (
    <User
      className="w-10 h-10 p-2 text-gray-600 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200"
      onClick={() => setShowDropdown(!showDropdown)}
    />
  );
};

export default ProfileAvatar;
