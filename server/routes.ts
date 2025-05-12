import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { wordValidationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Validate word API endpoint
  app.get("/api/validate-word", async (req, res) => {
    try {
      const { word } = wordValidationSchema.parse(req.query);
      const result = await storage.validateWord(word);
      return res.json({ valid: result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get random word with length and difficulty
  app.get("/api/random-word", async (req, res) => {
    try {
      const params = z.object({
        length: z.coerce.number().optional(),
        difficulty: z.enum(["easy", "medium", "hard"]).optional()
      }).parse(req.query);

      const word = await storage.getRandomWord(params.length, params.difficulty);
      if (!word) {
        return res.status(404).json({ message: "No word found with given criteria" });
      }
      
      return res.json({ word });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get words that are one letter away from the input word
  app.get("/api/word-hints", async (req, res) => {
    try {
      const params = z.object({
        word: z.string().min(1),
        limit: z.coerce.number().optional().default(5)
      }).parse(req.query);

      const hints = await storage.getWordHints(params.word, params.limit);
      return res.json({ hints });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
