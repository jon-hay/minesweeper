import React, { useEffect, useState } from 'react'
import Cells from './Cells'
import Scoreboard from './Scoreboard'
import useWindowFocus from '../hooks/WindowFocus'
import { CellDisplay, CellInfo, Coord, getNeighbours } from '../logic/CellInfo'
import { GameStatus, getInitialGameInfo } from '../logic/GameInfo'
import { Difficulty, getSettings } from '../logic/Settings'

const Game = () => {
  const [forceUpd, setForceUpd] = useState(false)
  const [difficulty, setDifficulty] = useState(Difficulty.EASY)
  const [gameInfo, setGameInfo] = useState(() => getInitialGameInfo(getSettings(difficulty)))
  const hasFocus = useWindowFocus()

  useEffect(() => {
    setGameInfo(getInitialGameInfo(getSettings(difficulty)))
  }, [forceUpd, difficulty])

  const hasWon = (processed: number) => {
    return (
      gameInfo.numCellsTotal - gameInfo.numCellsRevealed - processed === gameInfo.settings.numMines
    )
  }

  const floodFill = (processing: CellInfo[], processed: Set<string>) => {
    while (processing.length > 0) {
      const cellInfo = processing.pop()
      if (cellInfo === undefined) break

      processed.add(`${cellInfo.coord.rowNum}-${cellInfo.coord.colNum}`)

      if (cellInfo.numAdjMines === 0) {
        const neighbours = getNeighbours(cellInfo.coord, gameInfo.settings)
        for (const neighbour of neighbours) {
          if (processed.has(`${neighbour.rowNum}-${neighbour.colNum}`)) continue

          const neighbourInfo = gameInfo.cellsInfo[neighbour.rowNum][neighbour.colNum]
          if (neighbourInfo.display !== CellDisplay.HIDDEN) continue

          processing.push(gameInfo.cellsInfo[neighbour.rowNum][neighbour.colNum])
        }
      }
    }
  }

  const onFlag = (coord: Coord): void => {
    if (![GameStatus.UNSTARTED, GameStatus.PLAYING].includes(gameInfo.gameStatus)) return

    const cellInfo = gameInfo.cellsInfo[coord.rowNum][coord.colNum]
    switch (cellInfo.display) {
      case CellDisplay.HIDDEN:
        setGameInfo({
          ...gameInfo,
          numCellsFlagged: gameInfo.numCellsFlagged + 1,
          cellsInfo: gameInfo.cellsInfo.map((r) =>
            r.map((c) => {
              return c.coord.rowNum !== cellInfo.coord.rowNum ||
                c.coord.colNum !== cellInfo.coord.colNum
                ? c
                : {
                    ...c,
                    display: CellDisplay.FLAGGED,
                  }
            }),
          ),
        })
        break
      case CellDisplay.FLAGGED:
        setGameInfo({
          ...gameInfo,
          numCellsFlagged: gameInfo.numCellsFlagged - 1,
          cellsInfo: gameInfo.cellsInfo.map((r) =>
            r.map((c) => {
              return c.coord.rowNum !== cellInfo.coord.rowNum ||
                c.coord.colNum !== cellInfo.coord.colNum
                ? c
                : {
                    ...c,
                    display: CellDisplay.HIDDEN,
                  }
            }),
          ),
        })
        break
      case CellDisplay.REVEALED:
        break
      default:
        throw new Error(`Unhandled CellDisplay ${cellInfo.display}`)
    }
  }

  const onReveal = (coord: Coord): void => {
    if (![GameStatus.UNSTARTED, GameStatus.PLAYING].includes(gameInfo.gameStatus)) return

    const cellInfo = gameInfo.cellsInfo[coord.rowNum][coord.colNum]
    if (cellInfo.display === CellDisplay.REVEALED) return

    if (cellInfo.hasMine) {
      setGameInfo({
        ...gameInfo,
        gameStatus: GameStatus.LOSE,
        numCellsRevealed: gameInfo.numCellsRevealed + 1,
        cellsInfo: gameInfo.cellsInfo.map((r) =>
          r.map((c) => {
            return !c.hasMine &&
              (c.coord.rowNum !== cellInfo.coord.rowNum || c.coord.colNum !== cellInfo.coord.colNum)
              ? c
              : {
                  ...c,
                  display: CellDisplay.REVEALED,
                }
          }),
        ),
      })
    } else {
      let processing = [cellInfo]
      let processed: Set<string> = new Set()
      floodFill(processing, processed)

      setGameInfo({
        ...gameInfo,
        gameStatus: hasWon(processed.size) ? GameStatus.WIN : GameStatus.PLAYING,
        numCellsRevealed: gameInfo.numCellsRevealed + processed.size,
        cellsInfo: gameInfo.cellsInfo.map((r) =>
          r.map((c) => {
            return !processed.has(`${c.coord.rowNum}-${c.coord.colNum}`)
              ? c
              : {
                  ...c,
                  display: CellDisplay.REVEALED,
                }
          }),
        ),
      })
    }
  }

  const onMassReveal = (coord: Coord): void => {
    if (![GameStatus.UNSTARTED, GameStatus.PLAYING].includes(gameInfo.gameStatus)) return

    const cellInfo = gameInfo.cellsInfo[coord.rowNum][coord.colNum]
    if (cellInfo.display !== CellDisplay.REVEALED) return

    let hasMines = false
    let numNeighboursFlagged = 0
    let processing = []
    let processed: Set<string> = new Set()

    const neighbours = getNeighbours(coord, gameInfo.settings)
    for (const neighbour of neighbours) {
      const neighbourInfo = gameInfo.cellsInfo[neighbour.rowNum][neighbour.colNum]
      switch (neighbourInfo.display) {
        case CellDisplay.HIDDEN:
          hasMines = hasMines || neighbourInfo.hasMine
          if (neighbourInfo.hasMine) {
            processed.add(`${neighbour.rowNum}-${neighbour.colNum}`)
          } else {
            processing.push(neighbourInfo)
          }
          break
        case CellDisplay.FLAGGED:
          numNeighboursFlagged += 1
          break
        case CellDisplay.REVEALED:
          break
        default:
          throw new Error(`Unhandled CellDisplay ${cellInfo.display}`)
      }
    }

    if (numNeighboursFlagged !== cellInfo.numAdjMines) return

    floodFill(processing, processed)

    setGameInfo({
      ...gameInfo,
      gameStatus: hasMines
        ? GameStatus.LOSE
        : hasWon(processed.size)
        ? GameStatus.WIN
        : GameStatus.PLAYING,
      numCellsRevealed: gameInfo.numCellsRevealed + processed.size,
      cellsInfo: gameInfo.cellsInfo.map((r) =>
        r.map((c) => {
          return !(hasMines && c.hasMine) && !processed.has(`${c.coord.rowNum}-${c.coord.colNum}`)
            ? c
            : {
                ...c,
                display: CellDisplay.REVEALED,
              }
        }),
      ),
    })
  }

  const newGame = (newDifficulty: Difficulty): void => {
    if (newDifficulty === difficulty) {
      setForceUpd(!forceUpd)
    } else {
      setDifficulty(newDifficulty)
    }
  }

  const cellActions = {
    onFlag: onFlag,
    onReveal: onReveal,
    onMassReveal: onMassReveal,
  }

  return (
    <div className='game'>
      <Scoreboard gameInfo={gameInfo} newGame={newGame} hasFocus={hasFocus} />
      <Cells gameInfo={gameInfo} cellActions={cellActions} hasFocus={hasFocus} />
    </div>
  )
}

export default Game
