// Check if two words have exactly one letter difference
export function areOneLetterApart(word1: string, word2: string): boolean {
  if (word1.length !== word2.length) return false;

  let differences = 0;
  for (let i = 0; i < word1.length; i++) {
    if (word1[i] !== word2[i]) differences++;
    if (differences > 1) return false;
  }

  return differences === 1;
}

// Validate if a word exists in dictionary using the API
export async function validateWord(word: string): Promise<boolean> {
  try {
    // First check the server-side validation
    const response = await fetch(`/api/validate-word?word=${word.toLowerCase()}`);
    
    if (!response.ok) {
      // If our API fails, fall back to the free dictionary API
      return await fallbackValidation(word);
    }
    
    const data = await response.json();
    return data.valid;
  } catch (error) {
    console.error('Error validating word:', error);
    // Fall back to the external API
    return await fallbackValidation(word);
  }
}

// Fallback validation using the free dictionary API
async function fallbackValidation(word: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
    return response.ok;
  } catch (error) {
    console.error('Error with fallback validation:', error);
    // As a last resort, assume the word is valid to not block gameplay
    return true;
  }
}

// For testing: Generate words that are one letter away from the input word
export function generateOneLetterWords(word: string): string[] {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const result: string[] = [];
  
  for (let i = 0; i < word.length; i++) {
    for (let j = 0; j < alphabet.length; j++) {
      if (alphabet[j] !== word[i]) {
        const newWord = word.substring(0, i) + alphabet[j] + word.substring(i + 1);
        result.push(newWord);
      }
    }
  }
  
  return result;
}
