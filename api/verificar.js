import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (!req.query.codigo) {
    return res.status(400).json({ error: "Código não informado" });
  }

  try {
    await client.connect();
    const database = client.db("meubanco");
    const collection = database.collection("codigos");

    const codigo = req.query.codigo;
    const doc = await collection.findOne({ codigo });

    if (doc) {
      return res.status(200).json({ autorizado: true });
    } else {
      return res.status(200).json({ autorizado: false });
    }
  } catch (e) {
    return res.status(500).json({ error: "Erro no servidor: " + e.message });
  } finally {
    await client.close();
  }
}
