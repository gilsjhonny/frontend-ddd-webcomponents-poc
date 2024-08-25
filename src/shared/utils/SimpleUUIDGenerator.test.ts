import { describe, it, expect } from 'vitest';
import { SimpleUUIDGenerator } from './SimpleUUIDGenerator';

describe('SimpleUUIDGenerator', () => {
  it('should generate an ID that matches the expected format', () => {
    const id = SimpleUUIDGenerator.generateId();

    // Expected format: "timestamp-randomPart"
    const idPattern = /^[a-z0-9]+-[a-z0-9]+$/;
    expect(id).toMatch(idPattern);
  });

  it('should generate unique IDs on successive calls', () => {
    const id1 = SimpleUUIDGenerator.generateId();
    const id2 = SimpleUUIDGenerator.generateId();

    expect(id1).not.toBe(id2);
  });

  it('should generate IDs with a random part of expected length', () => {
    const id = SimpleUUIDGenerator.generateId();
    const randomPart = id.split('-')[1];

    // Check that the random part is 8 characters long
    expect(randomPart.length).toBe(8);
  });
});
