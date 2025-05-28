// hasCycles.mjs
import { test } from 'tap';
import createGraph from '../index.js';
import hasCycle from '../examples/hasCycles.js';

test('can detect cycles', (t) => {
  const graph = createGraph();
  graph.addLink(1, 2);
  graph.addLink(2, 3);
  graph.addLink(3, 6);
  graph.addLink(6, 1);
  t.ok(hasCycle(graph), 'cycle found');
  t.end();
});

test('detects absence of cycles', (t) => {
  const graph = createGraph();
  graph.addLink(1, 2);
  graph.addLink(2, 3);
  graph.addLink(3, 6);
  t.notOk(hasCycle(graph), 'no cycle found');
  t.end();
});
