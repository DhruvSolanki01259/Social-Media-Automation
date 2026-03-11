import React from "react";
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";
import PostPreview from "../components/PostPreview.jsx";

const socialOptions = [
  {
    name: "instagram",
    label: "Instagram",
    color: "#E1306C",
    icon: <FaInstagram />,
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    color: "#0A66C2",
    icon: <FaLinkedin />,
  },
  {
    name: "facebook",
    label: "Facebook",
    color: "#1877F2",
    icon: <FaFacebook />,
  },
  {
    name: "twitter",
    label: "Twitter",
    color: "#1DA1F2",
    icon: <FaTwitter />,
  },
];

const SocialPostStep = ({ postData, setPostData }) => {
  const togglePlatform = (platform) => {
    const exists = postData.socialMedia.includes(platform);

    const updated = exists
      ? postData.socialMedia.filter((p) => p !== platform)
      : [...postData.socialMedia, platform];

    setPostData((prev) => ({
      ...prev,
      socialMedia: updated,
    }));
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Platform Selection */}
      <div className="flex flex-wrap justify-center gap-4">
        {socialOptions.map((social) => {
          const active = postData.socialMedia.includes(social.name);

          return (
            <button
              key={social.name}
              onClick={() => togglePlatform(social.name)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg border transition-all
                ${
                  active
                    ? "text-white shadow-md"
                    : "bg-white dark:bg-[#1F2937] text-gray-700 dark:text-gray-300"
                }
              `}
              style={{
                backgroundColor: active ? social.color : "",
                borderColor: active ? social.color : "",
              }}
            >
              {social.icon}
              {social.label}
            </button>
          );
        })}
      </div>

      {/* Preview */}
      <PostPreview
        postData={postData}
        selectedPlatforms={postData.socialMedia}
      />
    </div>
  );
};

export default SocialPostStep;
