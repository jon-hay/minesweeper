import { useEffect, useState } from 'react'

const useWindowFocus = () => {
  const [hasFocus, setHasFocus] = useState(true)

  useEffect(() => {
    const handleFocus = () => {
      setHasFocus(true)
    }

    const handleBlur = () => {
      setHasFocus(false)
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  return hasFocus
}

export default useWindowFocus
