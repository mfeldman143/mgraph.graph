// hasCycles.test.js
import { describe, test, expect } from 'vitest';
import createGraph from '../index.js';
import hasCycle from '../examples/hasCycles.js';

describe('Cycle Detection', () => {
  test('can detect cycles', () => {
    const graph = createGraph();
    graph.addLink(1, 2);
    graph.addLink(2, 3);
    graph.addLink(3, 6);
    graph.addLink(6, 1);
    
    expect(hasCycle(graph)).toBe(true);
  });

  test('detects absence of cycles', () => {
    const graph = createGraph();
    graph.addLink(1, 2);
    graph.addLink(2, 3);
    graph.addLink(3, 6);
    
    expect(hasCycle(graph)).toBe(false);
  });

  test('handles self-loops', () => {
    const graph = createGraph();
    graph.addLink(1, 1);
    
    expect(hasCycle(graph)).toBe(true);
  });

  test('handles empty graph', () => {
    const graph = createGraph();
    
    expect(hasCycle(graph)).toBe(false);
  });
});