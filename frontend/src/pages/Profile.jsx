import { MapPin, UserPen, Settings2, Link2, LogOut } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { generateUserFromEmail } from "../utils/username";
import { useUser, useClerk } from "@clerk/clerk-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ---------------- Animations ---------------- */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  /* ---------------- Readiness Gate ---------------- */
  const [profileReady, setProfileReady] = useState(false);

  /* ---------------- Local UI State ---------------- */
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

  /* ---------------- Username Setup ---------------- */
  useEffect(() => {
    if (!user) return;

    const { fullName } = generateUserFromEmail(
      user.primaryEmailAddress?.emailAddress,
    );

    user.username = fullName;
  }, [user]);

  /* ---------------- Load Metadata ---------------- */
  useEffect(() => {
    if (!isLoaded || !user) return;

    const { profile = {}, socials = {} } = user.unsafeMetadata || {};

    setLocalProfile({
      bio: profile.bio || "",
      location: profile.location || "",
      website: profile.website || "",
    });

    setLocalSocials({
      linkedin: socials.linkedin || "",
      instagram: socials.instagram || "",
      facebook: socials.facebook || "",
      twitter: socials.twitter || "",
    });

    // ✅ Mark page ready ONLY after state is hydrated
    setProfileReady(true);
  }, [isLoaded, user]);

  /* ---------------- Save Profile ---------------- */
  const handleProfileSave = async () => {
    await user.update({
      unsafeMetadata: {
        ...user.unsafeMetadata,
        profile: localProfile,
      },
    });
    setEditMode(false);
  };

  /* ---------------- Save Socials ---------------- */
  const handleSocialSave = async () => {
    for (const [key, url] of Object.entries(localSocials)) {
      if (url && !/^https?:\/\//i.test(url)) {
        alert(
          `${key.charAt(0).toUpperCase() + key.slice(1)} URL must start with http:// or https://`,
        );
        return;
      }
    }

    await user.update({
      unsafeMetadata: {
        ...user.unsafeMetadata,
        socials: localSocials,
      },
    });

    setShowSocialForm(false);
  };

  /* ---------------- Logout ---------------- */
  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  /* ---------------- PAGE LOADER ---------------- */
  if (!isLoaded || !profileReady) {
    return <LoadingSpinner label="Loading profile…" />;
  }

  /* ================= UI ================= */
  return (
    <section className="min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* HEADER */}
        <motion.div {...fadeUp(0)}>
          <h1 className="text-4xl font-bold">
            Welcome, {user.username || user.firstName || "User"}
          </h1>
          <p className="opacity-80 mt-2">
            Manage your profile and connected social accounts.
          </p>
        </motion.div>

        {/* PROFILE CARD */}
        <motion.div
          {...fadeUp(0.2)}
          className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 flex flex-col md:flex-row gap-8"
        >
          {!editMode && (
            <button
              onClick={handleLogout}
              className="absolute top-4 right-4 p-2 border rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <LogOut className="w-5 h-5 text-red-500" />
            </button>
          )}

          <img
            src={user.imageUrl || "/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-400"
          />

          <div className="flex-1">
            {!editMode ? (
              <>
                <h2 className="text-2xl font-semibold">{user.username}</h2>

                <p className="opacity-80">
                  {user.primaryEmailAddress?.emailAddress}
                </p>

                <p className="mt-4 opacity-80">
                  {localProfile.bio || "No bio added yet."}
                </p>

                <p className="mt-2 flex items-center gap-1 text-blue-500">
                  <MapPin className="w-4 h-4" />
                  {localProfile.location || "Location not set"}
                </p>

                {localProfile.website && (
                  <a
                    href={localProfile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="block mt-1 text-blue-500 hover:underline"
                  >
                    🌐 {localProfile.website}
                  </a>
                )}

                <button
                  onClick={() => setEditMode(true)}
                  className="mt-6 flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <UserPen className="w-4 h-4" />
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <input
                  value={localProfile.bio}
                  onChange={(e) =>
                    setLocalProfile({
                      ...localProfile,
                      bio: e.target.value,
                    })
                  }
                  placeholder="Bio"
                  className="w-full border dark:border-gray-600 dark:bg-gray-700 rounded px-4 py-2 mb-2"
                />

                <input
                  value={localProfile.location}
                  onChange={(e) =>
                    setLocalProfile({
                      ...localProfile,
                      location: e.target.value,
                    })
                  }
                  placeholder="Location"
                  className="w-full border dark:border-gray-600 dark:bg-gray-700 rounded px-4 py-2 mb-2"
                />

                <input
                  value={localProfile.website}
                  onChange={(e) =>
                    setLocalProfile({
                      ...localProfile,
                      website: e.target.value,
                    })
                  }
                  placeholder="Website"
                  className="w-full border dark:border-gray-600 dark:bg-gray-700 rounded px-4 py-2"
                />

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleProfileSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditMode(false)}
                    className="border px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* SOCIALS */}
        <motion.div
          {...fadeUp(0.3)}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8"
        >
          <div className="flex justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Connected Social Accounts
            </h3>

            <button
              onClick={() => setShowSocialForm(!showSocialForm)}
              className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <Settings2 className="w-4 h-4" />
              Manage
            </button>
          </div>

          {showSocialForm ? (
            <>
              {Object.keys(localSocials).map((platform) => (
                <input
                  key={platform}
                  value={localSocials[platform]}
                  onChange={(e) =>
                    setLocalSocials({
                      ...localSocials,
                      [platform]: e.target.value,
                    })
                  }
                  placeholder={`${platform[0].toUpperCase()}${platform.slice(
                    1,
                  )} URL`}
                  className="w-full border dark:border-gray-600 dark:bg-gray-700 rounded px-4 py-2 mb-2"
                />
              ))}

              <button
                onClick={handleSocialSave}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
              >
                Save Socials
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              {Object.entries(localSocials).map(
                ([platform, url]) =>
                  url && (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {platform[0].toUpperCase() + platform.slice(1)}
                    </a>
                  ),
              )}

              {!Object.values(localSocials).some(Boolean) && (
                <p className="opacity-60">No socials connected.</p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Profile;
