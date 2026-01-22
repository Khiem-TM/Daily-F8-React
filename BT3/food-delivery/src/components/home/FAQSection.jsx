import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import order1 from "../../assets/order1.png";
import order2 from "../../assets/order2.png";
import order3 from "../../assets/order3.png";

const FAQSection = () => {
  const [activeTab, setActiveTab] = useState("Frequent Questions");

  const tabContent = {
    "Frequent Questions": {
      questions: [
        "How does Order.UK work?",
        "What payment methods are accepted?",
        "Can I track my order in real-time?",
        "Are there any special discounts?",
        "Is Order.UK available in my area?",
      ],
      steps: [
        {
          title: "Place an Order!",
          desc: "Place order through our website or Mobile app",
          img: order1,
        },
        {
          title: "Track Progress",
          desc: "Your can track your order status with delivery time",
          img: order2,
        },
        {
          title: "Get your Order!",
          desc: "Receive your order at a lighting fast speed!",
          img: order3,
        },
      ],
      footerText:
        "Order.UK simplifies the food ordering process. Browse through our diverse menu, select your favorite dishes, and proceed to checkout. Your delicious meal will be on its way to your doorstep in no time!",
    },
    "Who we are?": {
      questions: [
        "Our Story",
        "Our Mission",
        "Sustainability",
        "Careers",
        "Press & Media",
      ],
      steps: [
        {
          title: "Founded in 2024",
          desc: "Started as a small tech team in London",
          img: "../assets/logo1.png",
        },
        {
          title: "Global Vision",
          desc: "Connecting millions of food lovers daily",
          img: "../assets/logo2.png",
        },
        {
          title: "Top Rated",
          desc: "Highest customer satisfaction in the UK",
          img: "../assets/logo3.png",
        },
      ],
      footerText:
        "We are a team of food enthusiasts and tech experts dedicated to bringing the best local flavors to your home. Our platform is built on trust, speed, and a passion for great food.",
    },
    "Partner Program": {
      questions: [
        "Restaurant Partner",
        "Driver Benefits",
        "Corporate Accounts",
        "Marketing Support",
        "API Integration",
      ],
      steps: [
        {
          title: "Register",
          desc: "Sign up your business in minutes online",
          img: "../assets/logo1.png",
        },
        {
          title: "Get Orders",
          desc: "Receive orders via our merchant tablet",
          img: "../assets/logo2.png",
        },
        {
          title: "Grow Revenue",
          desc: "Watch your business expand with us",
          img: "../assets/logo3.png",
        },
      ],
      footerText:
        "Join thousands of businesses already growing with Order.uk. We provide the tools, the delivery network, and the customers while you focus on cooking amazing food.",
    },
    "Help & Support": {
      questions: [
        "Order Issues",
        "Refund Policy",
        "Account Safety",
        "Contact Us",
        "App Tutorial",
      ],
      steps: [
        {
          title: "24/7 Chat",
          desc: "Talk to our support team anytime",
          img: "/logo1.png",
        },
        {
          title: "Fast Refund",
          desc: "Money back within 3-5 business days",
          img: "/logo2.png",
        },
        {
          title: "Secure Pay",
          desc: "Multiple layers of encryption for safety",
          img: "/logo3.png",
        },
      ],
      footerText:
        "Need help? Our dedicated support team is available 24/7 to ensure your experience is seamless. From order tracking to account issues, we've got your back.",
    },
  };

  const tabs = Object.keys(tabContent);
  const currentData = tabContent[activeTab];

  return (
    <section className="w-full bg-[#F5F5F5] py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <h2 className="text-3xl font-extrabold text-[#03081F]">
            Know more about us!
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
                  activeTab === tab
                    ? "bg-white border-[#FC8A06] text-[#03081F] shadow-sm"
                    : "border-transparent text-[#03081F] hover:text-[#FC8A06] hover:bg-white/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div
          key={activeTab}
          className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm flex flex-col lg:flex-row gap-12 animate-in fade-in duration-500"
        >
          <div className="w-full lg:w-1/3 flex flex-col gap-4 justify-center">
            {currentData.questions.map((q, idx) => (
              <button
                key={idx}
                className={`text-left px-6 py-4 rounded-full text-sm font-extrabold transition-all duration-300 ${
                  idx === 0
                    ? "bg-[#FC8A06] text-white shadow-lg scale-105"
                    : "bg-transparent text-[#03081F] hover:bg-gray-50 hover:pl-8"
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentData.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-[#D9D9D9] rounded-2xl p-6 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
                >
                  <h4 className="font-bold text-[#03081F] text-sm group-hover:text-[#FC8A06]">
                    {step.title}
                  </h4>
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-24 h-24 object-contain transition-transform group-hover:rotate-6"
                  />
                  <p className="text-[11px] text-gray-700 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-sm text-center text-gray-600 leading-relaxed max-w-2xl mx-auto font-medium italic">
              "{currentData.footerText}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
