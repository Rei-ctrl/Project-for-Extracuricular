import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateProductDescription(productName: string, category: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "Anda adalah seorang copywriting ahli untuk marketplace premium. Tulislah deskripsi produk yang elegan, persuasif, dan profesional dalam Bahasa Indonesia (maksimal 300 karakter). Fokus pada kualitas, estetika, dan fungsionalitas bagi profesional.",
      },
      contents: `Buatlah deskripsi untuk produk alat tulis bernama "${productName}" dalam kategori "${category}".`,
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "";
  }
}
