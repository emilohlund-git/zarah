import { config } from 'dotenv';
import { resolve } from 'path';

const pathToConfig = '../../.env';
config({ path: resolve(__dirname, pathToConfig) });