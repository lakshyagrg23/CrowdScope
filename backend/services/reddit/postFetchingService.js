import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCRIPT_PATH = path.resolve(__dirname, "../../scripts/fetch_reddit.py");

export const fetchRedditData = (subreddits, query, postLimit, commentLimit) => {
    return new Promise((resolve, reject) => {
        const args = [SCRIPT_PATH, JSON.stringify(subreddits), query];
        if (postLimit !== undefined) args.push(String(postLimit));
        if (commentLimit !== undefined) args.push(String(commentLimit));

        const pythonProcess = spawn("python", args);
        let redditData = "";
        let errorData = "";

        pythonProcess.stdout.on("data", (data) => {
            redditData += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            errorData += data.toString();
        });

        pythonProcess.on("close", (code) => {
            if (code !== 0) {
                return reject(new Error(`Reddit scraper exited with code ${code}. Error: ${errorData}`));
            }
            try {
                const parsedData = JSON.parse(redditData);
                resolve(parsedData);
            } catch (err) {
                reject(new Error(`Failed to parse Reddit scraper output: ${err.message}`));
            }
        });
    });
};
