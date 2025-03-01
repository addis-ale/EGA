"use client";

import CustomeDropDown from "../customeDropDown";
const AdminNav = () => {
  return (
    <header className="sticky top-0 z-50 bg-slate-700 border-b border-gray-800 w-full">
      <div className="flex h-16 px-4 lg:px-12 items-center justify-between w-full">
        <span className="font-bold text-xl text-white">EGA</span>
        <CustomeDropDown />
      </div>
    </header>
  );
};

export default AdminNav;
