import React from 'react'

type ScoreboardTextProps = {
  text: string
}

const ScoreboardText: React.FC<ScoreboardTextProps> = ({ text }) => {
  return <div className='scoreboard-txt'>{text}</div>
}

export default ScoreboardText
