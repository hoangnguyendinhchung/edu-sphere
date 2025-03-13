import React from "react"
import { useNavigate } from "react-router-dom"
import { useConnect } from "@connect2ic/react"
import AuthModal from "../components/auth/AuthModal"
import Approved from "./tutorials/approved"

const Home = () => {
  const navigate = useNavigate()
  const { isConnected } = useConnect()

  return (
    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-200">
          Unlock Your Learning Potential
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-100">
          Explore courses, share knowledge, and connect with a global community
          of learners and educators. All in one place.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#"
            className="rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Get Started
          </a>
        </div>
      </div>

      <section className="mt-16">
        <Approved />
      </section>

      {isConnected && <AuthModal />}
    </div>
  )
}

export { Home }
