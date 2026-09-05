import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, X } from "lucide-react";

export const LEGAL_DOCS = {
  privacy: {
    title: "Privacy Policy & Data Protection (DPDP Act 2023 & GDPR)",
    updated: "September 2026",
    sections: [
      {
        heading: "1. Compliance with Digital Personal Data Protection Act 2023",
        content:
          "NexHire strictly complies with India's Digital Personal Data Protection (DPDP) Act, 2023 and global GDPR standards. Candidate contact information, resumes, and project portfolios are processed solely for facilitating verified recruitment opportunities with genuine hiring teams.",
      },
      {
        heading: "2. Masked Government Credentials & Encryption",
        content:
          "In alignment with UIDAI and Income Tax department protocols, Aadhaar numbers are never stored in raw readable text and remain permanently masked (e.g. XXXX XXXX 1234). All sensitive credentials are encrypted using TLS 1.3 in-transit and AES-256 GCM at-rest.",
      },
      {
        heading: "3. Transparent Data Access",
        content:
          "Your uploaded resume PDF and candidate profile are visible only to verified recruiters whose job postings you actively submit an application to, or whom you permit through privacy controls. NexHire never sells, rents, or monetizes personal data to third-party advertisers.",
      },
    ],
  },
  terms: {
    title: "Terms of Service & Platform Usage Agreement",
    updated: "September 2026",
    sections: [
      {
        heading: "1. Verified Job Postings & Fair Representation",
        content:
          "Recruiters warrant that every position published on NexHire represents an active, legitimate hiring requirement with authentic salary ranges and accurate role expectations. Deceptive, discriminatory, or commission-only MLM postings result in immediate account termination.",
      },
      {
        heading: "2. Merit-Based & Equal Opportunity Hiring",
        content:
          "NexHire mandates non-discriminatory hiring practices across gender, religion, caste, age, sexual orientation, or physical disability. All candidate decisions must be grounded strictly in technical competency and job qualifications.",
      },
      {
        heading: "3. Candidate Integrity & Portfolio Authenticity",
        content:
          "Candidates confirm that all academic records, work histories, uploaded resume PDFs, and project links submitted on the platform represent their own authentic achievements.",
      },
    ],
  },
  kyc: {
    title: "Candidate Verification & e-KYC Compliance Standard",
    updated: "September 2026",
    sections: [
      {
        heading: "1. Purpose of National Identity Registration",
        content:
          "Registering verified Aadhaar and PAN credentials establishes a trustworthy, high-integrity talent ecosystem, preventing automated bot spam, identity falsification, and fraudulent contractor representations.",
      },
      {
        heading: "2. Zero Biometric or Raw Credential Storage",
        content:
          "NexHire does not capture, process, or store biometric records. We only maintain cryptographic hashes and masked representations suitable for authorized HR background check audits.",
      },
    ],
  },
  security: {
    title: "Platform Security Architecture & Vulnerability SLA",
    updated: "September 2026",
    sections: [
      {
        heading: "1. Security Infrastructure",
        content:
          "Our full-stack environment is hardened with Helmet HTTP response headers, express rate limiters, strict Zod payload validation, and authenticated proxy streaming for all resume file downloads.",
      },
      {
        heading: "2. Vulnerability Disclosure SLA",
        content:
          "Security researchers can report findings responsibly to security@nexhire.com. We acknowledge verified reports within 24 hours and commit to a 48-hour resolution SLA.",
      },
    ],
  },
};

/**
 * LegalModal Component
 * Interactive modal for reviewing official legal, privacy, and compliance documents.
 */
const LegalModal = ({ activeDoc, onClose }) => {
  if (!activeDoc || !LEGAL_DOCS[activeDoc]) return null;

  const doc = LEGAL_DOCS[activeDoc];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-white"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-500/15 dark:text-cyan-400 mb-1.5">
                <Scale size={13} />
                <span>Official Compliance Record</span>
              </div>
              <h3 className="text-xl font-black">{doc.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Last Revised: {doc.updated}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sections */}
          <div className="mt-6 space-y-6">
            {doc.sections.map((sec, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <h4 className="text-sm font-bold text-indigo-600 dark:text-cyan-400">
                  {sec.heading}
                </h4>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn-primary text-xs py-2.5 px-5"
            >
              I Understand & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LegalModal;
