import { Pinecone } from "@pinecone-database/pinecone";

export const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});

export const indexName = "whatsapp_bot_index";

async function setupIndex() {
  try {
    await pc.createIndexForModel({
      name: indexName,
      cloud: "aws",    
      region: "us-east-1",
      embed: {
        model: "llama-text-embed-v2",
        fieldMap: { text: "chunk_text" },
      },
      waitUntilReady: true,
    });

    console.log(`Index "${indexName}" created successfully!`);
  } catch (error) {
    console.error("Error creating index:", error);
  }
};
setupIndex();