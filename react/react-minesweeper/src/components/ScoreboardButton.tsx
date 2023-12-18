import React from 'react'
import { Difficulty } from '../logic/Settings'

type ScoreboardButtonProps = {
  newGame(difficulty: Difficulty): void
  difficulty: Difficulty
  text: string
}

const ScoreboardButton: React.FC<ScoreboardButtonProps> = ({ newGame, difficulty, text }) => {
  return (
    <button
      className='scoreboard-btn'
      onClick={(event) => {
        newGame(difficulty)
      }}
    >
      {text}
    </button>
  )
}

export default ScoreboardButton
