import React from "react";
import { useEffect, useState } from "react";
import { Pokemon } from "./interfaces/Pokemon";
import { pkmnWinner, PokemonList, Result } from "./interfaces/PokemonList";
import axios from "axios";
import Logo from "./assets/pkmnLogo.png"
import "./App.css"


const PokeReact = () => {
  const backApi = "http://localhost:3000/"
  const [pokemonName1, setPokemonName1] = useState<string>("");
  const [pokemonName2, setPokemonName2] = useState<string>("");
  const [pokemon1Data, setPokemon1Data] = useState<Pokemon | null>(null);
  const [pokemon2Data, setPokemon2Data] = useState<Pokemon | null>(null);
  const [pokemonList, setPokemonList] = useState<PokemonList | null>(null);
  const [Duelres, setDuelres] = useState<Result | null>(null)
  const [noPkmn, setNopkmn] = useState<boolean>(true)
  const [hasFightResults, setHasFightResults] = useState<boolean>(false);

  useEffect(()=> {
    listPokemon();
  }, [])

  const listPokemon = async () => {
    const fetchlist = await axios(`${backApi}list`);
    setPokemonList(fetchlist.data);
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let name1 = pokemonName1;
    let name2 = pokemonName2;   
    if (!pokemonName1 || !pokemonName2) {
      if (!pokemonName1) name1 = Math.floor(Math.random() * (200)).toString() 
      if (!pokemonName2) name2 = Math.floor(Math.random() * (200)).toString()
    }
    setPokemonName1(name1);
    setPokemonName2(name2);
    
    try {     
      const response = await axios.post(`${backApi}battle`, {
        pokemon1name: name1,
        pokemon2name: name2,
      });
      setPokemon1Data(response.data.pokeData1);
      setPokemon2Data(response.data.pokeData2);
      setNopkmn(false)
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const handleFight = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!pokemon1Data || !pokemon2Data) return; 

    const pkmn1Stats: pkmnWinner = {
      name: pokemon1Data.name,
      hp: pokemon1Data.stats?.find((s)=>s.stat.name==="hp")?.base_stat || 0,
      attack: pokemon1Data.stats?.find((s)=>s.stat.name==="attack")?.base_stat || 0,
      defense: pokemon1Data.stats?.find((s)=>s.stat.name==="defense")?.base_stat || 0,
      image: pokemon1Data.sprites.other.showdown.front_default,
      audio: pokemon1Data.cries.latest
    }
    const pkmn2Stats: pkmnWinner = {
      name: pokemon2Data.name,
      hp: pokemon2Data.stats?.find((s)=>s.stat.name==="hp")?.base_stat || 0,
      attack: pokemon2Data.stats?.find((s)=>s.stat.name==="attack")?.base_stat || 0,
      defense: pokemon2Data.stats?.find((s)=>s.stat.name==="defense")?.base_stat || 0,
      image: pokemon2Data.sprites.other.showdown.front_default,
      audio: pokemon2Data.cries.latest
    }
    try {
      const response = await axios.post(`${backApi}battle/judge`, {
        pokemon1Stats: pkmn1Stats,
        pokemon2Stats: pkmn2Stats,
      });
      setDuelres(response.data);
      setHasFightResults(true)
  } catch (error) {
      console.error('Error sending data:', error);
  }
}

  return (
    <div className="containers">
    <div className="pkmn_input">
      <div className="logoContainer"><img src={Logo} className="pkmnLogo"/></div>
      <div className="pkmnblock">
        <div className="pkmnChoose">
          <form onSubmit={handleSubmit}>   
            <input type="" placeholder="Pokemon" value={pokemonName1} onChange={(e)=>setPokemonName1(e.target.value)}/>
            <button type="submit" className='btn'>{pokemonName1 && pokemonName2 ? 'Submit' : 'Random'}</button>
            <input type="" placeholder="Pokemon" value={pokemonName2} onChange={(e)=>setPokemonName2(e.target.value)}/>
          </form>
        </div>
        <hr/>
        
        { !noPkmn && 
          <div className='pkmn'>
          {pokemon1Data && 
            <div className='pkmnCard'>
              <p><strong>{pokemon1Data.name}</strong></p>
              <div className="imgContainer">
                <img src={pokemon1Data.sprites.other.showdown.front_default} className='pkmImg'/>
              </div>
              <p >HP: <strong>{pokemon1Data.stats?.find((s)=>s.stat.name==="hp")?.base_stat || 0}</strong></p>
              <p>Attack: <strong>{pokemon1Data.stats?.find((s)=>s.stat.name==="attack")?.base_stat || 0}</strong></p>
              <p>Defense: <strong>{pokemon1Data.stats?.find((s)=>s.stat.name==="defense")?.base_stat || 0}</strong></p>
            </div>
          }
          <div className="versus">
          <iframe src="https://giphy.com/embed/PmuFamTK9If78OnJiL" width="400" height="400" allowFullScreen scrolling="no"></iframe>
          </div>
          {pokemon2Data && 
            <div className='pkmnCard'>
              <p><strong>{pokemon2Data.name}</strong></p>
              <div className="imgContainer">
                <img src={pokemon2Data.sprites.other.showdown.front_default} className='pkmImg'/>
              </div>
              <p>HP: <strong>{pokemon2Data.stats?.find((s)=>s.stat.name==="hp")?.base_stat || 0}</strong></p>
              <p>Attack: <strong>{pokemon2Data.stats?.find((s)=>s.stat.name==="attack")?.base_stat || 0}</strong></p>
              <p>Defense: <strong>{pokemon2Data.stats?.find((s)=>s.stat.name==="defense")?.base_stat || 0}</strong></p>
            </div>
          }
        </div>
        }
      </div>

      {!noPkmn && (
          <form onSubmit={handleFight}>
            <input type="hidden" value={pokemon1Data ? pokemonName1 : ''} name="hiddenPokemon1" />
            <input type="hidden" value={pokemon1Data ? pokemonName2 : ''} name="hiddenPokemon2" />
            <button type="submit" className='btn'>FIGHT!</button>
          </form>
        )}

        {Duelres && hasFightResults && <div className="overlay" onClick={() => setHasFightResults(false)}>
          <div className='results'>
            <img src={Duelres.winner}/>
            <h3>{Duelres.message} </h3>
          </div>
        </div>}
    </div>
    </div>
  )
}

export default PokeReact;