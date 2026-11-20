import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  Pagination,
  Keyboard,
  A11y,
} from "swiper/modules";

// Hero Images
import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";
import hero3 from "../assets/hero3.png";
import hero4 from "../assets/hero4.png";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// --------------------------------------------------
// HERO SLIDES
// --------------------------------------------------
//
// Hero 1 → Men + TopWear + BottomWear
// Hero 2 → Women + TopWear + BottomWear
// Hero 3 → Kids + TopWear + BottomWear
// Hero 4 → WinterWear for everyone
//
// --------------------------------------------------

const slides = [
  {
    image: hero1,
    filterType: "category",
    filterValue: "Men",
    subCategories: ["TopWear", "BottomWear"],
  },

  {
    image: hero2,
    filterType: "category",
    filterValue: "Women",
    subCategories: ["TopWear", "BottomWear"],
  },

  {
    image: hero3,
    filterType: "category",
    filterValue: "Kids",
    subCategories: ["TopWear", "BottomWear"],
  },

  {
    image: hero4,
    filterType: "subCategory",
    filterValue: "WinterWear",
  },
];

const AUTOPLAY_DELAY = 4000;

const HeroSlider = () => {
  const [progress, setProgress] = useState(0);

  const swiperRef = useRef(null);

  const navigate = useNavigate();

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  const goToCollection = (slide) => {
    if (!slide?.filterType || !slide?.filterValue) {
      return;
    }

    const params = new URLSearchParams();

    // Men / Women / Kids
    if (slide.filterType === "category") {
      params.set("category", slide.filterValue);

      if (
        slide.subCategories &&
        slide.subCategories.length > 0
      ) {
        params.set(
          "subCategory",
          slide.subCategories.join(",")
        );
      }
    }

    // WinterWear
    if (slide.filterType === "subCategory") {
      params.set(
        "subCategory",
        slide.filterValue
      );
    }

    navigate(`/collections?${params.toString()}`);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <Swiper
        modules={[
          Autoplay,
          Navigation,
          Pagination,
          Keyboard,
          A11y,
        ]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
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
          bulletActiveClass:
            "!w-[22px] !bg-amber-500",
        }}
        wrapperClass="motion-reduce:!transition-none"
        keyboard={{
          enabled: true,
        }}
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
        onAutoplayTimeLeft={(
          _swiper,
          _timeLeft,
          percentage
        ) => setProgress(1 - percentage)}
        className="w-full h-[220px] sm:h-[340px] md:h-[440px] lg:h-[560px] xl:h-[600px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full h-full cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={
                slide.title
                  ? `${slide.title} — shop ${slide.filterValue}`
                  : `Shop ${slide.filterValue}`
              }
              onClick={() =>
                goToCollection(slide)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" ||
                  e.key === " "
                ) {
                  e.preventDefault();

                  goToCollection(slide);
                }
              }}
            >
              {/* Hero Image */}
              <img
                src={slide.image}
                alt={
                  slide.title
                    ? slide.title
                    : `Promotional banner ${
                        index + 1
                      }`
                }
                className="w-full h-full object-cover"
                loading={
                  index === 0
                    ? "eager"
                    : "lazy"
                }
                fetchPriority={
                  index === 0
                    ? "high"
                    : "auto"
                }
                draggable={false}
              />

              {/* Gradient Overlay */}
              {(slide.title ||
                slide.subtitle ||
                slide.ctaText) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent sm:bg-gradient-to-r sm:from-black/70 sm:via-black/25 sm:to-transparent">
                  <div className="flex h-full flex-col justify-end sm:justify-center px-5 sm:px-10 md:px-16 pb-8 sm:pb-0 max-w-xl">

                    {/* Title */}
                    {slide.title && (
                      <h2 className="text-white font-bold leading-tight text-xl sm:text-3xl md:text-4xl lg:text-5xl drop-shadow-sm">
                        {slide.title}
                      </h2>
                    )}

                    {/* Subtitle */}
                    {slide.subtitle && (
                      <p className="mt-2 text-slate-200/90 text-sm sm:text-base md:text-lg max-w-md">
                        {slide.subtitle}
                      </p>
                    )}

                    {/* CTA */}
                    {slide.ctaText && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          goToCollection(slide);
                        }}
                        className="mt-4 sm:mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all duration-200 text-slate-900 font-semibold text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3 shadow-lg shadow-amber-500/20"
                      >
                        {slide.ctaText}

                        <span aria-hidden="true">
                          →
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Previous Button */}
      <button
        type="button"
        aria-label="Previous slide"
        className="oc-hero-prev hidden sm:flex absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 active:scale-90 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        type="button"
        aria-label="Next slide"
        className="oc-hero-next hidden sm:flex absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 active:scale-90 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Pagination Dots */}
      <div className="oc-hero-pagination absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5"></div>

      {/* Autoplay Progress */}
      <div className="absolute bottom-0 left-0 h-0.5 sm:h-1 w-full bg-white/10 z-10">
        <div
          className="h-full bg-amber-500 transition-[width] duration-100 ease-linear motion-reduce:transition-none"
          style={{
            width: `${progress * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default HeroSlider;