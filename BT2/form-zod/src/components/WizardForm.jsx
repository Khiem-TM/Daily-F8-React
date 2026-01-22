import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactInfoSchema, usernameSchema } from "../schemas/wizardSchema";

import ContactInfoStep from "./steps/ContactInfoStep";
import UsernameStep from "./steps/UsernameStep";
import WarningStep from "./steps/WarningStep";
import AsyncStep from "./steps/AsyncStep";
import CompletionStep from "./steps/CompletionStep";

const TOTAL_STEPS = 5;

function WizardForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    age: "30",
    email: "",
    username: "john",
  });
  const [isAnimating, setIsAnimating] = useState(true);

  const form = useForm({
    defaultValues: formData,
    mode: "onBlur",
    resolver: zodResolver(contactInfoSchema),
  });

  const { handleSubmit, watch, trigger, getValues } = form;
  const firstName = watch("firstName");
  const email = watch("email");

  // logic progress bar
  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  const validateCurrentStep = async () => {
    if (currentStep === 1) {
      return await trigger(["firstName", "lastName", "age", "email"]);
    }
    if (currentStep === 2) {
      const isValid = await trigger(["username"]);
      const username = getValues("username");
      const currentFirstName = getValues("firstName");
      if (
        username &&
        currentFirstName &&
        !username.toLowerCase().includes(currentFirstName.toLowerCase())
      ) {
        form.setError("username", {
          type: "manual",
          message: "Username should include your first name",
        });
        return false;
      }
      return isValid;
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    const currentData = getValues();
    setFormData({ ...formData, ...currentData });

    if (currentStep === 2 && email) {
      setCurrentStep(4);
      return;
    }

    if (currentStep === 4) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      if (currentStep === 4 && email) {
        setCurrentStep(2);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const onSubmit = (data) => console.log("Form submitted:", data);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col font-sans">
      <header className="px-8 py-6 flex items-center justify-between bg-[#0f172a]">
        <h1 className="text-xl font-bold tracking-tight">rhf-wizard</h1>
        <div className="flex items-center gap-6">
          <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">
            Step {currentStep} / {TOTAL_STEPS}
          </span>
          <a href="#" className="hover:text-slate-300 transition-colors">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </header>

      <div className="w-full h-[2px] bg-slate-800 relative">
        <div
          className="absolute h-full bg-emerald-500 transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="px-8 py-4 flex justify-end">
        <label className="flex items-center gap-3 cursor-pointer">
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-tighter">
            Animate
          </span>
          <div className="relative">
            <input
              type="checkbox"
              checked={isAnimating}
              onChange={(e) => setIsAnimating(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full border border-emerald-500 transition-colors ${
                isAnimating ? "bg-transparent" : ""
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-3 h-3 bg-emerald-500 rounded-full transition-transform ${
                  isAnimating ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </div>
        </label>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[800px] mb-20"
        >
          <div
            className={`min-h-[250px] ${
              isAnimating ? "transition-opacity duration-500" : ""
            }`}
          >
            {currentStep === 1 && <ContactInfoStep form={form} />}
            {currentStep === 2 && (
              <UsernameStep form={form} firstName={firstName} />
            )}
            {currentStep === 3 && (
              <WarningStep
                onYes={() => setCurrentStep(1)}
                onNo={() => setCurrentStep(4)}
              />
            )}
            {currentStep === 4 && <AsyncStep />}
            {currentStep === 5 && <CompletionStep formData={formData} />}
          </div>

          {/* NAVIGATION BUTTONS - Tách biệt và căn lề rộng */}
          {currentStep !== 3 && (
            <div className="flex justify-between items-center mt-16">
              <button
                type="button"
                onClick={handlePrevious}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-xs tracking-[0.2em] transition-all bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white ${
                  currentStep === 1 ? "invisible" : ""
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                PREVIOUS
              </button>

              {currentStep < TOTAL_STEPS && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-10 py-3 bg-[#6366f1] hover:bg-[#5558dd] text-white rounded-lg font-bold text-xs tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
                >
                  NEXT
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

export default WizardForm;
