/**
 * @summary
 * In-memory store instance for InitExample entity.
 * Provides singleton pattern for data storage without database.
 *
 * @module instances/initExample/initExampleStore
 */

import { INIT_EXAMPLE_DEFAULTS } from '@/constants/initExample';

/**
 * InitExample record structure
 */
export interface InitExampleRecord {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  metadata?: {
    category: string;
    priority: 'low' | 'medium' | 'high';
  };
  dateCreated: string;
  dateModified: string;
}

/**
 * In-memory store for InitExample records
 */
class InitExampleStore {
  private records: Map<number, InitExampleRecord> = new Map();
  private currentId: number = 0;

  /**
   * Get next available ID
   */
  getNextId(): number {
    this.currentId += 1;
    return this.currentId;
  }

  /**
   * Get all records
   */
  getAll(): InitExampleRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Get record by ID
   */
  getById(id: number): InitExampleRecord | undefined {
    return this.records.get(id);
  }

  /**
   * Add new record
   */
  add(record: InitExampleRecord): InitExampleRecord {
    if (this.records.size >= INIT_EXAMPLE_DEFAULTS.MAX_RECORDS) {
      throw new Error('Maximum records limit reached');
    }
    this.records.set(record.id, record);
    return record;
  }

  /**
   * Update existing record
   */
  update(id: number, data: Partial<InitExampleRecord>): InitExampleRecord | undefined {
    const existing = this.records.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...data };
    this.records.set(id, updated);
    return updated;
  }

  /**
   * Delete record by ID
   */
  delete(id: number): boolean {
    return this.records.delete(id);
  }

  /**
   * Check if record exists
   */
  exists(id: number): boolean {
    return this.records.has(id);
  }

  /**
   * Get total count of records
   */
  count(): number {
    return this.records.size;
  }

  /**
   * Clear all records (useful for testing)
   */
  clear(): void {
    this.records.clear();
    this.currentId = 0;
  }
}

/**
 * Singleton instance of InitExampleStore
 */
export const initExampleStore = new InitExampleStore();
