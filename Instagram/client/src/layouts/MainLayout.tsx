import Sidebar from "../components/Sidebar";
import MessengerWidget from "../components/MessengerWidget";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 ml-20">{children}</main>
      <MessengerWidget />
    </div>
  );
}
