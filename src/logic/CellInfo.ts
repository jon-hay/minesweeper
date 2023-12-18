import { Settings } from './Settings'

export interface Coord {
  rowNum: number
  colNum: number
}

export enum CellDisplay {
  HIDDEN,
  FLAGGED,
  REVEALED,
}

export interface CellInfo {
  coord: Coord
  hasMine: boolean
  numAdjMines: number
  display: CellDisplay
}

export interface CellActions {
  onFlag(coord: Coord): void
  onReveal(coord: Coord): void
  onMassReveal(coord: Coord): void
}

export const getNeighbours = (coord: Coord, settings: Settings): Coord[] => {
  const r = coord.rowNum
  const c = coord.colNum

  return [
    { rowNum: r - 1, colNum: c - 1 },
    { rowNum: r - 1, colNum: c },
    { rowNum: r - 1, colNum: c + 1 },
    { rowNum: r, colNum: c - 1 },
    { rowNum: r, colNum: c + 1 },
    { rowNum: r + 1, colNum: c - 1 },
    { rowNum: r + 1, colNum: c },
    { rowNum: r + 1, colNum: c + 1 },
  ].filter((coord) => {
    return !(
      coord.rowNum < 0 ||
      coord.rowNum >= settings.numRows ||
      coord.colNum < 0 ||
      coord.colNum >= settings.numCols
    )
  })
}

export const getInitialCellsInfo = (settings: Settings): CellInfo[][] => {
  const cellsInfo: CellInfo[][] = []

  for (let rowNum = 0; rowNum < settings.numRows; ++rowNum) {
    const cellRowInfo: CellInfo[] = []

    for (let colNum = 0; colNum < settings.numCols; ++colNum) {
      cellRowInfo.push({
        coord: { rowNum: rowNum, colNum: colNum },
        hasMine: false,
        numAdjMines: 0,
        display: CellDisplay.HIDDEN,
      })
    }

    cellsInfo.push(cellRowInfo)
  }

  for (let mineNum = 0; mineNum < settings.numMines; ++mineNum) {
    while (true) {
      const mineRowNum = Math.floor(Math.random() * settings.numRows)
      const mineColNum = Math.floor(Math.random() * settings.numCols)

      if (cellsInfo[mineRowNum][mineColNum].hasMine === true) continue

      cellsInfo[mineRowNum][mineColNum].hasMine = true

      const neighbours = getNeighbours({ rowNum: mineRowNum, colNum: mineColNum }, settings)
      for (const neighbour of neighbours) {
        cellsInfo[neighbour.rowNum][neighbour.colNum].numAdjMines += 1
      }

      break
    }
  }

  return cellsInfo
}
