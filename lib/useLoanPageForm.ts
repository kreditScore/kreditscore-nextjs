import { useState } from 'react';

type SuggestionState = { current: boolean; permanent: boolean; office: boolean };

const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara'
];

const indianStates = [
  'Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat',
  'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Andhra Pradesh', 'Kerala', 'Punjab',
  'Haryana', 'Bihar'
];

const indianCompanies = [
  'TCS', 'Infosys', 'Wipro', 'HCL Technologies', 'Tech Mahindra', 'Reliance Industries',
  'HDFC Bank', 'ICICI Bank', 'SBI', 'Tata Motors', 'Mahindra & Mahindra', 'Adani Group',
  'Larsen & Toubro', 'Asian Paints', 'Bajaj Auto'
];

const companyTypes = ['Private Limited', 'Public Limited', 'Government', 'MNC', 'Startup', 'Partnership', 'Proprietorship'];

export function useLoanPageForm(specialFieldKey: string) {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({
    fullName: '',
    email: '',
    mobile: '',
    panCard: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    companyName: '',
    companyType: '',
    netSalary: '',
    workEmail: '',
    [specialFieldKey]: '',
    currentAddress: '',
    currentLandmark: '',
    currentCity: '',
    currentState: '',
    currentPincode: '',
    permanentAddress: '',
    permanentLandmark: '',
    permanentCity: '',
    permanentState: '',
    permanentPincode: '',
    officeAddress: '',
    officeLandmark: '',
    officeCity: '',
    officeState: '',
    officePincode: ''
  });

  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(12);
  const [tenure, setTenure] = useState(36);

  const [showCitySuggestions, setShowCitySuggestions] = useState<SuggestionState>({ current: false, permanent: false, office: false });
  const [showStateSuggestions, setShowStateSuggestions] = useState<SuggestionState>({ current: false, permanent: false, office: false });
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [showCompanyTypeSuggestions, setShowCompanyTypeSuggestions] = useState(false);

  const calculateEMI = (principal: number, rate: number, time: number) => {
    const r = rate / 12 / 100;
    const n = time;
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return isNaN(emi) ? 0 : emi;
  };

  const emi = calculateEMI(loanAmount, interestRate, tenure);
  const totalPayable = emi * tenure;
  const totalInterest = totalPayable - loanAmount;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (formStep < 3) setFormStep(formStep + 1);
  };

  const handlePrevStep = () => {
    if (formStep > 1) setFormStep(formStep - 1);
  };

  const filterCities = (input: string) =>
    input ? indianCities.filter((city) => city.toLowerCase().includes(input.toLowerCase())) : indianCities;

  const filterStates = (input: string) =>
    input ? indianStates.filter((state) => state.toLowerCase().includes(input.toLowerCase())) : indianStates;

  const filterCompanies = (input: string) =>
    input ? indianCompanies.filter((company) => company.toLowerCase().includes(input.toLowerCase())) : indianCompanies;

  const filterCompanyTypes = (input: string) =>
    input ? companyTypes.filter((type) => type.toLowerCase().includes(input.toLowerCase())) : companyTypes;

  return {
    formStep,
    formData,
    loanAmount,
    interestRate,
    tenure,
    showCitySuggestions,
    showStateSuggestions,
    showCompanySuggestions,
    showCompanyTypeSuggestions,
    emi,
    totalPayable,
    totalInterest,
    setLoanAmount,
    setInterestRate,
    setTenure,
    setShowCitySuggestions,
    setShowStateSuggestions,
    setShowCompanySuggestions,
    setShowCompanyTypeSuggestions,
    handleInputChange,
    handleNextStep,
    handlePrevStep,
    filterCities,
    filterStates,
    filterCompanies,
    filterCompanyTypes
  };
}
