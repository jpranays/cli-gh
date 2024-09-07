import fs from 'fs';
import path from 'path';
import os from 'os';

// Get the user's home directory
const homeDir = os.homedir();
// Define the path to the config file in a hidden directory within the home directory
const configDir = path.join(homeDir, '.gh-easy-cli');
const configPath = path.join(configDir, 'config.json');

// Ensure the config directory exists
const ensureConfigDir = () => {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
};

export const readConfig = () => {
  ensureConfigDir();
  if (fs.existsSync(configPath)) {
    const data = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(data);
  }
  return {};
};

export const writeConfig = (config) => {
  ensureConfigDir();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
};
