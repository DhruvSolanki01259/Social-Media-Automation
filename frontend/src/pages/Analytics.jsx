import React from "react";
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

const COLORS = ["#01497C", "#2A6F97", "#468FAF", "#A9D6E5"];

const Analytics = () => {
  // ✅ Static Sample Data
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

  return (
    <div className='p-6 space-y-8 bg-[#F8FAFC] min-h-screen'>
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-2xl font-bold text-[#01497C]'>
        Post Analytics Dashboard
      </motion.h1>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {[
          { title: "Total Posts", value: summary.totalPosts },
          { title: "Posted", value: summary.postedPosts },
          { title: "Scheduled", value: summary.scheduledPosts },
          { title: "Total Comments", value: summary.totalComments },
        ].map((item, i) => (
          <motion.div
            key={i}
            className='p-4 bg-white rounded-2xl shadow-md border border-[#E2E8F0]'
            whileHover={{ scale: 1.02 }}>
            <h3 className='text-lg font-semibold text-[#012A4A]'>
              {item.title}
            </h3>
            <p className='text-2xl font-bold text-[#01497C]'>{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Posts Over Time */}
      <div className='bg-white p-6 rounded-2xl shadow-md border border-[#E2E8F0]'>
        <h2 className='text-xl font-semibold mb-4 text-[#012A4A]'>
          Posts Over Time
        </h2>
        <ResponsiveContainer
          width='100%'
          height={250}>
          <BarChart data={postsByDate}>
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey='count'
              fill='#01497C'
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Platform Distribution */}
      <div className='bg-white p-6 rounded-2xl shadow-md border border-[#E2E8F0]'>
        <h2 className='text-xl font-semibold mb-4 text-[#012A4A]'>
          Posts by Platform
        </h2>
        <ResponsiveContainer
          width='100%'
          height={250}>
          <PieChart>
            <Pie
              data={platformCount}
              cx='50%'
              cy='50%'
              outerRadius={100}
              dataKey='value'
              label>
              {platformCount.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Posts */}
      <div className='bg-white p-6 rounded-2xl shadow-md border border-[#E2E8F0]'>
        <h2 className='text-xl font-semibold mb-4 text-[#012A4A]'>
          Recent Posts
        </h2>
        <ul className='space-y-3'>
          {recentPosts.map((post) => (
            <li
              key={post._id}
              className='p-3 border-b border-[#E2E8F0]'>
              <h3 className='font-semibold text-[#01497C]'>{post.title}</h3>
              <p className='text-[#013A63] text-sm'>{post.description}</p>
              <p className='text-[#6C757D] text-xs'>
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
