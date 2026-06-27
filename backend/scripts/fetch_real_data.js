import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildDiscussionDataset } from '../services/research/discussionDatasetService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log("Fetching real Reddit data for 'Claude'...");
    
    // Fetch discussions related to Claude
    const entity = "Claude Fable 5";
    const subreddits = ["ClaudeAI", "ArtificialIntelligene", "ChatGPT", "LLMs"];
    const config = {
        postLimit: 5,
        commentLimit: 10
    };
    
    try {
        const dataset = await buildDiscussionDataset(entity, subreddits, config);
        const outputPath = path.join(__dirname, 'real_dataset.json');
        
        fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2));
        console.log(`Saved dataset with ${dataset.discussions.length} discussions to ${outputPath}`);
    } catch (err) {
        console.error("Error fetching data:", err);
    }
}

main();
