import Benchmark from 'benchmark';
import createGraph from '../index.js';

const numberOfNodes = 10000;
const suite = new Benchmark.Suite();
const graph = createGraph();

for (let i = 0; i < numberOfNodes; i++) {
  graph.addNode('hello' + i, i);
}

let sum = 0;

suite.add('forEachNode', () => {
  let localSum = 0;
  graph.forEachNode(node => {
    localSum += node.data;
  });
  sum = localSum;
})
.on('cycle', event => {
  console.log(String(event.target));
})
.on('complete', function () {
  console.log(sum);
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ async: true });
