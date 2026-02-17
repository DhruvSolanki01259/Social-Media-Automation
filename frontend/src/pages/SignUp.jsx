import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignUp, UserButton } from "@clerk/clerk-react";

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex w-full max-w-6xl bg-white rounded-2xl shadow-lg border border-[#E2E8F0] overflow-hidden"
      >
        {/* Left Side: Clerk SignUp Form */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-10">
          <SignedOut>
            <SignUp
              path="/signup"
              routing="path"
              signInUrl="/login"
              afterSignUpUrl="/profile"
              appearance={{
                elements: {
                  card: "shadow-none border-none",
                },
              }}
            />
          </SignedOut>

          <SignedIn>
            <div className="flex flex-col items-center gap-4">
              <UserButton />
              <button
                onClick={() => navigate("/profile")}
                className="px-6 py-2 bg-[#01497C] text-white rounded-lg"
              >
                Go to Profile
              </button>
            </div>
          </SignedIn>
        </div>

        {/* Right Side: Image Section */}
        <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-10 bg-[#F1F5F9] border-l border-[#E2E8F0]">
          <img
            src="/signup-image.png"
            alt="Sign Up"
            className="w-128 h-128 object-contain mb-6"
          />
          <h3 className="text-3xl font-bold text-[#012A4A] mb-2 text-center">
            Automate Your Social Growth
          </h3>
          <p className="text-[#013A63]/80 text-center text-base">
            Simplify your social media workflow and let automation handle the
            posting.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
