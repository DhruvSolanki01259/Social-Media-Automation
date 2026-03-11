import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Calendar,
  BarChart3,
  Share2,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import LoadingSpinner from "../components/LoadingSpinner";
import axios from "axios";

/* ---------------- ANIMATION PRESETS ---------------- */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const floatY = {
  animate: { y: [0, -10, 0] },
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
};

/* ---------------- SOCIAL ICONS ---------------- */

const SOCIAL_ICONS = [
  { key: "instagram", icon: <FaInstagram />, color: "#E4405F" },
  { key: "twitter", icon: <FaTwitter />, color: "#1DA1F2" },
  { key: "linkedin", icon: <FaLinkedin />, color: "#0077B5" },
  { key: "facebook", icon: <FaFacebook />, color: "#1877F2" },
];

const Home = () => {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const socials = user?.unsafeMetadata?.socials || {};

  // const fetchData = async () => {
  //   const response = await axios.post(
  //     "http://localhost:8000/api/automatedata/generate",
  //     {
  //       title: "10 React Tips Every Developer Should Know",
  //       description:
  //         "A guide covering useful React patterns and performance improvements.",
  //       tags: ["react", "javascript", "webdev"],
  //     },
  //   );
  //   console.log(response.data);
  // };
  // fetchData();

  return (
    <main className="bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT */}
        <motion.div {...fadeUp(0)}>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            {isSignedIn ? (
              <>
                Welcome back,
                <span className="block text-blue-700 dark:text-blue-400">
                  manage your content smarter
                </span>
              </>
            ) : (
              <>
                Plan. Publish.
                <span className="block text-blue-700 dark:text-blue-400">
                  Grow with confidence.
                </span>
              </>
            )}
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-slate-300 max-w-xl">
            {isSignedIn
              ? "Control publishing, scheduling, and analytics from one reliable dashboard."
              : "A single platform to schedule content, track performance, and stay consistent across social channels."}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() =>
                navigate(isSignedIn ? "/content-studio" : "/signup")
              }
              className="bg-blue-700 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              {isSignedIn ? "Open Content Studio" : "Get Started Free"}
              <ArrowRight size={18} />
            </button>

            {!isSignedIn && (
              <button
                onClick={() => navigate("/login")}
                className="border border-gray-300 dark:border-slate-600 px-8 py-3 rounded-lg font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                Login
              </button>
            )}
          </div>
        </motion.div>

        {/* RIGHT – FLOATING CARDS */}
        <motion.div
          {...fadeUp(0.2)}
          className="relative h-[520px] hidden lg:block"
        >
          {/* Platforms */}
          <motion.div
            {...floatY}
            className="absolute top-0 right-0 w-[260px] bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-2xl shadow-lg p-5"
          >
            <h3 className="flex items-center gap-2 font-semibold text-sm">
              <Share2 size={16} className="text-blue-600" />
              Platforms
            </h3>

            <div className="flex gap-3 mt-4">
              {SOCIAL_ICONS.map((s) => (
                <div
                  key={s.key}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center ${
                    socials[s.key]
                      ? "bg-blue-50 border-blue-600 dark:bg-blue-900/40"
                      : "opacity-30"
                  }`}
                  style={{ color: s.color }}
                >
                  {s.icon}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Scheduling */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-[180px] right-[160px] w-[320px] bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-2xl shadow-lg p-6"
          >
            <h3 className="flex items-center gap-2 font-semibold">
              <Calendar className="text-blue-600" />
              Scheduling
            </h3>
            <p className="mt-3 text-sm text-gray-600 dark:text-slate-300">
              Schedule content once and publish automatically at the right time.
            </p>
          </motion.div>

          {/* Analytics */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-0 right-[360px] w-[240px] bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-2xl shadow-lg p-5"
          >
            <h4 className="flex items-center gap-2 font-semibold text-sm">
              <BarChart3 size={16} className="text-blue-600" />
              Analytics
            </h4>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
              Understand engagement and performance clearly.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-white dark:bg-[#0F172A] border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold text-center">
            Built for Serious Content Teams
          </h2>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                icon: <Clock className="text-blue-600" />,
                title: "Time Saving",
                desc: "Reduce manual work with reliable automation.",
              },
              {
                icon: <ShieldCheck className="text-blue-600" />,
                title: "Secure",
                desc: "Enterprise-grade authentication and data safety.",
              },
              {
                icon: <Zap className="text-blue-600" />,
                title: "Fast Workflow",
                desc: "Publish across platforms in minutes.",
              },
              {
                icon: <BarChart3 className="text-blue-600" />,
                title: "Insights",
                desc: "Track growth and make informed decisions.",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                {...fadeUp(0.1 * i)}
                className="bg-gray-50 dark:bg-slate-900 border dark:border-slate-700 rounded-2xl p-6"
              >
                {f.icon}
                <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      {!isSignedIn && (
        <section className="bg-blue-700 dark:bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl font-bold">
              Start Free. Upgrade When Ready.
            </h2>

            <p className="mt-4 text-blue-100 dark:text-slate-300 max-w-xl mx-auto">
              No credit card required. Get started in minutes.
            </p>

            <button
              onClick={() => navigate("/signup")}
              className="mt-8 bg-white text-blue-700 dark:bg-blue-600 dark:text-white px-10 py-3 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-500 transition"
            >
              Create Free Account
            </button>
          </div>
        </section>
      )}
    </main>
  );
};

export default Home;
