// iteration.mjs
import { test } from 'tap';
import createGraph from '../index.js';

test('forEachNode iterates nodes and quits fast when requested', (t) => {
  const graph = createGraph();
  graph.addNode(1);
  graph.addNode(2);
  let count = 0;
  const fastQuit = graph.forEachNode((node) => {
    count++;
    return count === 1;
  });
  t.ok(fastQuit, 'Iteration stopped early');
  t.end();
});

test('forEachLink iterates over links', (t) => {
  const graph = createGraph();
  graph.addLink(1, 2);
  let visited = 0;
  graph.forEachLink((link) => {
    visited++;
  });
  t.equal(visited, 1, 'visited exactly one link');
  t.end();
});
