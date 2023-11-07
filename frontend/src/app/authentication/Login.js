"use client"

import { useState, useEffect } from "react"

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="mx-auto max-w-md p-6">
      <form className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="px-4 py-2 border border-gray-300 rounded-md"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2 border border-gray-300 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      <div>{userName}</div>
      <div>{password}</div>
      
    </div>
  )
}

export default Login
