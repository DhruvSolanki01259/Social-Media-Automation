import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useThemeStore } from "../stores/theme.store.js";

const Analytics = () => {
  const { theme } = useThemeStore();

  // Apply theme class to <html>
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  // ✅ Sample Data
  const summary = {
    totalPosts: 24,
    postedPosts: 15,
    scheduledPosts: 6,
    totalComments: 48,
  };

  const postsByDate = [
    { date: "Nov 01", count: 3 },
    { date: "Nov 02", count: 4 },
    { date: "Nov 03", count: 5 },
    { date: "Nov 04", count: 2 },
    { date: "Nov 05", count: 6 },
    { date: "Nov 06", count: 4 },
  ];

  const platformCount = [
    { name: "Facebook", value: 8 },
    { name: "Instagram", value: 6 },
    { name: "LinkedIn", value: 5 },
    { name: "Twitter", value: 5 },
  ];

  const recentPosts = [
    {
      _id: "1",
      title: "New Feature Launch 🚀",
      description: "Announcing our latest product update.",
      platforms: ["Facebook", "LinkedIn"],
      isPosted: true,
      isScheduled: false,
    },
    {
      _id: "2",
      title: "Community Highlights",
      description: "Top posts from our amazing community!",
      platforms: ["Instagram", "Twitter"],
      isPosted: true,
      isScheduled: false,
    },
    {
      _id: "3",
      title: "Upcoming Webinar",
      description: "Join our live session on AI-driven automation.",
      platforms: ["LinkedIn"],
      isPosted: false,
      isScheduled: true,
    },
    {
      _id: "4",
      title: "Behind the Scenes",
      description: "A look at how we build our automation tools.",
      platforms: ["Instagram"],
      isPosted: false,
      isScheduled: false,
    },
  ];

  const COLORS_LIGHT = ["#01497C", "#2A6F97", "#468FAF", "#A9D6E5"];
  const COLORS_DARK = ["#61A5C2", "#2C7DA0", "#468FAF", "#A9D6E5"];
  const COLORS = theme === "dark" ? COLORS_DARK : COLORS_LIGHT;

  return (
    <div className="p-6 space-y-8 min-h-screen transition-colors duration-300 bg-[#F8FAFC] dark:bg-gray-900">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-[#01497C] dark:text-[#A9D6E5]"
      >
        Post Analytics Dashboard
      </motion.h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Posts", value: summary.totalPosts },
          { title: "Posted", value: summary.postedPosts },
          { title: "Scheduled", value: summary.scheduledPosts },
          { title: "Total Comments", value: summary.totalComments },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-[#E2E8F0] dark:border-gray-700"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-lg font-semibold text-[#012A4A] dark:text-white">
              {item.title}
            </h3>
            <p className="text-2xl font-bold text-[#01497C] dark:text-[#61A5C2]">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Posts Over Time */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-[#E2E8F0] dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-[#012A4A] dark:text-white">
          Posts Over Time
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={postsByDate}>
            <XAxis
              dataKey="date"
              stroke={theme === "dark" ? "#CBE5F5" : "#012A4A"}
            />
            <YAxis stroke={theme === "dark" ? "#CBE5F5" : "#012A4A"} />
            <Tooltip
              wrapperStyle={{
                backgroundColor: theme === "dark" ? "#1E3A5F" : "#FFF",
                border: "none",
                color: theme === "dark" ? "#FFF" : "#000",
              }}
            />
            <Bar
              dataKey="count"
              fill={theme === "dark" ? "#61A5C2" : "#01497C"}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Platform Distribution */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-[#E2E8F0] dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-[#012A4A] dark:text-white">
          Posts by Platform
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={platformCount}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {platformCount.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              wrapperStyle={{
                backgroundColor: theme === "dark" ? "#1E3A5F" : "#FFF",
                border: "none",
                color: theme === "dark" ? "#FFF" : "#000",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Posts */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-[#E2E8F0] dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-[#012A4A] dark:text-white">
          Recent Posts
        </h2>
        <ul className="space-y-3">
          {recentPosts.map((post) => (
            <li
              key={post._id}
              className="p-3 border-b border-[#E2E8F0] dark:border-gray-700"
            >
              <h3 className="font-semibold text-[#01497C] dark:text-[#61A5C2]">
                {post.title}
              </h3>
              <p className="text-[#013A63] dark:text-[#CBE5F5] text-sm">
                {post.description}
              </p>
              <p className="text-[#6C757D] dark:text-[#89A0B2] text-xs">
                Platforms: {post.platforms?.join(", ") || "None"} |{" "}
                {post.isPosted
                  ? "Posted"
                  : post.isScheduled
                    ? "Scheduled"
                    : "Draft"}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
