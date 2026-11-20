import React, { useContext, useEffect, useRef, useState } from 'react'
import ai from "../assets/ai.png"
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import open from "../assets/open.mp3"

function Ai() {
  let { showSearch, setShowSearch } = useContext(shopDataContext)
  let navigate = useNavigate()
  let [activeAi, setActiveAi] = useState(false)

  // Audio + SpeechRecognition must only be created once, not on every render.
  const openingSoundRef = useRef(null)
  const recognitionRef = useRef(null)
  const supportedRef = useRef(true)

  if (openingSoundRef.current === null) {
    openingSoundRef.current = new Audio(open)
  }

  if (recognitionRef.current === null) {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognitionCtor) {
      // Browser doesn't support voice recognition (Firefox, some in-app
      // webviews, some mobile browsers). Don't crash the whole app —
      // just disable the feature.
      console.log("SpeechRecognition not supported in this browser")
      supportedRef.current = false
    } else {
      recognitionRef.current = new SpeechRecognitionCtor()
    }
  }

  function speak(message) {
    const utterence = new SpeechSynthesisUtterance(message)
    window.speechSynthesis.speak(utterence)
  }

  useEffect(() => {
    const recognition = recognitionRef.current
    if (!recognition) return

    const handleResult = (e) => {
      const transcript = e.results[0][0].transcript.trim().toLowerCase()

      if (transcript.includes("search") && transcript.includes("open") && !showSearch) {
        speak("opening search")
        setShowSearch(true)
        navigate("/collections")
      } else if (transcript.includes("search") && transcript.includes("close") && showSearch) {
        speak("closing search")
        setShowSearch(false)
      } else if (
        transcript.includes("collection") ||
        transcript.includes("collections") ||
        transcript.includes("product") ||
        transcript.includes("products")
      ) {
        speak("opening collection page")
        navigate("/collections")
        setShowSearch(false)
      } else if (transcript.includes("about")) {
        speak("opening about page")
        navigate("/about")
        setShowSearch(false)
      } else if (transcript.includes("home")) {
        speak("opening home page")
        navigate("/")
        setShowSearch(false)
      } else if (
        transcript.includes("cart") ||
        transcript.includes("kaat") ||
        transcript.includes("caat")
      ) {
        speak("opening your cart")
        navigate("/cart")
        setShowSearch(false)
      } else if (transcript.includes("contact")) {
        speak("opening contact page")
        navigate("/contact")
        setShowSearch(false)
      } else if (
        transcript.includes("order") ||
        transcript.includes("myorders") ||
        transcript.includes("orders") ||
        transcript.includes("my order")
      ) {
        speak("opening your orders page")
        navigate("/order")
        setShowSearch(false)
      } else if (
        transcript.includes("checkout") ||
        transcript.includes("place order") ||
        transcript.includes("placeorder")
      ) {
        speak("opening checkout")
        navigate("/placeorder")
        setShowSearch(false)
      } else if (
        transcript.includes("login") ||
        transcript.includes("log in") ||
        transcript.includes("sign in")
      ) {
        speak("opening login page")
        navigate("/login")
        setShowSearch(false)
      } else if (
        transcript.includes("sign up") ||
        transcript.includes("signup") ||
        transcript.includes("register") ||
        transcript.includes("registration")
      ) {
        speak("opening sign up page")
        navigate("/signup")
        setShowSearch(false)
      } else {
        toast.error("Try Again")
      }
    }

    const handleEnd = () => setActiveAi(false)

    recognition.addEventListener("result", handleResult)
    recognition.addEventListener("end", handleEnd)

    return () => {
      recognition.removeEventListener("result", handleResult)
      recognition.removeEventListener("end", handleEnd)
    }
    // showSearch is read inside handleResult, so it needs to be a dependency
    // for the closure to see the latest value.
  }, [showSearch, navigate, setShowSearch])

  const handleClick = () => {
    if (!supportedRef.current || !recognitionRef.current) {
      toast.error("Voice assistant isn't supported in this browser")
      return
    }
    recognitionRef.current.start()
    openingSoundRef.current.play()
    setActiveAi(true)
  }

  return (
    <div
      className='fixed z-[9999] lg:bottom-[20px] md:bottom-[40px] bottom-[80px] left-[2%]'
      onClick={handleClick}
    >
      <img
        src={ai}
        alt=""
        className={`w-[100px] cursor-pointer ${activeAi ? 'translate-x-[10%] translate-y-[-10%] scale-125 ' : 'translate-x-[0] translate-y-[0] scale-100'} transition-transform`}
        style={{
          filter: `${activeAi ? "drop-shadow(0px 0px 30px #00d2fc)" : "drop-shadow(0px 0px 20px black)"}`
        }}
      />
    </div>
  )
}

export default Ai
