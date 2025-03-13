import React, { useRef, useEffect } from "react"
import { useAppStore } from "/frontend/store/store"

const ContextMenu = ({ options, cordinates, setContextMenu }) => {
  const contextMenuRef = useRef(null)
  const { userInfo } = useAppStore()

  const handleClick = (e, callBack) => {
    e.stopPropagation()
    callBack()
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        setContextMenu(false)
      }
    }

    document.addEventListener("click", handleClickOutside)

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const renderedOptions = options.map(({ name, callBack }) => {
    return (
      <li
        key={name}
        onClick={(e) => handleClick(e, callBack)}
        className="hover:bg-gray-700 pl-5 pr-10 py-2 cursor-pointer"
      >
        <span>{name}</span>
      </li>
    )
  })

  return (
    <div
      ref={contextMenuRef}
      style={{
        top: cordinates.y,
        left: cordinates.x,
      }}
      className="bg-gradient-to-br from-slate-100/80 to-white/90 dark:from-slate-900/95 dark:to-slate-800/95 backdrop-blur-lg border border-slate-200/70 dark:border-cyan-400/20 shadow-2xl fixed z-[1000] rounded-xl p-3 min-w-[240px] transition-all origin-top-right"
    >
      <div className="px-4 py-3  dark:border-cyan-400/10">
        <div className="text-sm font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
          {userInfo ? `👋 ${userInfo.name}` : "Connect ICP ID"}
        </div>
      </div>
    </div>
  )
}

export default ContextMenu
