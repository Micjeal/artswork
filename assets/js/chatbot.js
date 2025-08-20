// Chatbot functionality
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.initialize();
        this.setupEventListeners();
        this.addWelcomeMessage();
    }

    initialize() {
        // Create chatbot container
        this.chatbotContainer = document.createElement('div');
        this.chatbotContainer.className = 'chatbot-container';
        this.chatbotContainer.innerHTML = `
            <div class="chatbot-header">
                <h3>Art Gallery Assistant</h3>
                <button class="minimize-btn" aria-label="Minimize chat">×</button>
            </div>
            <div class="chatbot-messages"></div>
            <div class="chatbot-input">
                <input type="text" placeholder="Ask me about our gallery..." aria-label="Type your message" />
                <button class="send-btn" aria-label="Send message">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        `;
        document.body.appendChild(this.chatbotContainer);

        // Create chatbot toggle button
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'chatbot-toggle';
        this.toggleButton.setAttribute('aria-label', 'Open chat');
        this.toggleButton.innerHTML = '💬';
        document.body.appendChild(this.toggleButton);

        // Get DOM elements
        this.messagesContainer = this.chatbotContainer.querySelector('.chatbot-messages');
        this.inputField = this.chatbotContainer.querySelector('input');
        this.sendButton = this.chatbotContainer.querySelector('.send-btn');
        this.minimizeButton = this.chatbotContainer.querySelector('.minimize-btn');
    }

    setupEventListeners() {
        // Toggle chat window
        this.toggleButton.addEventListener('click', () => this.toggleChat());
        this.minimizeButton.addEventListener('click', () => this.toggleChat());

        // Send message on button click or Enter key
        this.sendButton.addEventListener('click', () => this.handleUserInput());
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserInput();
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.chatbotContainer.classList.add('show');
            this.toggleButton.style.display = 'none';
            this.inputField.focus();
        } else {
            this.chatbotContainer.classList.remove('show');
            this.toggleButton.style.display = 'flex';
        }
    }

    addMessage(content, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isUser ? 'user' : 'bot'}`;
        messageElement.textContent = content;
        this.messagesContainer.appendChild(messageElement);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        this.messages.push({ content, isUser });
    }

    async handleUserInput() {
        const userInput = this.inputField.value.trim();
        if (!userInput) return;

        // Add user message to chat
        this.addMessage(userInput, true);
        this.inputField.value = '';

        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot typing';
        typingIndicator.textContent = '...';
        this.messagesContainer.appendChild(typingIndicator);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

        // Get bot response
        const response = await this.getBotResponse(userInput);
        
        // Remove typing indicator and add bot response
        this.messagesContainer.removeChild(typingIndicator);
        this.addMessage(response, false);
    }

    getBotResponse(userInput) {
        // Convert input to lowercase for easier matching
        const input = userInput.toLowerCase();
        
        // Define responses based on keywords
        const responses = {
            'hello|hi|hey': "Hello! Welcome to our art gallery. How can I help you today?",
            'what can you do|help': "I can tell you about our gallery, current exhibitions, featured artists, and more. What would you like to know?",
            'hours|opening|close': "Our gallery is open Tuesday to Sunday from 10:00 AM to 6:00 PM. We're closed on Mondays.",
            'location|where|address': "We're located at 123 Art Street, Creative District, City. You can find us near the central park.",
            'exhibition|exhibitions': "We have several exciting exhibitions. Check out our 'Modern Perspectives' and 'Classic Reimagined' collections. Would you like more details about any specific exhibition?",
            'artist|artists': "We showcase works from both emerging and established artists. Our current featured artists include Sarah Chen, Marcus Johnson, and Elena Rodriguez.",
            'ticket|price|cost': "General admission is $15. We offer discounts for students, seniors, and groups. Admission is free for children under 12.",
            'tour|guided': "We offer guided tours every Saturday at 2:00 PM. Private tours can be arranged by appointment. Would you like to know more?",
            'collection|collections': "Our collections span various periods and styles, including contemporary, modern, and classical art. We also have special exhibitions that change quarterly.",
            'contact|email|phone': "You can reach us at info@artgallery.com or call us at (555) 123-4567 during business hours.",
            'thanks|thank you': "You're welcome! Is there anything else I can help you with?",
            'bye|goodbye': "Thank you for visiting! We hope to see you soon at our gallery."
        };

        // Find matching response
        for (const [pattern, response] of Object.entries(responses)) {
            if (new RegExp(pattern, 'i').test(input)) {
                return response;
            }
        }

        // Default response if no match found
        return "I'm not sure I understand. Could you rephrase your question? I can help with information about our exhibitions, artists, hours, and more.";
    }

    addWelcomeMessage() {
        const welcomeMessage = "Hello! I'm your Art Gallery Assistant. You can ask me about our exhibitions, artists, opening hours, or anything else about our gallery. How can I help you today?";
        this.addMessage(welcomeMessage, false);
    }
}

// Initialize chatbot when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const chatbot = new Chatbot();
});
