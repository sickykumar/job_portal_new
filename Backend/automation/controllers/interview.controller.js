import { Interview } from "../models/interview.model.js";
import { Application } from "../../models/application.model.js";
import { Job } from "../../models/job.model.js";
import { User } from "../../models/user.model.js";
import { Notification } from "../../models/notification.model.js";
import { createCalendarInterview, cancelCalendarInterview } from "../services/googleCalendar.service.js";
import { emitEvent } from "../events/automationBus.js";
import { EVENT_TYPES } from "../events/eventTypes.js";
import { sendEmail } from "../../utils/emailService.js";

/**
 * 1. Schedule Interview (Google Calendar + Nodemailer + .ics)
 * POST /api/interview/schedule
 */
export const scheduleInterview = async (req, res, next) => {
  try {
    const recruiterId = req.id;
    const {
      applicationId,
      date,
      time,
      notes = "",
      durationMinutes = 45,
      timezone = "Asia/Kolkata",
      customMeetingLink = null,
    } = req.body;

    if (!applicationId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "applicationId, date, and time are required to schedule an interview.",
      });
    }

    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("applicant", "fullname email");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Ownership check
    if (application.job?.created_by?.toString() !== recruiterId) {
      return res.status(403).json({
        success: false,
        message: "You can only schedule interviews for jobs you created.",
      });
    }

    const recruiter = await User.findById(recruiterId).select("fullname email");

    // Construct full start date
    // Handles date: "2026-09-10", time: "15:00" or "03:00 PM"
    let startDateTime = new Date(`${date} ${time}`);
    if (isNaN(startDateTime.getTime())) {
      startDateTime = new Date(date);
    }

    const eventTitle = `Technical Interview: ${application.applicant.fullname} | ${application.job.title}`;
    const description = `PathKhojo Technical Interview for ${application.job.title}.\nRecruiter Notes: ${notes || "None provided."}`;

    // Create Calendar Event & Meeting Link
    const calendarResult = await createCalendarInterview({
      title: eventTitle,
      description,
      startDateTime,
      durationMinutes: Number(durationMinutes) || 45,
      recruiterEmail: recruiter.email,
      recruiterName: recruiter.fullname,
      candidateEmail: application.applicant.email,
      candidateName: application.applicant.fullname,
      customMeetingLink,
    });

    // Create or update Interview record
    const interview = await Interview.create({
      applicationId,
      jobId: application.job._id,
      candidateId: application.applicant._id,
      recruiterId,
      calendarEventId: calendarResult.calendarEventId,
      calendarHtmlLink: calendarResult.calendarHtmlLink,
      meetingLink: calendarResult.meetingLink,
      date,
      time,
      scheduledAt: startDateTime,
      durationMinutes: Number(durationMinutes) || 45,
      timezone,
      notes,
      status: "scheduled",
    });

    // Update Application
    application.status = "interview";
    application.interviewRef = interview._id;
    application.interviewDetails = {
      date,
      time,
      meetingLink: calendarResult.meetingLink,
      notes,
    };
    application.reviewedAt = new Date();
    await application.save();

    // Emit Interview Scheduled Event
    emitEvent(EVENT_TYPES.INTERVIEW_SCHEDULED, {
      entityType: "interview",
      entityId: interview._id,
      actorId: recruiterId,
      metadata: {
        applicationId,
        candidateEmail: application.applicant.email,
        jobTitle: application.job.title,
        meetingLink: calendarResult.meetingLink,
      },
    });

    // 1. Create in-app notification for candidate
    // 1. Create in-app notification for candidate with congratulations
    await Notification.create({
      recipient: application.applicant._id,
      type: "interview_scheduled",
      title: `🎉 Congratulations! Interview Scheduled: ${application.job.title}`,
      message: `Congratulations! You have been selected for the technical interview on ${date} at ${time}. Google Meet: ${calendarResult.meetingLink}`,
      link: "applied",
    });

    // 2. Create in-app notification for recruiter
    await Notification.create({
      recipient: recruiterId,
      type: "interview_scheduled",
      title: `🗓️ Interview Confirmed: ${application.applicant.fullname}`,
      message: `Interview confirmed with ${application.applicant.fullname} for "${application.job.title}" on ${date} at ${time}. Google Meet: ${calendarResult.meetingLink}`,
      link: "recruiter-jobs",
    });

    // 3. Send confirmation email to candidate with Congratulations & Google Meet link
    sendEmail({
      to: application.applicant.email,
      subject: `🎉 Congratulations! Interview Invitation: ${application.job.title} at ${application.job.company?.companyName || "Employer"}`,
      html: `
        <div style="font-family: sans-serif; background: #080C14; color: #E2E8F0; padding: 24px; border-radius: 14px; max-width: 560px;">
          <div style="background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(16,185,129,0.2)); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <h2 style="color: #10B981; margin: 0 0 6px 0; font-size: 20px;">🎉 Congratulations, ${application.applicant.fullname}!</h2>
            <p style="margin: 0; font-size: 14px; color: #E2E8F0; line-height: 1.5;">
              We are thrilled to let you know that your application for <strong>${application.job.title}</strong> at <strong>${application.job.company?.companyName || "Employer"}</strong> has been shortlisted. The engineering hiring team was impressed with your skillset and profile!
            </p>
          </div>

          <h3 style="color: #818CF8; margin: 0 0 12px 0;">Your Interview Details:</h3>
          <div style="background: #141C31; border: 1px solid #1E293B; border-radius: 10px; padding: 16px; margin: 0 0 20px 0;">
            <p style="margin: 0 0 6px 0;">📅 <strong>Date:</strong> ${date}</p>
            <p style="margin: 0 0 6px 0;">⏰ <strong>Time:</strong> ${time} (${timezone})</p>
            <p style="margin: 0 0 6px 0;">⏳ <strong>Duration:</strong> ${durationMinutes} minutes</p>
            <p style="margin: 0 0 10px 0;">🔗 <strong>Meeting Link:</strong> <a href="${calendarResult.meetingLink}" style="color: #818CF8;">${calendarResult.meetingLink}</a></p>
            ${notes ? `<p style="margin: 0; font-size: 13px; color: #94A3B8;"><em>Notes from Recruiter: ${notes}</em></p>` : ""}
          </div>

          <p style="text-align: center; margin: 24px 0;">
            <a href="${calendarResult.meetingLink}" style="display: inline-block; background: #6366F1; color: #FFFFFF; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 10px;">Join Google Meet</a>
          </p>
          <p style="font-size: 11px; color: #64748B;">A calendar invitation (.ics) is included with this meeting.</p>
        </div>
      `,
    }).catch((err) => console.warn("[InterviewController] Candidate email warning:", err.message));

    // 4. Send confirmation email to recruiter with Google Meet link
    if (recruiter?.email) {
      sendEmail({
        to: recruiter.email,
        subject: `🗓️ Interview Scheduled (Recruiter Copy): ${application.applicant.fullname} | ${application.job.title}`,
        html: `
          <div style="font-family: sans-serif; background: #080C14; color: #E2E8F0; padding: 24px; border-radius: 14px; max-width: 560px;">
            <h2 style="color: #6366F1; margin-top: 0;">Interview Scheduled (Recruiter Copy)</h2>
            <p>Hi <strong>${recruiter.fullname}</strong>,</p>
            <p>You have scheduled an interview with <strong>${application.applicant.fullname}</strong> for <strong>${application.job.title}</strong>.</p>
            <div style="background: #141C31; border: 1px solid #1E293B; border-radius: 10px; padding: 16px; margin: 16px 0;">
              <p style="margin: 0 0 6px 0;">👤 <strong>Candidate:</strong> ${application.applicant.fullname} (${application.applicant.email})</p>
              <p style="margin: 0 0 6px 0;">📅 <strong>Date:</strong> ${date}</p>
              <p style="margin: 0 0 6px 0;">⏰ <strong>Time:</strong> ${time} (${timezone})</p>
              <p style="margin: 0 0 6px 0;">⏳ <strong>Duration:</strong> ${durationMinutes} minutes</p>
              <p style="margin: 0 0 10px 0;">🔗 <strong>Meeting Link:</strong> <a href="${calendarResult.meetingLink}" style="color: #818CF8;">${calendarResult.meetingLink}</a></p>
              ${notes ? `<p style="margin: 0; font-size: 13px; color: #94A3B8;"><em>Your Notes: ${notes}</em></p>` : ""}
            </div>
            <p style="text-align: center; margin: 24px 0;">
              <a href="${calendarResult.meetingLink}" style="display: inline-block; background: #6366F1; color: #FFFFFF; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 10px;">Launch Google Meet</a>
            </p>
            <p style="font-size: 11px; color: #64748B;">This event is synchronized with your Google Calendar.</p>
          </div>
        `,
      }).catch((err) => console.warn("[InterviewController] Recruiter email warning:", err.message));
    }

    return res.status(201).json({
      success: true,
      message: "Interview scheduled successfully! Calendar invite and meeting details dispatched.",
      interview,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. Get My Scheduled Interviews
 * GET /api/interview/my-interviews
 */
export const getMyInterviews = async (req, res, next) => {
  try {
    const userId = req.id;
    const role = req.user?.role;

    const query = role === "recruiter" ? { recruiterId: userId } : { candidateId: userId };

    const interviews = await Interview.find(query)
      .populate({
        path: "jobId",
        select: "title location salary jobType company",
        populate: { path: "company", select: "companyName logo" },
      })
      .populate("candidateId", "fullname email phoneNumber profile.profilePhoto")
      .populate("recruiterId", "fullname email")
      .sort({ scheduledAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      interviews,
      total: interviews.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. Reschedule Interview
 * POST /api/interview/:id/reschedule
 */
export const rescheduleInterview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, time, notes = "" } = req.body;

    const interview = await Interview.findById(id)
      .populate("jobId")
      .populate("candidateId", "fullname email");

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    interview.date = date;
    interview.time = time;
    interview.scheduledAt = new Date(`${date} ${time}`);
    interview.status = "rescheduled";
    interview.reminder24hSent = false;
    interview.reminder1hSent = false;
    if (notes) interview.notes = notes;

    await interview.save();

    // Update application details
    await Application.findByIdAndUpdate(interview.applicationId, {
      "interviewDetails.date": date,
      "interviewDetails.time": time,
      "interviewDetails.notes": notes || interview.notes,
    });

    // Notify candidate
    await Notification.create({
      recipient: interview.candidateId._id,
      type: "interview_scheduled",
      title: `Interview Rescheduled: ${interview.jobId?.title}`,
      message: `Your interview has been rescheduled to ${date} at ${time}.`,
      link: "/applied",
    });

    return res.status(200).json({
      success: true,
      message: "Interview rescheduled successfully.",
      interview,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. Cancel Interview
 * POST /api/interview/:id/cancel
 */
export const cancelInterview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason = "Unforeseen schedule conflict" } = req.body;

    const interview = await Interview.findById(id)
      .populate("jobId")
      .populate("candidateId", "fullname email")
      .populate("recruiterId", "fullname email");

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    interview.status = "cancelled";
    interview.cancellationReason = reason;
    await interview.save();

    // Cancel on Google Calendar
    if (interview.calendarEventId) {
      cancelCalendarInterview({ calendarEventId: interview.calendarEventId }).catch(() => {});
    }

    // Notify candidate
    await Notification.create({
      recipient: interview.candidateId._id,
      type: "status_update",
      title: `Interview Cancelled: ${interview.jobId?.title}`,
      message: `The scheduled interview was cancelled: ${reason}.`,
      link: "/applied",
    });

    return res.status(200).json({
      success: true,
      message: "Interview cancelled successfully.",
      interview,
    });
  } catch (error) {
    next(error);
  }
};
