import type { Employee } from "./types";

export const me: Employee = {
  name: "Anna Berg",
  initials: "AB",
  role: "IT Operations",
  department: "NordTech AB",
};

// Starter prompts surfaced as chips in the rail. The model answers
// them live — there are no scripted steps anymore.
export interface StarterPrompt {
  id: string;
  shortLabel: string;
  prompt: string;
}

export const caseFlows: StarterPrompt[] = [
  {
    id: "password",
    shortLabel: "Reset my password",
    prompt: "Hi, I'm locked out. Need to reset my company password.",
  },
  {
    id: "onboarding",
    shortLabel: "Onboard a consultant",
    prompt:
      "A new consultant starts on Monday and needs a laptop and access to our systems.",
  },
  {
    id: "incident",
    shortLabel: "Several can't log in",
    prompt:
      "NordTrack won't let me in. Two of my colleagues say the same. Login spins forever.",
  },
  {
    id: "vpn",
    shortLabel: "VPN won't connect",
    prompt: "VPN won't connect on my Mac. Worked fine yesterday.",
  },
  {
    id: "phishing",
    shortLabel: "Got a phishing email",
    prompt:
      "Got an email asking me to verify my password — looks suspicious. Should I click the link to check?",
  },
  {
    id: "newhire",
    shortLabel: "Onboard a new hire",
    prompt:
      "I have a new hire starting next Monday — same role as Hassan who joined in March. Can you set them up?",
  },
];
