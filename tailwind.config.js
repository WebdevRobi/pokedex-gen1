export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        poke: {
          red: '#EE1515',
          darkRed: '#CC0000',
          blue: '#3B4CCA',
          yellow: '#FFDE00',
          gold: '#B3A125',
        },
        type: {
          normal: '#A8A878',
          fire: '#F08030',
          water: '#6890F0',
          grass: '#78C850',
          electric: '#F8D030',
          ice: '#98D8D8',
          fighting: '#C03028',
          poison: '#A040A0',
          ground: '#E0C068',
          flying: '#A890F0',
          psychic: '#F85888',
          bug: '#A8B820',
          rock: '#B8A038',
          ghost: '#705898',
          dragon: '#7038F8',
          steel: '#B8B8D0',
          fairy: '#EE99AC',
        }
      },
    },
  },
  plugins: [],
}

