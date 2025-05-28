// findConnectedComponents.mjs
import { test } from 'tap';
import createGraph from '../index.js';
import findConnectedComponents from '../examples/findConnectedComponents.js';

test('can find connected components', (t) => {
  const graph = createGraph();
  graph.addLink(1, 2);
  graph.addLink(2, 3);
  graph.addLink(5, 6);
  graph.addNode(8);
  graph.addLink(9, 9);
  
  const components = findConnectedComponents(graph);
  t.equal(components.length, 4, 'all components found');
  t.same(components[0], [1, 2, 3], 'first component found');
  t.same(components[1], [5, 6], 'second component found');
  t.same(components[2], [8], 'third component found');
  t.same(components[3], [9], 'fourth component found');
  t.end();
});
