import { useState, useEffect } from "react";
import clsx from "clsx"
import { languages } from "./data";
import { getFarewellText, getRandomWord } from "./utils";
import Confetti from "react-confetti";
import SourceButton from "./SourceButton";

function App() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);

  const wrongGuesses = guessedLetters.filter(letter => !currentWord.includes(letter)).length
  
  const isGameWon = [...currentWord].every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuesses >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost
  const isLastGuessIncorrect = guessedLetters.length > 0 && !currentWord.includes(guessedLetters.at(-1))

  useEffect(() => {
    function handleKeypress(event) {
      if (new RegExp("^[A-z]{1}$").test(event.key)) {
        guessLetter(event.key)
      }
    }

    window.addEventListener("keyup", handleKeypress)

    return () => {
        window.removeEventListener('keyup', handleKeypress);
    };
  }, [guessLetter])

  function guessLetter(letter) {
    if (!guessedLetters.includes(letter) && !isGameOver) {
      setGuessedLetters((prev) => [...prev, letter]);
    }
  }

  function newGame() {
    setGuessedLetters([])
    setCurrentWord(getRandomWord())
  }

  const languageElements = languages.map((language, index) => (
    <span
      className={clsx("language", wrongGuesses > index && "dead")}
      key={language.name}
      style={{
        backgroundColor: language.backgroundColor,
        color: language.color,
      }}
    >
      {language.name}
    </span>
  ));

  const letterElements = [...currentWord].map((letter, index) => (
    <span className={clsx("letter", isGameLost && !guessedLetters.includes(letter) && "missed")} key={index}>
      {guessedLetters.includes(letter) || isGameLost ? letter.toUpperCase() : ""}
    </span>
  ));

  const keyboardElements = [
    ...new Array(26).keys().map((charCode) => {
      const letter = String.fromCharCode(charCode + 97);

      const isGuessed = guessedLetters.includes(letter);
      const isCorrect = isGuessed && currentWord.includes(letter)
      const isIncorrect = isGuessed && !currentWord.includes(letter)

      const classes = clsx("key", isCorrect && "correct", isIncorrect && "incorrect")

      return (
        <button
          className={classes}
          key={letter}
          onClick={() => guessLetter(letter)}
          disabled={isGameOver}
        >
          {letter}
        </button>
      );
    }),
  ];

  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={5000} />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word in under 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section className={clsx("status", {"won": isGameWon, "lost": isGameLost, "farewell": isLastGuessIncorrect && !isGameOver})}>
        {(() => {
          if (isGameOver) {
            if (isGameWon) {
              return (
              <>
                <h2>You win!</h2>
                <p>Well done! 🎉</p>
              </>
              )
            } else {
              return (
              <>
                <h2>Game over!</h2>
                <p>You lose! Better start learning Assembly 😭</p>
              </>
              )
            }
          } else if (isLastGuessIncorrect) {
            return <p>{getFarewellText(languages[wrongGuesses - 1].name)}</p>
          }
        })()}
      </section>
      <section className="languages">{languageElements}</section>
      <section className="letters">{letterElements}</section>
      <section className="keyboard">{keyboardElements}</section>
      {isGameOver && <button className="new-game" onClick={newGame}>New Game</button>}
      <SourceButton />
    </main>
  );
}

export default App;
