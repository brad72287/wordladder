import { words, type Word, type InsertWord } from "@shared/schema";

// Common English words for the in-memory database
const commonWords = [
  // 3-letter words
  { word: "cat", length: 3, difficulty: "easy" },
  { word: "dog", length: 3, difficulty: "easy" },
  { word: "hat", length: 3, difficulty: "easy" },
  { word: "bat", length: 3, difficulty: "easy" },
  { word: "sat", length: 3, difficulty: "easy" },
  { word: "rat", length: 3, difficulty: "easy" },
  { word: "map", length: 3, difficulty: "easy" },
  
  // 4-letter words
  { word: "cold", length: 4, difficulty: "medium" },
  { word: "warm", length: 4, difficulty: "medium" },
  { word: "card", length: 4, difficulty: "medium" },
  { word: "ward", length: 4, difficulty: "medium" },
  { word: "word", length: 4, difficulty: "medium" },
  { word: "cord", length: 4, difficulty: "medium" },
  { word: "form", length: 4, difficulty: "medium" },
  { word: "farm", length: 4, difficulty: "medium" },
  { word: "harm", length: 4, difficulty: "medium" },
  { word: "hand", length: 4, difficulty: "medium" },
  { word: "land", length: 4, difficulty: "medium" },
  { word: "sand", length: 4, difficulty: "medium" },
  { word: "band", length: 4, difficulty: "medium" },
  { word: "bond", length: 4, difficulty: "medium" },
  { word: "pond", length: 4, difficulty: "medium" },
  { word: "port", length: 4, difficulty: "medium" },
  { word: "fort", length: 4, difficulty: "medium" },
  { word: "sort", length: 4, difficulty: "medium" },
  { word: "part", length: 4, difficulty: "medium" },
  { word: "cart", length: 4, difficulty: "medium" },
  
  // 5-letter words
  { word: "blame", length: 5, difficulty: "hard" },
  { word: "flame", length: 5, difficulty: "hard" },
  { word: "frame", length: 5, difficulty: "hard" },
  { word: "crane", length: 5, difficulty: "hard" },
  { word: "plane", length: 5, difficulty: "hard" },
  { word: "plate", length: 5, difficulty: "hard" },
  { word: "place", length: 5, difficulty: "hard" },
  { word: "space", length: 5, difficulty: "hard" },
  { word: "spade", length: 5, difficulty: "hard" },
  { word: "shake", length: 5, difficulty: "hard" },
  { word: "shade", length: 5, difficulty: "hard" },
  { word: "shape", length: 5, difficulty: "hard" },
  { word: "share", length: 5, difficulty: "hard" },
  { word: "shark", length: 5, difficulty: "hard" },
  { word: "sharp", length: 5, difficulty: "hard" },
  { word: "spare", length: 5, difficulty: "hard" },
];

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateWord(word: string): Promise<boolean>;
  getRandomWord(length?: number, difficulty?: string): Promise<string | null>;
  getWordHints(word: string, limit?: number): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private wordDictionary: Map<string, Word>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.wordDictionary = new Map();
    this.currentId = 1;
    
    // Initialize word dictionary
    commonWords.forEach((word, index) => {
      this.wordDictionary.set(word.word.toLowerCase(), {
        id: index + 1,
        word: word.word.toLowerCase(),
        length: word.length,
        difficulty: word.difficulty,
      });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async validateWord(word: string): Promise<boolean> {
    // First check our in-memory dictionary
    const normalizedWord = word.toLowerCase();
    if (this.wordDictionary.has(normalizedWord)) {
      return true;
    }
    
    // For words not in our dictionary, we'll query the free dictionary API
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${normalizedWord}`);
      if (response.ok) {
        // Add to our dictionary for future reference
        this.wordDictionary.set(normalizedWord, {
          id: this.wordDictionary.size + 1,
          word: normalizedWord,
          length: normalizedWord.length,
          difficulty: this.getDifficultyForLength(normalizedWord.length),
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error validating word with external API:', error);
      // Default to our in-memory check result
      return false;
    }
  }

  async getRandomWord(length?: number, difficulty?: string): Promise<string | null> {
    const filteredWords = Array.from(this.wordDictionary.values()).filter(word => {
      if (length && word.length !== length) return false;
      if (difficulty && word.difficulty !== difficulty) return false;
      return true;
    });
    
    if (filteredWords.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    return filteredWords[randomIndex].word;
  }

  async getWordHints(word: string, limit: number = 5): Promise<string[]> {
    const normalizedWord = word.toLowerCase();
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const possibleWords: string[] = [];
    
    // Generate all possible words that are one letter different
    for (let i = 0; i < normalizedWord.length; i++) {
      for (let j = 0; j < alphabet.length; j++) {
        if (alphabet[j] !== normalizedWord[i]) {
          const newWord = normalizedWord.substring(0, i) + alphabet[j] + normalizedWord.substring(i + 1);
          if (this.wordDictionary.has(newWord)) {
            possibleWords.push(newWord);
          }
        }
      }
    }
    
    // Return random subset of valid words
    if (possibleWords.length <= limit) {
      return possibleWords;
    }
    
    // Shuffle and pick limit number of words
    const shuffled = [...possibleWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit).map(w => w.toUpperCase());
  }

  private getDifficultyForLength(length: number): string {
    if (length <= 3) return "easy";
    if (length <= 4) return "medium";
    return "hard";
  }
}

export const storage = new MemStorage();
