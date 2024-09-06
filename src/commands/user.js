import api from '../services/api.js';
import chalk from 'chalk';

export const getUserInfo = async () => {
  try {
    const { data } = await api.get('/user');
    console.log(chalk.green(`Username: ${data.login}`));
    console.log(chalk.green(`Name: ${data.name}`));
  } catch (error) {
    console.error(chalk.red('Error fetching user info:'), error.message);
  }
};
