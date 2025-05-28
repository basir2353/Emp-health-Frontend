import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import { AuthContext } from "../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { message } from "antd";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser({ email, password });

      if (response?.token && response?.user) {
        const { user, token } = response;

        // Save user and token
        localStorage.setItem("token", token);
        localStorage.setItem("loggedInUser", JSON.stringify(user));
     if (response?.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        message.success("Login successfully!");

        const role = response.user?.role;
        switch (role) {
          case "doctor":
            navigate("/health/doctor-schedule-appointments");
            break;
          case "employee":
            navigate("/");
            break;
          case "admin":
            navigate("/health/admin-schedule-appointments");
            break;
          default:
            navigate("/");
        }

      } else {
        navigate("/login");
      }
      } else {
        const errorMsg = "Authentication error. Please try again.";
        setError(errorMsg);
        message.error(errorMsg);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Unable to login. Please check your credentials.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <ToastContainer position="top-left" limit={3} newestOnTop draggable />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-600">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg"
              >
                <FiAlertCircle />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Forgot password?
              </a>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium 
                ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }
                transition-colors duration-200 flex items-center justify-center`}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                "Sign In"
              )}
            </motion.button>

            <p className="text-center text-gray-600 text-sm">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
