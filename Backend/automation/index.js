import { initializeAutomationListeners } from "./events/automationBus.js";
import { startJobQueueWorker, stopJobQueueWorker } from "./workers/jobQueueWorker.js";
import { startScheduler, stopScheduler } from "./workers/scheduler.js";
import automationRoute from "./routes/automation.route.js";
import interviewRoute from "./routes/interview.route.js";

/**
 * Initialize the complete Automation Subsystem
 */
export const initAutomationEngine = () => {
  // 1. Register event listeners
  initializeAutomationListeners();

  // 2. Start background queue workers & cron schedules
  startJobQueueWorker();
  startScheduler();

  console.log("⚡ [Automation Engine] Initialized and running in background.");
};

export const shutdownAutomationEngine = () => {
  stopJobQueueWorker();
  stopScheduler();
  console.log("⚡ [Automation Engine] Gracefully shut down.");
};

export { automationRoute, interviewRoute };
