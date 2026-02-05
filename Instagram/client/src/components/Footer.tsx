export default function Footer() {
  const links = [
    "Meta",
    "About",
    "Blog",
    "Jobs",
    "Help",
    "API",
    "Privacy",
    "Terms",
    "Locations",
    "Instagram Lite",
    "Meta AI",
    "Threads",
    "Contact Uploading & Non-Users",
    "Meta Verified",
  ];

  return (
    <footer className="absolute bottom-4 w-full text-center px-4 hidden md:block">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[12px] text-gray-500">
        {links.map((link) => (
          <span key={link} className="cursor-pointer hover:underline">
            {link}
          </span>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-3 text-[12px] text-gray-500">
        <span className="cursor-pointer">
          English <span className="text-[10px]">▼</span>
        </span>
        <span>© 2026 Instagram from Meta</span>
      </div>
    </footer>
  );
}
