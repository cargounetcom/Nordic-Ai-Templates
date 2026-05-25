/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazily initialize Gemini API setup to avoid startup crash if key is missing
let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required but missing. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Generation endpoint
  app.post("/api/generate-shop", async (req, res) => {
    try {
      const { prompt, stylePreference } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
      }

      const ai = getAI();
      const userPrompt = `
        You are a principal creative director and design system architect based in Copenhagen.
        Generate a fully fleshed out minimalist design specification and products catalog for a luxury digital "Nordic Templates Shop".
        
        The user wants a store for: "${prompt}"
        The visual style requested is: "${stylePreference || "Warm Scandinavian Serif (Theme 42)"}"
        
        Design Rules:
        - If the style is Warm Scandinavian / Theme 42, use very soft beige, stone, chalk, linen tones, and the serif typography option.
        - If the style is Brutalist Copenhagen / Theme 46, use strict high-contrast monochrome (deep pitch charcoal blacks, light grey, stark chalk whites), monospace fonts, with parenthetical numbering (01), (02) and raw grid frames.
        
        Generate the complete JSON model containing:
        1. Brand Name (keep it authentic, elegant, and minimal)
        2. Slogan or Tagline
        3. A poetic 1-2 sentence manifesto/philosophy
        4. Colors (background, accent, and text coordinates in high-contrast hex triplets relative to the aesthetic style)
        5. Appropriate layout directives (fontStyle: 'serif' or 'monospace' and layoutStyle: 'warm' or 'brutalist')
        6. A curated menu of 3 specialized products with Danish/Swedish sounding names (e.g. LYS Votive, STAV Plinth, KÄLLA Basin), appropriate category, price (in EUR or DKK), double-digit index numbers (01, 02, etc), and custom badge if applicable.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: "You are the head art director of a high-end Nordic design agency. Speak in poetic, material-focused, exact design terms.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              brandName: { type: Type.STRING },
              tagline: { type: Type.STRING },
              philosophy: { type: Type.STRING },
              accentColor: { type: Type.STRING },
              bgColor: { type: Type.STRING },
              textColor: { type: Type.STRING },
              fontStyle: { type: Type.STRING, description: "Must be 'serif' or 'monospace' depending on target concept style" },
              layoutStyle: { type: Type.STRING, description: "Must be 'warm' or 'brutalist' depending on target concept style" },
              products: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    category: { type: Type.STRING },
                    price: { type: Type.STRING },
                    description: { type: Type.STRING },
                    badge: { type: Type.STRING, description: "Short badge e.g. 'NEW ARRIVAL', 'LIMITED' or empty" },
                    number: { type: Type.STRING, description: "Double digit order number e.g. '01', '02', '03'" }
                  },
                  required: ["id", "name", "category", "price", "description", "number"]
                }
              }
            },
            required: ["brandName", "tagline", "philosophy", "accentColor", "bgColor", "textColor", "fontStyle", "layoutStyle", "products"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response returned from the model.");
      }

      const generatedData = JSON.parse(responseText.trim());
      res.json(generatedData);
    } catch (err: any) {
      console.error("AI Generation error:", err);
      res.status(500).json({ error: err.message || "Failed to generate spec from Gemini." });
    }
  });

  // Client static assets & SPA Fallbacks
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal startup failure:", err);
  process.exit(1);
});
