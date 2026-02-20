import React from "react";
import { motion } from "framer-motion";
import { Zap, Calendar, BarChart3, Share2, ArrowRight } from "lucide-react";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { usePostStore } from "../stores/post.store";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" },
});

const SOCIAL_ICONS = [
  { key: "instagram", icon: <FaInstagram />, color: "#E4405F" },
  { key: "twitter", icon: <FaTwitter />, color: "#1DA1F2" },
  { key: "linkedin", icon: <FaLinkedin />, color: "#0077B5" },
  { key: "facebook", icon: <FaFacebook />, color: "#1877F2" },
];

const Home = () => {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  const { posts } = usePostStore();

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center text-blue-800 dark:text-blue-300">
        Loading...
      </div>
    );
  }

  const socials = user?.unsafeMetadata?.socials || {};
  const scheduledPosts = posts
    .filter((p) => p.isScheduled && new Date(p.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

  const nextScheduledPost = scheduledPosts[0];

  return (
    <section className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden">
      {/* ================= HERO ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-24 grid lg:grid-cols-2 gap-14 items-center">
        {/* ================= LEFT ================= */}
        <motion.div {...fadeUp(0)}>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
            {isSignedIn ? (
              <>
                Welcome back,{" "}
                <span className="text-blue-800 dark:text-blue-400">
                  Creator
                </span>
              </>
            ) : (
              <>
                Automate. Schedule.{" "}
                <span className="bg-gradient-to-r from-blue-800 to-blue-400 bg-clip-text text-transparent">
                  Grow Smarter.
                </span>
              </>
            )}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-700 dark:text-gray-300/80">
            {isSignedIn
              ? "Manage publishing, scheduling, and analytics from one dashboard."
              : "Connect platforms, schedule content once, and grow consistently."}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() =>
                navigate(isSignedIn ? "/content-studio" : "/signup")
              }
              className="bg-blue-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              {isSignedIn ? "Explore Content Studio" : "Get Started Free"}
              <ArrowRight size={18} />
            </button>

            {!isSignedIn && (
              <button
                onClick={() => navigate("/signup")}
                className="border border-blue-800 text-blue-800 px-8 py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-gray-800 dark:border-blue-400 dark:text-blue-400"
              >
                Login
              </button>
            )}
          </div>
        </motion.div>

        {/* ================= FLOATING CONTAINERS ================= */}
        <motion.div
          {...fadeUp(0.3)}
          className="relative h-[520px] hidden lg:block"
        >
          {/* -------- Platforms -------- */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="absolute top-0 right-0 w-[260px] bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700 shadow-xl p-5"
          >
            <h3 className="flex items-center gap-2 font-semibold text-sm text-gray-900 dark:text-white">
              <Share2 size={18} className="text-blue-800 dark:text-blue-400" />
              Platforms
            </h3>

            {isSignedIn ? (
              <>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Your connected platforms
                </p>
                <div className="flex gap-3 mt-3">
                  {SOCIAL_ICONS.map((s) => (
                    <div
                      key={s.key}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center ${
                        socials[s.key]
                          ? "bg-blue-100 border-blue-800 dark:bg-blue-900 dark:border-blue-400"
                          : "opacity-30"
                      }`}
                      style={{ color: s.color }}
                    >
                      {s.icon}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Connect multiple platforms and manage everything from one place.
              </p>
            )}
          </motion.div>

          {/* -------- Scheduling -------- */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 5.5 }}
            className="absolute top-[170px] right-[140px] w-[320px] bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700 shadow-xl p-6"
          >
            <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
              <Calendar className="text-blue-800 dark:text-blue-400" />
              Scheduling
            </h3>

            <div className="mt-4 bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-center">
              {isSignedIn ? (
                nextScheduledPost ? (
                  <>
                    <p className="font-medium truncate text-gray-900 dark:text-white">
                      "{nextScheduledPost.title}"
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                      {new Date(nextScheduledPost.scheduledAt).toLocaleString()}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    No upcoming scheduled posts
                  </p>
                )
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Schedule once and publish automatically.
                </p>
              )}
            </div>
          </motion.div>

          {/* -------- Analytics -------- */}
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ repeat: Infinity, duration: 7 }}
            className="absolute bottom-0 right-[360px] w-[240px] bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg p-4"
          >
            <h4 className="flex items-center gap-2 font-semibold text-sm text-gray-900 dark:text-white">
              <BarChart3
                size={16}
                className="text-blue-800 dark:text-blue-400"
              />
              Analytics
            </h4>

            <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
              Track engagement and performance across all platforms.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* ================= FEATURES ================= */}
      <section className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white">
            Everything You Need to Scale Your Social Presence
          </h2>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="text-blue-800 dark:text-blue-400" />,
                title: "Smart Automation",
                desc: "Set it once and let the system handle posting.",
              },
              {
                icon: <Calendar className="text-blue-800 dark:text-blue-400" />,
                title: "Content Planning",
                desc: "Plan days or weeks of content visually.",
              },
              {
                icon: <Share2 className="text-blue-800 dark:text-blue-400" />,
                title: "Multi-Platform",
                desc: "Manage all platforms from one dashboard.",
              },
              {
                icon: (
                  <BarChart3 className="text-blue-800 dark:text-blue-400" />
                ),
                title: "Analytics",
                desc: "Understand performance and optimize faster.",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                {...fadeUp(0.1 * i)}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8"
              >
                <div>{f.icon}</div>
                <h3 className="text-lg font-semibold mt-4 text-gray-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      {!isSignedIn && (
        <section className="bg-blue-800 dark:bg-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Start Free. Grow Faster.
            </h2>
            <p className="mt-4 text-blue-100 dark:text-blue-200 max-w-xl mx-auto">
              Connect platforms, schedule your first post, and track results —
              no credit card required.
            </p>

            <button
              onClick={() => navigate("/signup")}
              className="mt-8 bg-white text-blue-800 dark:text-blue-200 px-10 py-4 rounded-xl font-semibold hover:bg-blue-100 dark:hover:bg-blue-800"
            >
              Create Free Account
            </button>
          </div>
        </section>
      )}
    </section>
  );
};

export default Home;
