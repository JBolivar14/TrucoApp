import { useState, useRef, useEffect } from 'react'
import './Tooltip.css'

/**
 * Componente Tooltip reutilizable
 * @param {ReactNode} children - Elemento sobre el cual mostrar el tooltip
 * @param {string} text - Texto del tooltip
 * @param {string} position - Posición del tooltip: 'top', 'bottom', 'left', 'right'
 */
export function Tooltip({ children, text, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false)
  const tooltipRef = useRef(null)

  useEffect(() => {
    const handleResize = () => setIsVisible(false)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!text) return children

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`tooltip tooltip-${position}`}
          role="tooltip"
        >
          {text}
        </div>
      )}
    </div>
  )
}
