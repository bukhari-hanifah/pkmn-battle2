export interface PokemonList {
    count: number
    next: string
    previous: any
    results: Result[]
  }

export interface pkmnWinner {
  name: string
  hp: number
  attack: number
  defense: number
  image: string
  audio: string
}
  
  export interface Result {
    winner: string
    audio: string
    message: string
  }
  