import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, Calendar, UserCheck, Briefcase, Sparkles, Video, ExternalLink } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const NotificationBell = ({ onNavigate }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const qc = useQueryClient();
  const queryKey = ["notifications"];
  const { user } = useAuth();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch notifications with background polling
  const { data } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const res = await api.get("/notification/get");
        if (res.data?.success) {
          return {
            notifications: res.data.notifications || [],
            unreadCount: res.data.unreadCount || 0,
          };
        }
      } catch (err) {
        // Silently handle if unauthenticated or session expired
      }
      return { notifications: [], unreadCount: 0 };
    },
    staleTime: 5 * 1000,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    retry: false,
    enabled: !!user || !!token,
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  // Mark all notifications as read
  const readAllMutation = useMutation({
    mutationFn: () => api.put("/notification/read-all"),
    onSuccess: () => {
      qc.setQueryData(queryKey, (old) => ({
        ...old,
        unreadCount: 0,
        notifications: (old?.notifications || []).map((n) => ({ ...n, read: true })),
      }));
    },
  });

  // Mark single notification as read
  const readOneMutation = useMutation({
    mutationFn: (id) => api.put(`/notification/read/${id}`),
    onSuccess: (_, id) => {
      qc.setQueryData(queryKey, (old) => ({
        ...old,
        unreadCount: Math.max(0, (old?.unreadCount || 0) - 1),
        notifications: (old?.notifications || []).map((n) =>
          n._id === id ? { ...n, read: true } : n
        ),
      }));
    },
  });

  // Handle outside click & escape key
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleNotificationClick = (n) => {
    if (!n.read) {
      readOneMutation.mutate(n._id);
    }
    setOpen(false);
    if (n.link && onNavigate) {
      let targetLink = n.link.trim();
      if (!targetLink.startsWith("/") && !targetLink.startsWith("http")) {
        targetLink = `/${targetLink}`;
      }
      onNavigate(targetLink);
    }
  };

  const renderIcon = (type) => {
    switch (type) {
      case "interview_scheduled":
        return <Calendar className="h-4 w-4" />;
      case "hired":
        return <UserCheck className="h-4 w-4" />;
      case "application_received":
        return <Briefcase className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div ref={ref} className="relative z-50">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((v) => !v)}
        className={`relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border backdrop-blur-xl transition-all ${
          open
            ? "border-blue-400/40 bg-blue-500/10 text-blue-500"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        }`}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 px-1 text-[9px] font-black text-white shadow-[0_0_12px_rgba(244,63,94,.55)]"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-[calc(100%+10px)] z-[200] w-[calc(100vw-24px)] max-w-[370px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-black text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  disabled={readAllMutation.isPending}
                  onClick={() => readAllMutation.mutate()}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-violet-600 disabled:opacity-50 dark:text-blue-400"
                >
                  <Check className="h-3 w-3" />
                  <span>Read all</span>
                </button>
              )}
            </div>

            {/* Notification Items List */}
            <div className="max-h-[min(430px,65vh)] overflow-y-auto p-2">
              {notifications.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-900">
                    <Bell className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    You're all caught up!
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">No new notifications</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n._id}
                    type="button"
                    onClick={() => handleNotificationClick(n)}
                    className={`flex w-full gap-3 rounded-xl p-3 text-left transition-all ${
                      n.read
                        ? "hover:bg-slate-100 dark:hover:bg-slate-900"
                        : "bg-blue-50/80 hover:bg-blue-100/80 dark:bg-blue-500/10 dark:hover:bg-blue-500/15"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        n.read
                          ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          : "bg-gradient-to-br from-blue-500/15 to-violet-500/15 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {renderIcon(n.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <p
                          className={`flex-1 truncate text-xs text-slate-900 dark:text-white ${
                            n.read ? "font-semibold" : "font-bold"
                          }`}
                        >
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,.7)]" />
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-slate-600 dark:text-slate-400">
                        {n.message}
                      </p>
                      {n.message?.includes("https://meet.google.com") && (
                        <div className="mt-2">
                          <a
                            href={n.message.match(/https:\/\/meet\.google\.com\/[^\s]+/)?.[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold shadow-sm transition"
                          >
                            <Video className="h-3 w-3" />
                            <span>Join Google Meet</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </div>
                      )}
                      <p className="mt-1.5 text-[9px] font-medium text-slate-400">
                        {n.createdAt ? new Date(n.createdAt).toLocaleDateString("en-IN") : "Recent"}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
