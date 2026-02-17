import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: "easeOut" },
});

const Contact = () => {
  return (
    <section className='min-h-screen bg-[#F8FAFC] py-16 px-6'>
      <div className='max-w-6xl mx-auto text-center'>
        {/* 🌟 Header Section */}
        <motion.div
          {...fadeUp(0)}
          className='mb-16 relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-[#A9D6E5]/20 to-[#E0F2FF]/30 blur-3xl rounded-full opacity-60 -z-10'></div>

          <h1 className='text-4xl md:text-5xl font-extrabold text-[#012A4A] leading-tight tracking-tight'>
            Let’s Connect with{" "}
            <span className='bg-gradient-to-r from-[#01497C] to-[#61A5C2] bg-clip-text text-transparent'>
              Our Team
            </span>
          </h1>
          <p className='text-[#013A63]/80 text-base md:text-lg max-w-2xl mx-auto mt-6 leading-relaxed'>
            Have questions, feedback, or collaboration ideas? Reach out to us —
            we’d love to hear from you!
          </p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className='h-1 mt-6 mx-auto bg-gradient-to-r from-[#01497C] to-[#61A5C2] rounded-full'></motion.div>
        </motion.div>

        {/* 📞 Contact Info Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20'>
          {[
            {
              icon: <Mail className='w-6 h-6' />,
              title: "Email Us",
              content: "support@socialmediaauto.com",
              link: "mailto:support@socialmediaauto.com",
            },
            {
              icon: <Phone className='w-6 h-6' />,
              title: "Call Us",
              content: "+91 98765 43210",
              link: "tel:+919876543210",
            },
            {
              icon: <MapPin className='w-6 h-6' />,
              title: "Visit Us",
              content: "Ahmedabad, Gujarat, India",
              link: "#",
            },
          ].map((item, idx) => (
            <motion.a
              key={idx}
              {...fadeUp(idx * 0.2)}
              href={item.link}
              className='group bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500'>
              <div className='flex flex-col items-center text-center space-y-4'>
                <div className='p-4 rounded-full bg-[#E0F2FF] text-[#01497C] group-hover:bg-[#61A5C2] group-hover:text-white transition-colors'>
                  {item.icon}
                </div>
                <h3 className='text-lg font-bold text-[#012A4A]'>
                  {item.title}
                </h3>
                <p className='text-[#2A6F97]'>{item.content}</p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* 📝 Contact Form */}
        <motion.div
          {...fadeUp(0.3)}
          className='bg-white rounded-3xl border border-[#E2E8F0] shadow-md hover:shadow-xl transition-all duration-500 p-10 md:p-14 max-w-4xl mx-auto text-left'>
          <h2 className='text-2xl font-bold text-[#012A4A] mb-8 text-center'>
            Send Us a Message
          </h2>

          <form className='space-y-6'>
            {/* Name */}
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-semibold text-[#013A63] mb-2'>
                Your Name
              </label>
              <input
                type='text'
                id='name'
                name='name'
                placeholder='Enter your name'
                className='w-full px-4 py-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-[#012A4A] placeholder:text-[#6C757D] focus:ring-2 focus:ring-[#61A5C2]/60 focus:border-[#61A5C2] transition-all outline-none'
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-semibold text-[#013A63] mb-2'>
                Your Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                placeholder='example@email.com'
                className='w-full px-4 py-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-[#012A4A] placeholder:text-[#6C757D] focus:ring-2 focus:ring-[#61A5C2]/60 focus:border-[#61A5C2] transition-all outline-none'
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor='message'
                className='block text-sm font-semibold text-[#013A63] mb-2'>
                Message
              </label>
              <textarea
                id='message'
                name='message'
                rows='5'
                placeholder='Type your message...'
                className='w-full px-4 py-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-[#012A4A] placeholder:text-[#6C757D] focus:ring-2 focus:ring-[#61A5C2]/60 focus:border-[#61A5C2] transition-all outline-none resize-none'></textarea>
            </div>

            {/* Submit Button */}
            <div className='flex justify-center'>
              <button
                type='submit'
                className='flex items-center gap-2 bg-[#01497C] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#014F86] transition-all duration-300 shadow-md hover:shadow-lg'>
                <Send className='w-5 h-5' /> Send Message
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
