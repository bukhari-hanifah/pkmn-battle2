import express, { Router } from "express";

const pokeRoutes  = express.Router();

pokeRoutes.get("/list", async (req, res) => {
    const jsonData = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const list = await jsonData.json();
    res.json(list);
});

pokeRoutes.get("/get", async (req, res) => {
    const pokemonName = req.query.name;
    const fetchJson = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const pokemonData = await fetchJson.json();
    res.json(pokemonData)
})

export default pokeRoutes;