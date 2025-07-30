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
  const timerRef = useRef(null);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
    startCountdown();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCountdown = () => {
    setResendDisabled(true);
    setCountdown(60);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleInputChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("").slice(0, 6);
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-xl bg-white p-6 sm:p-8 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <FiMail className="text-2xl text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-blue-600">Verify Your Email</h2>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            We've sent a verification code to:
          </p>
          <p className="font-medium text-gray-800 break-all">{email}</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-center space-x-2 sm:space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="h-12 w-12 rounded-lg border-2 border-gray-300 text-center text-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:h-14 sm:w-14"
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-500"
          >
            <FiAlertCircle />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        <motion.button
          onClick={handleVerify}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex w-full items-center justify-center rounded-lg py-3 px-4 font-medium text-white transition-colors duration-200 ${
            isLoading ? "cursor-not-allowed bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
            />
          ) : (
            <>
              <FiCheck className="mr-2" /> Verify Email
            </>
          )}
        </motion.button>

        <div className="mt-4 text-center">
          <p className="mb-2 text-sm text-gray-600">Didn't receive the code?</p>
          <button
            onClick={handleResendOTP}
            disabled={resendDisabled || isLoading}
            className={`text-sm font-medium text-blue-600 ${
              resendDisabled || isLoading ? "cursor-not-allowed opacity-60" : "hover:text-blue-800"
            }`}
          >
            {resendDisabled ? `Resend in ${countdown}s` : "Resend Code"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerification;