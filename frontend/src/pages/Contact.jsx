import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useThemeStore } from "../stores/theme.store.js";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: "easeOut" },
});

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { theme } = useThemeStore();
  const { user } = useUser();

  const API_URL = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);

    if (user?.emailAddresses?.[0]?.emailAddress) {
      setEmail(user.emailAddresses[0].emailAddress);
    }
  }, [theme, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/user/contact`,
        {
          name,
          email,
          message,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data?.success) {
        toast.success("Message sent successfully! 🚀");

        setName("");
        setEmail(user?.emailAddresses?.[0]?.emailAddress || "");
        setMessage("");

        const textarea = document.querySelector("#message");
        if (textarea) textarea.style.height = "25px";
      } else {
        toast.error(res.data?.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Contact Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen py-16 px-6 transition-colors duration-300 bg-[#F8FAFC] dark:bg-gray-900">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div {...fadeUp(0)} className="mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#A9D6E5]/20 to-[#E0F2FF]/30 blur-3xl rounded-full opacity-60 -z-10"></div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-[#012A4A] dark:text-white">
            Let’s Connect with{" "}
            <span className="bg-gradient-to-r from-[#01497C] to-[#61A5C2] bg-clip-text text-transparent">
              Our Team
            </span>
          </h1>

          <p className="text-[#013A63]/80 dark:text-[#CBE5F5]/80 text-base md:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            Have questions, feedback, or collaboration ideas? Reach out to us —
            we’d love to hear from you!
          </p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="h-1 mt-6 mx-auto bg-gradient-to-r from-[#01497C] to-[#61A5C2] rounded-full"
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: <Mail className="w-6 h-6" />,
              title: "Email Us",
              content: "socialarc.sma@gmail.com",
              link: "mailto:socialarc.sma@gmail.com",
            },
            {
              icon: <Phone className="w-6 h-6" />,
              title: "Call Us",
              content: "+91 98332 81953",
              link: "tel:+919833281953",
            },
            {
              icon: <MapPin className="w-6 h-6" />,
              title: "Visit Us",
              content: "Mumbai, Maharashtra, India",
              link: "#",
            },
          ].map((item, idx) => (
            <motion.a
              key={idx}
              {...fadeUp(idx * 0.2)}
              href={item.link}
              className="group bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-[#E0F2FF] dark:bg-[#2C7DA0] text-[#01497C] dark:text-white group-hover:bg-[#61A5C2] group-hover:text-white transition-colors">
                  {item.icon}
                </div>

                <h3 className="text-lg font-bold text-[#012A4A] dark:text-white">
                  {item.title}
                </h3>

                <p className="text-[#2A6F97] dark:text-[#A9D6E5]">
                  {item.content}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          {...fadeUp(0.3)}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-[#E2E8F0] dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-500 p-10 md:p-14 max-w-4xl mx-auto text-left"
        >
          <h2 className="text-2xl font-bold text-[#012A4A] dark:text-white mb-8 text-center">
            Send Us a Message
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-[#013A63] dark:text-[#CBE5F5] mb-2"
              >
                Your Name
              </label>

              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-[#F1F5F9] dark:bg-gray-700 border border-[#E2E8F0] dark:border-gray-600 rounded-lg text-[#012A4A] dark:text-white placeholder:text-[#6C757D] dark:placeholder:text-gray-300 focus:ring-2 focus:ring-[#61A5C2]/60 focus:border-[#61A5C2] transition-all outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#013A63] dark:text-[#CBE5F5] mb-2"
              >
                Your Email
              </label>

              <input
                type="email"
                id="email"
                placeholder="example@email.com"
                className="w-full px-4 py-3 bg-[#F1F5F9] dark:bg-gray-700 border border-[#E2E8F0] dark:border-gray-600 rounded-lg text-[#012A4A] dark:text-white placeholder:text-[#6C757D] dark:placeholder:text-gray-300 focus:ring-2 focus:ring-[#61A5C2]/60 focus:border-[#61A5C2] transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-[#013A63] dark:text-[#CBE5F5] mb-2"
              >
                Message
              </label>

              <textarea
                id="message"
                rows="5"
                placeholder="Type your message..."
                className="w-full px-4 py-3 bg-[#F1F5F9] dark:bg-gray-700 border border-[#E2E8F0] dark:border-gray-600 rounded-lg text-[#012A4A] dark:text-white placeholder:text-[#6C757D] dark:placeholder:text-gray-300 focus:ring-2 focus:ring-[#61A5C2]/60 focus:border-[#61A5C2] transition-all outline-none resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#01497C] dark:bg-[#61A5C2] text-white dark:text-[#012A4A] px-6 py-3 rounded-xl font-semibold hover:bg-[#014F86] hover:text-white dark:hover:bg-[#89C2D9] dark:hover:text-[#012A4A] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
