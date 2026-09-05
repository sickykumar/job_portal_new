/**
 * Automation Engine Configuration
 * Configurable parameters with environment variable overrides and sensible defaults.
 */
export const automationConfig = {
  // Worker loop toggle
  workerEnabled: process.env.AUTOMATION_WORKER_ENABLED !== "false",
  pollIntervalMs: parseInt(process.env.AUTOMATION_POLL_INTERVAL_MS || "5000", 10),
  batchSize: parseInt(process.env.AUTOMATION_BATCH_SIZE || "5", 10),

  // Job Retry settings
  defaultMaxAttempts: 3,
  initialBackoffMs: 2000,
  maxBackoffMs: 60000,

  // Scheduler intervals
  schedulerEnabled: process.env.AUTOMATION_SCHEDULER_ENABLED !== "false",
  expiredCheckIntervalMs: 60 * 60 * 1000, // Every 1 hour
  interviewReminderIntervalMs: 15 * 60 * 1000, // Every 15 minutes
  dailyDigestHourUtc: 3, // 8:30 AM IST (3:00 UTC)

  // Candidate Match & Recommendation thresholds
  minMatchScoreThreshold: 40,
  highMatchScoreThreshold: 75,
};
