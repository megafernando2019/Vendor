import Image from "next/image"
import Link from "next/link"

import logo from "@/assets/img/logo/logo-green.webp"
import MobileMenu from "./MobileMenu";
import { useState } from "react";

interface MobileSidebarProps {
   offCanvas: boolean;
   setOffCanvas: (offCanvas: boolean) => void;
}

const Offcanvas = ({ offCanvas, setOffCanvas }: MobileSidebarProps) => {

   const [searchValue, setSearchValue] = useState("");

   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSearchValue('');
      setOffCanvas(false);
   };

   return (
      <div className={offCanvas ? "mobile-menu-visible" : ""}>
         <div className="tgmobile__menu">
            <nav className="tgmobile__menu-box">
               <button type="button" onClick={() => setOffCanvas(false)} className="close-btn" aria-label="Close menu"><i className="fa-solid fa-xmark"></i></button>
               <div className="nav-logo">
                  <Link href="/"><Image src={logo} alt="logo" /></Link>
               </div>
               <div className="tgmobile__search">
                  <form onSubmit={handleSubmit}>
                     <input aria-label="Search here..."
                        type="text"
                        placeholder="Search here..."
                        value={searchValue}
                        onChange={handleSearchChange}
                     />
                  </form>
               </div>
               <div className="tgmobile__menu-outer">
                  <MobileMenu />
               </div>
               <div className="social-links">
                  <ul className="list-wrap">
                     <li><Link href="#"><i className="fab fa-facebook-f"></i></Link></li>
                     <li><Link href="#"><i className="fab fa-twitter"></i></Link></li>
                     <li><Link href="#"><i className="fab fa-instagram"></i></Link></li>
                     <li><Link href="#"><i className="fab fa-linkedin-in"></i></Link></li>
                     <li><Link href="#"><i className="fab fa-youtube"></i></Link></li>
                  </ul>
               </div>
            </nav>
         </div>
         <button type="button" onClick={() => setOffCanvas(false)} className="tgmobile__menu-backdrop" aria-label="Close menu" />
      </div>
   )
}

export default Offcanvas
