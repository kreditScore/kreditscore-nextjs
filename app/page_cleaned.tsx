'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import ComingSoonModal from '@/components/ComingSoonModal';
import LoanApplicationForm from '@/components/LoanApplicationFormImproved';
import CustomCursor from '@/components/CustomCursor';
import {
  ChevronRight,
  Shield,
  Zap,
  Clock,
  TrendingUp,
  Users,
  Award,
  Lock,
  Phone,
  CheckCircle2,
  ArrowRight,
  Building2,
  CreditCard,
  Wallet,
  BarChart3,
  FileText,
  Calculator,
  Star,
  Smartphone,
  Mail,
  MapPin,
  User
} from 'lucide-react';

// Types
interface LoanProduct {
  icon: any;
  title: string;
  features: string[];
  color: string;
}

interface Tool {
  icon: any;
  title: string;
  color: string;
}

interface Step {
  icon: any;
  title: string;
  description: string;
  color: string;
}

interface Reason {
  icon: any;
  title: string;
  description: string;
  gradient: string;
}

export default function KreditScoreLanding() {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');

  // Loan Form state
  const [isLoanFormOpen, setIsLoanFormOpen] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState('');

  const handleFeatureClick = (featureName: string) => {
    setSelectedFeature(featureName);
    setIsModalOpen(true);
  };

