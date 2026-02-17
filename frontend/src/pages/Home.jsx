import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Calendar, BarChart3, Share2, CheckCircle, X } from "lucide-react";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";
import { usePostStore } from "../stores/post.store";
import { useProfileStore } from "../stores/profile.store";
import { useNavigate } from "react-router-dom";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: "easeOut" },
});

// Socials
const SUPPORTED_SOCIALS = [
  {
    name: "Instagram",
    icon: <FaInstagram className='w-5 h-5' />,
    color: "#E4405F",
  },
  {
    name: "Twitter",
    icon: <FaTwitter className='w-5 h-5' />,
    color: "#1DA1F2",
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedin className='w-5 h-5' />,
    color: "#0077B5",
  },
  {
    name: "Facebook",
    icon: <FaFacebook className='w-5 h-5' />,
    color: "#1877F2",
  },
];

const Home = () => {
  const navigate = useNavigate();

  // Fetch posts and profile info
  const { posts } = usePostStore();
  const { socials, getProfile } = useProfileStore();

  // Fetch profile on mount for persistent social state
  useEffect(() => {
    getProfile();
  }, []);

  // Get next scheduled post
  const scheduledPosts = posts
    .filter((p) => p.isScheduled && new Date(p.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  const nextScheduledPost = scheduledPosts[0];

  return (
    <section className='bg-[#F8FAFC] text-[#012A4A] min-h-screen overflow-hidden'>
      {/* Hero Section */}
      <div className='max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between gap-16'>
        {/* Left - Text */}
        <motion.div
          {...fadeUp(0)}
          className='flex-1 text-center lg:text-left max-w-2xl'>
          <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight'>
            Automate. Schedule.{" "}
            <span className='bg-gradient-to-r from-[#01497C] to-[#61A5C2] bg-clip-text text-transparent'>
              Grow Smarter.
            </span>
          </h1>
          <p className='text-[#013A63]/80 mt-6 text-base sm:text-lg max-w-xl mx-auto lg:mx-0'>
            Simplify your social media strategy with real-time insights,
            AI-powered scheduling, and automated performance tracking — all in
            one seamless dashboard.
          </p>

          <div className='flex flex-wrap justify-center lg:justify-start gap-4 mt-10'>
            <button
              onClick={() => navigate("/profile")}
              className='bg-[#01497C] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#014F86] shadow-md transition-all duration-300'>
              Get Started
            </button>
            <button className='border border-[#01497C] text-[#01497C] px-8 py-3 rounded-xl font-semibold hover:bg-[#E0F2FF] transition-all duration-300'>
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Right - Animated Hero Visualization */}
        <motion.div
          {...fadeUp(0.3)}
          className='flex-1 relative w-full max-w-sm sm:max-w-md lg:max-w-lg h-[300px] sm:h-[340px] lg:h-[400px] mx-auto lg:mx-0'>
          {/* Background Glow */}
          <div className='absolute inset-0 w-full h-full bg-gradient-to-r from-[#A9D6E5]/40 to-[#E0F2FF]/50 blur-3xl rounded-full -z-10'></div>

          {/* Floating Dashboard Cards */}
          <div className='relative w-full h-full flex flex-col items-center justify-center'>
            {/* Scheduled Post */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className='bg-white border border-[#E2E8F0] rounded-3xl shadow-xl p-6 w-full max-w-xs sm:max-w-sm z-20'>
              <h3 className='text-lg font-semibold text-[#012A4A] mb-3 flex items-center gap-2'>
                <Calendar className='text-[#01497C] w-5 h-5' />
                Scheduled Post
              </h3>
              <div className='bg-[#F1F5F9] rounded-xl p-3 min-h-[60px] flex items-center justify-center text-center'>
                {nextScheduledPost ? (
                  <div>
                    <p className='text-[#013A63] text-sm font-medium'>
                      "{nextScheduledPost.title}"
                    </p>
                    <p className='text-[#6C757D] text-xs mt-1'>
                      Scheduled for{" "}
                      {new Date(nextScheduledPost.scheduledAt).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p className='text-[#6C757D] text-sm'>
                    You have no scheduled posts yet. Create a post to see
                    detailed analytics here!
                  </p>
                )}
              </div>
            </motion.div>

            {/* Analytics Card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className='absolute top-[-40px] right-[-40px] bg-white border border-[#E2E8F0] rounded-2xl shadow-lg p-4 w-[150px] sm:w-[180px]'>
              <h4 className='flex items-center gap-2 text-sm font-semibold text-[#012A4A] mb-2'>
                <BarChart3 className='w-4 h-4 text-[#01497C]' />
                Analytics
              </h4>
              <div className='h-16 bg-gradient-to-t from-[#A9D6E5] to-[#61A5C2] rounded-lg relative overflow-hidden'>
                <motion.div
                  className='absolute bottom-0 left-0 right-0 bg-[#01497C]'
                  animate={{ height: ["40%", "80%", "50%"] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />
              </div>
            </motion.div>

            {/* Connected Socials */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut",
                delay: 1,
              }}
              className='absolute bottom-[-40px] left-[-40px] bg-white border border-[#E2E8F0] rounded-2xl shadow-lg p-4 w-[180px] sm:w-[200px]'>
              <h4 className='text-sm font-semibold text-[#012A4A] mb-2 flex items-center gap-1'>
                {Object.values(socials || {}).some(Boolean) ? (
                  <CheckCircle className='text-[#2ECC71] w-4 h-4' />
                ) : (
                  <X className='text-red-500 w-4 h-4' />
                )}
                <span>Connected Socials</span>
              </h4>
              <div className='flex flex-wrap gap-3 mt-2'>
                {SUPPORTED_SOCIALS.map((s) => {
                  const isConnected = socials ? socials[s.name] : false;
                  return (
                    <div
                      key={s.name}
                      onClick={() => !isConnected && navigate("/profile")}
                      className={`flex items-center justify-center w-8 h-8 rounded-full border cursor-pointer ${
                        isConnected
                          ? "bg-[#E0F2FF] border-[#01497C]"
                          : "bg-white border-[#E2E8F0] hover:bg-[#F1F5F9]"
                      }`}
                      title={
                        isConnected
                          ? `${s.name} Connected`
                          : `Click to connect ${s.name}`
                      }>
                      {React.cloneElement(s.icon, {
                        className: `${s.icon.props.className} text-[${s.color}]`,
                      })}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        {...fadeUp(0.5)}
        className='max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
        {[
          {
            icon: <Zap className='text-[#01497C] w-8 h-8' />,
            title: "Smart Automation",
            desc: "AI-driven scheduling and optimized posting times for maximum reach.",
          },
          {
            icon: <Calendar className='text-[#01497C] w-8 h-8' />,
            title: "Content Planner",
            desc: "Organize, visualize, and plan your content calendar effortlessly.",
          },
          {
            icon: <BarChart3 className='text-[#01497C] w-8 h-8' />,
            title: "Analytics Dashboard",
            desc: "Get deep insights on engagement, growth, and performance trends.",
          },
          {
            icon: <Share2 className='text-[#01497C] w-8 h-8' />,
            title: "Cross-Platform Posting",
            desc: "Post across Instagram, Twitter, and LinkedIn in one click.",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            {...fadeUp(0.1 * i)}
            className='bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-300'>
            <div className='mb-4'>{feature.icon}</div>
            <h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
            <p className='text-[#6C757D] text-sm'>{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        {...fadeUp(0.6)}
        className='relative bg-gradient-to-r from-[#01497C] to-[#61A5C2] text-white py-20 px-6 text-center rounded-[2.5rem] mx-6 my-24 shadow-lg overflow-hidden'>
        <div className='absolute inset-0 bg-white/10 backdrop-blur-sm'></div>
        <div className='relative z-10'>
          <h2 className='text-3xl md:text-4xl font-bold mb-6'>
            Ready to Elevate Your Social Media Game?
          </h2>
          <p className='text-[#E0F2FF]/90 mb-4 max-w-2xl mx-auto text-lg'>
            Join thousands of creators and brands automating their social growth
            — it’s{" "}
            <span className='font-semibold text-white'>
              100% Free (for now)
            </span>{" "}
            🎉
          </p>
          <div className='flex flex-wrap justify-center gap-4 mt-10'>
            <button
              onClick={() => navigate("/profile")}
              className='bg-white text-[#01497C] px-8 py-3 rounded-xl font-semibold hover:bg-[#E0F2FF] transition-all duration-300 shadow-md hover:shadow-lg'>
              Get Started
            </button>
            <button className='border border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300'>
              See Demo
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Home;
