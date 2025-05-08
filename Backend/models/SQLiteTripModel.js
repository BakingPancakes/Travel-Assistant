// Backend/models/SQLiteTripModel.js
import { Sequelize, DataTypes } from 'sequelize';

// Initialize a new Sequelize instance with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

// Define Trip model - using TEXT type for JSON data since SQLite doesn't support JSON natively
const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: true
  },
  traveler: {
    type: DataTypes.STRING,
    allowNull: true
  },
  companions: {
    type: DataTypes.STRING,
    allowNull: true
  },
  from: {
    type: DataTypes.STRING,
    allowNull: false
  },
  to: {
    type: DataTypes.STRING,
    allowNull: false
  },
  budget: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  accommodations: {
    type: DataTypes.TEXT, // JSON stored as string
    allowNull: true,
    get() {
      const value = this.getDataValue('accommodations');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('accommodations', JSON.stringify(value || []));
    }
  },
  todoItems: {
    type: DataTypes.TEXT, // JSON stored as string
    allowNull: true,
    get() {
      const value = this.getDataValue('todoItems');
      return value ? JSON.parse(value) : { before: [], during: [], after: [] };
    },
    set(value) {
      this.setDataValue('todoItems', JSON.stringify(value || { before: [], during: [], after: [] }));
    }
  }
});

class _SQLiteTripModel {
  constructor() {
    this.init();
  }

  async init(fresh = false) {
    try {
      await sequelize.authenticate();
      console.log('Connection to the database has been established successfully.');
      
      // Create tables if they don't exist
      await sequelize.sync({ force: false });
      
      // Add sample data if requested
      if (fresh) {
        await this.delete();
        await this.addSampleData();
      }
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  // Add sample data for testing
  async addSampleData() {
    try {
      await Trip.create({
        name: "Japan Tokyo Trip",
        destination: "Tokyo, Japan",
        traveler: "Hong Gildong",
        companions: "Kim Chulsoo, Lee Younghee",
        from: "2023-06-15",
        to: "2023-06-22",
        budget: 1500000,
        accommodations: [
          { person: "Hong Gildong", type: "hotel", price: 200 },
          { person: "Kim Chulsoo", type: "hotel", price: 200 },
          { person: "Lee Younghee", type: "hotel", price: 200 }
        ],
        todoItems: {
          before: ["Renew passport", "Book hotel", "Purchase flight tickets"],
          during: ["Visit Tokyo Tower", "Visit Disneyland", "Shopping in Akihabara"],
          after: ["Organize travel photos", "Write blog post about Japan visit"]
        }
      });

      await Trip.create({
        name: "Jeju Island Summer Vacation",
        destination: "Jeju Island",
        traveler: "Kim Youngsoo",
        companions: "Park Miyoung",
        from: "2023-07-20",
        to: "2023-07-25",
        budget: 800000,
        accommodations: [
          { person: "Kim Youngsoo", type: "condo", price: 100 },
          { person: "Park Miyoung", type: "condo", price: 100 }
        ],
        todoItems: {
          before: ["Reserve rental car", "Book accommodation"],
          during: ["Climb Seongsan Ilchulbong", "Visit Hamdeok Beach", "Visit black pork restaurant"],
          after: ["Write review"]
        }
      });

      console.log('Sample data added successfully');
    } catch (error) {
      console.error('Error adding sample data:', error);
    }
  }

  // Create a new trip
  async create(trip) {
    try {
      const newTrip = await Trip.create(trip);
      return newTrip.toJSON();
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  }

  // Read trip information (by ID or all)
  async read(id = null) {
    try {
      if (id !== null) {
        const trip = await Trip.findByPk(id);
        return trip ? trip.toJSON() : null;
      }
      const trips = await Trip.findAll();
      return trips.map(trip => trip.toJSON());
    } catch (error) {
      console.error('Error reading trips:', error);
      throw error;
    }
  }

  // Update trip information
  async update(trip) {
    try {
      const id = trip.id;
      const tripRecord = await Trip.findByPk(id);
      
      if (!tripRecord) {
        return null;
      }
      
      await tripRecord.update(trip);
      return tripRecord.toJSON();
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  }

  // Delete trips (all or by ID)
  async delete(id = null) {
    try {
      if (id === null) {
        // Delete all trips
        await Trip.destroy({ where: {} });
        return true;
      }
      
      // Delete trip by specific ID
      const deleted = await Trip.destroy({
        where: { id: id }
      });
      
      return deleted > 0;
    } catch (error) {
      console.error('Error deleting trips:', error);
      throw error;
    }
  }
}

// Create singleton instance
const SQLiteTripModel = new _SQLiteTripModel();

export default SQLiteTripModel;
export { sequelize, Trip };