import { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiAlertCircle, FiBook, FiBriefcase, FiAward } from "react-icons/fi";
import { registerUser } from "../../api/auth";
import OTPVerification from "./OtpVerification";
import { AuthContext } from "../../components/context/AuthContext";
import { message } from "antd";


const RegisterForm = () => {
 const [form, setForm] = useState({
  firstName: "", 
  lastName: "",
  city: "",
  pinCode: "",
  phone: "",
  email: "",
  password: "",
  role: "employee",
  // Doctor-specific fields
  education: "",
  department: "",
  experience: "",
});

    const { register } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationStep, setVerificationStep] = useState("register");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Prepare registration data
      const registrationData = {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        role: form.role,
        number: form.phone,
      };

      // Add doctor-specific fields if role is doctor
      if (form.role === "doctor") {
        registrationData.education = form.education;
        registrationData.department = form.department;
        registrationData.experience = form.experience;
      }
  console.log("registrationData", registrationData);
     
  const response = await registerUser(registrationData);
    localStorage.setItem("doctor", JSON.stringify(response));

      setRegisteredEmail(form.email);
      setUserId(response.userId);
      setVerificationStep("verify");
      toast.success("Registration initiated. Please verify your email.");

      setIsLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      setIsLoading(false);
    }
  };

  const handleVerified = (user, token) => {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    localStorage.setItem("token", token,user);
 console.log("token", token,user);
 
 register(user);
 
    message.success(`Welcome ${user.name}! Your account has been verified.`);

    switch (user.role) {

      case "admin":
        navigate("/health/admin-schedule-appointments");
        break;
      case "doctor":
        navigate("/doctor-schedule-appointments");
        break;
      case "employee":
        navigate("/health/appointments");
        break;
      default:
        navigate("/");
        break;
    }
  };

  if (verificationStep === "verify") {
    return (
      <OTPVerification 
        email={registeredEmail} 
        userId={userId} 
        onVerified={handleVerified}
      />
    );
  }
  
  // Registration form
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const doctorFieldsVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { 
      opacity: 1, 
      height: "auto", 
      marginTop: 16,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-600">Create Account</h2>
            <p className="text-gray-600 mt-2">Join our community today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* First Name */}
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              {/* Last Name */}
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              {/* City */}
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="city"
                  type="text"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              {/* Pin Code */}
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="pinCode"
                  type="text"
                  placeholder="Pin Code"
                  value={form.pinCode}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              {/* Phone Number */}
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="phone"
                  type="text"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              {/* Role Selection */}
              <div className="relative">
                <label className="block text-gray-700 mb-2">Register as:</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="" disabled>Select Role</option>
                  <option value="doctor">Doctor</option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Doctor-specific fields - only show when role is doctor */}
              {form.role === "doctor" && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={doctorFieldsVariants}
                  className="space-y-4 border-t border-gray-200 pt-4"
                >
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">Doctor Information</h3>
                    <p className="text-gray-500 text-sm">Please provide your professional details</p>
                  </div>

                  {/* Education */}
                  <div className="relative">
                    <FiBook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="education"
                      type="text"
                      placeholder="Education (e.g., MBBS, MD)"
                      value={form.education}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>

                  {/* Department */}
                  <div className="relative">
                    <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <option value="" disabled>Select Department</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="neurology">Neurology</option>
                      <option value="orthopedics">Orthopedics</option>
                      <option value="pediatrics">Pediatrics</option>
                      <option value="dermatology">Dermatology</option>
                      <option value="psychiatry">Psychiatry</option>
                      <option value="oncology">Oncology</option>
                      <option value="radiology">Radiology</option>
                      <option value="anesthesiology">Anesthesiology</option>
                      <option value="emergency">Emergency Medicine</option>
                      <option value="general">General Medicine</option>
                      <option value="surgery">Surgery</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Experience */}
                  <div className="relative">
                    <FiAward className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <option value="" disabled>Years of Experience</option>
                      <option value="0-1">0-1 years</option>
                      <option value="2-5">2-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="11-15">11-15 years</option>
                      <option value="16-20">16-20 years</option>
                      <option value="20+">20+ years</option>
                    </select>
                  </div>
                </motion.div>
              )}
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
                "Create Account"
              )}
            </motion.button>

            <p className="text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Sign in
              </a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;