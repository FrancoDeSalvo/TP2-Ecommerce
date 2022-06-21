import { MongoClient } from "mongodb"
import { CNX_STR } from '../../config/config.js'

const client = new MongoClient(CNX_STR);

await client.connect();

export const database = client.db('');