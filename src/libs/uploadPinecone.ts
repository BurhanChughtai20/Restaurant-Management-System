import { prepareVectors } from "./embedData.ts"; 
import { indexName, pc } from "./Pinecone.ts";
import type { RestaurantData } from "../types/types.ts"; 

export async function uploadToPinecone(restaurantId: number, data: RestaurantData) {
  const records = prepareVectors(data, restaurantId);

  await pc.index(indexName).upsert(records); 

  console.log(`Uploaded ${records.length} records for restaurant ${restaurantId}`);
}
