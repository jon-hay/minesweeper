import { useEffect, useState } from 'react'

const useTimer = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [elapsedMS, setElapsedMS] = useState(0)

  useEffect(() => {
    let interval: any = null

    const cleanupInterval = () => {
      if (interval !== null) {
        clearInterval(interval)
        interval = null
      }
    }

    if (isRunning) {
      setStartTime(Date.now() - elapsedMS)
      interval = setInterval(() => {
        setElapsedMS(Date.now() - startTime)
      }, 100)
    } else {
      cleanupInterval()
    }

    return cleanupInterval
  }, [isRunning, startTime, elapsedMS])

  const start = () => {
    setIsRunning(true)
  }

  const pause = () => {
    setIsRunning(false)
  }

  const reset = () => {
    setIsRunning(false)
    setElapsedMS(0)
  }

  return {
    isRunning: isRunning,
    elapsedMS: elapsedMS,
    start: start,
    pause: pause,
    reset: reset,
  }
}

export default useTimer
