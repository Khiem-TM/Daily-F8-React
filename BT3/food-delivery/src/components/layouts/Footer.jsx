import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import facebookIcon from "../../assets/footer/facebook.png";
import instagramIcon from "../../assets/footer/Instagram.png";
import tiktokIcon from "../../assets/footer/TikTok.png";
import snapchatIcon from "../../assets/footer/Snapchat.png";
import logo from "../../assets/footer/logo.png";
import appStore from "../../assets/footer/store.png";

const Footer = () => {
  return (
    <footer className="w-full bg-[#D9D9D9] font-sans mt-auto">
      <div className="w-full px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Order.uk Logo"
              className="h-16 w-auto object-contain"
            />
          </div>
          <div className="flex flex-col gap-3">
            <img
              src={appStore}
              alt="Download App"
              className="w-40 cursor-pointer"
            />
          </div>
          <p className="text-sm text-gray-700 leading-tight">
            Company # 490039-445, Registered with House of companies.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-bold text-[#03081F]">
            Get Exclusive Deals in your Inbox
          </h3>
          <div className="relative flex w-full max-w-lg items-center">
            <Input
              type="email"
              placeholder="youremail@gmail.com"
              className="rounded-full bg-[#EEEEEE] border-none h-12 pr-32 pl-6 focus-visible:ring-1 focus-visible:ring-orange-500 w-full"
            />
            <Button className="absolute right-0 h-12 rounded-full bg-[#FC8A06] hover:bg-[#e67d05] px-8 text-white font-bold">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-gray-600">
            we wont spam, read our{" "}
            <a href="#" className="underline">
              email policy
            </a>
          </p>
          <div className="flex gap-4">
            <img
              src={facebookIcon}
              alt="Facebook"
              className="w-8 h-8 cursor-pointer"
            />
            <img
              src={instagramIcon}
              alt="Instagram"
              className="w-8 h-8 cursor-pointer"
            />
            <img
              src={tiktokIcon}
              alt="TikTok"
              className="w-8 h-8 cursor-pointer"
            />
            <img
              src={snapchatIcon}
              alt="Snapchat"
              className="w-8 h-8 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-[#03081F]">Legal Pages</h3>
          <ul className="flex flex-col gap-3 text-sm underline text-gray-800 font-medium">
            <li>
              <a href="#">Terms and conditions</a>
            </li>
            <li>
              <a href="#">Privacy</a>
            </li>
            <li>
              <a href="#">Cookies</a>
            </li>
            <li>
              <a href="#">Modern Slavery Statement</a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-[#03081F]">Important Links</h3>
          <ul className="flex flex-col gap-3 text-sm underline text-gray-800 font-medium">
            <li>
              <a href="#">Get help</a>
            </li>
            <li>
              <a href="#">Add your restaurant</a>
            </li>
            <li>
              <a href="#">Sign up to deliver</a>
            </li>
            <li>
              <a href="#">Create a business account</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full bg-[#03081F] text-white py-6">
        <div className="w-full px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
          <p>Order.uk Copyright 2024, All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300">
              Terms
            </a>
            <a href="#" className="hover:text-gray-300">
              Pricing
            </a>
            <a href="#" className="hover:text-gray-300">
              Do not sell or share my personal information
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
