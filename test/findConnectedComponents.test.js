// findConnectedComponents.test.js
import { describe, test, expect } from 'vitest';
import createGraph from '../index.js';
import findConnectedComponents from '../examples/findConnectedComponents.js';

describe('Connected Components', () => {
  test('can find connected components', () => {
    const graph = createGraph();
    graph.addLink(1, 2);
    graph.addLink(2, 3);
    graph.addLink(5, 6);
    graph.addNode(8);
    graph.addLink(9, 9);

    const components = findConnectedComponents(graph);
    
    expect(components.length).toBe(4);
    expect(components[0]).toEqual([1, 2, 3]);
    expect(components[1]).toEqual([5, 6]);
    expect(components[2]).toEqual([8]);
    expect(components[3]).toEqual([9]);
  });

  test('handles empty graph', () => {
    const graph = createGraph();
    const components = findConnectedComponents(graph);
    
    expect(components).toEqual([]);
  });

  test('handles single node', () => {
    const graph = createGraph();
    graph.addNode('alone');
    
    const components = findConnectedComponents(graph);
    
    expect(components).toEqual([['alone']]);
  });
});