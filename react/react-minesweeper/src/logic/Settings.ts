export enum Difficulty {
  EASY,
  MEDIUM,
  HARD,
}

export interface Settings {
  numRows: number
  numCols: number
  numMines: number
}

export const getSettings = (difficulty: Difficulty): Settings => {
  switch (difficulty) {
    case Difficulty.EASY:
      return { numRows: 8, numCols: 8, numMines: 10 }
    case Difficulty.MEDIUM:
      return { numRows: 16, numCols: 16, numMines: 40 }
    case Difficulty.HARD:
      return { numRows: 16, numCols: 30, numMines: 99 }
    default:
      throw new Error(`Unhandled Difficulty ${difficulty}`)
  }
}
