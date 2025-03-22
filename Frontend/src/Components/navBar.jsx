import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineReceiptLong, MdOutlineInventory2, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { PiLightning } from "react-icons/pi";

const NavBar = () => {
    const location = useLocation();
    const menuItems = [
        { name: "Billing", path: "/billing", icon: <MdOutlineReceiptLong className="text-3xl" /> },
        { name: "Inventory", path: "/inventory", icon: <MdOutlineInventory2 className="text-3xl" /> },
        { name: "Flash Sale", path: "/flash-sale", icon: <PiLightning className="text-3xl" /> },
        { name: "Restocking", path: "/restocking", icon: <MdOutlineSettingsBackupRestore className="text-3xl" /> }
    ];

    return (
        <div className="border boder-2 bg-white border-[#d8d9d4] rounded p-4 h-screen w-full flex flex-col items-center pt-5 justify-between" style={{ fontFamily: "Iansui, sans-serif" }}>
            <div>
                <div className="flex justify-center items-center">
                    <img src="/FinalLogo.png" alt="logo" className="h-10" />
                    <h1 className="font-bold text-2xl text-[#0d222e]">Checky</h1>
                </div>
                <hr className="text-[#d8d9d4] mt-2 w-50" />
                <ul className="mt-2 pl-2">
                    {menuItems.map(item => (
                        <li key={item.name} className="w-full">
                            <Link
                                to={item.path}
                                className={`text-md font-semibold py-2 flex w-40 items-center gap-2 rounded-lg transition-all duration-200 ${location.pathname === item.path ? "text-[#575952] pl-8" : "text-[#898c81] pl-2"
                                    }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <hr className="text-[#d8d9d4] mt-2 w-50" />
                <div className="flex items-center justify-center mt-2">
                    <img src="/profile.jpg" alt="Store" className="h-15 object-cover rounded-full" />
                    <div className="">
                        <p className="text-[#575952] text-lg font-semibold">Store Name</p>
                        <p className="text-[#898c81] text-sm">Store Name</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
