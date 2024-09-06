import axios from 'axios';
import { readConfig } from '../utils/config.js';

const GITHUB_API_URL = 'https://api.github.com';

const config = readConfig();
const token = config.githubToken;

const api = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    ...(token && { Authorization: `token ${token}` }),
  },
});

export default api;
