import fs from 'fs';
import path from 'path';

const configPath = path.resolve('config/config.json');

export const readConfig = () => {
  if (fs.existsSync(configPath)) {
    const data = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(data);
  }
  return {};
};

export const writeConfig = (config) => {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
};
