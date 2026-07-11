// src/components/HeroSlider.jsx

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, Keyboard, A11y } from "swiper/modules";

import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import hero4 from "../assets/hero4.jpg";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Each slide is just an image + optional caption/CTA.
// Leave title/subtitle/cta blank ("") on any slide to render an image-only slide.
const slides = [
  {
    image: hero1,
    title: "New Season, New Style",
    subtitle: "Fresh arrivals are in — shop the latest drops",
    ctaText: "Shop New Arrivals",
    ctaLink: "/products?sort=newest",
  },
  {
    image: hero2,
    title: "Up to 50% Off",
    subtitle: "Limited-time deals across top categories",
    ctaText: "View Deals",
    ctaLink: "/deals",
  },
  {
    image: hero3,
    title: "Everyday Essentials",
    subtitle: "Quality picks, handpicked for you",
    ctaText: "Explore Now",
    ctaLink: "/products",
  },
  {
    image: hero4,
    title: "",
    subtitle: "",
    ctaText: "",
    ctaLink: "",
  },
];

const AUTOPLAY_DELAY = 4000;

const HeroSlider = () => {
  const [progress, setProgress] = useState(0);
  const swiperRef = useRef(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="relative w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, Keyboard, A11y]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={1}
        loop={true}
        speed={700}
        navigation={{
          nextEl: ".oc-hero-next",
          prevEl: ".oc-hero-prev",
        }}
        pagination={{
          clickable: true,
          el: ".oc-hero-pagination",
          bulletClass:
            "inline-block h-2 w-2 rounded-full bg-white/40 cursor-pointer transition-all duration-300 motion-reduce:!transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2",
          bulletActiveClass: "!w-[22px] !bg-amber-500",
        }}
        wrapperClass="motion-reduce:!transition-none"
        keyboard={{ enabled: true }}
        a11y={{
          prevSlideMessage: "Previous slide",
          nextSlideMessage: "Next slide",
        }}
        autoplay={
          prefersReducedMotion
            ? false
            : {
                delay: AUTOPLAY_DELAY,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
        }
        onAutoplayTimeLeft={(_swiper, _timeLeft, percentage) =>
          setProgress(1 - percentage)
        }
        className="w-full h-[220px] sm:h-[340px] md:h-[440px] lg:h-[560px] xl:h-[600px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={slide.title ? slide.title : `Promotional banner ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                fetchpriority={index === 0 ? "high" : "auto"}
                draggable={false}
              />

              {/* Gradient overlay only rendered when there's copy to keep it readable */}
              {(slide.title || slide.subtitle || slide.ctaText) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent sm:bg-gradient-to-r sm:from-black/70 sm:via-black/25 sm:to-transparent">
                  <div className="flex h-full flex-col justify-end sm:justify-center px-5 sm:px-10 md:px-16 pb-8 sm:pb-0 max-w-xl">
                    {slide.title && (
                      <h2 className="text-white font-bold leading-tight text-xl sm:text-3xl md:text-4xl lg:text-5xl drop-shadow-sm">
                        {slide.title}
                      </h2>
                    )}
                    {slide.subtitle && (
                      <p className="mt-2 text-slate-200/90 text-sm sm:text-base md:text-lg max-w-md">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.ctaText && (
                      <a
                        href={slide.ctaLink || "#"}
                        className="mt-4 sm:mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all duration-200 text-slate-900 font-semibold text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3 shadow-lg shadow-amber-500/20"
                      >
                        {slide.ctaText}
                        <span aria-hidden="true">→</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom nav arrows — glassmorphism to match the rest of the UI, hidden on very small screens */}
      <button
        type="button"
        aria-label="Previous slide"
        className="oc-hero-prev hidden sm:flex absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 active:scale-90 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next slide"
        className="oc-hero-next hidden sm:flex absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 active:scale-90 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="oc-hero-pagination absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5"></div>

      {/* Autoplay progress bar */}
      <div className="absolute bottom-0 left-0 h-0.5 sm:h-1 w-full bg-white/10 z-10">
        <div
          className="h-full bg-amber-500 transition-[width] duration-100 ease-linear motion-reduce:transition-none"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
};

export default HeroSlider;
