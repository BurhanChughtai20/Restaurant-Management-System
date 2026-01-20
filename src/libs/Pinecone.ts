import { Pinecone } from "@pinecone-database/pinecone";

export const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});

// Yahan underscore (_) ko dash (-) se badal diya hai
export const indexName = "whatsapp-bot-index"; 

async function setupIndex() {
  try {
    // Check karein ke index pehle se toh nahi bana hua?
    const existingIndexes = await pc.listIndexes();
    const indexExists = existingIndexes.indexes?.some(idx => idx.name === indexName);

    if (indexExists) {
      console.log(`Index "${indexName}" already exists.`);
      return;
    }

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