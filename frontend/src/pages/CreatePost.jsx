import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { usePostStore } from "../stores/post.store.js";

import ScheduleStep from "../components/create-post/steps/ScheduleStep";
import SocialPostStep from "../components/create-post/steps/SocialPostStep";
import ContentStep from "../components/create-post/steps/ContentStep";
import GenAIImageStep from "../components/create-post/steps/GenAIImageStep";
import FinalizeStep from "../components/create-post/steps/FinalizeStep";

import Stepper from "../components/create-post/Stepper";

const steps = ["Image", "Content", "Social", "Schedule", "Finalize"];

const CreatePost = () => {
  const navigate = useNavigate();
  const { createPost, loading } = usePostStore();

  const [step, setStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);

  const [postData, setPostData] = useState({
    title: "",
    description: "",
    tags: [],
    category: "Other",
    socialMedia: [],
    isScheduled: false,
    scheduledAt: null,
    mediaUrls: [],
    prompt: "",
  });

  const canProceed = () => {
    if (step === 0) return postData.mediaUrls.length > 0 || postData.prompt;
    if (step === 1) return postData.title.trim() && postData.description.trim();
    if (step === 2) return postData.socialMedia.length > 0;

    return true;
  };

  const next = () => {
    if (canProceed()) setStep((prev) => prev + 1);
  };

  const back = () => {
    setStep((prev) => prev - 1);
  };

  const handleCreatePost = async () => {
    setErrorMsg(null);

    try {
      if (!postData.title.trim()) {
        setErrorMsg("Post title is required");
        return;
      }

      if (!postData.description.trim()) {
        setErrorMsg("Post description is required");
        return;
      }

      if (!postData.socialMedia.length) {
        setErrorMsg("Select at least one social media platform");
        return;
      }

      const payload = {
        ...postData,
        tags: postData.tags || [],
        mediaUrls: postData.mediaUrls || [],
      };

      const newPost = await createPost(payload);

      if (!newPost) {
        setErrorMsg("Failed to create post. Please try again.");
        return;
      }

      // Reset stepper (optional but good UX)
      setStep(0);

      // Navigate to Content Studio
      navigate("/content-studio");
    } catch (error) {
      console.error("Create Post Error:", error);
      setErrorMsg("Unexpected error occurred while creating post.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Stepper steps={steps} currentStep={step} />

      <div className="mt-10 relative min-h-[320px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <MotionWrapper key="image">
              <GenAIImageStep postData={postData} setPostData={setPostData} />
            </MotionWrapper>
          )}

          {step === 1 && (
            <MotionWrapper key="content">
              <ContentStep postData={postData} setPostData={setPostData} />
            </MotionWrapper>
          )}

          {step === 2 && (
            <MotionWrapper key="social">
              <SocialPostStep postData={postData} setPostData={setPostData} />
            </MotionWrapper>
          )}

          {step === 3 && (
            <MotionWrapper key="schedule">
              <ScheduleStep postData={postData} setPostData={setPostData} />
            </MotionWrapper>
          )}

          {step === 4 && (
            <MotionWrapper key="finalize">
              <FinalizeStep postData={postData} />
            </MotionWrapper>
          )}
        </AnimatePresence>
      </div>

      {errorMsg && (
        <div className="mt-6 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="flex justify-between mt-10">
        <button
          onClick={back}
          disabled={step === 0}
          className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-40"
        >
          Back
        </button>

        {step < steps.length - 1 && (
          <button
            onClick={next}
            disabled={!canProceed()}
            className="px-6 py-2 rounded-lg bg-[#2A6F97] text-white disabled:opacity-50"
          >
            Next
          </button>
        )}

        {step === steps.length - 1 && (
          <button
            onClick={handleCreatePost}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreatePost;

const MotionWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);
