"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

function LoginPage() {
  const router = useRouter();
  const [buttonDisable, setButtonDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onLogin = async (e) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      alert("Please fill all fields!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`/api/users/login`, user);
      console.log("User logged in:", data);
      alert("Login successful!");
      router.push("/"); // Redirect to dashboard or desired page
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisable(!(user.email && user.password.length >= 8));
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">{loading ? "Processing..." : "Login"}</h1>
      <hr />
      <form onSubmit={onLogin} className="flex flex-col w-80">
        <label htmlFor="email">Email</label>
        <input
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
          type="email"
          id="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
          autoComplete="off"
        />
        <label htmlFor="password">Password</label>
        <input
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
          type="password"
          id="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Password"
          autoComplete="off"
        />
        <button
          type="submit"
          className={`p-2 rounded-lg w-full ${
            buttonDisable || loading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"
          }`}
          disabled={buttonDisable || loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <hr />
      <Link href="/forgot-password" className="text-blue-500 mt-2">
        Forgot password?
      </Link>
      <Link href="/signup" className="text-blue-500 mt-2">
        Don't have an account? Sign Up
      </Link>
    </div>
  );
}

export default LoginPage;