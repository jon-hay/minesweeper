import React, { useState } from 'react'
import useTimer from '../hooks/Timer'
import { GameInfo, GameStatus } from '../logic/GameInfo'
import ScoreboardText from './ScoreboardText'

type ScoreboardTimerProps = {
  gameInfo: GameInfo
  hasFocus: boolean
}

const ScoreboardTimer: React.FC<ScoreboardTimerProps> = ({ gameInfo, hasFocus }) => {
  const timer = useTimer()

  const [prevGameStatus, setPrevGameStatus] = useState(gameInfo.gameStatus)
  if (prevGameStatus !== gameInfo.gameStatus) {
    setPrevGameStatus(gameInfo.gameStatus)

    switch (gameInfo.gameStatus) {
      case GameStatus.UNSTARTED:
        timer.reset()
        break
      case GameStatus.PLAYING:
        timer.start()
        break
      case GameStatus.LOSE:
        timer.pause()
        break
      case GameStatus.WIN:
        timer.pause()
        break
      default:
        throw new Error(`Unhandled GameStatus ${gameInfo.gameStatus}`)
    }
  }

  const [prevHasFocus, setPrevHasFocus] = useState(hasFocus)
  if (prevHasFocus !== hasFocus) {
    setPrevHasFocus(hasFocus)

    if (gameInfo.gameStatus === GameStatus.PLAYING) {
      if (hasFocus) timer.start()
      else timer.pause()
    }
  }

  const elapsedS = Math.floor(timer.elapsedMS / 1000)
  let gameStatus = ''
  switch (gameInfo.gameStatus) {
    case GameStatus.UNSTARTED:
      gameStatus = ''
      break
    case GameStatus.PLAYING:
      gameStatus = `${elapsedS}`
      break
    case GameStatus.LOSE:
      gameStatus = `${elapsedS} [You Lose!]`
      break
    case GameStatus.WIN:
      gameStatus = `${elapsedS} [You Win!]`
      break
    default:
      throw new Error(`Unhandled GameStatus ${gameInfo.gameStatus}`)
  }

  return <ScoreboardText text={gameStatus} />
}

export default ScoreboardTimer
