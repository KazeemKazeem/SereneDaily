
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Moon, Calendar, BarChart2 } from 'lucide-react';

const steps = [
  {
    title: "Capture the Moment",
    desc: "A safe space to write your thoughts, track your mood, and save daily highlights.",
    icon: <Moon className="text-indigo-600" size={48} />,
    color: "bg-indigo-50"
  },
  {
    title: "Stay Organized",
    desc: "Manage tasks and activities in one place. Your daily focus, simplified.",
    icon: <Calendar className="text-emerald-600" size={48} />,
    color: "bg-emerald-50"
  },
  {
    title: "Insightful Growth",
    desc: "Visualize your wellness trends over time and celebrate your consistency.",
    icon: <BarChart2 className="text-amber-600" size={48} />,
    color: "bg-amber-50"
  }
];

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-8 max-w-md mx-auto animate-in fade-in duration-500">
      <div className="flex justify-end pt-4">
        <button 
          onClick={() => navigate('/')}
          className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600"
        >
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className={`w-32 h-32 ${steps[currentStep].color} rounded-[48px] flex items-center justify-center mb-12 shadow-inner`}>
          {steps[currentStep].icon}
        </div>
        
        <h2 className="text-3xl font-lexend font-black text-slate-900 mb-4 animate-in slide-in-from-bottom-2">
          {steps[currentStep].title}
        </h2>
        
        <p className="text-slate-500 leading-relaxed max-w-[280px]">
          {steps[currentStep].desc}
        </p>
      </div>

      <div className="flex flex-col items-center pb-12">
        <div className="flex gap-2 mb-10">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`} 
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-bold text-sm shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          {currentStep === steps.length - 1 ? "Get Started" : "Continue"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
