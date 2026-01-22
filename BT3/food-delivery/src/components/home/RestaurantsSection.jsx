import React from "react";
import { Button } from "@/components/ui/button";

import res1 from "../../assets/res1.png";
import res2 from "../../assets/res2.png";
import res3 from "../../assets/res3.png";
import res4 from "../../assets/res4.png";
import res5 from "../../assets/res5.png";
import res6 from "../../assets/res6.png";
import background2 from "../../assets/background2.png";
import partner from "../../assets/partner.png";
import ride from "../../assets/ride.png";

const RestaurantsSelection = () => {
  const popularRestaurants = [
    { name: "McDonald's London", img: res1, bgColor: "bg-[#E31837]" },
    { name: "Papa Johns", img: res2, bgColor: "bg-[#006747]" },
    { name: "KFC West London", img: res3, bgColor: "bg-[#E31837]" },
    { name: "Texas Chicken", img: res4, bgColor: "bg-[#004B8D]" },
    { name: "Burger King", img: res5, bgColor: "bg-[#D62300]" },
    { name: "Shaurma 1", img: res6, bgColor: "bg-[#FFFFFF]" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 space-y-20 font-sans">
      <div>
        <h2 className=" text-left text-3xl font-extrabold text-[#03081F] mb-8">
          Popular Restaurants
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {popularRestaurants.map((res, index) => (
            <div
              key={index}
              className="group cursor-pointer transition-all duration-300 transform hover:-translate-y-2"
            >
              <div
                className={`aspect-square rounded-t-2xl flex items-center justify-center p-6 ${res.bgColor} border border-gray-100 shadow-sm`}
              >
                <img
                  src={res.img}
                  alt={res.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="bg-[#FC8A06] rounded-b-2xl p-3 text-center shadow-md">
                <span className="text-white font-bold text-xs truncate block">
                  {res.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full">
        <img
          src={background2}
          alt="Ordering is more Personalised & Instant"
          className="w-full h-auto rounded-3xl shadow-lg object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative group overflow-hidden rounded-3xl min-h-100">
          <img
            src={partner}
            alt="Partner with us"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

          <div className="absolute top-0 left-10">
            <div className="bg-white px-6 py-2 rounded-b-xl shadow-md">
              <span className="text-[#03081F] font-bold text-sm">
                Earn more with lower fees
              </span>
            </div>
          </div>

          <div className="absolute bottom-10 left-10 space-y-2">
            <p className="text-[#FC8A06] font-bold text-sm uppercase">
              Signup as a business
            </p>
            <h3 className="text-white text-4xl font-extrabold">
              Partner with us
            </h3>
            <Button className="mt-4 bg-[#FC8A06] hover:bg-white hover:text-[#FC8A06] text-white rounded-full px-10 py-6 text-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-95">
              Get Started
            </Button>
          </div>
        </div>

        <div className="relative group overflow-hidden rounded-3xl min-h-100">
          <img
            src={ride}
            alt="Ride with us"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />

          <div className="absolute top-0 left-10">
            <div className="bg-white px-6 py-2 rounded-b-xl shadow-md">
              <span className="text-[#03081F] font-bold text-sm">
                Avail exclusive perks
              </span>
            </div>
          </div>

          <div className="absolute bottom-10 left-10 space-y-2">
            <p className="text-[#FC8A06] font-bold text-sm uppercase">
              Signup as a rider
            </p>
            <h3 className="text-white text-4xl font-extrabold">Ride with us</h3>
            <Button className="mt-4 bg-[#FC8A06] hover:bg-white hover:text-[#FC8A06] text-white rounded-full px-10 py-6 text-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-95">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantsSelection;
