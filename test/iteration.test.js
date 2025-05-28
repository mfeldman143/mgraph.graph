import { describe, test, expect } from 'vitest';
import createGraph from '../index.js';

describe('Graph Iteration', () => {
  test('forEachNode iterates nodes and quits fast when requested', () => {
    const graph = createGraph();
    graph.addNode(1);
    graph.addNode(2);
    
    let count = 0;
    const fastQuit = graph.forEachNode((node) => {
      count++;
      return count === 1;
    });
    
    expect(fastQuit).toBe(true);
    expect(count).toBe(1);
  });

  test('forEachLink iterates over links', () => {
    const graph = createGraph();
    graph.addLink(1, 2);
    
    let visited = 0;
    graph.forEachLink((link) => {
      visited++;
    });
    
    expect(visited).toBe(1);
  });

  test('forEachLinkedNode iterates neighbors', () => {
    const graph = createGraph();
    graph.addLink('a', 'b');
    graph.addLink('a', 'c');
    
    const neighbors = [];
    graph.forEachLinkedNode('a', (neighbor) => {
      neighbors.push(neighbor.id);
    });
    
    expect(neighbors).toEqual(expect.arrayContaining(['b', 'c']));
    expect(neighbors.length).toBe(2);
  });

  test('forEachLinkedNode respects oriented parameter', () => {
    const graph = createGraph();
    graph.addLink('a', 'b');
    graph.addLink('c', 'a');
    
    const outbound = [];
    graph.forEachLinkedNode('a', (neighbor) => {
      outbound.push(neighbor.id);
    }, true); // oriented = true
    
    expect(outbound).toEqual(['b']);
  });
});