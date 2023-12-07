import { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";


export const sequelize = new Sequelize({
    dialect: "sqlite",
    // dialect: 'postgres',
    storage: "./db.sqlite",
    // storage: "./db.postgres",
})

export const Jeu = sequelize.define('Jeux', {
    // Chaque champ correspond à une colonne dans la table
    nom: {
        type: DataTypes.STRING,
        allowNull: false // Indique si ce champ peut être null
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
},{
        timestamps: false,
});

export const JeuOfficial = sequelize.define('JeuxOfficial', {
    // Chaque champ correspond à une colonne dans la table
    nom: {
        type: DataTypes.STRING,
        allowNull: false // Indique si ce champ peut être null
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    prix: {
        type: DataTypes.STRING,
        allowNull: true
    },
},{
        timestamps: false,
});

export const User = sequelize.define('Users', {
    // Chaque champ correspond à une colonne dans la table
    // id: {
    //     type: DataTypes.STRING,
    //     allowNull: false // Indique si ce champ peut être null
    // },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
},{
        timestamps: false,
});

export const Recipe = sequelize.define('Recipes', {
    // Chaque champ correspond à une colonne dans la table
    nom: {
        type: DataTypes.STRING,
        allowNull: false // Indique si ce champ peut être null
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    duree: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    note: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
},{
        timestamps: false,
});

sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    console.log("Base de données synchronisée et prête");
       
  })
  .catch(error => {
    console.error('Erreur de synchronisation:', error);
  });
