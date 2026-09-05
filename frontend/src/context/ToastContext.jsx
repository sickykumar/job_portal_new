import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  LogIn,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ message, type = "info", title, action, duration = 4500 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 7);
      const newToast = { id, message, type, title, action, duration };

      setToasts((prev) => [...prev.slice(-4), newToast]); // keep max 5 active toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  // Convenient helper functions
  const success = useCallback(
    (message, options = {}) => addToast({ message, type: "success", ...options }),
    [addToast]
  );

  const error = useCallback(
    (message, options = {}) => addToast({ message, type: "error", ...options }),
    [addToast]
  );

  const warning = useCallback(
    (message, options = {}) => addToast({ message, type: "warning", ...options }),
    [addToast]
  );

  const info = useCallback(
    (message, options = {}) => addToast({ message, type: "info", ...options }),
    [addToast]
  );

  // Specialized Auth Toast (Professional prompt to sign in with 1-click CTA)
  const requireAuth = useCallback(
    (message = "Please sign in to continue.", customActionText = "Sign In") => {
      return addToast({
        title: "Sign In Required",
        message,
        type: "auth",
        duration: 6000,
        action: {
          label: customActionText,
          onClick: () => {
            navigate("/login");
          },
        },
      });
    },
    [addToast, navigate]
  );

  return (
    <ToastContext.Provider
      value={{
        show: addToast,
        success,
        error,
        warning,
        info,
        requireAuth,
        remove: removeToast,
      }}
    >
      {children}

      {/* Floating Toast Notification Center */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-x-0 top-4 z-[9999] flex flex-col items-center gap-2 px-4 sm:top-5 sm:right-5 sm:left-auto sm:items-end max-w-sm sm:max-w-md w-full"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            let config = {
              border: "border-indigo-500/30",
              bg: "bg-white/95 dark:bg-slate-900/95",
              icon: Info,
              iconColor: "text-indigo-500 dark:text-cyan-400",
              iconBg: "bg-indigo-500/10",
              titleColor: "text-indigo-900 dark:text-cyan-300",
            };

            if (toast.type === "success") {
              config = {
                border: "border-emerald-500/30",
                bg: "bg-white/95 dark:bg-slate-900/95",
                icon: CheckCircle2,
                iconColor: "text-emerald-500",
                iconBg: "bg-emerald-500/10",
                titleColor: "text-emerald-800 dark:text-emerald-300",
              };
            } else if (toast.type === "error") {
              config = {
                border: "border-rose-500/30",
                bg: "bg-white/95 dark:bg-slate-900/95",
                icon: AlertCircle,
                iconColor: "text-rose-500",
                iconBg: "bg-rose-500/10",
                titleColor: "text-rose-800 dark:text-rose-300",
              };
            } else if (toast.type === "warning") {
              config = {
                border: "border-amber-500/30",
                bg: "bg-white/95 dark:bg-slate-900/95",
                icon: AlertTriangle,
                iconColor: "text-amber-500",
                iconBg: "bg-amber-500/10",
                titleColor: "text-amber-800 dark:text-amber-300",
              };
            } else if (toast.type === "auth") {
              config = {
                border: "border-blue-500/40 dark:border-cyan-500/40",
                bg: "bg-white/98 dark:bg-slate-950/98",
                icon: LogIn,
                iconColor: "text-blue-600 dark:text-cyan-400",
                iconBg: "bg-blue-500/15 dark:bg-cyan-500/15",
                titleColor: "text-blue-700 dark:text-cyan-300",
              };
            }

            const IconComponent = config.icon;

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`pointer-events-auto relative w-full overflow-hidden rounded-2xl border ${config.border} ${config.bg} p-3.5 shadow-xl backdrop-blur-xl transition`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${config.iconBg} ${config.iconColor}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    {toast.title && (
                      <h4 className={`text-xs font-black tracking-wide ${config.titleColor}`}>
                        {toast.title}
                      </h4>
                    )}
                    <p className="mt-0.5 text-xs font-medium text-slate-700 dark:text-slate-200 leading-snug">
                      {toast.message}
                    </p>

                    {toast.action && (
                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            toast.action.onClick?.();
                            removeToast(toast.id);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-md hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition"
                        >
                          <span>{toast.action.label}</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeToast(toast.id)}
                    className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContext;
