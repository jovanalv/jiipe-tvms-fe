import { useState, useEffect, useCallback } from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import Swal from "sweetalert2";
import Loader from "../../components/common/Loader";
import { User, Camera } from "lucide-react";
import Button from "../../components/common/Button";
import FormInput from "../../components/form/FormInput";
import {
  getProfile,
  updateProfile,
} from "../../services/profile/myProfileService";

export default function MyProfile() {
  const breadcrumbItems = [{ name: "User" }, { name: "My Profile", href: "/" }];

  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      let result = await getProfile();

      if (result.success) {
        const data = result.data;
        if (data.img) {
          setImagePreview(`${data.img}`);
        } else {
          setImagePreview(null);
        }

        setFormData(data);
      } else {
        throw new Error("Invalid data format or no data received");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          img: reader.result,
        }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.newPassword !== formData.confNewPassword) {
      newErrors.confNewPassword = "Passwords do not match";
    }

    if (formData.newPassword && !formData.oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.name1) {
      newErrors.name1 = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      usrpw: formData.newPassword,
      oldPassword: formData.oldPassword,
      phone: formData.phone,
      email: formData.email,
      name1: formData.name1,
      img: formData.img,
      img_ttd:
        formData.img_ttd?.String === ""
          ? ""
          : formData.img_ttd?.String || formData.img_ttd,
    };

    try {
      setIsSubmitting(true);

      await updateProfile(payload);

      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confNewPassword: "",
      }));

      await Swal.fire({
        icon: "success",
        title: "Successful",
        text: "Profile successfully changed",
      });

      window.location.reload();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save data",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-2 mx-auto max-w-screen-2xl lg:px-4">
      {isLoading ? (
        <Loader screen={true} />
      ) : (
        <main>
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          {/* Profile Content */}
          <div className="overflow-hidden bg-white rounded-lg shadow-md">
            <div className="md:flex">
              {/* Sidebar */}
              <div className="p-6 text-white md:w-1/3 bg-gradient-to-b from-blue-800 to-blue-900">
                <div className="flex flex-col items-center mb-8">
                  <div className="relative mb-4 group">
                    <div className="w-32 h-32 overflow-hidden border-4 border-white rounded-full shadow-lg">
                      {imagePreview ? (
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Profile"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-3xl font-bold text-white bg-blue-700">
                          {formData.name1
                            ? formData.name1.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor="profile-image"
                      className="absolute bottom-0 right-0 p-2 transition-opacity bg-white rounded-full shadow-md opacity-0 cursor-pointer group-hover:opacity-100"
                    >
                      <Camera className="w-5 h-5 text-blue-900" />
                      <input
                        type="file"
                        id="profile-image"
                        name="profile-image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <h2 className="text-xl font-bold">
                    {formData.name1 || "User"}
                  </h2>
                  <p className="text-blue-200">
                    {formData.email || "email@example.com"}
                  </p>
                </div>

                <nav className="mt-8">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex items-center w-full px-4 py-3 rounded-md transition-colors mb-2 ${
                      activeTab === "profile"
                        ? "bg-white text-blue-900 font-medium"
                        : "text-white hover:bg-blue-700"
                    }`}
                  >
                    <User className="w-5 h-5 mr-3" />
                    Profile Information
                  </button>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`flex items-center w-full px-4 py-3 rounded-md transition-colors mb-2 ${
                      activeTab === "security"
                        ? "bg-white text-blue-900 font-medium"
                        : "text-white hover:bg-blue-700"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Security
                  </button>
                </nav>
              </div>

              {/* Main Content */}
              <div className="p-6 md:w-2/3">
                <form onSubmit={handleSubmit}>
                  {activeTab === "profile" && (
                    <>
                      <h3 className="pb-2 mb-6 text-lg font-semibold text-gray-800 border-b">
                        Profile Information
                      </h3>

                      <div className="space-y-1">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormInput
                            label={"User ID"}
                            id="usrid"
                            name="usrid"
                            value={formData.usrid || ""}
                            disabled={true}
                          />

                          <FormInput
                            label={"Username"}
                            type="text"
                            id="name1"
                            name="name1"
                            maxLength={20}
                            value={formData.name1 || ""}
                            onChange={handleChange}
                            errors={errors}
                          />

                          <FormInput
                            label={"Phone Number"}
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleChange}
                            maxLength={13}
                            errors={errors}
                          />

                          <FormInput
                            label={"Email"}
                            type="email"
                            id="email"
                            name="email"
                            maxLength={40}
                            value={formData.email || ""}
                            onChange={handleChange}
                            errors={errors}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "security" && (
                    <>
                      <h3 className="pb-2 mb-6 text-lg font-semibold text-gray-800 border-b">
                        Account Security
                      </h3>

                      <div className="space-y-6">
                        <FormInput
                          label={"Old Password"}
                          type="password"
                          id="oldPassword"
                          name="oldPassword"
                          maxLength={16}
                          minLength={8}
                          value={formData.oldPassword || ""}
                          onChange={handleChange}
                          errors={errors}
                        />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <FormInput
                            label={"New Password"}
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword || ""}
                            maxLength={16}
                            minLength={8}
                            onChange={handleChange}
                            errors={errors}
                          />

                          <FormInput
                            label={"Confirm New Password"}
                            type="password"
                            id="confNewPassword"
                            name="confNewPassword"
                            value={formData.confNewPassword || ""}
                            maxLength={16}
                            minLength={8}
                            onChange={handleChange}
                            errors={errors}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-6 mt-8 border-t">
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        isLoading={isSubmitting}
                        variant="submit"
                        icon="Save"
                        label="Save"
                        labelLoading="Processing..."
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
