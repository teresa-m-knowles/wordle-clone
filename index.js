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
  const wordOfTheDay = await getWordOfTheDay();

  const letters = document.getElementsByClassName("letter");
  const words = document.getElementsByClassName("word");

  Array.from(letters).forEach((letter) => {
    letter.addEventListener("keyup", (event) => {
      if (letter.value.length === 1 && event.keyCode !== 13) {
        if (!isLetter(event.key)) {
          letter.value = "";
          event.preventDefault();
        } else letter.nextElementSibling && letter.nextElementSibling.focus();
      } else if (
        event.keyCode === 8 &&
        letter.value.length === 0 &&
        letter.previousElementSibling
      ) {
        letter.previousElementSibling.value = "";
        letter.previousElementSibling.focus();
      }
    });
  });

  Array.from(words).forEach((word) => {
    word.addEventListener("keyup", async (event) => {
      if (event.keyCode === 13) {
        let characters = Array.from(word.elements);
        characters = characters.map((char) => char.value.toLowerCase());
        let guess = characters.join("");
        if (guess.length === 5) {
        }
        const correct = await isWord(guess);

        if (correct && guess === wordOfTheDay) {
          const letterInputs = Array.from(word.elements);
          letterInputs.forEach((letterInput) => {
            letterInput.classList.add("correct");
          });
          const allLetterInputs = Array.from(letters);
          allLetterInputs.forEach((letterInput) => {
            letterInput.setAttribute("readonly", true);
          });
        } else if (!correct) {
          alert("not a word");
        } else {
          const letterInputs = Array.from(word.elements);
          letterInputs.forEach((letterInput, index) => {
            const letter = letterInput.value;
            letterInput.setAttribute("readonly", true);
            if (letter === wordOfTheDay[index]) {
              letterInput.classList.add("correct");
            } else if (wordOfTheDay.includes(letter)) {
              letterInput.classList.add("wrong-position");
            }
          });
          word.nextElementSibling.elements[0].focus();
        }
      }
    });
  });
};

init();
