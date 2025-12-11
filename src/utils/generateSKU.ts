export function generateSKU(name: string) {
  const cleaned = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const random = Math.floor(100 + Math.random() * 900);
  return `${cleaned}-${random}`;
}
