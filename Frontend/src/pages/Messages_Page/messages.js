const input_box = this.document.getElementById("input-box");
input_box.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && event.target.value !== ""){
        const newMessage = document.createElement("div");
        newMessage.classList.add("chat-bubble");
        newMessage.classList.add("chat-to");
        newMessage.textContent = event.target.value + " [Zavier]";
    
        const display = document.getElementById("messages-display");
        display.appendChild(newMessage);
        input_box.value = "";
    }
});

const newChatPopupForm = this.document.createElement("form");
newChatPopupForm.classList.add("form-container");
newChatPopupForm.innerHTML = `
    <label for"username"><b>Who would you like to chat with?</b></label>
    <input type="text" placeholder="Enter Friend's Username" required name="username">

    <br>
    <label for="name"><b>Chat Name<b/></label>
    <input type="text" placeholder="Enter Chat Name" required name="name">

    <br>
    <input type="button" class="btn" value="Create Chat"> 
`;
newChatPopupForm.style.display = "none";
const chatGroupsContainer = this.document.getElementById("chat-groups-container");
chatGroupsContainer.appendChild(newChatPopupForm);

const chat_add_button = this.document.getElementById("chat-add-button");
chat_add_button.addEventListener("click", () => {
    const newChatPopupForm = this.document.getElementsByClassName("form-container")[0];
    newChatPopupForm.style.display = "block";

    const newChatIcon = document.createElement("input");
    newChatIcon.classList.add("chat-icon");
    newChatIcon.type = "button";

})