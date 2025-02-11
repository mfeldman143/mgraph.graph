export default function hasCycles(graph) {
  const visited = new Set();
  let hasCycle = false;

  graph.forEachNode((node) => {
    if (hasCycle || visited.has(node.id)) return;

    dfs(graph, node.id, (otherNode) => {
      if (visited.has(otherNode.id)) {
        hasCycle = true;
        return false;
      }
      visited.add(otherNode.id);
      return true;
    });
  });

  return hasCycle;
}

function dfs(graph, startFromNodeId, visitor) {
  const queue = [startFromNodeId];
  while (queue.length) {
    const nodeId = queue.pop();
    graph.forEachLinkedNode(nodeId, (otherNode) => {
      if (visitor(otherNode)) queue.push(otherNode.id);
    }, true);
  }
}
