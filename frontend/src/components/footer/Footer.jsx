import React, { useState } from "react";
import NewsletterStrip from "./NewsletterStrip";
import FooterNavLinks from "./FooterNavLinks";
import FooterBottomBar from "./FooterBottomBar";
import LegalModal from "./LegalModal";

/**
 * Footer Component
 * Master footer layout matching Navbar container (max-w-7xl px-3 sm:px-5 lg:px-7).
 * Encapsulates the newsletter callout, 5-column navigation, legal modal, and bottom bar.
 */
const Footer = () => {
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | 'kyc' | 'security' | null

  return (
    <>
      <footer className="w-full border-t border-slate-200/80 bg-slate-50/70 dark:border-white/5 dark:bg-slate-950/80 backdrop-blur-xl mt-20 transition-colors">
        <div className="w-full px-3 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* 1. Tech Alert & Newsletter Subscription Strip */}
          <NewsletterStrip />

          {/* 2. 5-Column Navigation Grid with Tech Domains & Legal Links */}
          <FooterNavLinks onOpenLegal={(docId) => setActiveModal(docId)} />

          {/* 3. Bottom Legal & Corporate Copyright Bar */}
          <FooterBottomBar onOpenLegal={(docId) => setActiveModal(docId)} />
        </div>
      </footer>

      {/* 4. Interactive Legal Documents Modal (Privacy, Terms, KYC, Security) */}
      <LegalModal activeDoc={activeModal} onClose={() => setActiveModal(null)} />
    </>
  );
};

export default Footer;
