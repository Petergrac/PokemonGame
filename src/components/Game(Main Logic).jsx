import "../styles/App.css";
import { useEffect, useState } from "react";
import ShuffleArray from "./Card";

const getPokemon = async (count = 12) => {
  const promises = [];
  for (let i = 1; i <= count; i++) {
    const rand = (i * 60) / 5; // Gen 1 range
    promises.push(
      fetch(`https://pokeapi.co/api/v2/pokemon/${rand}`).then((res) =>
        res.json()
      )
    );
  }
  const results = await Promise.all(promises);
  return results.map((p) => ({
    id: p.id,
    name: p.name,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`,
  }));
};

export default function Game() {
  const [cards, setCards] = useState([]);
  const [clicked, setClicked] = useState(new Set());
  const [score, setScore] = useState(0);
  const [bestscore, setBestScore] = useState(0);

  useEffect(() => {
    getPokemon(12).then(setCards);
  }, []);

  const handleClick = (id) => {
    // Logic to reset the game
    if (clicked.has(id)) {
      if (score > bestscore) {
        setBestScore(score);
      }
      setScore(0);
      setClicked(new Set());
    }
    // Logic to update the game
    else {
      setScore((prev) => prev + 1); // Increment Score
      setClicked((prev) => new Set(prev).add(id)); // Append the id to the state
      const shuffled = ShuffleArray(cards); // Shuffle the cards
      setCards(shuffled); // Update the state with new cards
    }
  };

  return (
    <div className=" bg-teal-600 dark:bg-gray-950 min-h-screen ">
      <header className="flex justify-between p-2 border-2 border-violet-700 dark:border-teal-500 rounded-2xl">
        <p className="hover:underline decoration-4 decoration-lime-400 dark:decoration-sky-400 text-amber-50 text-sm pt-2 text-center font-game md:pt-8 md:pl-8 md:pb-3 md:text-5xl">
          Pokemon Memory Game
        </p>
        <div className="flex flex-col text-sm text-white font-sans md:font-game md:text-3xl">
          <p>Score: {score}</p>
          <p>Best Score: {bestscore}</p>
        </div>
      </header>
      <main className="border-violet-800 dark:border-teal-500 rounded-2xl border-2">
        <section className="m-0 flex flex-wrap justify-center p-4">
          {cards.map((card) => (
            <div key={card.id} onClick={() => handleClick(card.id)}>
              <img
                className="w-20 md:w-53 border-rose-800 custom-fuchsia-shadow dark:border-green-500 border-2 rounded-2xl m-1 bg-blue-500/10 hover:bg-blue-500"
                src={card.image}
                alt={card.name}
              />
            </div>
          ))}
        </section>
      </main>
      <footer className="text-center text-white dark:text-gray-500 text-sm mt-1 md:mt-10">
        © {new Date().getFullYear()} Peter254. All rights reserved.
      </footer>
    </div>
  );
}
