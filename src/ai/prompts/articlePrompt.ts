export function articlePrompt(input: {
  title: string;
  restaurantName: string;
  keywords?: string;
  address?: string;
  phoneNumber?: string;
  mapLink?: string;
}) {
  return `
You are an expert SEO content writer for Google ranking.

Write a FULL SEO optimized article for food & restaurant industry.

Context:
- Article Title: ${input.title}
- Restaurant Name: ${input.restaurantName}
- Keywords: ${input.keywords || "food, restaurant, dining"}
- Address: ${input.address || "N/A"}
- Phone: ${input.phoneNumber || "N/A"}
- Google Map: ${input.mapLink || "N/A"}

Requirements:
- Long marketing focused description (800–1200 words)
- Use keywords naturally
- Professional tone
- Google SEO friendly
- Local SEO optimized

Return ONLY valid JSON in this format:

{
  "title": "",
  "description": "",
  "metaTitle": "",
  "metaDescription": "",
  "keywords": "",
  "openingHours": "",
  "socialLinks": {
    "facebook": "",
    "instagram": ""
  }
}
`;
}
