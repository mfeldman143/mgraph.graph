# mgraph.graph

Graph data structure for JavaScript. This library is a modern refactoring of [ngraph.graph](https://github.com/anvaka/ngraph.graph) that now uses [mgraph.events](https://www.npmjs.com/package/mgraph.events) for eventing.

[![build status](https://img.shields.io/travis/mfeldman143/mgraph.graph.svg)](https://travis-ci.org/mfeldman143/mgraph.graph)

## Install

Using npm:

```npm install mgraph.graph```

Or via CDN:
```<script src="https://unpkg.com/mgraph.graph/dist/mgraph.graph.min.js"></script>```

When loaded from CDN the library is available as the global variable createGraph.

Creating a Graph
Create an empty graph:

import createGraph from 'mgraph.graph';
const g = createGraph();
Growing a Graph
Add nodes one at a time:

g.addNode('hello');
g.addNode('world');
Or add a link (which creates nodes if needed):

g.addLink('space', 'bar'); // creates nodes "space" and "bar"
g.addLink('hello', 'world'); // connects existing nodes
Data on Nodes and Links
Associate data when adding nodes/links:

g.addNode('world', 'custom data');
g.addLink(1, 2, { weight: 1 });
Access data via node.data or link.data.

Enumerating Nodes and Links

g.forEachNode(node => console.log(node.id, node.data));

g.forEachLink(link => console.dir(link));

// For a given node (both inbound/outbound):
g.forEachLinkedNode('hello', (otherNode, link) => {
  console.log("Connected:", otherNode.id);
});

// For outbound links only:
g.forEachLinkedNode('hello', (otherNode, link) => {
  console.log("Outbound:", otherNode.id);
}, true);
Listening to Events
Graph changes are broadcast on the 'changed' event:

g.on('changed', changes => {
  console.dir(changes);
});

g.addLink(42, 43); // triggers a change event
Each change record contains a changeType (add, remove, or update) plus either a node or link property.

Bulk updates can be wrapped between beginUpdate() and endUpdate().

Removing Nodes and Links

g.removeNode('space');

g.forEachLinkedNode('hello', (other, link) => {
  g.removeLink(link);
});

g.clear(); // removes all nodes and links
License
BSD 3-Clause