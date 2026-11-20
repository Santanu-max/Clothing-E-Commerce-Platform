import React from "react";
import HeroSlider from "../components/HeroSlider.jsx";
import Product from "./Product.jsx"
import OurPolicy from "../components/OurPolicy.jsx"
import NewLetterBox from "../components/NewLetterBox.jsx"
import Footer from "../components/Footer.jsx"
import Ai from "../components/Ai.jsx";

function Home() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] pt-[70px] pb-[62px] md:pb-0 relative z-0">

      {/* Spacer wrapper keeps the slider fully below the 70px fixed header */}
      <div className="relative z-0 w-full">
        <HeroSlider />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 flex flex-col gap-20">
        <Product />
        <OurPolicy />
        <NewLetterBox />
      </div>

      <Footer />
      <Ai />
    </div>
  );
}

export default Home;
