import { Feature, Step } from "./types";
import { Compass, Brain, MessageSquare } from "lucide-react";

export const FEATURES: Feature[] = [
  {
    title: "Career Assessment Engine",
    description: "Our AI analyzes your skills, interests, and personality to suggest the most fulfilling career paths tailored for you.",
    icon: <Compass className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "University Entry Tests",
    description: "Smart preparation for NTS, ECAT, FAST, and COMSATS exams. The platform adjusts to your learning pace and focuses on your weak areas.",
    icon: <Brain className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "ISSB & HR Interviews",
    description: "Practice with our AI-powered interview coach. Get real-time feedback and official recommendations for Army and Corporate roles.",
    icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
  },
];

export const STEPS: Step[] = [
  {
    step: "01",
    title: "Sign up",
    description: "Create your profile and tell us about your educational background and goals."
  },
  {
    step: "02",
    title: "Take assessment",
    description: "Complete our comprehensive AI-driven assessment to map your potential."
  },
  {
    step: "03",
    title: "Get personalized guidance",
    description: "Receive a tailored roadmap for your careers and rigorous interview/exam simulations."
  }
];
