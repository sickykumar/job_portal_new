import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Server,
  Database,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Zap,
  HardDrive,
  Globe,
  Radio,
} from "lucide-react";
import api from "../../services/api";

const AdminHealthTab = () => {
  const {
    data: healthData,
    isLoading,
    isRefetching,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["admin-system-health"],
    queryFn: async () => {
      const res = await api.get("/admin/health");
      return res.data?.success ? res.data.data : null;
    },
    refetchInterval: 15000, // Auto-refresh every 15 seconds
  });

  const isHealthy = healthData?.status === "operational";
  const isDbHealthy = healthData?.database?.status === "healthy";

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              isHealthy
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
            }`}
          >
            <Activity className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Live System Health & Service Telemetry
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-black ${
                  isHealthy
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isHealthy ? "bg-emerald-500 animate-ping" : "bg-amber-500"}`} />
                {isHealthy ? "All Systems Operational" : "Service Performance Degraded"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live heartbeat telemetry polled automatically every 15 seconds from backend <code>/health</code> gateway
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Last Pinged</p>
            <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString("en-IN") : "Connecting..."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 transition shadow-xs disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefetching ? "animate-spin text-indigo-500" : ""} />
            <span>{isRefetching ? "Ping..." : "Ping Now"}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: API Gateway Status */}
        <div className="dashboard-card p-4.5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                API Gateway Uptime
              </p>
              <h3 className="mt-1 text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
                {isLoading ? "..." : healthData?.uptimeFormatted || "0h 0m 0s"}
              </h3>
              <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>Zero crash downtime</span>
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Clock size={20} />
            </div>
          </div>
        </div>

        {/* Card 2: MongoDB Latency */}
        <div className="dashboard-card p-4.5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                MongoDB Cluster Ping
              </p>
              <h3 className="mt-1 text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
                {isLoading ? "..." : `${healthData?.database?.latencyMs || 0} ms`}
              </h3>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Radio size={12} className={isDbHealthy ? "text-emerald-500" : "text-amber-500"} />
                <span>{healthData?.database?.provider || "MongoDB Atlas"}</span>
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Database size={20} />
            </div>
          </div>
        </div>

        {/* Card 3: Memory Heap */}
        <div className="dashboard-card p-4.5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Node.js Heap Memory
              </p>
              <h3 className="mt-1 text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
                {isLoading ? "..." : `${healthData?.memory?.heapUsedMb || 0} MB`}
              </h3>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Total Allocated: {healthData?.memory?.heapTotalMb || 0} MB
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <HardDrive size={20} />
            </div>
          </div>
        </div>

        {/* Card 4: Round-Trip API Latency */}
        <div className="dashboard-card p-4.5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Health Route Response
              </p>
              <h3 className="mt-1 text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
                {isLoading ? "..." : `${healthData?.totalResponseTimeMs || 0} ms`}
              </h3>
              <p className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                <Zap size={12} />
                <span>Express 5 Native Pipeline</span>
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Server size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Deep Telemetry Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Services Matrix */}
        <div className="dashboard-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Server size={18} className="text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Microservice & Driver Health</h3>
            </div>
            <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
              {healthData?.nodeVersion || "Node.js"}
            </span>
          </div>

          <div className="space-y-3">
            {/* Service Item 1 */}
            <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800/80 dark:bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                  <Database size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">MongoDB Atlas Driver</p>
                  <p className="text-[11px] text-slate-500">Mongoose 9 ODM Connection Pool</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {healthData?.database?.status === "healthy" ? "CONNECTED" : "DEGRADED"}
                </span>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">{healthData?.database?.latencyMs || 0}ms latency</p>
              </div>
            </div>

            {/* Service Item 2 */}
            <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800/80 dark:bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                  <Globe size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Express 5 REST Router</p>
                  <p className="text-[11px] text-slate-500">HTTP/1.1 API Gateway on Port 5000</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  RUNNING
                </span>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">{healthData?.environment || "development"}</p>
              </div>
            </div>

            {/* Service Item 3 */}
            <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800/80 dark:bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Security Intrusion Prevention</p>
                  <p className="text-[11px] text-slate-500">Breach Watchdog & Developer Mail Alert</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  ACTIVE
                </span>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">Automated Alerting</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Diagnostics & Metadata */}
        <div className="dashboard-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <HardDrive size={18} className="text-purple-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Host Process Diagnostics</h3>
            </div>
            <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
              Uptime: {healthData?.uptimeSeconds || 0}s
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-slate-500">Current Server Timestamp (IST)</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {healthData?.serverTimeIST || "..."}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-slate-500">Resident Set Size (RSS)</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {healthData?.memory?.rssMb || 0} MB
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-slate-500">Heap Used</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {healthData?.memory?.heapUsedMb || 0} MB
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-slate-500">Public Health Endpoint</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                GET /health (HTTP 200)
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-slate-500">Super Admin Health Telemetry</span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                GET /api/admin/health
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHealthTab;
