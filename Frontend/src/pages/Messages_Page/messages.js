const input_box = this.document.getElementById("input-box");
        input_box.addEventListener('keypress', (event) => {
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