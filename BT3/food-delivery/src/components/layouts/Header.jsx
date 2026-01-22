import React from "react";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import logo from "../../assets/logo.png";
import LoginModal from "@/components/auth/LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const navLinks = [
    { name: "Home", active: true },
    { name: "Browse Menu", active: false },
    { name: "Special Offers", active: false },
    { name: "Restaurants", active: false },
    { name: "Track Order", active: false },
  ];

  return (
    <header className="w-full bg-white py-4 px-6 md:px-12 flex items-center justify-between shadow-sm">
      <div className="shrink-0">
        <img
          src={logo}
          alt="Order.uk Logo"
          className="h-10 w-auto object-contain"
        />
      </div>

      <nav className="hidden lg:flex items-center gap-2">
        {navLinks.map((link) => (
          <button
            key={link.name}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all
              ${
                link.active
                  ? "bg-[#FC8A06] text-white"
                  : "text-[#03081F] hover:bg-gray-100"
              }`}
          >
            {link.name}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="font-semibold text-[#03081F]">
              Hi, {user.name}
            </span>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="rounded-full px-6 py-2 border-[#03081F] text-[#03081F] hover:bg-gray-100"
            >
              Logout
            </Button>
          </div>
        ) : (
          <LoginModal>
            <Button className="bg-[#03081F] hover:bg-[#0a1029] text-white rounded-full px-8 py-6 flex items-center gap-3 text-base font-medium transition-transform active:scale-95">
              <UserCircle className="w-6 h-6 text-[#FC8A06]" />
              Login/Signup
            </Button>
          </LoginModal>
        )}
      </div>
    </header>
  );
};

export default Header;
