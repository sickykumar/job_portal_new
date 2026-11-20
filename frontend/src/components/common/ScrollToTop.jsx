import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 * Ensures every page navigation smoothly animates and scrolls the viewport to the top.
 * Prevents the issue where navigating from the bottom of a page (e.g. clicking footer links)
 * leaves the new page scrolled to the bottom.
 */
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If an anchor hash exists (e.g. #faq, #contact), smoothly scroll to that specific element
    if (hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    // Smooth scroll animation to the very top (0, 0)
    const performScroll = () => {
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
        if (document.documentElement) {
          document.documentElement.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
        if (document.body) {
          document.body.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
      } catch {
        // Fallback for older browsers
        window.scrollTo(0, 0);
      }
    };

    // Immediate smooth scroll on route change
    performScroll();

    // Secondary backup trigger after small delay to handle React.lazy / Suspense page renders
    const timer = setTimeout(performScroll, 60);

    return () => clearTimeout(timer);
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
