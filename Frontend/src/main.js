import { ScreenControllerComponent } from "./components/ScreenControllerComponent/ScreenControllerComponent";

// Create instance
const screenController = new ScreenControllerComponent();

// Render the component in the #screen container
const screenContainer = document.getElementById("screen");
screenContainer.appendChild(screenController.render());

// Services