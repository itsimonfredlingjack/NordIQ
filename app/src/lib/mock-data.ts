import type { Employee } from "./types";

export const me: Employee = {
  name: "Lina Nordin",
  initials: "LN",
  role: "Head of HR",
  department: "NordTech AB",
};

// Starter prompts surfaced as chips in the rail. Narrowed to onboarding
// scenarios — the focus of the demo. Other use-cases (VPN, password,
// phishing) still work via free-text input but aren't promoted.
export interface StarterPrompt {
  id: string;
  shortLabel: string;
  prompt: string;
}

export const caseFlows: StarterPrompt[] = [
  {
    id: "consultant",
    shortLabel: "Onboard a consultant",
    prompt:
      "Hassan Karim starts Monday as a junior consultant on a 6-month engagement. Sponsor is Erik Holm. Please set him up.",
  },
  {
    id: "samesetup",
    shortLabel: "Same setup as someone",
    prompt:
      "I have a new hire starting next Monday — same role and access as Hassan who joined in March.",
  },
  {
    id: "offboard",
    shortLabel: "Off-board someone",
    prompt:
      "Sara Olsson's last day is Friday. Please plan her off-boarding — accounts, devices, access.",
  },
];
