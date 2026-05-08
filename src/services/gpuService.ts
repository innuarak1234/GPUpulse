import { GoogleGenAI, Type } from "@google/genai";
import { GPUDetail, LatestDriverUpdate, GPUBrand } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiInstance) {
    // If the key is missing or undefined, we don't crash on module load
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. AI calls will fail.");
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey || "dummy_key_to_prevent_crash" });
  }
  return aiInstance;
}

export async function searchGPUMetal(query: string): Promise<string[]> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `List real potential GPU model names matching "${query}" for AMD, NVIDIA, or Intel. Return as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Search GPU Error:", error);
    return [];
  }
}

export async function getGPUDetails(modelName: string): Promise<GPUDetail | null> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find the specifications, driver history (at least 3 previous versions), current MSRP/launch price, major AIB partner brands (e.g. ASUS, MSI, Gigabyte), and recommended CPU pairings (Intel and AMD models that avoid significant bottlenecks) for the GPU: ${modelName}. Use Google Search for accuracy.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            modelName: { type: Type.STRING },
            brand: { type: Type.STRING, enum: ["AMD", "NVIDIA", "Intel"] },
            architecture: { type: Type.STRING },
            vram: { type: Type.STRING },
            memoryBus: { type: Type.STRING },
            baseClock: { type: Type.STRING },
            boostClock: { type: Type.STRING },
            cudaCores: { type: Type.NUMBER },
            streamProcessors: { type: Type.NUMBER },
            executionUnits: { type: Type.NUMBER },
            powerTDP: { type: Type.STRING },
            releaseYear: { type: Type.NUMBER },
            priceMSRP: { type: Type.STRING },
            partners: { type: Type.ARRAY, items: { type: Type.STRING } },
            drivers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  version: { type: Type.STRING },
                  releaseDate: { type: Type.STRING },
                  notes: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            compatibleCPUs: {
              type: Type.OBJECT,
              properties: {
                intel: { type: Type.ARRAY, items: { type: Type.STRING } },
                amd: { type: Type.ARRAY, items: { type: Type.STRING } },
                tier: { type: Type.STRING }
              },
              required: ["intel", "amd", "tier"]
            }
          },
          required: ["modelName", "brand", "vram", "drivers", "compatibleCPUs"]
        }
      }
    });

    return JSON.parse(response.text || "null");
  } catch (error) {
    console.error("Get GPU Details Error:", error);
    return null;
  }
}

export async function getLatestDriverUpdates(): Promise<LatestDriverUpdate[]> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Find the latest stable driver version, release date, and official download URL for NVIDIA (GeForce), AMD (Adrenalin), and Intel (Arc/Iris Xe). Use Google Search.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              brand: { type: Type.STRING, enum: ["AMD", "NVIDIA", "Intel"] },
              latestVersion: { type: Type.STRING },
              releaseDate: { type: Type.STRING },
              link: { type: Type.STRING }
            },
            required: ["brand", "latestVersion", "releaseDate", "link"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Get Latest Drivers Error:", error);
    return [];
  }
}
