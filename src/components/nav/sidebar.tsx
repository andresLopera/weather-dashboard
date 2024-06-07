'use client'

import Paths from "@/lib/paths/paths";
import Image from "next/image"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdBookmarks, MdOutlineDashboard, MdOutlineImageSearch } from "react-icons/md";
import { RiHome5Line } from "react-icons/ri";

function SideBarComponent() {

    const pathname = usePathname();

    const routes = [{
        path: Paths.Dashboard,
        icon: <RiHome5Line className="text-2xl" />
    }, {
        path: Paths.OtherPage,
        icon: <MdOutlineImageSearch className="text-2xl" />
    }, {
        path: '',
        icon: <MdBookmarks className="text-2xl" />
    }, {
        path: '',
        icon: <MdOutlineDashboard className="text-2xl" />
    }]

    return (
        <div className="flex flex-col">
            <div className="p-3">
                <Image src='/logo.png' width={50} height={50} alt="Weather-logo" />
            </div>
            <div className="flex items-center flex-1">
                <ul className="flex flex-col gap-1 w-full">
                    {routes.map((route, index) => (
                        <li key={index}>
                            <Link href={route.path} className={`pt-4 pb-4 w-full flex items-center justify-center sidebar-btn-menu ${pathname === route.path ? 'sidebar-btn-menu--active' : ''}`}>
                                {route.icon}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}

export default SideBarComponent