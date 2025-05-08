// Backend/models/ModelFactory.js
import InMemoryTripModel from "./InMemoryTripModel.js";
import SQLiteTripModel from "./SQLiteTripModel.js";

class _ModelFactory {
    async getModel(model = "sqlite") {
        if (model === "sqlite") {
            return SQLiteTripModel;
        } else if (model === "sqlite-fresh") {
            await SQLiteTripModel.init(true); // Initialize with sample data
            return SQLiteTripModel;
        } else {
            return InMemoryTripModel; // Default is in-memory model
        }
    }
}

const ModelFactory = new _ModelFactory();
export default ModelFactory;