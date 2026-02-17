import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, Loader, Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../stores/auth.store";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password, navigate);
  };

const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider} clicked`);
    // OAuth logic
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-10'>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className='flex w-full max-w-6xl bg-white rounded-2xl shadow-lg border border-[#E2E8F0] overflow-hidden md:h-[650px]'>
        {/* Left Side */}
        <div className='hidden md:flex md:w-1/2 flex-col items-center justify-center p-10 bg-[#F1F5F9] border-r border-[#E2E8F0]'>
          <img
            src='/login-image.png'
            alt='Login'
            className='w-128 h-128 object-contain mb-6'
          />
          <h3 className='text-3xl font-bold text-[#012A4A] mb-2 text-center'>
            Manage Your Presence Effortlessly
          </h3>
          <p className='text-[#013A63]/80 text-center text-base'>
            Access your automation dashboard and keep your social media running
            smoothly.
          </p>
        </div>

        {/* Right Side */}
        <div className='w-full md:w-1/2 flex justify-center items-center p-8 md:p-10 bg-white'>
          <div className='w-full max-w-md'>
            <h2 className='text-3xl font-bold text-center mb-6 text-[#012A4A]'>
              Welcome Back
            </h2>
            <p className='text-center text-[#6C757D] mb-6'>
              Log in to manage your social automation
            </p>

            <form
              onSubmit={handleLogin}
              className='space-y-4'>
              <Input
                icon={Mail}
                type='email'
                placeholder='Enter your Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                icon={Lock}
                type='password'
                placeholder='Enter your Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && (
                <p className='text-[#E63946] text-sm font-medium text-center'>
                  {error}
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type='submit'
                disabled={isLoading}
                className='mt-5 w-full py-3 px-4 font-semibold rounded-lg shadow-md transition-all duration-300 bg-[#01497C] hover:bg-[#014F86] text-white'>
                {isLoading ? (
                  <Loader className='w-5 h-5 animate-spin mx-auto' />
                ) : (
                  "Log In"
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className='flex items-center my-6'>
              <hr className='flex-grow border-[#E2E8F0]' />
              <span className='mx-3 text-sm text-[#6C757D]'>
                or continue with
              </span>
              <hr className='flex-grow border-[#E2E8F0]' />
            </div>

            {/* Social Buttons */}
            <div className='flex gap-4 justify-center'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialLogin("google")}
                className='flex items-center gap-2 px-5 py-2.5 border border-[#E2E8F0] rounded-lg text-[#013A63] hover:bg-[#F1F5F9] transition'>
                <FcGoogle className='w-5 h-5' />
                Google
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialLogin("github")}
                className='flex items-center gap-2 px-5 py-2.5 border border-[#E2E8F0] rounded-lg text-[#013A63] hover:bg-[#F1F5F9] transition'>
                <Github className='w-5 h-5 text-[#2A6F97]' />
                GitHub
              </motion.button>
            </div>

            <div className='mt-6 text-center'>
              <p className='text-sm text-[#6C757D]'>
                Don’t have an account?{" "}
                <Link
                  to='/signup'
                  className='text-[#01497C] font-medium hover:underline'>
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
