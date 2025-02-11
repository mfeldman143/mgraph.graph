import createGraph from '../index.js';
import mgraphRandom from 'mgraph.random';
import Benchmark from 'benchmark';

const suite = new Benchmark.Suite();

let edgeIterationSumWeight = 0;
let edgeIterationMultigraph = 0;

suite.add('Edge iteration', () => {
  const graph = createGraph();
  const randomGenerator = mgraphRandom(42);
  const maxEdgeId = 10000000;
  for (let i = 1; i < 1000; i++) {
    const fromId = randomGenerator.next(maxEdgeId);
    const toId = randomGenerator.next(maxEdgeId);
    graph.addLink(fromId, toId, i);
  }
  edgeIterationSumWeight = 0;
  for (let i = 0; i < 100; i++) {
    graph.forEachLink(link => {
      edgeIterationSumWeight += link.data;
    });
  }
});

suite.add('Edge iteration for multigraph', () => {
  const graph = createGraph({ multigraph: true });
  const randomGenerator = mgraphRandom(42);
  const maxEdgeId = 10000000;
  for (let i = 1; i < 1000; i++) {
    const fromId = randomGenerator.next(maxEdgeId);
    const toId = randomGenerator.next(maxEdgeId);
    graph.addLink(fromId, toId, i);
  }
  edgeIterationMultigraph = 0;
  for (let i = 0; i < 100; i++) {
    graph.forEachLink(link => {
      edgeIterationMultigraph += link.data;
    });
  }
});

suite.on('cycle', event => {
  console.log(String(event.target));
  console.log('edge iteration sum weight', edgeIterationSumWeight);
  console.log('edge iteration multigraph weight', edgeIterationMultigraph);
});

suite.run({ async: true });
