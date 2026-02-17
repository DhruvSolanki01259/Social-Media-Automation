import React from "react";
import { motion } from "framer-motion";
import { Linkedin, Github, Mail } from "lucide-react";
import { teamData } from "../data/teamData";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: "easeOut" },
});

const AboutUs = () => {
  return (
    <section className='min-h-screen bg-[#F8FAFC] py-16 px-6'>
      <div className='max-w-7xl mx-auto text-center'>
        {/* Hero Section */}
        <motion.div
          {...fadeUp(0)}
          className='mb-20 relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-[#A9D6E5]/20 to-[#E0F2FF]/30 blur-3xl rounded-full opacity-60 -z-10'></div>

          <h1 className='text-4xl md:text-5xl font-extrabold text-[#012A4A] leading-tight tracking-tight'>
            Meet the Visionaries Behind{" "}
            <span className='bg-gradient-to-r from-[#01497C] to-[#61A5C2] bg-clip-text text-transparent'>
              Social Media Automation
            </span>
          </h1>
          <p className='text-[#013A63]/80 text-base md:text-lg max-w-2xl mx-auto mt-6 leading-relaxed'>
            We’re a passionate team driven by innovation — building intelligent
            automation tools to simplify your online presence management and
            elevate your brand efficiency.
          </p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className='h-1 mt-6 mx-auto bg-gradient-to-r from-[#01497C] to-[#61A5C2] rounded-full'
          />
        </motion.div>

        {/* Guide Section */}
        <motion.div
          {...fadeUp(0.2)}
          className='bg-[#FFFFFF] rounded-3xl border border-[#E2E8F0] shadow-md hover:shadow-xl transition-all duration-500 p-10 md:p-14 max-w-5xl mx-auto mb-20 text-left flex flex-col md:flex-row items-center gap-10'>
          {/* Guide Image */}
          <div className='flex-shrink-0'>
            <img
              src={teamData.guide.profileImage}
              alt={teamData.guide.name}
              className='w-40 h-40 rounded-full border-4 border-[#61A5C2] object-cover shadow-lg mx-auto md:mx-0'
            />
          </div>

          {/* Guide Info */}
          <div className='flex-1'>
            <h3 className='text-2xl font-bold text-[#012A4A]'>
              {teamData.guide.name}
            </h3>
            <p className='text-[#2A6F97] mt-1 font-semibold'>
              {teamData.guide.designation}
            </p>
            <p className='text-[#6C757D] mt-4 leading-relaxed text-sm md:text-base'>
              {teamData.guide.description}
            </p>
            <div className='flex gap-6 mt-6 text-[#2A6F97]'>
              <a
                href={`mailto:${teamData.guide.email}`}
                aria-label='Email'>
                <Mail className='w-5 h-5 hover:text-[#01497C] transition-colors' />
              </a>
              <a
                href={teamData.guide.linkedin}
                target='_blank'
                rel='noopener noreferrer'
                aria-label='LinkedIn'>
                <Linkedin className='w-5 h-5 hover:text-[#01497C] transition-colors' />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Team Members */}
        <motion.h2
          {...fadeUp(0.3)}
          className='text-3xl font-bold text-[#012A4A] mb-12'>
          Our Core Team
        </motion.h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
          {teamData.teamMembers.map((member, idx) => (
            <motion.div
              key={idx}
              {...fadeUp(idx * 0.2)}
              className='relative bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden'>
              {/* Gradient Accent Border */}
              <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#01497C] to-[#61A5C2]' />

              {/* Card Content */}
              <div className='p-8 flex flex-col items-center text-center'>
                <div className='relative'>
                  <img
                    src={member.profileImage}
                    alt={member.name}
                    className='w-28 h-28 rounded-full border-4 border-[#61A5C2] object-cover shadow-md group-hover:scale-105 transition-transform duration-500'
                  />
                </div>

                <h4 className='text-lg font-bold mt-5 text-[#012A4A]'>
                  {member.name}
                </h4>
                <p className='text-[#2A6F97] font-medium text-sm mb-2'>
                  {member.role}
                </p>
                <p className='text-sm text-[#6C757D] leading-relaxed line-clamp-3 max-w-xs'>
                  {member.description}
                </p>

                {/* Social Links */}
                <div className='flex justify-center gap-5 mt-6 text-[#2A6F97]'>
                  <a
                    href={`mailto:${member.email}`}
                    aria-label='Email'>
                    <Mail className='w-5 h-5 hover:text-[#01497C] transition-colors' />
                  </a>
                  <a
                    href={member.linkedin}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='LinkedIn'>
                    <Linkedin className='w-5 h-5 hover:text-[#01497C] transition-colors' />
                  </a>
                  <a
                    href={member.github}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='GitHub'>
                    <Github className='w-5 h-5 hover:text-[#01497C] transition-colors' />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
