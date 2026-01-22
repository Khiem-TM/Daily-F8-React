import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import hero1 from "../../assets/hero1.png";
import hero2 from "../../assets/hero2.png";
import hero3 from "../../assets/hero3.png";

const HeroSection = () => {
  return (
    <section className="text-left relative w-full bg-[#FAFAFA] overflow-hidden rounded-3xl mt-4 max-w-7xl mx-auto">
      <div className="mx-auto rounded-3xl relative w-full h-125 overflow-hidden flex items-center bg-[#F3F4F6] justify-between">
        <div className="text-left z-10 px-12 md:w-1/2 space-y-4">
          <p className="text-[#03081F] font-medium">
            Order Restaurant food, takeaway and groceries.
          </p>
          <h1 className="text-left text-5xl md:text-6xl font-extrabold tracking-tight text-[#03081F]">
            Feast Your Senses, <br />
            <span className="text-[#FC8A06]">Fast and Fresh</span>
          </h1>

          <div className="pt-4 space-y-3">
            <p className="text-sm font-semibold">
              Enter a postcode to see what we deliver
            </p>
            <div className="relative flex w-full max-w-md items-center">
              <Input
                type="text"
                placeholder="e.g. EC4R 3TE"
                className="rounded-full h-14 pl-8 pr-36 border-gray-200 focus-visible:ring-[#FC8A06]"
              />
              <Button className="absolute right-0 h-14 rounded-full bg-[#FC8A06] hover:bg-[#e67d05] px-10 text-white font-bold text-lg">
                Search
              </Button>
            </div>
          </div>
        </div>

        <div className="relative w-full lg:w-1/2 h-125 mt-12 lg:mt-0">
          <img
            src={hero3}
            alt="Background Decor"
            className="absolute right-0 top-0 h-full w-[80%] object-contain object-right z-0"
          />

          <div className="absolute left-0 bottom-8 z-10 hidden md:block">
            <img
              src={hero2}
              alt="Person"
              className="h-80 object-contain rounded-2xl border-4 border-white shadow-xl translate-x-4"
            />
          </div>

          <div className="flex bottom-0 left-[45%] -translate-x-1/2 z-20">
            <img src={hero1} alt="Person" className="h-100 object-contain" />
          </div>

          <div className="absolute right-8 top-12 flex flex-col gap-6 z-30">
            <NotificationCard
              number="1"
              title="We've Received your order!"
              desc="Awaiting Restaurant acceptance"
            />
            <NotificationCard
              number="2"
              title="Order Accepted! "
              desc="Your order will be delivered shortly"
            />
            <NotificationCard
              number="3"
              title="Your rider's nearby "
              desc="They're almost there – get ready!"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const NotificationCard = ({ number, title, desc }) => (
  <div className="relative bg-white/95 backdrop-blur shadow-lg rounded-xl p-4 w-64 border border-gray-100">
    <div className="flex justify-between items-start mb-1">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold bg-[#03081F] text-white px-1 rounded">
          Order.uk
        </span>
      </div>
      <span className="text-[10px] text-gray-400">now</span>
    </div>
    <h4 className="text-[12px] font-bold text-[#03081F]">{title}</h4>
    <p className="text-[10px] text-gray-600 leading-tight">{desc}</p>
    <span className="absolute -top-6 -right-2 text-6xl font-bold text-white/50 pointer-events-none select-none italic">
      {number}
    </span>
  </div>
);

export default HeroSection;
