import InMemoryTripModel from "./InMemoryTripModel.js";

class _ModelFactory {
    async getModel(model = "inmemory") {
        if (model === "sqlite") {
            //
        } else if (model === "sqlite-fresh") {
            //
        } else {
            return InMemoryTripModel;
        }
    }
}

const ModelFactory = new _ModelFactory();
export default ModelFactory;