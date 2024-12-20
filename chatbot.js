class ChatBot {
    constructor(options = {}) {
        this.apiKey = "AIzaSyAGLv7V7dBngG3dFFzHKqDuMV4lfR5PELY";  // Your API key
        this.config = {
            themeColor: options.themeColor || "#5e36db",
            botName: options.botName || "WALL-E",
            userPlaceholder: options.userPlaceholder || "Type your message...",
            apiURL: options.apiURL || "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            containerStyle: options.containerStyle || {},
            ...options
        };

        this.chatContainer = null;
        this.chatLog = null;
        this.inputBox = null;
        this.chatToggler = null;
        this.isChatOpen = false;

        this.injectStyles();
    }

    injectStyles() {
        const styles = `
            body {
                background: #F9F9F9;
                font-family: 'Arial', sans-serif;
                margin: 0;
            }

            .chatbot-toggler {
                position: fixed;
                bottom: 30px;
                right: 35px;
                outline: none;
                border: none;
                height: 60px;
                width: 60px;
                display: flex;
                cursor: pointer;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: ${this.config.themeColor};
                box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
                transition: transform 0.3s ease, background-color 0.2s ease;
            }

              body.show-chatbot .chatbot-toggler {
                transform: rotate(45deg);
                background-color: #4c25a7;
            }

          

            .chatbot-toggler::after {
                content: '\\1F4AC'; /* Unicode for speech bubble */
                font-size: 24px;
                color: ${this.config.themeColor};
                position: absolute;
                top: 16px;
                left: 17px;
                z-index: 1;
                transition: transform 0.2s ease;
            }

            body.show-chatbot .chatbot-toggler::after {
                transform: rotate(-180deg);
                opacity: 0;
            }


            body.show-chatbot .chatbot-toggler {
                transform: rotate(45deg);
                background-color: #4c25a7;
            }

            .chatbot-toggler span {
                color: #fff;
                font-size: 24px;
                transition: opacity 0.2s ease;
                opacity: 1;
            }

            .chatbot {
                position: fixed;
                right: 35px;
                bottom: 90px;
                width: 380px;
                max-width: 100%;
                background: #fff;
                border-radius: 20px;
                overflow: hidden;
                opacity: 0;
                pointer-events: none;
                transform: scale(0.6);
                transform-origin: bottom right;
                box-shadow: 0 0 50px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease-out;
            }

            body.show-chatbot .chatbot {
                opacity: 1;
                pointer-events: auto;
                transform: scale(1);
            }

            .chatbot header {
                padding: 20px 15px;
                position: relative;
                text-align: center;
                color: #fff;
                background: ${this.config.themeColor};
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
                border-radius: 15px 15px 0 0;
            }

            .chatbot header h2 {
                margin: 0;
                font-size: 1.2rem;
                font-weight: bold;
                letter-spacing: 1px;
            }

            .chatbot header span {
                position: absolute;
                right: 15px;
                top: 50%;
                cursor: pointer;
                transform: translateY(-50%);
                font-size: 22px;
                color: #fff;
            }

            .chatbot .chatbox {
                padding: 20px;
                height: 400px;
                overflow-y: auto;
                background: #f8f8f8;
            }

            .chatbox .chat {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                margin-bottom: 20px;
            }

            .chatbox .outgoing {
                align-items: flex-end;
            }

            .chatbox .incoming {
                align-items: flex-start;
            }

            .chatbox .outgoing p {
                background-color: ${this.config.themeColor};
                color: #fff;
                border-radius: 20px;
                padding: 12px 18px;
                font-size: 14px;
                max-width: 70%;
                box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
            }

            .chatbox .incoming p {
                background-color: #e1e1e1;
                color: #333;
                border-radius: 20px;
                padding: 12px 18px;
                font-size: 14px;
                max-width: 70%;
                box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
            }

            .chatbot .chat-input {
                position: absolute;
                bottom: 0;
                width: 100%;
                padding: 15px;
                background: #fff;
                border-top: 1px solid #ddd;
                box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
                display: flex;
                gap: 10px;
                justify-content: space-between;
            }

            .chat-input textarea {
                width: 85%;
                height: 45px;
                padding: 10px;
                border-radius: 30px;
                border: 1px solid #ddd;
                font-size: 14px;
                outline: none;
                resize: none;
                transition: box-shadow 0.3s ease;
            }

            .chat-input textarea:focus {
                box-shadow: 0 0 10px ${this.config.themeColor};
            }

            .chat-input button {
                background-color: ${this.config.themeColor};
                border: none;
                border-radius: 50%;
                height: 40px;
                width: 40px;
                color: #fff;
                font-size: 18px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .chat-input button:hover {
                background-color: #4c25a7;
                transform: scale(1.1);
            }

            /* Responsive Styling */
            @media (max-width: 768px) {
                .chatbot-toggler {
                    bottom: 20px;
                    right: 20px;
                }

                .chatbot {
                    right: 20px;
                    bottom: 20px;
                    width: 90%;
                    max-width: 400px;
                }

                .chatbot header {
                    padding: 15px;
                }

                .chatbot .chatbox {
                    height: 300px;
                }

                .chatbot .chat-input {
                    bottom: 10px;
                }
            }

            @media (max-width: 480px) {
                .chatbot-toggler {
                    right: 15px;
                    bottom: 15px;
                }

                .chatbot {
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    height: 100%;
                    max-width: none;
                    border-radius: 0;
                }

                .chatbot header {
                    padding: 10px;
                    font-size: 1rem;
                }

                .chatbot .chatbox {
                    padding: 15px;
                    height: 250px;
                }

                .chatbot .chat-input {
                    padding: 8px;
                    gap: 8px;
                }

                .chat-input textarea {
                    width: 75%;
                    height: 40px;
                }

                .chat-input button {
                    width: 35px;
                    height: 35px;
                    font-size: 16px;
                }
            }

            @keyframes chatbotEntrance {
                0% { transform: scale(0); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    init() {
        this.createChatButton();
        this.createChatWindow();
    }

    createChatButton() {
        const button = document.createElement("button");
        button.className = "chatbot-toggler";
        
        // Chat bubble and toggle icon are purely handled by CSS, no HTML needed in button creation.
        button.addEventListener("click", () => this.toggleChatWindow());
        document.body.appendChild(button);
    }

    createChatWindow() {
        const chatbot = document.createElement("div");
        chatbot.className = "chatbot";

        // Header
        const header = document.createElement("header");
        header.innerHTML = `<h2>${this.config.botName}</h2><span>&#x274c;</span>`;
        header.querySelector("span").addEventListener("click", () => this.toggleChatWindow());
        chatbot.appendChild(header);

        // Chatbox
        const chatbox = document.createElement("div");
        chatbox.className = "chatbox";
        chatbot.appendChild(chatbox);
        this.chatLog = chatbox;

        // Input
        const inputWrapper = document.createElement("div");
        inputWrapper.className = "chat-input";
        const inputBox = document.createElement("textarea");
        inputBox.placeholder = this.config.userPlaceholder;
        inputBox.className = "chat-input-box";
        inputWrapper.appendChild(inputBox);
        const sendButton = document.createElement("button");
        sendButton.innerHTML = "&#10148;";
        sendButton.addEventListener("click", () => {
            if (inputBox.value.trim()) {
                this.addMessage("You", inputBox.value);
                this.sendMessage(inputBox.value);
                inputBox.value = "";
            }
        });
        inputWrapper.appendChild(sendButton);
        chatbot.appendChild(inputWrapper);

        // Append chatbot to the body
        document.body.appendChild(chatbot);
        this.chatContainer = chatbot;
    }

    toggleChatWindow() {
        this.isChatOpen = !this.isChatOpen;
        document.body.classList.toggle("show-chatbot", this.isChatOpen);
    }

    async sendMessage(message) {
        const loadingIndicator = this.addMessage(this.config.botName, "...");
        const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

        const requestPayload = {
            contents: [{
                parts: [{
                    text: message,
                }]
            }]
        };

        try {
            const response = await fetch(apiURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestPayload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error: ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates.length > 0) {
                const replyText = data.candidates[0].content.parts[0].text;
                this.updateMessage(loadingIndicator, replyText);
            } else {
                this.updateMessage(loadingIndicator, "Sorry, I didn't understand that.");
            }

        } catch (error) {
            console.error("Chatbot API error:", error);
            this.updateMessage(loadingIndicator, "There was an error. Please try again.");
        }
    }

    addMessage(sender, message) {
        const chat = document.createElement("div");
        chat.className = "chat";

        const bubble = document.createElement("p");
        bubble.textContent = message;

        if (sender === "You") {
            chat.classList.add("outgoing");
        } else {
            chat.classList.add("incoming");
        }
        chat.appendChild(bubble);

        this.chatLog.appendChild(chat);
        this.chatLog.scrollTop = this.chatLog.scrollHeight;

        return chat;
    }

    updateMessage(messageElement, newText) {
        messageElement.querySelector("p").textContent = newText;
    }
}

const chatBot = new ChatBot({
    botName: "WALL-E",
    themeColor: "#32A8F0",
    userPlaceholder: "Ask me anything!"
});

chatBot.init();
