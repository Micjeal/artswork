const fs = require('fs');
const path = require('path');

// Function to add chatbot script to HTML files
function addChatbotToHTML(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if chatbot script is already added
        if (content.includes('chatbot.js')) {
            console.log(`Skipping ${filePath} - chatbot already added`);
            return;
        }
        
        // Find the closing body tag and insert the script before it
        if (content.includes('</body>')) {
            const chatbotScript = '    <script src="assets/js/chatbot.js"></script>\n';
            const updatedContent = content.replace('</body>', chatbotScript + '    </body>');
            
            // Write the updated content back to the file
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Updated ${filePath}`);
        } else {
            console.log(`Skipping ${filePath} - no </body> tag found`);
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
}

// Find all HTML files in the project directory
function processHTMLFiles(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            // Skip node_modules and other directories we don't want to process
            if (file !== 'node_modules' && !file.startsWith('.')) {
                processHTMLFiles(fullPath);
            }
        } else if (file.endsWith('.html')) {
            addChatbotToHTML(fullPath);
        }
    });
}

// Start processing from the current directory
const projectRoot = __dirname;
processHTMLFiles(projectRoot);

console.log('Chatbot script has been added to all HTML files.');
