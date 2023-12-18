import React from 'react'
import { CellActions, CellDisplay, CellInfo } from '../logic/CellInfo'

const getButtonClass = (cellInfo: CellInfo): string => {
  let buttonClass = ''

  switch (cellInfo.display) {
    case CellDisplay.HIDDEN:
    case CellDisplay.FLAGGED:
      buttonClass = 'hidden'
      break
    case CellDisplay.REVEALED:
      buttonClass = 'revealed'
      break
    default:
      throw new Error(`Unhandled CellDisplay ${cellInfo.display}`)
  }

  return buttonClass
}

const getButtonText = (cellInfo: CellInfo): string => {
  let buttonText = ''

  switch (cellInfo.display) {
    case CellDisplay.HIDDEN:
      buttonText = ''
      break
    case CellDisplay.FLAGGED:
      buttonText = '\u{2691}'
      break
    case CellDisplay.REVEALED:
      if (cellInfo.hasMine) {
        buttonText = '\u{1F4A3}'
      } else if (cellInfo.numAdjMines > 0) {
        buttonText = cellInfo.numAdjMines.toString()
      } else {
        buttonText = ''
      }
      break
    default:
      throw new Error(`Unhandled CellDisplay ${cellInfo.display}`)
  }

  return buttonText
}

type CellProps = {
  cellInfo: CellInfo
  cellActions: CellActions
}

const Cell: React.FC<CellProps> = ({ cellInfo, cellActions }) => {
  const buttonClass = getButtonClass(cellInfo)
  const buttonText = getButtonText(cellInfo)

  return (
    <button
      className={`cell ${buttonClass}`}
      onClick={(event) => {
        cellActions.onReveal(cellInfo.coord)
      }}
      onDoubleClick={(event) => {
        cellActions.onMassReveal(cellInfo.coord)
      }}
      onContextMenu={(event) => {
        event.preventDefault()
        cellActions.onFlag(cellInfo.coord)
      }}
    >
      {buttonText}
    </button>
  )
}

export default Cell
