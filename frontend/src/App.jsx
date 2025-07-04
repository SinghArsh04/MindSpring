
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

 
import Navbar from "./components/common/Navbar"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      </div>
      hello
    </>
  )
}

export default App
