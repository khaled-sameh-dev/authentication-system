import DatabaseManager  from "./DatabaseManager";
import MongoProvider from "./MongoProvider";


export const database = new DatabaseManager(new MongoProvider());
