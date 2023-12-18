import React from 'react'
import { GameInfo, getNumCellsHidden } from '../logic/GameInfo'
import { Difficulty } from '../logic/Settings'
import ScoreboardButton from './ScoreboardButton'
import ScoreboardText from './ScoreboardText'
import ScoreboardTimer from './ScoreboardTimer'

type ScoreboardProps = {
  gameInfo: GameInfo
  newGame(difficulty: Difficulty): void
  hasFocus: boolean
}

const Scoreboard: React.FC<ScoreboardProps> = ({ gameInfo, newGame, hasFocus }) => {
  return (
    <div className='scoreboard'>
      <div className='scoreboard-left'>
        <ScoreboardText
          text={`Mines: ${gameInfo.numCellsFlagged} / ${gameInfo.settings.numMines}`}
        />
        <ScoreboardText
          text={`Cells: ${getNumCellsHidden(gameInfo)} / ${gameInfo.numCellsTotal}`}
        />
        <ScoreboardTimer gameInfo={gameInfo} hasFocus={hasFocus} />
      </div>
      <div className='scoreboard-right'>
        <ScoreboardButton newGame={newGame} difficulty={Difficulty.EASY} text='Easy' />
        <ScoreboardButton newGame={newGame} difficulty={Difficulty.MEDIUM} text='Medium' />
        <ScoreboardButton newGame={newGame} difficulty={Difficulty.HARD} text='Hard' />
      </div>
    </div>
  )
}

export default Scoreboard
