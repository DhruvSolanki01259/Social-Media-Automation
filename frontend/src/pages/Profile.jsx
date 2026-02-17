import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  UserPen,
  Settings2,
  Link2,
  PlusCircle,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "../stores/profile.store";
import { useAuthStore } from "../stores/auth.store";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const Profile = () => {
  const navigate = useNavigate();
  const {
    user,
    socials,
    isLoading,
    getProfile,
    updateProfile,
    updateSocials,
    deleteSocial,
    error,
  } = useProfileStore();

  const { logout } = useAuthStore();

  const [editMode, setEditMode] = useState(false);
  const [showSocialForm, setShowSocialForm] = useState(false);
  const [localProfile, setLocalProfile] = useState({
    bio: "",
    location: "",
    website: "",
  });
  const [localSocials, setLocalSocials] = useState({
    linkedin: "",
    instagram: "",
    facebook: "",
    twitter: "",
  });

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (user) {
      setLocalProfile({
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
      });
      setLocalSocials(user.socials || {});
    }
  }, [user]);

  const handleProfileSave = async () => {
    const success = await updateProfile(localProfile);
    if (success) setEditMode(false);
  };

  const handleSocialSave = async () => {
    const success = await updateSocials(localSocials);
    if (success) setShowSocialForm(false);
  };

  const handleDeleteSocial = async (platform) => {
    await deleteSocial(platform);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading && !user) {
    return (
      <div className='flex items-center justify-center h-screen text-[#01497C]'>
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen text-red-600 font-medium'>
        {error}
      </div>
    );
  }

  return (
    <section className='min-h-screen bg-[#F8FAFC] py-16 px-6 relative'>
      <div className='max-w-7xl mx-auto space-y-16'>
        {/* === HEADER === */}
        <motion.div
          {...fadeUp(0)}
          className='flex flex-col md:flex-row justify-between items-center gap-6 relative'>
          <div className='text-center md:text-left'>
            <h1 className='text-4xl md:text-5xl font-bold text-[#012A4A]'>
              {user?.username ? `Welcome, ${user.username}` : "Welcome!"}
            </h1>
            <p className='text-[#013A63]/80 text-base md:text-lg mt-3'>
              Manage your profile and connected social accounts.
            </p>
          </div>
        </motion.div>

        {/* === PROFILE CARD === */}
        <motion.div
          {...fadeUp(0.2)}
          className='relative bg-white border border-[#E2E8F0] rounded-2xl shadow-sm hover:shadow-md transition-all p-8 flex flex-col md:flex-row items-center gap-8'>
          {/* ✅ Hide logout when in edit mode */}
          {!editMode && (
            <button
              onClick={handleLogout}
              title='Logout'
              className='absolute top-4 right-4 p-2 border border-[#E2E8F0] rounded-full hover:bg-[#F1F5F9] transition'>
              <LogOut className='w-5 h-5 text-[#E63946]' />
            </button>
          )}

          <img
            src={
              user?.profilePic ||
              `https://avatar.iran.liara.run/username?username=${encodeURIComponent(
                user?.username || "User"
              )}`
            }
            alt='Profile'
            className='w-32 h-32 rounded-full border-4 border-[#61A5C2] object-cover shadow'
          />

          <div className='flex-1 text-center md:text-left w-full'>
            {!editMode ? (
              <>
                <h2 className='text-2xl font-semibold text-[#012A4A]'>
                  {user?.username}
                </h2>
                <p className='text-[#2A6F97] font-medium'>{user?.email}</p>

                <div className='mt-4 space-y-2'>
                  <p className='text-[#6C757D]'>
                    {user?.bio || "No bio added yet."}
                  </p>
                  <p className='text-[#01497C] flex items-center justify-center md:justify-start gap-1'>
                    <MapPin className='w-4 h-4' />
                    {user?.location || "Location not set"}
                  </p>
                  {user?.website && (
                    <a
                      href={user.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[#2A6F97] hover:underline block'>
                      🌐 {user.website}
                    </a>
                  )}
                </div>

                <div className='mt-6 flex justify-center md:justify-end'>
                  {/* ✏️ Edit Button */}
                  <button
                    onClick={() => setEditMode(true)}
                    className='flex items-center gap-2 text-[#01497C] border border-[#01497C] px-4 py-1.5 rounded-lg hover:bg-[#01497C] hover:text-white transition-all'>
                    <UserPen className='w-4 h-4' />
                    Edit Profile
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className='text-xl font-semibold mb-4 text-[#012A4A]'>
                  Edit Profile
                </h3>
                <div className='flex flex-col gap-3'>
                  <input
                    type='text'
                    placeholder='Bio'
                    value={localProfile.bio}
                    onChange={(e) =>
                      setLocalProfile({ ...localProfile, bio: e.target.value })
                    }
                    className='border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#01497C] focus:border-[#01497C]'
                  />
                  <input
                    type='text'
                    placeholder='Location'
                    value={localProfile.location}
                    onChange={(e) =>
                      setLocalProfile({
                        ...localProfile,
                        location: e.target.value,
                      })
                    }
                    className='border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#01497C] focus:border-[#01497C]'
                  />
                  <input
                    type='text'
                    placeholder='Website'
                    value={localProfile.website}
                    onChange={(e) =>
                      setLocalProfile({
                        ...localProfile,
                        website: e.target.value,
                      })
                    }
                    className='border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#01497C] focus:border-[#01497C]'
                  />
                </div>

                <div className='flex gap-3 mt-4 justify-end'>
                  <button
                    onClick={handleProfileSave}
                    className='bg-[#01497C] text-white px-4 py-2 rounded-lg hover:bg-[#014F86]'>
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className='border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100'>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* === SOCIALS SECTION === */}
        <motion.div
          {...fadeUp(0.3)}
          className='bg-white border border-[#E2E8F0] rounded-2xl shadow-sm hover:shadow-md transition-all p-8'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-3'>
              <Link2 className='text-[#01497C] w-6 h-6' />
              <h3 className='text-xl font-semibold text-[#012A4A]'>
                Connected Social Accounts
              </h3>
            </div>

            <button
              onClick={() => setShowSocialForm(true)}
              className='flex items-center gap-2 border border-[#01497C] text-[#01497C] px-4 py-1.5 rounded-lg hover:bg-[#01497C] hover:text-white transition-all'>
              <Settings2 className='w-4 h-4' />
              Manage
            </button>
          </div>

          <div className='grid sm:grid-cols-2 md:grid-cols-4 gap-6'>
            {Object.entries(socials || {}).map(([platform, link]) => (
              <div
                key={platform}
                className={`p-4 rounded-lg border text-center ${
                  link
                    ? "border-[#2ECC71] text-[#2ECC71] bg-[#2ECC71]/5"
                    : "border-[#E2E8F0] text-[#6C757D]"
                }`}>
                <span className='font-medium capitalize'>
                  {platform}:{" "}
                  {link ? (
                    <a
                      href={link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='underline hover:text-[#27AE60]'>
                      Connected
                    </a>
                  ) : (
                    "Not Connected"
                  )}
                </span>
                {link && (
                  <button
                    onClick={() => handleDeleteSocial(platform)}
                    className='ml-2 text-sm text-[#E63946] hover:underline'>
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {showSocialForm && (
            <div className='mt-6 space-y-3'>
              {Object.keys(localSocials).map((platform) => (
                <input
                  key={platform}
                  type='url'
                  placeholder={`${platform} URL`}
                  value={localSocials[platform] || ""}
                  onChange={(e) =>
                    setLocalSocials({
                      ...localSocials,
                      [platform]: e.target.value,
                    })
                  }
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#01497C] focus:border-[#01497C]'
                />
              ))}

              <div className='flex justify-end gap-3'>
                <button
                  onClick={handleSocialSave}
                  className='bg-[#01497C] text-white px-4 py-2 rounded-lg hover:bg-[#014F86]'>
                  Save
                </button>
                <button
                  onClick={() => setShowSocialForm(false)}
                  className='border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100'>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Profile;
