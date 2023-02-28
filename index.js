const isLetter = (letter) => {
  return /^[a-zA-Z]$/.test(letter);
};

const getWordOfTheDay = async () => {
  const response = await fetch("https://words.dev-apis.com/word-of-the-day", {
    headers: {
      Accept: "application/json",
    },
  });
  const res = await response.json();
  return res.word;
};

const isWord = async (guess) => {
  const response = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({ word: guess }),
  });
  const validation = await response.json();
  return validation.validWord;
};

const init = async () => {
  let gameOver = false;
  const wordOfTheDay = await getWordOfTheDay();

  const letters = document.getElementsByClassName("letter");
  const words = document.getElementsByClassName("word");

  Array.from(letters).forEach((letter) => {
    letter.addEventListener("input", (event) => {
      if (!isLetter(event.target.value)) {
        event.target.value = "";
        event.preventDefault();
      } else {
        letter.nextElementSibling && letter.nextElementSibling.focus();
      }
    });

    letter.addEventListener("keydown", (event) => {
      if (
        (event.keyCode === 8 || event.keyCode === 46) &&
        letter.value.length === 0 &&
        letter.previousElementSibling
      ) {
        letter.previousElementSibling.value = "";
        letter.previousElementSibling.focus();
      }
    });
  });

  Array.from(words).forEach((word) => {
    word.addEventListener("keydown", async (event) => {
      if (event.keyCode === 13 && !gameOver) {
        let characters = Array.from(word.elements);
        characters = characters.map((char) => char.value.toLowerCase());
        let guess = characters.join("");

        if (guess.length !== 5) {
          return alert("Word needs to be five letters");
        }

        const isValidWord = await isWord(guess);

        if (!isValidWord) {
          return alert("Not in word list");
        }

        if (guess === wordOfTheDay) {
          const letterInputs = Array.from(word.elements);
          letterInputs.forEach((letterInput) => {
            letterInput.classList.add("correct");
          });
          const allLetterInputs = Array.from(letters);
          allLetterInputs.forEach((letterInput) => {
            letterInput.setAttribute("readonly", true);
          });
          gameOver = true;
          return alert("You win!");
        } else {
          const letterInputs = Array.from(word.elements);
          letterInputs.forEach((letterInput, index) => {
            const letter = letterInput.value;
            letterInput.setAttribute("readonly", true);
            alert(letter);
            if (letter === wordOfTheDay[index]) {
              alert(`wordOfTheDay: ${wordOfTheDay[index]}`);
              letterInput.classList.add("correct");
            } else if (wordOfTheDay.includes(letter)) {
              letterInput.classList.add("wrong-position");
            }
          });
          if (word.nextElementSibling) {
            word.nextElementSibling.elements[0].focus();
          } else {
            gameOver = true;
            alert("You lose!");
          }
        }
      }
    });
  });
};

init();
