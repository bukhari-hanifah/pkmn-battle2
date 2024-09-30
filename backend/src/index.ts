import express, { Request, Response } from 'express';
import pokeRoutes from './pokemon';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
const pokeApi = 'https://pokeapi.co/api/v2/';
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('<button>Hello, TypeScript Express!</button>');
});

app.get("/list", async (req, res) => {
  const jsonData = await fetch('https://pokeapi.co/api/v2/pokemon?limit=200');
  const list = await jsonData.json();
  const listN = list.name;
  res.json(listN);
});

app.post('/battle', async(req, res) => {
  const { pokemon1name, pokemon2name } = req.body;
  const res1 = await fetch(`${pokeApi}pokemon/${pokemon1name}`);
  const P1 = await res1.json();
  const res2 = await fetch(`${pokeApi}pokemon/${pokemon2name}`);
  const P2 = await res2.json();
  console.log('Received value:', pokemon1name, pokemon2name);
  res.json({ message: 'Data received successfully!', pokeData1: P1, pokeData2: P2 });
});

app.post('/battle/judge', async(req, res) => {
    const { pokemon1Stats, pokemon2Stats } = req.body;
    console.log('Players: ', pokemon1Stats, pokemon2Stats);
    let pokemon1Life: number = pokemon1Stats.hp + pokemon1Stats.defense - pokemon2Stats.attack;
    let pokemon2Life: number = pokemon2Stats.hp + pokemon2Stats.defense - pokemon1Stats.attack;

    if(pokemon1Life>0 && pokemon2Life>0){
        pokemon1Life -=pokemon2Stats.attack;
        pokemon2Life -=pokemon1Stats.attack;
    }

    let results = ""
    let pImage = ""
    let pCry = ""

    if(pokemon1Life<=0 || pokemon2Life<=0){
        if(pokemon1Life<=0 && pokemon2Life<=0){
            results = "draw".toUpperCase()
            pImage = ""
        }    
        else if(pokemon2Life>0){
            pImage = pokemon2Stats.image
            pCry = pokemon2Stats.audio
            results = `${pokemon2Stats.name} WINS`.toUpperCase()
        }    
        else if(pokemon1Life>0){
            pImage = pokemon1Stats.image
            pCry = pokemon1Stats.audio
            results = `${pokemon1Stats.name} WINS`.toUpperCase()
        }
    }
    console.log(results, pImage)
    res.json({ message: results, winner: pImage });
  });


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});