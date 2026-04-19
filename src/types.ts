import React from "react";

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Step {
  step: string;
  title: string;
  description: string;
}
