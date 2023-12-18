import React from 'react'
import Cell from './Cell'
import { CellActions, CellInfo } from '../logic/CellInfo'
import { GameInfo, GameStatus } from '../logic/GameInfo'

type CellsProps = {
  gameInfo: GameInfo
  cellActions: CellActions
  hasFocus: boolean
}

const Cells: React.FC<CellsProps> = ({ gameInfo, cellActions, hasFocus }) => {
  if (!hasFocus && gameInfo.gameStatus === GameStatus.PLAYING) {
    return 'Paused'
  }

  return (
    <div className='cells'>
      {gameInfo.cellsInfo.map((cellRowInfo: CellInfo[]) => (
        <div className='cell-row' key={cellRowInfo[0].coord.rowNum}>
          {cellRowInfo.map((cellInfo: CellInfo) => (
            <Cell
              key={`${cellInfo.coord.rowNum}-${cellInfo.coord.colNum}`}
              cellInfo={cellInfo}
              cellActions={cellActions}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Cells
