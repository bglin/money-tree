import { useState, useRef } from 'react';

interface iState {
  start:number,
  duration: number
}

const useTimer = (initialState: iState) => {
  const [timer, setTimer] = useState(initialState.start)
  const [duration] = useState(initialState.duration)
  const [isActive, setIsActive] = useState(false)
  // const [isPaused, setIsPaused] = useState(false)
  const countRef = useRef<any>(null)


  const handleStart = () => {
    setIsActive(true)
    // setIsPaused(true)
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1)
    }, 1000)
  }

  // const handlePause = () => {
  //   clearInterval(countRef.current)
  //   setIsPaused(false)
  // }

  const handleResume = () => {
    // setIsPaused(true)
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1)
    }, 1000)
  }

  const handleReset = () => {
    clearInterval(countRef.current)
    setIsActive(false)
    // setIsPaused(false)
    setTimer(0)
  }
const handleStop = () => {
  console.log("bye")
  setTimeout(() => {
    clearInterval(countRef.current)
    setIsActive(false)
    // setIsPaused(false)
    setTimer(0)
    console.log('forever')
  },duration)
}
  return { timer, isActive, handleStart, handleResume, handleReset, handleStop }
}

export default useTimer;
