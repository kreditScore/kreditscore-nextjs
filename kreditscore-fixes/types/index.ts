import { LucideIcon } from 'lucide-react';

export interface LoanProduct {
  icon: LucideIcon;
  title: string;
  features: string[];
  color: string;
}

export interface Tool {
  icon: LucideIcon;
  title: string;
  color: string;
}

export interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export interface Reason {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

export interface LoanFormData {
  loanAmount: string;
  city: string;
  mobile: string;
  netSalary: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  panNumber: string;
  address: string;
  employmentType: string;
  companyName: string;
  designation: string;
  workExperience: string;
  officialEmail: string;
  officeAddress: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  author?: string;
}
