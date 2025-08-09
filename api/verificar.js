import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let cachedClient = null;
let cachedDb = null;

export default async function handler(req, res) {
  if (!req.query.codigo) {
    return res.status(400).json({ error: "Código não informado" });
  }

  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
      cachedDb = cachedClient.db("meubanco");
    }

    const collection = cachedDb.collection("codigos");

    const codigo = req.query.codigo;
    const doc = await collection.findOne({ codigo });

    if (doc) {
      return res.status(200).json({ autorizado: true });
    } else {
      return res.status(200).json({ autorizado: false });
    }
  } catch (e) {
    return res.status(500).json({ error: "Erro no servidor: " + e.message });
  }
}
