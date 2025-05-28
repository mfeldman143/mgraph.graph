/**
 * Type definitions for mgraph.graph
 */

import { EventedType } from 'mgraph.events';

export type NodeId = string | number;
export type LinkId = string;

export interface Link<Data = any> {
  id: LinkId;
  fromId: NodeId;
  toId: NodeId;
  data: Data;
}

export interface Node<Data = any> {
  id: NodeId;
  links: Set<Link<any>> | null;
  data: Data;
}

export interface Graph<NodeData = any, LinkData = any> extends EventedType {
  addNode(node: NodeId, data?: NodeData): Node<NodeData>;
  addLink(from: NodeId, to: NodeId, data?: LinkData): Link<LinkData>;
  removeLink(link: Link<LinkData>): boolean;
  removeNode(nodeId: NodeId): boolean;
  getNode(nodeId: NodeId): Node<NodeData> | undefined;
  hasNode(nodeId: NodeId): Node<NodeData> | undefined;
  getLink(fromNodeId: NodeId, toNodeId: NodeId): Link<LinkData> | undefined;
  hasLink(fromNodeId: NodeId, toNodeId: NodeId): Link<LinkData> | undefined;
  getNodesCount(): number;
  getNodeCount(): number;
  getLinksCount(): number;
  getLinkCount(): number;
  getLinks(nodeId: NodeId): Set<Link<LinkData>> | null;
  forEachNode(callback: (node: Node<NodeData>) => void | boolean): void;
  forEachLink(callback: (link: Link<LinkData>) => void | boolean): void;
  forEachLinkedNode(
    nodeId: NodeId,
    callback: (otherNode: Node<NodeData>, link: Link<LinkData>) => void,
    oriented?: boolean
  ): void;
  beginUpdate(): void;
  endUpdate(): void;
  clear(): void;
}

export default function createGraph<NodeData = any, LinkData = any>(
  options?: { multigraph?: boolean }
): Graph<NodeData, LinkData>;
