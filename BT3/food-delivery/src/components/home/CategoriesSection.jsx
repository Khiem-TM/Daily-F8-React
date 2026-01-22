import React, { useState } from "react";
import food11 from "../../assets/food11.png";
import food12 from "../../assets/food12.png";
import food13 from "../../assets/food13.png";
import food21 from "../../assets/food21.png";
import food22 from "../../assets/food22.png";
import food23 from "../../assets/food23.png";
import food24 from "../../assets/food24.png";
import food25 from "../../assets/food25.png";
import food26 from "../../assets/food26.png";

const CategoriesSection = () => {
  const [activeTab, setActiveTab] = useState("Pizza & Fast food");

  const tabs = [
    { id: "Vegan", name: "Vegan" },
    { id: "Sushi", name: "Sushi" },
    { id: "Pizza & Fast food", name: "Pizza & Fast food" },
    { id: "others", name: "others" },
  ];

  const dealsData = {
    "Pizza & Fast food": [
      {
        id: 1,
        img: food11,
        discount: "-40%",
        restaurant: "Chef Burgers London",
      },
      {
        id: 2,
        img: food12,
        discount: "-20%",
        restaurant: "Grand Ai Cafe London",
      },
      {
        id: 3,
        img: food13,
        discount: "-17%",
        restaurant: "Butterbrot Café London",
      },
    ],
    Vegan: [
      {
        id: 4,
        img: food11,
        discount: "-15%",
        restaurant: "Green Garden",
      },
      {
        id: 5,
        img: food12,
        discount: "-10%",
        restaurant: "Vegan Life",
      },
      {
        id: 6,
        img: food13,
        discount: "-25%",
        restaurant: "Leafy Bites",
      },
    ],
  };

  const categories = [
    {
      name: "Burgers & Fast food",
      count: "21 Restaurants",
      img: food21,
    },
    { name: "Salads", count: "32 Restaurants", img: food22 },
    {
      name: "Pasta & Casuals",
      count: "4 Restaurants",
      img: food23,
    },
    { name: "Pizza", count: "32 Restaurants", img: food24 },
    { name: "Breakfast", count: "4 Restaurants", img: food25 },
    { name: "Soups", count: "32 Restaurants", img: food26 },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <h2 className="text-3xl font-extrabold text-[#03081F]">
            Up to -40% Order.uk exclusive deals
          </h2>

          <div className="text-left flex flex-wrap gap-2 items-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white border-[#FC8A06] text-[#FC8A06] shadow-md"
                    : "border-transparent text-[#03081F] hover:bg-gray-100"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="text-left grid grid-cols-1 md:grid-cols-3 gap-6">
          {(dealsData[activeTab] || dealsData["Pizza & Fast food"]).map(
            (item) => (
              <div
                key={item.id}
                className="relative group overflow-hidden rounded-2xl cursor-pointer bg-black"
              >
                <img
                  src={item.img}
                  alt={item.restaurant}
                  className="w-full h-62.5 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-80"
                />
                <div className="absolute top-0 right-8 bg-[#03081F] text-white px-4 py-2 rounded-b-xl font-bold">
                  {item.discount}
                </div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-[#FC8A06] text-sm font-bold">Restaurant</p>
                  <h3 className="text-xl font-extrabold">{item.restaurant}</h3>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-extrabold text-[#03081F] mb-8 flex items-center gap-2">
          Order.uk Popular Categories 🤩
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="bg-[#F5F5F5] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
            >
              <div className="overflow-hidden">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-32 object-cover transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110"
                />
              </div>
              <div className="p-4 bg-white md:bg-[#F5F5F5]">
                <h4 className="font-bold text-[#03081F] text-sm truncate">
                  {cat.name}
                </h4>
                <p className="text-[#FC8A06] text-[10px] font-bold mt-1">
                  {cat.count}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
