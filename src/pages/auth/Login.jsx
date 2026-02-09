import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GridShape from "../../components/common/GridShape";
import {
  Loader2,
  Lock,
  User,
  AlertCircle,
  UserCog,
  Eye,
  EyeOff,
  RefreshCcw,
} from "lucide-react";
import {
  checkIsLogin,
  getCaptcha,
  login,
} from "../../services/auth/authService";

export default function Login() {
  const navigate = useNavigate();

  // Data state
  const [usrid, setUsrid] = useState("");
  const [usrpw, setPassword] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // Captcha State
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaImg, setCaptchaImg] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(false);

  // Failed State
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Condition state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch Captcha
  const fetchCaptcha = async () => {
    setIsLoadingCaptcha(true);
    try {
      let result = await getCaptcha();

      setCaptchaId(result.data.captcha_id);
      setCaptchaImg(result.data.captcha_img);
      setCaptchaValue("");
    } catch (err) {
      setError(err.message || "Failed to load captcha. Please try again.");
    } finally {
      setIsLoadingCaptcha(false);
    }
  };

  // Check if user already login
  const fetchData = useCallback(async () => {
    try {
      await checkIsLogin();

      navigate("/");
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "An error occurred while fetching data.");
    }
  }, [navigate]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, []);

  // Handle Submit Login data
  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        usrid,
        usrpw,
        captcha_id: captchaId,
        captcha_value: captchaValue,
      };

      let result = await login(payload);
      localStorage.setItem("token", result.data.token);
      setFailedAttempts(0);
      setShowCaptcha(false);
      setCaptchaId("");
      setCaptchaImg("");
      setCaptchaValue("");
      navigate("/");
    } catch (err) {
      if (err.status == 401 || err.status == 403 || err.status == 400) {
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);

        if (newFailedAttempts >= 1 && !showCaptcha) {
          setShowCaptcha(true);
          await fetchCaptcha();
        } else if (showCaptcha) {
          await fetchCaptcha();
        }
      }
      console.error("Login Error:", err);
      setError(err.message || "An error occurred while logging in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle show/hide password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle captcha refresh
  const refreshCaptcha = () => {
    fetchCaptcha();
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-gray-50">
      {/* Left Section - Branding */}
      <div className="relative items-center justify-center hidden w-1/2 h-full lg:flex bg-gradient-to-br from-slate-950 to-slate-900">
        {/* Background image - preserving the original */}
        <div className="absolute inset-0 bg-[url('/bg-login.png')] bg-cover bg-center opacity-40"></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-100">
          <GridShape />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-2xl px-12">
          <div className="mb-10">
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-white">
              Selamat Datang
            </h1>
            <p className="text-xl leading-relaxed text-blue-200">
              di Truck Volume Monitoring System
            </p>
          </div>

          <div className="mb-10 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-blue-200 lucide lucide-shield-check-icon lucide-shield-check"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">
                  Monitoring Volume Realtime
                </h3>
                {/* <p className="text-blue-200">
                  Enterprise-grade security for your data
                </p> */}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-blue-200 lucide lucide-database-icon lucide-database"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">
                  Data Otomatis & Terpusat
                </h3>
                {/* <p className="text-blue-200">
                  Quickly record the data and time of entry and exit of guests
                </p> */}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-blue-200 lucide lucide-monitor-icon lucide-monitor"
                >
                  <rect width="20" height="14" x="2" y="3" rx="2" />
                  <line x1="8" x2="16" y1="21" y2="21" />
                  <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">
                  Efisiensi Operasional
                </h3>
                {/* <p className="text-blue-200">
                  Monitor visitor and area status in real-time
                </p> */}
              </div>
            </div>
          </div>

          {/* <div className="p-5 border rounded-xl bg-white/5 backdrop-blur-sm border-white/10">
            <p className="text-sm italic leading-relaxed text-blue-100">
              "We are committed to providing a safe, comfortable, and
              professional visiting experience for every visitor with the
              support of technology."
            </p>
          </div> */}
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="relative flex items-center justify-center w-full h-full overflow-y-auto lg:w-1/2 sm:p-6 lg:p-8">
        <div
          style={{
            backgroundImage: "url('/bg-login2.webp')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "-10px 20px",
            backgroundSize: "106%",
            opacity: 0.05,
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        />
        <div className="relative z-10 w-full max-w-md">
          <div className="p-6 border border-gray-100 shadow-lg bg-white/30 rounded-xl backdrop-blur-sm mt-[50px]">
            <div className="mb-[15px] text-center">
              <img
                src="/logo/logo.png"
                alt="Logo"
                className="h-[80px] mx-auto"
              />
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <div className="mb-3">
                  {/* <h2 className="text-2xl font-bold text-center text-primary">
                    Sign in to your account
                  </h2> */}
                  <p className="text-sm text-center text-gray-600">
                    Masukkan username dan password untuk melanjutkan.
                  </p>
                </div>
                <label
                  htmlFor="username"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={usrid}
                    onChange={(e) => setUsrid(e.target.value)}
                    className="block w-full py-2 pl-10 pr-3 transition-all border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={usrpw}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full py-2 pl-10 pr-10 transition-all border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {showCaptcha && (
                <div>
                  <label
                    htmlFor="captcha"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Confirm you are human
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="">
                        {captchaImg ? (
                          <img
                            src={captchaImg}
                            alt="Captcha"
                            className="w-full bg-white border border-gray-300 rounded-lg"
                            style={{ width: "150px", height: "32px" }}
                          />
                        ) : (
                          <div
                            className="flex items-center justify-center w-full bg-gray-100 border border-gray-300 rounded-lg"
                            style={{ width: "150px", height: "32px" }}
                          >
                            <span className="text-xs text-gray-500">
                              Loading...
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        disabled={isLoadingCaptcha}
                        className="flex items-center justify-center w-8 h-8 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Refresh Captcha"
                      >
                        <RefreshCcw
                          className={`w-3 h-3 ${
                            isLoadingCaptcha ? "animate-spin" : ""
                          }`}
                        />
                      </button>
                    </div>
                    <input
                      id="captcha"
                      name="captcha"
                      type="text"
                      required={showCaptcha}
                      value={captchaValue}
                      onChange={(e) => setCaptchaValue(e.target.value)}
                      className="block w-full px-2 py-1 text-sm transition-all border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      placeholder="Enter the characters shown above"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 p-3 mb-2 text-sm text-red-600 border border-red-100 rounded-lg bg-red-50">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-white font-medium bg-[linear-gradient(248.93deg,_#1F36C7_36.09%,_#001F82_100%)] hover:bg-[#2e48a0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <Loader2 className="w-5 h-5 mr-2 -ml-1 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      LOGIN
                      <svg
                        className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs text-gray-500">© 2025 All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
