import type { CaseFlow, Employee } from "./types";

export const me: Employee = {
  name: "Anna Berg",
  initials: "AB",
  role: "IT Operations",
  department: "NordTech AB",
};

const t = (h: number, m: number) =>
  new Date(2026, 4, 5, h, m).toISOString();

export const caseFlows: CaseFlow[] = [
  {
    id: "password",
    shortLabel: "Reset my password",
    prompt: "Hi, I'm locked out. Need to reset my company password.",
    steps: [
      {
        id: "u1",
        author: "user",
        timestamp: t(10, 14),
        content: "Hi, I'm locked out. Need to reset my company password.",
      },
      {
        id: "a1",
        author: "agent",
        timestamp: t(10, 14),
        classification: "direct-answer",
        content:
          "I can help. Reset it via the NordID self-service portal — no ticket needed. The change propagates across SSO services in about 30 seconds.",
        attachments: [
          {
            kind: "kb",
            sources: [
              { title: "Reset your NordID password", reviewedAt: "2026-04-12" },
            ],
          },
        ],
      },
      {
        id: "a2",
        author: "agent",
        timestamp: t(10, 14),
        classification: "direct-answer",
        content:
          "If MFA also fails after the reset, just say so and I'll open a ticket with the Identity team.",
      },
    ],
  },
  {
    id: "onboarding",
    shortLabel: "Onboard a consultant",
    prompt:
      "A new consultant starts on Monday and needs a laptop and access to our systems.",
    steps: [
      {
        id: "u1",
        author: "user",
        timestamp: t(9, 48),
        content:
          "A new consultant starts on Monday and needs a laptop and access to our systems.",
      },
      {
        id: "a1",
        author: "agent",
        timestamp: t(9, 48),
        classification: "follow-up",
        content: "Got it. Quick details and I'll set it up:",
        attachments: [
          {
            kind: "follow-up",
            questions: [
              "Full name",
              "Start date",
              "Contract length",
              "Sponsor at NordTech",
              "Systems they need (e.g. Slack, NordTrack)",
            ],
          },
        ],
      },
      {
        id: "u2",
        author: "user",
        timestamp: t(9, 50),
        content:
          "Henrik Roos, starts 11 May, 6 months, sponsor Lina Nordin, needs Slack + NordTrack L1. MacBook Pro.",
      },
      {
        id: "a2",
        author: "agent",
        timestamp: t(9, 51),
        classification: "ticket-created",
        content:
          "Done. I've created the ticket and routed it to the Endpoint team. You'll get a confirmation when the laptop is staged.",
        attachments: [
          {
            kind: "ticket",
            ticket: {
              id: "REQ-204791",
              summary: "Onboarding — Henrik Roos (consultant, 6 mo)",
              routedTo: "Endpoint team",
              priority: "P3",
            },
          },
        ],
      },
    ],
  },
  {
    id: "incident",
    shortLabel: "Several can't log in",
    prompt:
      "NordTrack won't let me in. Two of my colleagues say the same. Login spins forever.",
    steps: [
      {
        id: "u1",
        author: "user",
        timestamp: t(10, 2),
        content:
          "NordTrack won't let me in. Two of my colleagues say the same. Login spins forever.",
      },
      {
        id: "a1",
        author: "agent",
        timestamp: t(10, 2),
        classification: "incident-flagged",
        content:
          "I'm not going to try to fix this from chat. Multiple reports for NordTrack login in the last 10 minutes — I'm flagging this and getting a person on it.",
        attachments: [
          {
            kind: "escalation",
            routedTo: "On-call engineer",
            reason: "Multi-user pattern · NordTrack auth",
          },
        ],
      },
      {
        id: "a2",
        author: "agent",
        timestamp: t(10, 2),
        classification: "incident-flagged",
        content:
          "Please don't keep retrying — it adds load. I'll update you here as soon as someone is on the bridge.",
      },
    ],
  },
  {
    id: "vpn",
    shortLabel: "VPN won't connect",
    prompt: "VPN won't connect on my Mac. Worked fine yesterday.",
    steps: [
      {
        id: "u1",
        author: "user",
        timestamp: t(9, 30),
        content: "VPN won't connect on my Mac. Worked fine yesterday.",
      },
      {
        id: "a1",
        author: "agent",
        timestamp: t(9, 30),
        classification: "direct-answer",
        content:
          "Most Mac VPN drops after a working day are a stale session cert. Quit the NordVPN client fully (⌘Q), reopen it, then sign in again — the cert refreshes on launch. Takes about 20 seconds.",
        attachments: [
          {
            kind: "kb",
            sources: [
              { title: "VPN setup for Mac/Windows", reviewedAt: "2026-04-21" },
            ],
          },
        ],
      },
      {
        id: "a2",
        author: "agent",
        timestamp: t(9, 30),
        classification: "direct-answer",
        content:
          "If it still hangs after the restart, reply here and I'll open a ticket for the network team with your client logs.",
      },
    ],
  },
  {
    id: "phishing",
    shortLabel: "Got a phishing email",
    prompt:
      "Got an email asking me to verify my password — looks suspicious. Should I click the link to check?",
    steps: [
      {
        id: "u1",
        author: "user",
        timestamp: t(14, 12),
        content:
          "Got an email asking me to verify my password — looks suspicious. Should I click the link to check?",
      },
      {
        id: "a1",
        author: "agent",
        timestamp: t(14, 12),
        classification: "incident-flagged",
        content:
          "Don't click it. I'm not going to evaluate the link myself — credential-prompt mails need a human to look at the headers. Handing this to security on-call now.",
        attachments: [
          {
            kind: "escalation",
            routedTo: "Karl Eek · Security on-call",
            reason: "Suspected phishing · credential prompt",
          },
        ],
      },
      {
        id: "a2",
        author: "agent",
        timestamp: t(14, 12),
        classification: "incident-flagged",
        content:
          "While they look: keep the email, don't reply, don't forward outside this chat. They'll DM you within 30 minutes — and if anyone else in your team got the same one, ask them to leave it alone too.",
      },
    ],
  },
  {
    id: "newhire",
    shortLabel: "Onboard a new hire",
    prompt:
      "I have a new hire starting next Monday — same role as Hassan who joined in March. Can you set them up?",
    steps: [
      {
        id: "u1",
        author: "user",
        timestamp: t(11, 20),
        content:
          "I have a new hire starting next Monday — same role as Hassan who joined in March. Can you set them up?",
      },
      {
        id: "a1",
        author: "agent",
        timestamp: t(11, 20),
        classification: "follow-up",
        content:
          "Yes — Hassan's setup is on file (Sales · NordTrack full · Slack · Outlook · MacBook Pro). I'll reuse it unless you say otherwise. Three quick confirmations:",
        attachments: [
          {
            kind: "follow-up",
            questions: [
              "Full name",
              "Start date",
              "Office (Göteborg / Stockholm / Malmö)",
            ],
          },
        ],
      },
      {
        id: "u2",
        author: "user",
        timestamp: t(11, 22),
        content: "Maja Lindberg, starts 12 May, Göteborg HQ.",
      },
      {
        id: "a2",
        author: "agent",
        timestamp: t(11, 23),
        classification: "ticket-created",
        content:
          "Done. Reusing Hassan's template so the Endpoint team can stage the laptop today, and I've flagged HR to confirm address details for the welcome kit.",
        attachments: [
          {
            kind: "ticket",
            ticket: {
              id: "REQ-204815",
              summary: "Onboarding — Maja Lindberg (new hire · Sales · GBG)",
              routedTo: "Endpoint team",
              priority: "P3",
            },
          },
        ],
      },
    ],
  },
];
