import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiAlertCircle, FiBook, FiBriefcase, FiAward, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
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
    confirmPassword: "",
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation
  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific errors
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }

    // Real-time validation
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }

    if (name === "email" && value && !validateEmail(value)) {
      setFieldErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
    }

    if (name === "phone" && value && !validatePhone(value)) {
      setFieldErrors(prev => ({ ...prev, phone: "Please enter a valid phone number" }));
    }

    if (name === "confirmPassword" && value !== form.password) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!form.email || !validateEmail(form.email)) errors.email = "Valid email is required";
    if (!form.password || form.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) errors.confirmPassword = "Passwords do not match";
    if (!form.phone || !validatePhone(form.phone)) errors.phone = "Valid phone number is required";
    if (!form.city.trim()) errors.city = "City is required";
    if (!form.pinCode.trim()) errors.pinCode = "Pin code is required";
    if (!form.role) errors.role = "Please select a role";

    if (form.role === "doctor") {
      if (!form.education.trim()) errors.education = "Education is required for doctors";
      if (!form.department) errors.department = "Department is required for doctors";
      if (!form.experience) errors.experience = "Experience is required for doctors";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError("Please correct the errors below");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const registrationData = {
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.toLowerCase(),
        password: form.password,
        role: form.role,
        number: form.phone,
        city: form.city.trim(),
        pinCode: form.pinCode.trim(),
      };

      if (form.role === "doctor") {
        registrationData.education = form.education.trim();
        registrationData.department = form.department;
        registrationData.experience = form.experience;
      }

      console.log("registrationData", registrationData);
     
      const response = await registerUser(registrationData);
      localStorage.setItem("doctor", JSON.stringify(response));

      if (response?.token && response?.user) {
        const { user, token } = response;

        localStorage.setItem("token_real", token);
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        localStorage.setItem("user", JSON.stringify(user));
        message.success("Register successfully!");
      }
      setRegisteredEmail(form.email);
      setUserId(response.userId);
      setVerificationStep("verify");
      toast.success("Registration initiated. Please verify your email.");

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerified = (user, token) => {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    localStorage.setItem("token", token);
    console.log("token", token, user);
 
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const doctorFieldsVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { 
      opacity: 1, 
      height: "auto", 
      marginTop: 24,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div variants={fieldVariants} className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FiUser className="text-white text-2xl" />
            </div>
          </motion.div>
          <motion.h1 variants={fieldVariants} className="text-4xl font-bold text-gray-900 mb-2">
            Create Account
          </motion.h1>
          <motion.p variants={fieldVariants} className="text-gray-600 text-lg">
            Join our healthcare community today
          </motion.p>
        </div>

        {/* Main Form Container */}
        <motion.div variants={fieldVariants} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 sm:px-8 lg:px-10 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FiUser className="text-blue-600" />
                    Personal Information
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">Please provide your basic details</p>
                </div>

                {/* Name Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={fieldVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">First Name *</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        name="firstName"
                        type="text"
                        placeholder="Enter first name"
                        value={form.firstName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          fieldErrors.firstName 
                            ? "border-red-300 focus:ring-red-500" 
                            : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      />
                      {form.firstName && !fieldErrors.firstName && (
                        <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                      )}
                    </div>
                    {fieldErrors.firstName && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" />
                        {fieldErrors.firstName}
                      </p>
                    )}
                  </motion.div>

                  <motion.div variants={fieldVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        name="lastName"
                        type="text"
                        placeholder="Enter last name"
                        value={form.lastName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          fieldErrors.lastName 
                            ? "border-red-300 focus:ring-red-500" 
                            : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      />
                      {form.lastName && !fieldErrors.lastName && (
                        <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                      )}
                    </div>
                    {fieldErrors.lastName && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" />
                        {fieldErrors.lastName}
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* Email */}
                <motion.div variants={fieldVariants} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                        fieldErrors.email 
                          ? "border-red-300 focus:ring-red-500" 
                          : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    />
                    {form.email && !fieldErrors.email && validateEmail(form.email) && (
                      <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                  </div>
                  {fieldErrors.email && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" />
                      {fieldErrors.email}
                    </p>
                  )}
                </motion.div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={fieldVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Password *</label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        value={form.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          fieldErrors.password 
                            ? "border-red-300 focus:ring-red-500" 
                            : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {form.password && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${
                            passwordStrength <= 2 ? "text-red-500" : 
                            passwordStrength <= 3 ? "text-yellow-500" : "text-green-500"
                          }`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                      </div>
                    )}
                    {fieldErrors.password && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" />
                        {fieldErrors.password}
                      </p>
                    )}
                  </motion.div>

                  <motion.div variants={fieldVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          fieldErrors.confirmPassword 
                            ? "border-red-300 focus:ring-red-500" 
                            : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                      {form.confirmPassword && form.password === form.confirmPassword && (
                        <FiCheck className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500" />
                      )}
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" />
                        {fieldErrors.confirmPassword}
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={fieldVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        name="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={form.phone}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          fieldErrors.phone 
                            ? "border-red-300 focus:ring-red-500" 
                            : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      />
                      {form.phone && !fieldErrors.phone && validatePhone(form.phone) && (
                        <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                      )}
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" />
                        {fieldErrors.phone}
                      </p>
                    )}
                  </motion.div>

                  <motion.div variants={fieldVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">City *</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        name="city"
                        type="text"
                        placeholder="Enter your city"
                        value={form.city}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          fieldErrors.city 
                            ? "border-red-300 focus:ring-red-500" 
                            : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      />
                      {form.city && !fieldErrors.city && (
                        <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                      )}
                    </div>
                    {fieldErrors.city && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" />
                        {fieldErrors.city}
                      </p>
                    )}
                  </motion.div>
                </div>

                <motion.div variants={fieldVariants} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Pin Code *</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="pinCode"
                      type="text"
                      placeholder="Enter pin code"
                      value={form.pinCode}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                        fieldErrors.pinCode 
                          ? "border-red-300 focus:ring-red-500" 
                          : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    />
                    {form.pinCode && !fieldErrors.pinCode && (
                      <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                  </div>
                  {fieldErrors.pinCode && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" />
                      {fieldErrors.pinCode}
                    </p>
                  )}
                </motion.div>

                {/* Role Selection */}
                <motion.div variants={fieldVariants} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Register as *</label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                        fieldErrors.role 
                          ? "border-red-300 focus:ring-red-500" 
                          : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    >
                      <option value="employee">Employee</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  {fieldErrors.role && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" />
                      {fieldErrors.role}
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Doctor-specific fields */}
              {form.role === "doctor" && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={doctorFieldsVariants}
                  className="space-y-6 border-t border-gray-200 pt-6"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-blue-600 flex items-center justify-center gap-2 mb-2">
                      <FiAward className="text-blue-600" />
                      Professional Information
                    </h3>
                    <p className="text-gray-500 text-sm">Please provide your medical credentials</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Education *</label>
                      <div className="relative">
                        <FiBook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          name="education"
                          type="text"
                          placeholder="e.g., MBBS, MD, FRCS"
                          value={form.education}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                            fieldErrors.education 
                              ? "border-red-300 focus:ring-red-500" 
                              : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                        />
                      </div>
                      {fieldErrors.education && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <FiAlertCircle className="w-3 h-3" />
                          {fieldErrors.education}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Experience *</label>
                      <div className="relative">
                        <FiAward className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                          name="experience"
                          value={form.experience}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                            fieldErrors.experience 
                              ? "border-red-300 focus:ring-red-500" 
                              : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                        >
                          <option value="">Select experience</option>
                          <option value="0-1">0-1 years</option>
                          <option value="2-5">2-5 years</option>
                          <option value="6-10">6-10 years</option>
                          <option value="11-15">11-15 years</option>
                          <option value="16-20">16-20 years</option>
                          <option value="20+">20+ years</option>
                        </select>
                      </div>
                      {fieldErrors.experience && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <FiAlertCircle className="w-3 h-3" />
                          {fieldErrors.experience}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Department *</label>
                    <div className="relative">
                      <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          fieldErrors.department 
                            ? "border-red-300 focus:ring-red-500" 
                            : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      >
                        <option value="">Select department</option>
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
                        <option value="gynecology">Gynecology</option>
                        <option value="ophthalmology">Ophthalmology</option>
                        <option value="ent">ENT</option>
                        <option value="pathology">Pathology</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    {fieldErrors.department && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" />
                        {fieldErrors.department}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl"
                >
                  <FiAlertCircle className="text-red-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className={`w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg
                  ${
                    isLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                  } 
                  transition-all duration-300 flex items-center justify-center gap-3`}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <FiUser className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </motion.button>

              {/* Login Link */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 hover:underline"
                  >
                    Sign in here
                  </a>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 sm:px-8 lg:px-10 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 gap-4">
              <div className="flex items-center gap-4">
                <span>© 2024 Healthcare Platform</span>
                <span className="hidden sm:inline">•</span>
                <a href="/privacy" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="/terms" className="hover:text-gray-700 transition-colors">Terms of Service</a>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure Registration</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        {/* <motion.div 
          variants={fieldVariants}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-100">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FiLock className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Secure & Private</h3>
            <p className="text-gray-600 text-sm">Your data is encrypted and protected</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-100">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FiCheck className="text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Easy Verification</h3>
            <p className="text-gray-600 text-sm">Quick email verification process</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-100">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FiAward className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Professional Network</h3>
            <p className="text-gray-600 text-sm">Connect with healthcare professionals</p>
          </div>
        </motion.div> */}
      </motion.div>
    </div>
  );
};

export default RegisterForm;