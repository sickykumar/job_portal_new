import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Sparkles, Building2, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import CompanyCard from "../components/company/CompanyCard";
import EmptyCompanies from "../components/company/EmptyCompanies";
import CompanyModal from "../components/company/CompanyModal";

/**
 * Companies Page
 * Employer brand and organization directory management page for recruiters.
 * Allows registering and updating company details (name, website, location, description, logo).
 */
const Companies = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  // Form state
  const [form, setForm] = useState({
    companyName: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  const [ui, setUi] = useState({ error: "", message: "", ai: false });

  // 1. Fetch authenticated recruiter's registered companies
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await api.get("/company/get");
      return res.data?.companies || [];
    },
  });

  // Open modal for new registration
  const handleOpenRegister = () => {
    setEditingCompany(null);
    setForm({
      companyName: "",
      description: "",
      website: "",
      location: "",
      file: null,
    });
    setUi({ error: "", message: "", ai: false });
    setShowModal(true);
  };

  // Open modal for editing existing company
  const handleEditCompany = (comp) => {
    setEditingCompany(comp);
    setForm({
      companyName: comp.companyName || "",
      description: comp.description || "",
      website: comp.website || "",
      location: comp.location || "",
      file: null,
    });
    setUi({ error: "", message: "", ai: false });
    setShowModal(true);
  };

  const handleUpdateField = (field, val) => {
    if (field === "logoFile") {
      setForm((prev) => ({ ...prev, file: val }));
    } else {
      setForm((prev) => ({ ...prev, [field]: val }));
    }
  };

  // 2. Register Company Mutation
  const registerCompany = useMutation({
    mutationFn: async () => {
      if (!form.companyName.trim()) {
        throw new Error("Company name is required.");
      }

      const data = new FormData();
      data.append("companyName", form.companyName.trim());
      data.append("description", form.description.trim());
      data.append("website", form.website.trim());
      data.append("location", form.location.trim());
      if (form.file) {
        data.append("file", form.file);
      }

      const res = await api.post("/company/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["companies"] });
        queryClient.invalidateQueries({ queryKey: ["admin-recruiters"] });
        queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
        setUi({
          error: "",
          message: "Company registered successfully!",
          ai: false,
        });
        setTimeout(() => {
          setShowModal(false);
          setUi({ error: "", message: "", ai: false });
        }, 1200);
      }
    },
    onError: (err) => {
      setUi({
        error: err.response?.data?.message || err.message || "Failed to register company.",
        message: "",
        ai: false,
      });
    },
  });

  // 3. Update Company Mutation
  const updateCompanyMutation = useMutation({
    mutationFn: async () => {
      if (!form.companyName.trim()) {
        throw new Error("Company name is required.");
      }

      const data = new FormData();
      data.append("companyName", form.companyName.trim());
      data.append("name", form.companyName.trim());
      data.append("description", form.description.trim());
      data.append("website", form.website.trim());
      data.append("location", form.location.trim());
      if (form.file) {
        data.append("file", form.file);
      }

      const res = await api.put(`/company/update/${editingCompany._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["companies"] });
        queryClient.invalidateQueries({ queryKey: ["admin-recruiters"] });
        queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
        queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
        setUi({
          error: "",
          message: "Company updated successfully!",
          ai: false,
        });
        setTimeout(() => {
          setShowModal(false);
          setEditingCompany(null);
          setUi({ error: "", message: "", ai: false });
        }, 1200);
      }
    },
    onError: (err) => {
      setUi({
        error: err.response?.data?.message || err.message || "Failed to update company.",
        message: "",
        ai: false,
      });
    },
  });

  // 4. AI Company Bio Description Generator
  const generateCompanyBio = async () => {
    if (!form.companyName.trim()) {
      return setUi((prev) => ({
        ...prev,
        error: "Enter Company Name first so AI can draft description.",
      }));
    }
    setUi((prev) => ({ ...prev, ai: true, error: "" }));
    try {
      const res = await api.post("/ai/generate-bio", {
        title: form.companyName,
        skills: form.location,
      });
      if (res.data?.success) {
        setForm((prev) => ({ ...prev, description: res.data.bio }));
      }
    } catch {
      setUi((prev) => ({
        ...prev,
        error: "AI Generation unavailable. Please write description manually.",
      }));
    } finally {
      setUi((prev) => ({ ...prev, ai: false }));
    }
  };

  const isPending = registerCompany.isPending || updateCompanyMutation.isPending;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCompany) {
      updateCompanyMutation.mutate();
    } else {
      registerCompany.mutate();
    }
  };

  return (
    <div className="w-full px-3 py-3 sm:px-6 lg:px-8 space-y-4 min-w-0">
      
      {/* Toast Notification */}
      {ui.message && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xl animate-bounce">
          <CheckCircle2 size={16} />
          <span>{ui.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Companies Directory
            </h1>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-cyan-300">
              {companies.length} Registered
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Register and manage brand profiles, websites, and logos across job postings
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenRegister}
          className="btn-primary flex items-center gap-1.5 self-start text-xs sm:self-auto"
        >
          <Plus size={14} />
          <span>Register Company</span>
        </button>
      </div>

      {/* Grid or Empty State */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5"
            />
          ))}
        </div>
      ) : !companies.length ? (
        <EmptyCompanies onRegister={handleOpenRegister} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((comp) => (
            <CompanyCard
              key={comp._id}
              company={comp}
              onEdit={handleEditCompany}
            />
          ))}
        </div>
      )}

      {/* Modal Dialog for Register & Update */}
      <CompanyModal
        show={showModal}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCompany(null);
        }}
        form={form}
        onUpdate={handleUpdateField}
        onSubmit={handleSubmit}
        onAiBio={generateCompanyBio}
        isPending={isPending}
        error={ui.error}
        isEditing={Boolean(editingCompany)}
        currentLogo={editingCompany?.logo}
      />
    </div>
  );
};

export default Companies;
