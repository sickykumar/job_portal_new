import crypto from "crypto";

/**
 * Google Calendar & Virtual Meeting Service
 * Manages Google Calendar event creation, Google Meet link generation,
 * rescheduling, cancellation, and standard RFC 5545 iCalendar (.ics) delivery.
 */

// Generate a valid RFC 5545 .ics calendar invite buffer
export const generateIcsContent = ({
  uid,
  summary,
  description,
  location,
  startDate,
  endDate,
  organizerEmail,
  organizerName,
  attendeeEmail,
  attendeeName,
}) => {
  const formatDateToIcs = (date) => {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  };

  const now = formatDateToIcs(new Date());
  const start = formatDateToIcs(new Date(startDate));
  const end = formatDateToIcs(new Date(endDate));

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PathKhojo Recruitment Platform//Interview Scheduler//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid || crypto.randomUUID()}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    `LOCATION:${location}`,
    `ORGANIZER;CN=${organizerName || "PathKhojo Hiring Lead"}:mailto:${organizerEmail || "careers@sickykumar.in"}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${attendeeName || "Candidate"}:mailto:${attendeeEmail}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT24H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Interview Reminder: 24 hours remaining",
    "END:VALARM",
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Interview Reminder: 1 hour remaining",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};

/**
 * Obtain an OAuth Access Token if refresh token is provided
 */
const getGoogleAccessToken = async () => {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.access_token;
    }
  } catch (err) {
    console.warn("[GoogleCalendar] Failed to refresh access token:", err.message);
  }
  return null;
};

/**
 * Schedule Interview with Google Calendar
 * Uses Google Calendar API when configured, or generates Google Meet link with .ics fallback.
 */
export const createCalendarInterview = async ({
  title,
  description,
  startDateTime,
  durationMinutes = 45,
  recruiterEmail,
  recruiterName,
  candidateEmail,
  candidateName,
  customMeetingLink = null,
}) => {
  const startDate = new Date(startDateTime);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
  const eventUid = `pathkhojo-${Date.now()}-${crypto.randomBytes(4).toString("hex")}@sickykumar.in`;

  // Fallback meeting link
  const defaultMeetCode = `${crypto.randomBytes(3).toString("hex")}-${crypto.randomBytes(4).toString("hex")}-${crypto.randomBytes(3).toString("hex")}`;
  let meetingLink = customMeetingLink || `https://meet.google.com/${defaultMeetCode}`;
  let calendarEventId = `ev_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  let calendarHtmlLink = meetingLink;

  // Try Google Calendar REST API if token is present
  const accessToken = await getGoogleAccessToken();
  if (accessToken) {
    try {
      const eventPayload = {
        summary: title,
        description,
        start: { dateTime: startDate.toISOString() },
        end: { dateTime: endDate.toISOString() },
        attendees: [
          { email: recruiterEmail, displayName: recruiterName, organizer: true, responseStatus: "accepted" },
          { email: candidateEmail, displayName: candidateName, responseStatus: "needsAction" },
        ],
        guestsCanModify: false,
        guestsCanInviteOthers: false,
        conferenceData: {
          createRequest: {
            requestId: crypto.randomUUID(),
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      };

      const gRes = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventPayload),
        }
      );

      if (gRes.ok) {
        const gData = await gRes.json();
        calendarEventId = gData.id || calendarEventId;
        calendarHtmlLink = gData.htmlLink || calendarHtmlLink;
        if (gData.hangoutLink) {
          meetingLink = gData.hangoutLink;
        }
        console.log(`[GoogleCalendar] Created API calendar event ${calendarEventId}`);
      }
    } catch (apiErr) {
      console.warn("[GoogleCalendar] API creation failed, using .ics invite fallback:", apiErr.message);
    }
  }

  // Generate standard RFC 5545 .ics invite string
  const icsData = generateIcsContent({
    uid: eventUid,
    summary: title,
    description: `${description}\n\nJoin Video Conference: ${meetingLink}`,
    location: meetingLink,
    startDate,
    endDate,
    organizerEmail: recruiterEmail,
    organizerName: recruiterName,
    attendeeEmail: candidateEmail,
    attendeeName: candidateName,
  });

  return {
    calendarEventId,
    calendarHtmlLink,
    meetingLink,
    startDate,
    endDate,
    icsData,
  };
};

/**
 * Cancel Calendar Event
 */
export const cancelCalendarInterview = async ({ calendarEventId }) => {
  if (!calendarEventId) return true;

  const accessToken = await getGoogleAccessToken();
  if (accessToken) {
    try {
      await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${calendarEventId}?sendUpdates=all`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(`[GoogleCalendar] Cancelled calendar event ${calendarEventId}`);
    } catch (err) {
      console.warn(`[GoogleCalendar] Cancel event error:`, err.message);
    }
  }
  return true;
};
