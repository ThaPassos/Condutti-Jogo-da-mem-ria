import { neon } from "@neondatabase/serverless";
import type { Handler } from "@netlify/functions";

const sql = neon(process.env.DATABASE_URL!);

export const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    // GET — busca o melhor recorde global
    if (event.httpMethod === "GET") {
      const rows = await sql`
        SELECT time_seconds FROM records
        ORDER BY time_seconds ASC
        LIMIT 1
      `;
      const best = rows[0]?.time_seconds ?? null;
      return { statusCode: 200, headers, body: JSON.stringify({ best }) };
    }

    // POST — salva um novo tempo
    if (event.httpMethod === "POST") {
      const { time } = JSON.parse(event.body ?? "{}");
      if (!time || typeof time !== "number" || time < 1) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Tempo inválido" }) };
      }
      await sql`INSERT INTO records (time_seconds) VALUES (${time})`;
      const rows = await sql`
        SELECT time_seconds FROM records
        ORDER BY time_seconds ASC
        LIMIT 1
      `;
      const best = rows[0]?.time_seconds ?? time;
      return { statusCode: 200, headers, body: JSON.stringify({ best }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Método não permitido" }) };
  } catch (err) {
    console.error("Erro na function record:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Erro interno" }) };
  }
};