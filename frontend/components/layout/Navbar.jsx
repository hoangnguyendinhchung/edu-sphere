import React, { useState } from "react"
import { ConnectButton, ConnectDialog, useConnect } from "@connect2ic/react"
import { useAppStore } from "/frontend/store/store"
import { Link, useNavigate } from "react-router-dom"
import { RxHamburgerMenu } from "react-icons/rx"
import ContextMenu from "../auth/ContextMenu"

const Navbar = () => {
  const { userInfo, setUserInfo } = useAppStore()
  const { isConnected } = useConnect({
    onDisconnect: () => {
      setUserInfo(null)
    },
  })
  const navigate = useNavigate()
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false)

  const contextMenuOptions = [
    {
      name: "About",
      callBack: () => {
        setIsContextMenuVisible(false)
      },
    },
    {
      name: "Help",
      callBack: () => {
        setIsContextMenuVisible(false)
      },
    },
  ]

  const authenticatedMenuOptions = [
    {
      name: "Dashboard",
      callBack: () => {
        setIsContextMenuVisible(false)
        navigate("/tutorials/incoming")
      },
    },
    {
      name: "New Tutorial",
      callBack: () => {
        setIsContextMenuVisible(false)
        navigate("/tutorials/new")
      },
    },
    {
      name: "Help ",
      callBack: () => {
        setIsContextMenuVisible(false)
      },
    },
  ]

  return (
    <nav>
      <div className="w-full h-24 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-zinc-950 dark:to-zinc-900 border-b border-slate-700">
        <div className="flex items-center justify-between h-full px-8">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                EduSphere
              </span>
            </Link>

            <div className="flex gap-8 ml-6">
              <Link
                to="/"
                className="text-slate-300 hover:text-cyan-400 transition-all font-medium relative 
            before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 
            before:bg-cyan-400 before:transition-all hover:before:w-full"
              >
                Home
              </Link>
              <Link
                to="/"
                className="text-slate-300 hover:text-cyan-400 transition-all font-medium relative 
            before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 
            before:bg-cyan-400 before:transition-all hover:before:w-full"
              >
                Courses
              </Link>
              <Link
                to="/"
                className="text-slate-300 hover:text-cyan-400 transition-all font-medium relative 
            before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 
            before:bg-cyan-400 before:transition-all hover:before:w-full"
              >
                Community
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <ConnectButton className="!bg-cyan-600 !hover:bg-cyan-500 !px-6 !py-3 !rounded-xl" />

            <div
              className="relative flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors"
              onClick={() => setIsContextMenuVisible(!isContextMenuVisible)}
            >
              <div className="relative">
                {userInfo?.avatar?.length > 0 ? (
                  <img
                    src={userInfo.avatar[0]}
                    alt="profile"
                    className="w-10 h-10 rounded-full border-2 border-cyan-400"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-cyan-600 rounded-full text-white font-bold">
                    {userInfo?.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center">
                  <RxHamburgerMenu className="text-slate-900 w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <ConnectDialog />

        {isContextMenuVisible && (
          <ContextMenu
            contextMenu={isContextMenuVisible}
            setContextMenu={setIsContextMenuVisible}
            cordinates={{ x: window.innerWidth - 280, y: 90 }}
            options={userInfo ? authenticatedMenuOptions : contextMenuOptions}
            className="!bg-slate-800 !border !border-slate-700 !rounded-xl !py-3 !shadow-xl"
          />
        )}
      </div>
    </nav>
  )
}

export default Navbar
