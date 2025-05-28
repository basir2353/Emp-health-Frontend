import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FiMail, FiAlertCircle, FiCheck } from "react-icons/fi";
import { verifyOTP, resendOTP } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const OTPVerification = ({ email, userId, onVerified }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
    startCountdown();

    return () => {
      // Cleanup countdown timer on component unmount
      clearInterval(timerRef.current);
    };
  }, []);

  const timerRef = useRef(null);

  const startCountdown = () => {
    setResendDisabled(true);
    setCountdown(60);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleInputChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Only digits

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Move to next field
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      await resendOTP({ email });
      toast.success("Verification code resent successfully!");
      startCountdown();
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to resend code";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await verifyOTP({ email, otp: otpCode, userId });

      if (response?.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        message.success("Email verified successfully!");

        const role = response.user?.role;
        switch (role) {
          case "doctor":
            navigate("/health/doctor-schedule-appointments");
            break;
          case "employee":
            navigate("/");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/health/admin-schedule-appointments");
        }

        onVerified?.(response.user);
      } else {
        navigate("/login");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Verification failed";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <FiMail className="text-blue-600 text-2xl" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-blue-600">Verify Your Email</h2>
        <p className="text-gray-600 mt-2">We've sent a verification code to:</p>
        <p className="font-medium text-gray-800">{email}</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-xl text-center border-2 border-gray-300 rounded-lg 
                        focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          ))}
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg mb-6"
        >
          <FiAlertCircle />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      <motion.button
        onClick={handleVerify}
        disabled={isLoading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium mb-4
          ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"} 
          transition-colors duration-200 flex items-center justify-center`}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          />
        ) : (
          <>
            <FiCheck className="mr-2" /> Verify Email
          </>
        )}
      </motion.button>

      <div className="text-center">
        <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
        <button
          onClick={handleResendOTP}
          disabled={resendDisabled || isLoading}
          className={`text-blue-600 text-sm font-medium 
            ${resendDisabled || isLoading ? "opacity-60 cursor-not-allowed" : "hover:text-blue-800"}`}
        >
          {resendDisabled ? `Resend in ${countdown}s` : "Resend Code"}
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
