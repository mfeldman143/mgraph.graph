
/**
 * mgraph.graph – A graph data structure for JavaScript.
 * Modern refactoring of ngraph.graph using mgraph.events.
 */

import eventify from 'mgraph.events';

export default function createGraph(options = {}) {
  // Support legacy option; prefer using { multigraph: true }.
  if ('uniqueLinkId' in options) {
    console.warn(
      'mgraph.graph: `uniqueLinkId` is deprecated. Use `multigraph` instead.'
    );
    options.multigraph = options.uniqueLinkId;
  }
  if (options.multigraph === undefined) options.multigraph = false;
  if (typeof Map !== 'function') {
    throw new Error('mgraph.graph requires Map to be defined. Please polyfill it.');
  }

  const nodes = new Map(); // nodeId => Node
  const links = new Map(); // linkId => Link
  const multiEdges = {};
  let suspendEvents = 0;
  const changes = [];
  let recordLinkChange = noop;
  let recordNodeChange = noop;
  let enterModification = noop;
  let exitModification = noop;

  // Depending on options create single or unique links:
  const createLink = options.multigraph ? createUniqueLink : createSingleLink;

  const graph = {
    version: 1.0,

    addNode,
    addLink,
    removeLink,
    removeNode,
    getNode,
    hasNode: getNode,
    getLink,
    hasLink: getLink,
    getNodeCount,
    getNodesCount: getNodeCount,
    getLinkCount,
    getLinksCount: getLinkCount,
    getLinks,
    forEachNode,
    forEachLink,
    forEachLinkedNode,
    beginUpdate: enterModificationReal,
    endUpdate: exitModificationReal,
    clear
  };

  // Add event methods (on, off, fire) from mgraph.events:
  eventify(graph);
  monitorSubscribers();
  return graph;

  function monitorSubscribers() {
    const realOn = graph.on;
    graph.on = function (...args) {
      // Switch on event recording once someone subscribes:
      graph.beginUpdate = enterModification = enterModificationReal;
      graph.endUpdate = exitModification = exitModificationReal;
      recordLinkChange = recordLinkChangeReal;
      recordNodeChange = recordNodeChangeReal;
      graph.on = realOn;
      return realOn.apply(graph, args);
    };
  }

  function recordLinkChangeReal(link, changeType) {
    changes.push({ link, changeType });
  }

  function recordNodeChangeReal(node, changeType) {
    changes.push({ node, changeType });
  }

  function addNode(nodeId, data) {
    if (nodeId === undefined) throw new Error('Invalid node identifier');
    enterModification();
    let node = getNode(nodeId);
    if (!node) {
      node = new Node(nodeId, data);
      recordNodeChange(node, 'add');
    } else {
      node.data = data;
      recordNodeChange(node, 'update');
    }
    nodes.set(nodeId, node);
    exitModification();
    return node;
  }

  function getNode(nodeId) {
    return nodes.get(nodeId);
  }

  function removeNode(nodeId) {
    const node = getNode(nodeId);
    if (!node) return false;
    enterModification();
    if (node.links) {
      node.links.forEach(removeLinkInstance);
      node.links = null;
    }
    nodes.delete(nodeId);
    recordNodeChange(node, 'remove');
    exitModification();
    return true;
  }

  function addLink(fromId, toId, data) {
    enterModification();
    const fromNode = getNode(fromId) || addNode(fromId);
    const toNode = getNode(toId) || addNode(toId);
    const link = createLink(fromId, toId, data);
    const isUpdate = links.has(link.id);
    links.set(link.id, link);
    addLinkToNode(fromNode, link);
    if (fromId !== toId) addLinkToNode(toNode, link);
    recordLinkChange(link, isUpdate ? 'update' : 'add');
    exitModification();
    return link;
  }

  function createSingleLink(fromId, toId, data) {
    const linkId = makeLinkId(fromId, toId);
    const prevLink = links.get(linkId);
    if (prevLink) {
      prevLink.data = data;
      return prevLink;
    }
    return new Link(fromId, toId, data, linkId);
  }

  function createUniqueLink(fromId, toId, data) {
    let linkId = makeLinkId(fromId, toId);
    const isMultiEdge = Object.prototype.hasOwnProperty.call(multiEdges, linkId);
    if (isMultiEdge || getLink(fromId, toId)) {
      if (!isMultiEdge) multiEdges[linkId] = 0;
      const suffix = '@' + (++multiEdges[linkId]);
      linkId = makeLinkId(fromId + suffix, toId + suffix);
    }
    return new Link(fromId, toId, data, linkId);
  }

  function getNodeCount() {
    return nodes.size;
  }

  function getLinkCount() {
    return links.size;
  }

  function getLinks(nodeId) {
    const node = getNode(nodeId);
    return node ? node.links : null;
  }

  function removeLink(link, otherId) {
    if (otherId !== undefined) link = getLink(link, otherId);
    return removeLinkInstance(link);
  }

  function removeLinkInstance(link) {
    if (!link || !links.get(link.id)) return false;
    enterModification();
    links.delete(link.id);
    const fromNode = getNode(link.fromId);
    const toNode = getNode(link.toId);
    if (fromNode && fromNode.links) fromNode.links.delete(link);
    if (toNode && toNode.links) toNode.links.delete(link);
    recordLinkChange(link, 'remove');
    exitModification();
    return true;
  }

  function getLink(fromNodeId, toNodeId) {
    if (fromNodeId === undefined || toNodeId === undefined) return undefined;
    return links.get(makeLinkId(fromNodeId, toNodeId));
  }

  function clear() {
    enterModification();
    nodes.forEach(node => removeNode(node.id));
    exitModification();
  }

  function forEachLink(callback) {
    for (const link of links.values()) {
      if (callback(link)) return true;
    }
  }

  function forEachLinkedNode(nodeId, callback, oriented) {
    const node = getNode(nodeId);
    if (node && node.links && typeof callback === 'function') {
      return oriented
        ? forEachOrientedLink(node.links, nodeId, callback)
        : forEachNonOrientedLink(node.links, nodeId, callback);
    }
  }

  function forEachNonOrientedLink(linksSet, nodeId, callback) {
    for (const link of linksSet.values()) {
      const linkedNodeId = link.fromId === nodeId ? link.toId : link.fromId;
      if (callback(nodes.get(linkedNodeId), link)) return true;
    }
  }

  function forEachOrientedLink(linksSet, nodeId, callback) {
    for (const link of linksSet.values()) {
      if (link.fromId === nodeId && callback(nodes.get(link.toId), link)) return true;
    }
  }

  function forEachNode(callback) {
    for (const node of nodes.values()) {
      if (callback(node)) return true;
    }
  }

  function enterModificationReal() {
    suspendEvents++;
  }

  function exitModificationReal() {
    suspendEvents--;
    if (suspendEvents === 0 && changes.length > 0) {
      graph.fire('changed', changes);
      changes.length = 0;
    }
  }

  function noop() {}
}

function Node(id, data) {
  this.id = id;
  this.links = null;
  this.data = data;
}

function addLinkToNode(node, link) {
  if (node.links) {
    node.links.add(link);
  } else {
    node.links = new Set([link]);
  }
}

function Link(fromId, toId, data, id) {
  this.fromId = fromId;
  this.toId = toId;
  this.data = data;
  this.id = id;
}

function makeLinkId(fromId, toId) {
  return fromId.toString() + '👉' + toId.toString();
}
