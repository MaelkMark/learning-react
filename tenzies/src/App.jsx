import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import Confetti from "react-confetti"

import Die from './Die'
import SourceButton from './components/SourceButton'

export default function App() {
  const [dice, setDice] = useState(() => allNewDice()) // Storing dice in state
  const [rolls, setRolls] = useState(0) // Total rolls from start of game
  const [timer, setTimer] = useState("00:00") // Timer from start of game

  const gameWon = dice.every(die => die.held && die.value === dice[0].value) // Did the player win the game

  // Timer logic
  useEffect(() => {
    let timerInterval
    
    if (!gameWon) {
      let timerStart = new Date()

      timerInterval = setInterval(() => {
        const delta = (new Date() - timerStart) / 1000
        const minutes = Math.floor(delta / 60)
        const seconds = Math.floor(delta % 60)

        setTimer(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`)
      }, 1000)
    }

    return () => {
      console.log("Clearing interval", timerInterval)
      clearInterval(timerInterval)
    }
  }, [gameWon])

  // Generating new dice
  function allNewDice() {
    return Array(10).fill().map(() => ({value: Math.ceil(Math.random() * 6), held: false, id: nanoid()}))
  }

  // Holding dice
  function hold(id) {
    if (!gameWon) {
      setDice(prev => prev.map(die => die.id === id ? {...die, held: !die.held} : die))
    }
  }

  // Rolling all dice or (if the player won) resetting the game
  function roll() {
    if (!gameWon) {
      setDice(prev => prev.map(die => !die.held ? {...die, value: Math.ceil(Math.random() * 6)} : die))
      setRolls(prev => prev + 1)
    } else {
      setDice(allNewDice())
      setRolls(0)
      setTimer("00:00")
    }
  }

  const diceComponents = dice.map(die => <Die value={die.value} held={die.held} key={die.id} hold={() => hold(die.id)} />)

  return (
    <>
      <main>
        { gameWon && <Confetti /> }
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="stats">
          <div className="timer">{timer}</div>
          <div className="rolls">Rolls: {rolls}</div>
        </div>
        <div className="dice-container">
          { diceComponents }
        </div>
        <button className="roll-button" onClick={roll}>{ gameWon ? "New game" : "Roll"}</button>
      </main>
      <SourceButton />
    </>
  )
}