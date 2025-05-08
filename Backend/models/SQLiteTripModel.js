import { Sequelize, DataTypes } from "sequelize";

// Initialize a new Sequelize instance with SQLite
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
});

// Define the trip model
const Trip = sequelize.define("Trip", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    traveler: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    companions: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    from: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    to: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    budget: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    accommodations: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: true,
    },
    todoItems: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: true,
    },
});


class _SQLiteTripModel {
    constructor () {}

    async init(fresh = false) {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
        // An exception will be thrown if either of these operations fail.

        if (fresh) {
            await this.delete();

            await this.create({
               // Create mock data here 
            });
        }
    }

    async create(trip) {
        return await Trip.create(trip);
    }

    async read(id = null) {
        if (id) {
            return await Trip.findByPk(id);
        }

        return await Trip.findAll();
    }

    async update(trip) {
        const tripu = await Trip.findByPk(trip.id);
        if (!tripu) {
            return null;
        }

        await tripu.update(trip);
        return tripu;
    }

    async delete(trip = null) {
        if (trip === null) {
            await Trip.destroy({ truncate: true });
            return;
        }

        await Trip.destroy({ where: { id: trip.id } });
        return trip;
    }
}

const SQLiteTripModel = new _SQLiteTripModel();

export default SQLiteTripModel;