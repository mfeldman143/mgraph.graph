import { test } from 'tap';
import createGraph from '../index.js';

test('add node adds node', (t) => {
  const graph = createGraph();
  const customData = '31337';
  const node = graph.addNode(1, customData);
  t.equal(graph.getNodesCount(), 1, 'exactly one node');
  t.equal(graph.getLinksCount(), 0, 'no links');
  t.equal(graph.getNode(1), node, 'invalid node returned by addNode/getNode');
  t.equal(node.data, customData, 'data was not set properly');
  t.equal(node.id, 1, 'node id was not set properly');
  t.end();
});

test('hasNode checks node', (t) => {
  const graph = createGraph();
  graph.addNode(1);
  t.ok(graph.hasNode(1), 'node is there');
  t.notOk(graph.hasNode(2), 'should not be here');
  t.end();
});
