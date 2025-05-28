import { describe, test, expect } from 'vitest';
import createGraph from '../index.js';

describe('Graph Construction', () => {
  test('add node adds node', () => {
    const graph = createGraph();
    const customData = '31337';
    const node = graph.addNode(1, customData);
    
    expect(graph.getNodesCount()).toBe(1);
    expect(graph.getLinksCount()).toBe(0);
    expect(graph.getNode(1)).toBe(node);
    expect(node.data).toBe(customData);
    expect(node.id).toBe(1);
  });

  test('hasNode checks node', () => {
    const graph = createGraph();
    graph.addNode(1);
    
    expect(graph.hasNode(1)).toBe(true);
    expect(graph.hasNode(2)).toBe(false);
  });

  test('can add links', () => {
    const graph = createGraph();
    const link = graph.addLink('a', 'b', { weight: 1.5 });
    
    expect(graph.getNodesCount()).toBe(2);
    expect(graph.getLinksCount()).toBe(1);
    expect(link.fromId).toBe('a');
    expect(link.toId).toBe('b');
    expect(link.data.weight).toBe(1.5);
  });

  test('can remove nodes and links', () => {
    const graph = createGraph();
    graph.addLink('a', 'b');
    
    expect(graph.removeNode('a')).toBe(true);
    expect(graph.getNodesCount()).toBe(1);
    expect(graph.getLinksCount()).toBe(0);
  });

  test('can clear graph', () => {
    const graph = createGraph();
    graph.addLink('a', 'b');
    graph.addLink('b', 'c');
    
    graph.clear();
    expect(graph.getNodesCount()).toBe(0);
    expect(graph.getLinksCount()).toBe(0);
  });
});