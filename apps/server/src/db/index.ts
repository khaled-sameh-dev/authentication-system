import { DatabaseManager } from "./database.manager";
import { MongoDatabaseProvider } from "./mongodb.provider";

export const database = new DatabaseManager(new MongoDatabaseProvider());
