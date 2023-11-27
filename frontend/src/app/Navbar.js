"use client"
import { useState } from "react"

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="bg-gray-800 text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <a href="/" className="hover:text-gray-300">
            Home
          </a>
        </div>
        <div className="flex items-center space-x-4 justify-center flex-1">
          <a href="/post" className="hover:text-gray-300">
            Post
          </a>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded p-1 text-black"
            />
            <button onClick={() => {}} className="absolute right-0 top-0 mt-1 mr-1"></button>
          </div>
        </div>
        <div className="flex items-center space-x-4 justify-end">
          <a href={isLoggedIn ? "/profile" : "/authentication"} className="hover:text-gray-300">
            {isLoggedIn ? "Profile" : "Login"}
          </a>
        </div>
      </div>
    </div>
  )
}

export default Navbar
