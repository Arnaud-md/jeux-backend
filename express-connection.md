# La même mais avec Express

## Objectif

Créer une API avec Express qui fonctionne de manière proche de l'API Strapi.
Améliorer certains points de l'API Strapi.

## Prérequis

- Créer une API sans authentification avec Express + Sequelize pour les jeux gratuits et payants

## Comment ajouter une authentification ?

### Créer un model utilisateur

Créez un model `User` avec les champs suivants :
- id
- email
- password

### Créer une route de registration

Au moment de l'enregistrement d'un utilisateur, vous devez vérifier que l'email n'est pas déjà utilisé.
Si l'email est déjà utilisé, vous devez renvoyer une erreur 400 avec un message d'erreur.
Sinon hashez le mot de passe et créez l'utilisateur.

Comment hasher un mot de passe ?

```ts
import bcrypt from 'bcrypt';

const saltRounds = 10;

const hash = await bcrypt.hash(myPlaintextPassword, saltRounds);
```

### Créer une route de login

Au moment de la connexion d'un utilisateur, vous devez vérifier que le couple email/password est correct.
Si le couple email/password est incorrect, vous devez renvoyer une erreur 400 avec un message d'erreur.
Sinon vous devez créer un token JWT et le renvoyer dans la réponse.

Comment comparer un mot de passe hashé avec un mot de passe en clair ?

```ts
import bcrypt from 'bcrypt';

const match = await bcrypt.compare(myPlaintextPassword, hash);
```

Comment créer un token JWT ?

```ts
import jwt from 'jsonwebtoken';

jwt.sign({ data: 'foobar'}, 'secret', { expiresIn: '1h' });
```

### Créer un middleware d'authentification

Créez un middleware qui vérifie que le token JWT est présent dans le header `Authorization` et qu'il est valide.
Si le token n'est pas présent ou qu'il n'est pas valide, vous devez renvoyer une erreur 401 avec un message d'erreur.
Sinon vous devez ajouter l'utilisateur dans la requête et appeler la fonction `next()`.

Comment vérifier qu'un token JWT est valide ?

```ts
import jwt from 'jsonwebtoken';

jwt.verify(token, 'secret');
```

Qu'est ce qu'un middleware ? comment l'utiliser et comment le créer ?

```ts
// middleware
const middleware = (req, res, next) => {
  // do something
  next();
}

// utilisation globale
app.use(middleware);

// ou sur une route
app.get('/foo', middleware, (req, res) => {
  // do something
});
```

### Utilisation du middleware d'authentification

Ajoutez le middleware d'authentification sur les routes privées.

### Créer une route de logout

Créez une route de logout qui supprime le token JWT de l'utilisateur.
Comment sont stockés les tokens JWT ?
Strapi permet d'utiliser plusieurs token JWT simultanément, est-ce une bonne pratique ?
Comment est ce possible ?

### Créer une route de récupération de l'utilisateur connecté

Créez une route qui renvoie les informations de l'utilisateur connecté.
Lecture du token JWT et récupération de l'utilisateur dans la base de données.

### Créer une route de modification du mot de passe

Créez une route qui permet de modifier le mot de passe de l'utilisateur connecté.
Lecture du token JWT et modification du mot de passe dans la base de données.