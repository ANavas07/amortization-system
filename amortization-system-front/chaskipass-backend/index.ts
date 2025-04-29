//Imports are called first for that reason we need to import dotenv first to use everywhere
import dotenv from 'dotenv';

dotenv.config();

import Server from "./src/server/server.server";
const server = new Server();