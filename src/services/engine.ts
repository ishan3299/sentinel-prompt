import { PromptTemplate, COMMON_FIELDS } from '../data/templates';

// 1. COMPILER
export function compilePrompt(templateText: string, values: Record<string, string>): string {
  let compiled = templateText;
  for (const [key, val] of Object.entries(values)) {
    // Replace all instances of {{key}} with value, fallback to empty string
    const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`{{\\s*${escapedKey}\\s*}}`, 'g');
    compiled = compiled.replace(regex, val || '');
  }
  return compiled;
}

// 2. SEARCH & FILTER
export function filterTemplates(
  templates: PromptTemplate[],
  query: string,
  category: string,
  difficulty: string
): PromptTemplate[] {
  let filtered = templates;

  if (category) {
    filtered = filtered.filter(t => t.category === category);
  }

  if (difficulty) {
    filtered = filtered.filter(t => t.difficulty === difficulty);
  }

  if (query.trim()) {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    filtered = filtered.filter(t => {
      const searchTarget = `${t.title} ${t.description} ${t.subcategory} ${t.tags.join(' ')}`.toLowerCase();
      // Must match ALL search terms (AND search)
      return terms.every(term => searchTarget.includes(term));
    });
  }

  return filtered;
}

// 3. STORAGE MANAGER
const STORAGE_PREFIX = 'ai_sec_prompt_';

export const Storage = {
  getFavorites(): string[] {
    try {
      const favs = localStorage.getItem(`${STORAGE_PREFIX}favorites`);
      return favs ? JSON.parse(favs) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite(templateId: string): boolean {
    const favs = this.getFavorites();
    const index = favs.indexOf(templateId);
    let isFav = false;
    if (index > -1) {
      favs.splice(index, 1);
    } else {
      favs.push(templateId);
      isFav = true;
    }
    localStorage.setItem(`${STORAGE_PREFIX}favorites`, JSON.stringify(favs));
    return isFav;
  },

  isFavorite(templateId: string): boolean {
    return this.getFavorites().includes(templateId);
  },

  getRecent(): string[] {
    try {
      const recent = localStorage.getItem(`${STORAGE_PREFIX}recent`);
      return recent ? JSON.parse(recent) : [];
    } catch {
      return [];
    }
  },

  addRecent(templateId: string): void {
    let recent = this.getRecent();
    // Remove if already exists to move to top
    recent = recent.filter(id => id !== templateId);
    recent.unshift(templateId);
    // Limit to 10 recents
    if (recent.length > 10) recent.pop();
    localStorage.setItem(`${STORAGE_PREFIX}recent`, JSON.stringify(recent));
  }
};

// 4. URL STATE SERIALIZER
export const UrlSerializer = {
  encode(templateId: string, values: Record<string, string>): string {
    const data = { id: templateId, vals: values };
    try {
      const jsonStr = JSON.stringify(data);
      // UTF-8 base64 encoding
      const utf8Bytes = new TextEncoder().encode(jsonStr);
      let binString = '';
      utf8Bytes.forEach(byte => {
        binString += String.fromCharCode(byte);
      });
      return btoa(binString)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, ''); // URL-safe base64
    } catch (e) {
      console.error('Failed to encode URL state', e);
      return '';
    }
  },

  decode(hashStr: string): { id: string; vals: Record<string, string> } | null {
    if (!hashStr) return null;
    try {
      // Restore padding and standard base64 characters
      let base64 = hashStr.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const binString = atob(base64);
      const uint8Array = new Uint8Array(binString.length);
      for (let i = 0; i < binString.length; i++) {
        uint8Array[i] = binString.charCodeAt(i);
      }
      const jsonStr = new TextDecoder().decode(uint8Array);
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to decode URL state', e);
      return null;
    }
  }
};

// 5. PROMPT OPTIMIZER & STATISTICS
export interface OptimizerSuggestion {
  type: 'warning' | 'tip' | 'info';
  message: string;
  fieldId?: string;
}

export interface PromptMetrics {
  score: number;
  complexity: 'Low' | 'Medium' | 'High' | 'Expert';
  wordCount: number;
  charCount: number;
  suggestions: OptimizerSuggestion[];
}

export function analyzePrompt(
  template: PromptTemplate,
  values: Record<string, string>,
  compiledPrompt: string
): PromptMetrics {
  const suggestions: OptimizerSuggestion[] = [];
  let score = 100;

  // Word & character counts
  const wordCount = compiledPrompt.trim() ? compiledPrompt.trim().split(/\s+/).length : 0;
  const charCount = compiledPrompt.length;

  // Heuristic evaluations
  // Check required fields
  template.fields.forEach(field => {
    const val = (values[field.id] || '').trim();
    if (field.required && !val) {
      score -= 15;
      suggestions.push({
        type: 'warning',
        message: `Missing required input: "${field.label}" is highly critical for context.`,
        fieldId: field.id
      });
    } else if (val.length > 0 && val.length < 15 && field.type === 'textarea') {
      score -= 5;
      suggestions.push({
        type: 'tip',
        message: `Short description for "${field.label}". Provide more context (at least 15 characters) for better LLM output.`,
        fieldId: field.id
      });
    }
  });

  // Check specific keys
  const targetTech = (values['targetTechnology'] || '').trim();
  if (!targetTech) {
    score -= 10;
    suggestions.push({
      type: 'warning',
      message: 'No Target Technology specified. LLMs perform best with explicit tech stacks, frameworks, and versions.',
      fieldId: 'targetTechnology'
    });
  }

  const constraints = (values['constraints'] || '').trim();
  if (constraints === COMMON_FIELDS.constraints.defaultValue) {
    suggestions.push({
      type: 'info',
      message: 'Using default constraints. Customize these to define your specific testing boundaries.',
      fieldId: 'constraints'
    });
  }

  // Check for tool specification
  const tools = (values['requiredTools'] || '').trim();
  if (!tools) {
    suggestions.push({
      type: 'tip',
      message: 'Consider defining specific security tools (e.g., Burp, Ghidra) to generate exact tool commands.',
      fieldId: 'requiredTools'
    });
  }

  // Length constraints
  if (wordCount < 100) {
    score -= 10;
    suggestions.push({
      type: 'warning',
      message: 'Prompt length is short. Generative responses might lack depth. Consider expanding your context fields.'
    });
  } else if (wordCount > 600) {
    suggestions.push({
      type: 'info',
      message: 'Excellent granularity. The prompt contains rich system instructions and parameters.'
    });
  }

  // Ensure minimum score is 0
  score = Math.max(0, score);

  // Compute complexity classification
  let complexity: 'Low' | 'Medium' | 'High' | 'Expert' = 'Low';
  const filledFieldsCount = Object.values(values).filter(v => v.trim().length > 0).length;
  if (template.difficulty === 'Expert' || (filledFieldsCount >= 6 && wordCount > 400)) {
    complexity = 'Expert';
  } else if (template.difficulty === 'Advanced' || (filledFieldsCount >= 4 && wordCount > 250)) {
    complexity = 'High';
  } else if (filledFieldsCount >= 3) {
    complexity = 'Medium';
  }

  return {
    score,
    complexity,
    wordCount,
    charCount,
    suggestions
  };
}
