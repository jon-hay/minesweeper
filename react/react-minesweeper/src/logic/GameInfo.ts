import { CellInfo, getInitialCellsInfo } from './CellInfo'
import { Settings } from './Settings'

export enum GameStatus {
  UNSTARTED,
  PLAYING,
  LOSE,
  WIN,
}

export interface GameInfo {
  settings: Settings
  cellsInfo: CellInfo[][]
  gameStatus: GameStatus
  numCellsTotal: number
  numCellsRevealed: number
  numCellsFlagged: number
}

export const getInitialGameInfo = (settings: Settings): GameInfo => {
  return {
    settings: settings,
    cellsInfo: getInitialCellsInfo(settings),
    gameStatus: GameStatus.UNSTARTED,
    numCellsTotal: settings.numRows * settings.numCols,
    numCellsRevealed: 0,
    numCellsFlagged: 0,
  }
}

export const getNumCellsHidden = (gameInfo: GameInfo): number => {
  return gameInfo.numCellsTotal - gameInfo.numCellsFlagged - gameInfo.numCellsRevealed
}
