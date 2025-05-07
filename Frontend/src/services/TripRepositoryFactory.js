import { TripRepositoryService } from "./TripRepositoryService.js";
import { TripRepositoryRemoteFakeService } from "./TripRepositoryFakeService.js";
import { TripRepositoryRemoteService } from "./TripRepositoryRemoteService.js";

export class TripRepositoryFactory {
    constructor() {
        throw new Error("Cannot instantiate a TripRepositoryFactory obejct");
    }

    /**
     * Returns an instance of a trip repository service based on given type
     * @param {string} [repoType='local'] - Can be 'local' or 'remote'
     * @returns {TripRepositoryService|TripRepositoryServerRemote}
     * @throws Will throw an error if the repository type is not recognized
     */
    static get(repoType = "local") {
        if (repoType === "local") {
            return new TripRepositoryService();
        } else if (repoType === "fake") {
            return new TripRepositoryRemoteFakeService();
        } else if (repoType === "remote") {
            return new TripRepositoryRemoteService();
        } else {
            throw new Error("Invalid repository type");
        }
    }
}