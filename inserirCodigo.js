import { MongoClient } from "mongodb";

// Pega a URL do MongoDB do mesmo lugar que sua API
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ Erro: variável MONGODB_URI não encontrada no .env");
  process.exit(1);
}

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    const db = client.db("meubanco"); // mesmo nome do seu handler
    const collection = db.collection("codigos");

    const codigo = "00910023"; // código que quer inserir

    // Insere o código, evitando duplicados
    const resultado = await collection.updateOne(
      { codigo }, // filtro
      { $set: { codigo } }, // se já existir, mantém
      { upsert: true } // insere se não existir
    );

    console.log("✅ Código inserido/atualizado com sucesso!");
    console.log(resultado);
  } catch (err) {
    console.error("❌ Erro ao inserir:", err);
  } finally {
    await client.close();
  }
}

run();
