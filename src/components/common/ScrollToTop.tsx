"use client";
import UseSticky from "@/hooks/UseSticky";
import { useState, useEffect } from "react";

function scrollTop() {
   window.scrollTo({ top: 0, behavior: "smooth" });
}

const ScrollToTop = () => {
   const { sticky }: { sticky: boolean } = UseSticky();
   const [showScroll, setShowScroll] = useState(false);

   useEffect(() => {
      const checkScrollTop = () => {
         const currentScroll = window.pageYOffset > 400;
         setShowScroll(prev => (prev !== currentScroll ? currentScroll : prev));
      };

      window.addEventListener("scroll", checkScrollTop, { passive: true });
      return () => window.removeEventListener("scroll", checkScrollTop);
   }, []);

   return (
      <button
         type="button"
         onClick={scrollTop}
         className={`scroll__top scroll-to-target ${sticky && showScroll ? "open" : ""}`}
         data-target="html"
         aria-label="Scroll to top"
      >
         <i className="fa-sharp fa-regular fa-arrow-up"></i>
      </button>
   );
};

export default ScrollToTop;
