import React, { useState } from "react";
import OpenAI from "openai";

const PRODUCTS = [
  { id: 1, name: "Samsung Galaxy A54", category: "Phone", price: 449 },
  { id: 2, name: "iPhone 15", category: "Phone", price: 799 },
  { id: 3, name: "Google Pixel 7a", category: "Phone", price: 499 },
  { id: 4, name: "OnePlus Nord CE 3 Lite", category: "Phone", price: 249 },
  { id: 5, name: "MacBook Air M2", category: "Laptop", price: 1099 },
  { id: 6, name: "Dell XPS 13", category: "Laptop", price: 999 },
  { id: 7, name: "Lenovo IdeaPad Slim 5", category: "Laptop", price: 649 },
  { id: 8, name: "Sony WH-1000XM5", category: "Audio", price: 349 },
  { id: 9, name: "Bose QC45", category: "Audio", price: 279 }
];

export default function App() {
  const [query, setQuery] = useState("");
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    try {
      setLoading(true);

      const client = new OpenAI({
        apiKey: "MY_API_KEY",
        dangerouslyAllowBrowser: true,
      });

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `Return only JSON.
Products:
${JSON.stringify(PRODUCTS)}
Format:
{"ids":[]}`,
          },
          {
            role: "user",
            content: query,
          },
        ],
      });

      const result = JSON.parse(
        completion.choices[0].message.content
      );

      const filtered = PRODUCTS.filter((p) =>
        result.ids.includes(p.id)
      );

      setRecommended(filtered);
    } catch (err) {
      console.error(err);
      alert("Error getting recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>AI Product Recommendation System</h1>

      <input
        style={{ width: "70%", padding: 10 }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="I want a phone under $500"
      />

      <button
        onClick={getRecommendations}
        disabled={loading}
        style={{ marginLeft: 10, padding: 10 }}
      >
        {loading ? "Loading..." : "Get Recommendations"}
      </button>

      <h2>Recommended Products</h2>

      {recommended.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10 }}>
          <h3>{p.name}</h3>
          <p>Category: {p.category}</p>
          <p>Price: ${p.price}</p>
        </div>
      ))}
    </div>
  );
}
