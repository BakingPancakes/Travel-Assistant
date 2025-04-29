import { ScreenControllerComponent } from "./components/ScreenControllerComponent/ScreenControllerComponent.js";
// import { TripRepositoryFactory } from "./services/TripRepositoryFactory.js";

// Create instance
const screenController = new ScreenControllerComponent();

// Render the component in the #screen container
const screenContainer = document.getElementById("app");
screenContainer.appendChild(screenController.render());

// Services
// const tripRepository = TripRepositoryFactory.get("fake");