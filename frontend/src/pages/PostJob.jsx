import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import { CheckCircle, AlertCircle, Send, Plus } from "lucide-react";
import PostJobHeader from "../components/post-job/PostJobHeader";
import JobFormFields from "../components/post-job/JobFormFields";
import JobAiDescriptionField from "../components/post-job/JobAiDescriptionField";

/**
 * PostJob Page
 * Modular job creation page for employers & recruiters with Gemini AI description generator.
 */
const PostJob = ({ onJobCreated }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatingJd, setGeneratingJd] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full-Time");
  const [experience, setExperience] = useState(1);
  const [position, setPosition] = useState(1);
  const [activeDays, setActiveDays] = useState(30);
  const [companyId, setCompanyId] = useState("");

  // Fetch registered companies on mount
  useEffect(() => {
    api
      .get("/company/get")
      .then(({ data }) => {
        if (data?.success) {
          setCompanies(data.companies || []);
          if (data.companies?.length) setCompanyId(data.companies[0]._id);
        }
      })
      .catch(() => setErrorMsg("Unable to load your companies."));
  }, []);

  // Generate plain-text job description via Gemini AI
  const handleAiGenerate = async () => {
    if (!title.trim()) {
      return setErrorMsg("Please enter a Job Title first so AI can generate the description.");
    }
    setGeneratingJd(true);
    setErrorMsg("");
    try {
      const { data } = await api.post("/ai/generate-jd", {
        title,
        keySkills: requirements,
        experienceLevel: experience,
      });
      if (data?.success) {
        setDescription(data.description);
      }
    } catch {
      setErrorMsg("AI generation failed. You can write the description manually.");
    } finally {
      setGeneratingJd(false);
    }
  };

  // Submit job opportunity
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyId) {
      return setErrorMsg("Please select a registered company or register one first.");
    }
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const { data } = await api.post("/job/post", {
        title,
        description,
        requirements,
        salary,
        location,
        jobType,
        experience,
        position,
        companyId,
        activeDays: parseInt(activeDays, 10) || 30,
      });
      if (data?.success) {
        setSuccessMsg("Job opportunity published successfully!");
        onJobCreated?.();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to publish job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-auto w-full px-3 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full space-y-6"
      >
        <PostJobHeader />

        {/* Feedback Notifications */}
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            <CheckCircle size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Job Creation Form Card */}
        <form
          onSubmit={handleSubmit}
          className="glass-panel w-full space-y-6 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm"
        >
          {/* Basic Parameters */}
          <JobFormFields
            title={title} setTitle={setTitle}
            companies={companies} companyId={companyId} setCompanyId={setCompanyId}
            location={location} setLocation={setLocation}
            jobType={jobType} setJobType={setJobType}
            experience={experience} setExperience={setExperience}
            position={position} setPosition={setPosition}
            salary={salary} setSalary={setSalary}
            activeDays={activeDays} setActiveDays={setActiveDays}
          />

          {/* AI Description & Skills */}
          <JobAiDescriptionField
            requirements={requirements} setRequirements={setRequirements}
            description={description} setDescription={setDescription}
            generatingJd={generatingJd} handleAiGenerate={handleAiGenerate}
          />

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 text-sm px-6 py-3"
            >
              <Send size={16} />
              <span>{loading ? "Publishing Role..." : "Publish Job Opportunity"}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PostJob;
