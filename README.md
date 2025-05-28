# mgraph.graph

Modern graph data structure for JavaScript — A refactoring of ngraph.graph using mgraph.events

[![npm version](https://img.shields.io/npm/v/mgraph.graph.svg)](https://www.npmjs.com/package/mgraph.graph)
[![License](https://img.shields.io/npm/l/mgraph.graph.svg)](https://github.com/mfeldman143/mgraph.graph/blob/main/LICENSE)

## About This Project

**mgraph.graph** is a modern ES module refactoring of **ngraph.graph**, originally developed by [Andrei Kashcha](https://github.com/anvaka). This project retains the powerful graph functionality while updating it to modern JavaScript standards and using **mgraph.events** for the eventing system.

This project is **not affiliated with or endorsed by Andrei Kashcha**, and any modifications are the responsibility of the maintainers of **mgraph.graph**.

## Installation

### Via npm

```bash
npm install mgraph.graph
Via CDN
html<script src="https://cdn.jsdelivr.net/npm/mgraph.graph/dist/mgraph.graph.umd.min.js"></script>
When loaded from a CDN, the library is available as the global variable createGraph.
Quick Start
javascriptimport createGraph from 'mgraph.graph';

const graph = createGraph();
graph.addLink('hello', 'world');

console.log(graph.getNodesCount()); // 2
console.log(graph.getLinksCount()); // 1
Usage
Creating a Graph
javascriptimport createGraph from 'mgraph.graph';

// Create an empty graph
const graph = createGraph();

// Create a multigraph (allows multiple edges between same nodes)
const multigraph = createGraph({ multigraph: true });
Adding Nodes and Links
javascript// Add nodes explicitly
graph.addNode('alice');
graph.addNode('bob', { age: 25 }); // with data

// Add links (creates nodes automatically if they don't exist)
graph.addLink('alice', 'bob');
graph.addLink('bob', 'charlie', { weight: 0.8 }); // with data

// Self-loops are supported
graph.addLink('alice', 'alice');
Accessing Nodes and Links
javascript// Get specific nodes/links
const alice = graph.getNode('alice');
console.log(alice.id, alice.data);

const link = graph.getLink('alice', 'bob');
console.log(link.fromId, link.toId, link.data);

// Check existence
if (graph.hasNode('charlie')) {
  console.log('Charlie exists!');
}

if (graph.hasLink('alice', 'bob')) {
  console.log('Alice and Bob are connected!');
}
Enumerating Graph Elements
javascript// Iterate over all nodes
graph.forEachNode(node => {
  console.log(`Node: ${node.id}`, node.data);
});

// Iterate over all links
graph.forEachLink(link => {
  console.log(`Link: ${link.fromId} → ${link.toId}`, link.data);
});

// Iterate over neighbors of a specific node
graph.forEachLinkedNode('alice', (neighbor, link) => {
  console.log(`Alice is connected to ${neighbor.id}`);
});

// Iterate only outbound links
graph.forEachLinkedNode('alice', (neighbor, link) => {
  console.log(`Alice points to ${neighbor.id}`);
}, true); // true = outbound only
Event System
javascript// Listen for graph changes
graph.on('changed', changes => {
  changes.forEach(change => {
    if (change.node) {
      console.log(`Node ${change.changeType}:`, change.node.id);
    } else if (change.link) {
      console.log(`Link ${change.changeType}:`, change.link.id);
    }
  });
});

// Add elements (triggers events)
graph.addNode('newNode');
graph.addLink('alice', 'newNode');

// Batch updates (single event at the end)
graph.beginUpdate();
for (let i = 0; i < 100; i++) {
  graph.addNode(i);
}
graph.endUpdate(); // Single 'changed' event with all changes

// Stop listening
graph.off('changed', yourHandler);
Removing Elements
javascript// Remove specific node (also removes all its links)
graph.removeNode('alice');

// Remove specific link
const link = graph.getLink('bob', 'charlie');
graph.removeLink(link);

// Or remove link by node IDs
graph.removeLink('bob', 'charlie');

// Clear entire graph
graph.clear();
Graph Statistics
javascriptconsole.log(`Nodes: ${graph.getNodesCount()}`);
console.log(`Links: ${graph.getLinksCount()}`);

// Get all links for a specific node
const aliceLinks = graph.getLinks('alice');
if (aliceLinks) {
  console.log(`Alice has ${aliceLinks.size} connections`);
}
Framework Integration
React
jsximport { useEffect, useState } from 'react';
import createGraph from 'mgraph.graph';

function GraphComponent() {
  const [graph, setGraph] = useState(() => createGraph());
  const [stats, setStats] = useState({ nodes: 0, links: 0 });

  useEffect(() => {
    const updateStats = () => {
      setStats({
        nodes: graph.getNodesCount(),
        links: graph.getLinksCount()
      });
    };

    graph.on('changed', updateStats);
    updateStats();

    return () => graph.off('changed', updateStats);
  }, [graph]);

  const addRandomLink = () => {
    const nodeA = Math.floor(Math.random() * 10);
    const nodeB = Math.floor(Math.random() * 10);
    graph.addLink(nodeA, nodeB);
  };

  return (
    <div>
      <div>Nodes: {stats.nodes}, Links: {stats.links}</div>
      <button onClick={addRandomLink}>Add Random Link</button>
    </div>
  );
}
Vue
vue<template>
  <div>
    <div>Nodes: {{ stats.nodes }}, Links: {{ stats.links }}</div>
    <button @click="addRandomLink">Add Random Link</button>
  </div>
</template>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue';
import createGraph from 'mgraph.graph';

const graph = createGraph();
const stats = reactive({ nodes: 0, links: 0 });

const updateStats = () => {
  stats.nodes = graph.getNodesCount();
  stats.links = graph.getLinksCount();
};

const addRandomLink = () => {
  const nodeA = Math.floor(Math.random() * 10);
  const nodeB = Math.floor(Math.random() * 10);
  graph.addLink(nodeA, nodeB);
};

onMounted(() => {
  graph.on('changed', updateStats);
  updateStats();
});

onUnmounted(() => {
  graph.off('changed', updateStats);
});
</script>
Angular
typescriptimport { Component, OnInit, OnDestroy } from '@angular/core';
import createGraph from 'mgraph.graph';

@Component({
  selector: 'app-graph',
  template: `
    <div>
      <div>Nodes: {{ stats.nodes }}, Links: {{ stats.links }}</div>
      <button (click)="addRandomLink()">Add Random Link</button>
    </div>
  `
})
export class GraphComponent implements OnInit, OnDestroy {
  private graph = createGraph();
  stats = { nodes: 0, links: 0 };
  private changeHandler = () => this.updateStats();

  ngOnInit() {
    this.graph.on('changed', this.changeHandler);
    this.updateStats();
  }

  ngOnDestroy() {
    this.graph.off('changed', this.changeHandler);
  }

  addRandomLink() {
    const nodeA = Math.floor(Math.random() * 10);
    const nodeB = Math.floor(Math.random() * 10);
    this.graph.addLink(nodeA, nodeB);
  }

  private updateStats() {
    this.stats = {
      nodes: this.graph.getNodesCount(),
      links: this.graph.getLinksCount()
    };
  }
}
Advanced Usage
Building Social Networks
javascriptconst socialNetwork = createGraph();

// Add users with profile data
socialNetwork.addNode('alice', {
  name: 'Alice Johnson',
  age: 28,
  interests: ['coding', 'hiking', 'photography']
});

socialNetwork.addNode('bob', {
  name: 'Bob Smith', 
  age: 32,
  interests: ['gaming', 'cooking']
});

// Add relationships with metadata
socialNetwork.addLink('alice', 'bob', {
  relationship: 'friend',
  since: '2020-03-15',
  strength: 0.8
});

// Find mutual connections
function findMutualFriends(userId1, userId2) {
  const friends1 = new Set();
  const friends2 = new Set();
  
  socialNetwork.forEachLinkedNode(userId1, neighbor => {
    friends1.add(neighbor.id);
  });
  
  socialNetwork.forEachLinkedNode(userId2, neighbor => {
    friends2.add(neighbor.id);
  });
  
  return [...friends1].filter(id => friends2.has(id));
}
Building Dependency Graphs
javascriptconst dependencies = createGraph();

// Add packages with version info
dependencies.addNode('react', { version: '18.2.0' });
dependencies.addNode('react-dom', { version: '18.2.0' });
dependencies.addNode('typescript', { version: '5.0.0' });

// Add dependency relationships
dependencies.addLink('react-dom', 'react', { type: 'dependency' });
dependencies.addLink('my-app', 'react', { type: 'dependency' });
dependencies.addLink('my-app', 'typescript', { type: 'devDependency' });

// Find all dependencies of a package
function getAllDependencies(packageName, visited = new Set()) {
  if (visited.has(packageName)) return [];
  visited.add(packageName);
  
  const deps = [];
  dependencies.forEachLinkedNode(packageName, (dep, link) => {
    if (link.fromId === packageName) {
      deps.push(dep.id);
      deps.push(...getAllDependencies(dep.id, visited));
    }
  }, true); // outbound only
  
  return [...new Set(deps)];
}
Building Knowledge Graphs
javascriptconst knowledge = createGraph();

// Add concepts
knowledge.addNode('javascript', { type: 'programming-language' });
knowledge.addNode('react', { type: 'library' });
knowledge.addNode('web-development', { type: 'field' });

// Add semantic relationships
knowledge.addLink('react', 'javascript', { 
  relationship: 'built-with',
  confidence: 1.0 
});

knowledge.addLink('react', 'web-development', {
  relationship: 'used-in',
  confidence: 0.9
});

// Query related concepts
function getRelatedConcepts(concept, relationshipType) {
  const related = [];
  
  knowledge.forEachLinkedNode(concept, (neighbor, link) => {
    if (link.data.relationship === relationshipType) {
      related.push({
        concept: neighbor.id,
        confidence: link.data.confidence
      });
    }
  });
  
  return related.sort((a, b) => b.confidence - a.confidence);
}
API Reference
Graph Creation
createGraph(options?)
Parameters:

options.multigraph (boolean, default: false) - Allow multiple edges between same nodes

Returns: Graph instance
Node Operations
addNode(nodeId, data?)

nodeId (any) - Unique identifier for the node
data (any, optional) - Data to associate with the node
Returns: Node object

getNode(nodeId) / hasNode(nodeId)

Returns: Node object or undefined

removeNode(nodeId)

Returns: Boolean indicating success

getNodesCount()

Returns: Number of nodes in the graph

forEachNode(callback)

callback(node) - Function called for each node
Returns: Boolean (true if iteration was stopped early)

Link Operations
addLink(fromId, toId, data?)

fromId (any) - Source node ID
toId (any) - Target node ID
data (any, optional) - Data to associate with the link
Returns: Link object

getLink(fromId, toId) / hasLink(fromId, toId)

Returns: Link object or undefined

removeLink(link) / removeLink(fromId, toId)

Returns: Boolean indicating success

getLinksCount()

Returns: Number of links in the graph

getLinks(nodeId)

Returns: Set of links connected to the node, or null

forEachLink(callback)

callback(link) - Function called for each link
Returns: Boolean (true if iteration was stopped early)

forEachLinkedNode(nodeId, callback, oriented?)

nodeId (any) - Node to start from
callback(neighbor, link) - Function called for each connected node
oriented (boolean, optional) - If true, only follow outbound links
Returns: Boolean (true if iteration was stopped early)

Event Operations
on(eventName, callback)

Listen to graph changes ('changed' event)

off(eventName, callback)

Stop listening to events

beginUpdate() / endUpdate()

Batch multiple operations into a single event

Utility Operations
clear()

Remove all nodes and links from the graph

Data Structures
Node Object
typescript{
  id: any;           // Node identifier
  data: any;         // Associated data
  links: Set<Link>; // Connected links (internal)
}
Link Object
typescript{
  id: string;        // Internal link identifier
  fromId: any;       // Source node ID
  toId: any;         // Target node ID
  data: any;         // Associated data
}
Change Record
typescript{
  changeType: 'add' | 'remove' | 'update';
  node?: Node;       // Present for node changes
  link?: Link;       // Present for link changes
}
Performance

Node operations: O(1) average case (Map-based storage)
Link operations: O(1) average case for single links
Memory usage: Approximately 200 bytes per node, 150 bytes per link
Recommended limits: 100K+ nodes, 1M+ links perform well

Part of the mgraph Ecosystem

mgraph.graph - Core graph data structure ← You are here
mgraph.events - Event system
mgraph.forcelayout - Force-directed layouts
mgraph.generators - Graph generators
mgraph.fromdot - DOT file parser
mgraph.fromjson - JSON parser
mgraph.hde - High-dimensional embedding
mgraph.merge - Object merging utility
mgraph.random - Seeded random numbers

Migration from ngraph.graph
Most code should work unchanged:
javascript// Old (ngraph.graph)
const createGraph = require('ngraph.graph');
const graph = createGraph();

// New (mgraph.graph)
import createGraph from 'mgraph.graph';
const graph = createGraph();
Breaking changes:

ES modules only (no CommonJS)
Uses mgraph.events instead of ngraph.events
Some internal APIs may have changed

License
This project is released under the BSD 3-Clause License, in compliance with the original ngraph.graph licensing terms. See LICENSE for details.
Contributing
Issues and pull requests are welcome on GitHub.
Credits
Original ngraph.graph by Andrei Kashcha.
Modern mgraph.graph maintained by Michael Feldman.