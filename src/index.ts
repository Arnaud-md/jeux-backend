import express, { Request } from "express";
import 'dotenv/config';
import {Jeu, JeuOfficial, Recipe, User} from './seqconfig';
import bodyParser from "body-parser";
import { IntegerDataType } from "sequelize";
import cors from "cors";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Http2ServerRequest, Http2ServerResponse } from "http2";

const middleware = (req:any, res:any, next:any) => {
  console.log(req);
  let bearer = req.headers.authorization;
  if(bearer!==undefined) {
    bearer = bearer.replace("Bearer ","");
    const ok = jwt.verify(bearer, 'secret');
    if(ok) {
      next();
    }
    else {
      res.status(401).send("Vous n'avez pas l'autorisation");
    }
  }
  else {
    res.status(401).send("Il n'y a pas de token")
  }
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT ? parseInt(process.env.PORT as string) : 3030

interface IMaRequetBody {
    nom: string,
    image: string,
    duree: IntegerDataType,
    note: IntegerDataType
  }
  
  app.post("/api/auth/local/register", async(req, res) => {
    //const id = req.body.id;
    const email = req.body.email;

    const userEmail = await User.findOne({ where: {email:email}});
    console.log("userEmail : ",userEmail);
    if (userEmail===null) {
      const password = req.body.password;
      
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      const monUser = { email, password:hash };
      const newUser = await User.create(monUser);
      const newUserData = newUser.dataValues
      delete newUserData.password
      res.status(200).json(newUserData);
    }
    else {
      res.status(400).send("l'email que vous avez saisi est déjà utilisé");
    }
    
    console.log("userEmail : ",userEmail);
  })
  app.get("/api/users", async(req, res) => {
    const allUsers = await User.findAll();
    res.status(200).send(JSON.stringify(allUsers));
  })
  app.post("/api/auth/local", async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const userEmail = await User.findOne({ where: {email:email}});
    if (userEmail!==null) {
      const userEmailData = userEmail.dataValues;
      const match = await bcrypt.compare(password, userEmailData.password);
      if(!match) {
        res.status(400).send("le mot de passe n'est pas le bon");
      }
      else {
        const tokenJWT = jwt.sign({ data: 'foobar'}, 'secret', { expiresIn: '1h' });
        res.status(200).send(tokenJWT);
      }
    }
    else {
      res.status(400).send("l'email saisi n'est pas le bon");
    }
  })

  app.post("/api/free-games", (req, res) => {
    const nom = req.body.data.nom;
    const description = req.body.data.description;
    const image = req.body.data.image;
    const monJeu = { nom, description ,image }
    console.log(monJeu);
    Jeu.create(monJeu);
    res.json(monJeu);
  })

  app.get('/api/free-games', async(req, res) => {
    const allGames = await Jeu.findAll();
    res.status(200).send(JSON.stringify(allGames));
})

app.get('/api/free-games/:id', async(req, res) => {
  const id=req.params.id;
  const monJeu = await Jeu.findOne({
    where: {id: req.params.id }
  }
  );
  res.status(200).send(JSON.stringify(monJeu));
})

app.put('/api/free-games/:id', async(req, res) => {
  const id=req.params.id;
  const nom = req.body.data.nom;
  const description = req.body.data.description;
  const image = req.body.data.image;
  const monJeu = { nom, description ,image };
  Jeu.update(monJeu,{where: {id}});
  res.status(200).send(JSON.stringify(monJeu));
})

app.delete("/api/free-games/:id", async (req, res) => {
  await Jeu.destroy({
      where: {id: req.params.id }
  });

  res.send('ok');
})

app.post("/api/official-games", middleware, (req, res) => {
  const nom = req.body.data.nom;
  const description = req.body.data.description;
  const image = req.body.data.image;
  const prix = req.body.data.prix;
  const monJeu = { nom, description ,image, prix }
  console.log(monJeu);
  JeuOfficial.create(monJeu);
  res.json(monJeu);
})

app.get('/api/official-games', middleware, async(req, res) => {
  const allGames = await JeuOfficial.findAll();
  res.status(200).send(JSON.stringify(allGames));
})

app.get('/api/official-games/:id', middleware, async(req, res) => {
const id=req.params.id;
const monJeu = await JeuOfficial.findOne({
  where: {id: req.params.id }
}
);
res.status(200).send(JSON.stringify(monJeu));
})

app.put('/api/official-games/:id', middleware, async(req, res) => {
const id=req.params.id;
const nom = req.body.data.nom;
const description = req.body.data.description;
const image = req.body.data.image;
const prix = req.body.data.prix;
const monJeu = { nom, description ,image, prix };
JeuOfficial.update(monJeu,{where: {id}});
res.status(200).send(JSON.stringify(monJeu));
})

app.delete("/api/official-games/:id", middleware, async (req, res) => {
await JeuOfficial.destroy({
    where: {id: req.params.id }
});

res.send('ok');
})

  app.post("/send-recipe", (req, res) => {
    const nom = req.body.nom;
    const image = req.body.image;
    const duree = req.body.duree;
    const note = req.body.note;
    const maRecette = { nom, image ,duree, note }
    console.log(maRecette);
    Recipe.create(maRecette);
    res.json(maRecette);
  })

  app.delete("/delete-recipe/:id", async (req, res) => {
    await Recipe.destroy({
        where: {id: req.params.id }
    });

    res.send('ok');
  })

app.get('/random-between/:min/:max', (req, res) => {
    const min = parseInt(req.params.min)
    const max = parseInt(req.params.max)
    const random = Math.floor(Math.random() * (max - min + 1)) + min
    console.log('number' + random);
    res.send(random.toString())
})

app.post('/saveRecipe/:nom/:image/:duree/:note', (req, res) => {
    const nom = req.params.nom;
    const image = req.params.image;
    const duree = parseInt(req.params.duree);
    const note = parseInt(req.params.note);
    const myRecipe = {
        nom: nom,
        image : image,
        duree : duree,
        note : note
    };
    Recipe.create(myRecipe);
    res.send(myRecipe);
})

app.get('/findAll', async(req, res) => {
    const allRecipes = await Recipe.findAll();
    res.status(200).send(JSON.stringify(allRecipes));
})

app.listen(port, () => {
    console.log('serveur running on port : ' + port);
})