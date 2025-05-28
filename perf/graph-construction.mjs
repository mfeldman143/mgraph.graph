// graph-construction.mjs
import createGraph from '../index.js';
import mgraphRandom from 'mgraph.random';
import Benchmark from 'benchmark';

const suite = new Benchmark.Suite();

suite.add('Adding 5,000 edges', () => {
  const graph = createGraph();
  for (let i = 1; i < 5000; i++) {
    graph.addLink(i, i - 1, i);
  }
});

suite.add('Adding 5,000 multigraph edges', () => {
  const graph = createGraph({ multigraph: true });
  for (let i = 1; i < 5000; i++) {
    graph.addLink(i, i - 1, i);
  }
});

suite.add('Adding 5,000 random edges', () => {
  const graph = createGraph();
  const randomGenerator = mgraphRandom(42);
  const maxEdgeId = 10000000;
  for (let i = 1; i < 5000; i++) {
    const fromId = randomGenerator.next(maxEdgeId);
    const toId = randomGenerator.next(maxEdgeId);
    graph.addLink(fromId, toId, i);
  }
});

suite.add('Adding 5,000 random edges to multigraph', () => {
  const graph = createGraph({ multigraph: true });
  const randomGenerator = mgraphRandom(42);
  const maxEdgeId = 10000000;
  for (let i = 1; i < 5000; i++) {
    const fromId = randomGenerator.next(maxEdgeId);
    const toId = randomGenerator.next(maxEdgeId);
    graph.addLink(fromId, toId, i);
  }
});

suite.add('Adding 5,000 random edges and randomly removing them', () => {
  const graph = createGraph();
  const randomGenerator = mgraphRandom(42);
  const maxEdgeId = 10000000;
  for (let i = 1; i < 5000; i++) {
    const fromId = randomGenerator.next(maxEdgeId);
    const toId = randomGenerator.next(maxEdgeId);
    graph.addLink(fromId, toId, i);
  }
  for (let i = 1; i < 15000; i++) {
    const fromId = randomGenerator.next(maxEdgeId);
    const toId = randomGenerator.next(maxEdgeId);
    graph.removeLink(fromId, toId);
  }
});

suite.add('Adding 5,000 random edges to multigraph and randomly removing them', () => {
  const graph = createGraph({ multigraph: true });
  const randomGenerator = mgraphRandom(42);
  const maxEdgeId = 10000000;
  for (let i = 1; i < 15000; i++) {
    const fromId = randomGenerator.next(maxEdgeId);
    const toId = randomGenerator.next(maxEdgeId);
    graph.addLink(fromId, toId, i);
  }
  for (let i = 1; i < 5000; i++) {
    const fromId = randomGenerator.next(maxEdgeId);
    const toId = randomGenerator.next(maxEdgeId);
    graph.removeLink(fromId, toId);
  }
});

suite.add('Removing all edges one by one from 5k graph', () => {
  const graph = createGraph();
  const randomGenerator = mgraphRandom(42);
  const maxEdgeId = 10000000;
  for (let i = 1; i < 5000; i++) {
    const fromId = randomGenerator.next(maxEdgeId);
    const toId = randomGenerator.next(maxEdgeId);
    graph.addLink(fromId, toId, i);
  }
  const links = [];
  graph.forEachLink(link => links.push(link));
  for (let i = 0; i < links.length; i++) {
    graph.removeLink(links[i]);
  }
});

suite.add('Removing all edges one by one from 5k multigraph graph', () => {
  const graph = createGraph({ multigraph: true });
  const randomGenerator = mgraphRandom(42);
  const maxEdgeId = 10000000;
  for (let i = 1; i < 5000; i++) {
    const fromId = randomGenerator.next(maxEdgeId);
    const toId = randomGenerator.next(maxEdgeId);
    graph.addLink(fromId, toId, i);
  }
  const links = [];
  graph.forEachLink(link => links.push(link));
  for (let i = 0; i < links.length; i++) {
    graph.removeLink(links[i]);
  }
});

suite.on('cycle', event => {
  console.log(String(event.target));
});

suite.run({ async: true });
