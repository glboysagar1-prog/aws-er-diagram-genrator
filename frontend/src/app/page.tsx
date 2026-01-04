
'use client';
import { useCallback, useState } from "react";
import { Canvas } from "@/components/diagram/Canvas";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { useNodesState, useEdgesState, addEdge, Connection, Node, Edge } from '@xyflow/react';
import ArchitectureGroupNode from "@/components/diagram/ArchitectureGroupNode";
import EntityNode from "@/components/diagram/EntityNode";
import { SchemaPanel } from "@/components/diagram/SchemaPanel";
import { DiagramTabs } from "@/components/diagram/DiagramTabs";
import { AwsServiceNode } from "@/components/diagram/AwsServiceNode";
import RelationshipNode from "@/components/diagram/RelationshipNode";
import AttributeNode from "@/components/diagram/AttributeNode";
import { getAwsIconPath, getAwsServiceName, getAwsCategory } from "@/utils/aws-icons";
import dagre from 'dagre';

const nodeTypes = {
  awsService: AwsServiceNode,
  group: ArchitectureGroupNode,
  entity: EntityNode,
  relationship: RelationshipNode,
  attribute: AttributeNode,
};

const nodeWidth = 150;
const nodeHeight = 100;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph({ compound: true });
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'LR', align: 'UL', nodesep: 50, ranksep: 50, marginx: 50, marginy: 50 });

  nodes.forEach((node) => {
    // For groups, we set a min size, but dagre will expand it to fit children
    if (node.type === 'group') {
      dagreGraph.setNode(node.id, { label: node.data.label, width: 100, height: 100 });
    } else {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight, label: node.data.label });
    }

    if (node.parentId) {
      dagreGraph.setParent(node.id, node.parentId);
    }
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // First pass: Capture all absolute positions and dimensions from Dagre
  const absoluteProps = new Map();
  nodes.forEach((node) => {
    const dagreNode = dagreGraph.node(node.id);
    absoluteProps.set(node.id, {
      x: dagreNode.x - dagreNode.width / 2,
      y: dagreNode.y - dagreNode.height / 2,
      width: dagreNode.width,
      height: dagreNode.height
    });
  });

  // Second pass: Convert to relative positions for React Flow
  const layoutedNodes = nodes.map((node) => {
    const props = absoluteProps.get(node.id);
    let position = { x: props.x, y: props.y };

    if (node.parentId) {
      const parentProps = absoluteProps.get(node.parentId);
      if (parentProps) {
        position = {
          x: props.x - parentProps.x,
          y: props.y - parentProps.y
        };
      }
    }

    return {
      ...node,
      position,
      style: node.type === 'group' ? {
        width: props.width,
        height: props.height,
        zIndex: -1
      } : node.style,
    };
  });

  return { nodes: layoutedNodes, edges };
};

export default function Home() {
  // Dual State: Architecture vs ERD
  const [activeTab, setActiveTab] = useState<'architecture' | 'erd'>('architecture');

  const [archNodes, setArchNodes, onArchNodesChange] = useNodesState<Node>([]);
  const [archEdges, setArchEdges, onArchEdgesChange] = useEdgesState<Edge>([]);

  const [erdNodes, setErdNodes, onErdNodesChange] = useNodesState<Node>([]);
  const [erdEdges, setErdEdges, onErdEdgesChange] = useEdgesState<Edge>([]);

  // Connect handler based on active tab
  const onConnect = useCallback(
    (params: Connection) => {
      if (activeTab === 'architecture') setArchEdges((eds) => addEdge(params, eds));
      else setErdEdges((eds) => addEdge(params, eds));
    },
    [activeTab, setArchEdges, setErdEdges],
  );

  const onDiagramGenerated = useCallback((data: { nodes: any[], edges: any[], groups?: any[] }) => {
    // 1. Pre-process Groups (usually Architecture)
    let groupNodes: Node[] = [];
    if (data.groups) {
      groupNodes = data.groups.map(group => ({
        id: group.id,
        type: 'group',
        position: { x: 0, y: 0 },
        parentId: group.groupId,
        extent: group.groupId ? 'parent' : undefined,
        data: { label: group.label, type: group.type, isInner: !!group.groupId },
        style: { width: 0, height: 0 },
      }));
    }

    // 2. Pre-process all Service/Entity Nodes
    const itemNodes = data.nodes.map((node) => {
      const isEntity = Array.isArray(node.fields) && node.fields.length > 0;

      // Determine node type based on AI metadata or our logic
      let type = isEntity ? 'entity' : 'awsService';
      if (node.type === 'relationship') type = 'relationship';
      if (node.type === 'attribute') type = 'attribute';

      return {
        id: node.id,
        type,
        position: { x: 0, y: 0 },
        parentId: node.groupId,
        extent: (node.groupId ? 'parent' : undefined) as any,
        data: {
          title: node.title,
          subtitle: node.subtitle || getAwsServiceName(node.serviceType),
          label: node.title || node.label || (isEntity ? 'Table' : undefined),
          iconPath: getAwsIconPath(node.serviceType),
          category: getAwsCategory(node.serviceType),
          fields: node.fields
        }
      };
    });

    // 3. Separation Logic
    const erdNodeTypes = ['entity', 'relationship', 'attribute'];
    const erdItemNodes = itemNodes.filter((n: any) => erdNodeTypes.includes(n.type));
    const architectureItemNodes = itemNodes.filter((n: any) => !erdNodeTypes.includes(n.type));

    // Identify which groups belong where
    const erdGroupIds = new Set(erdItemNodes.map((n: any) => n.parentId).filter(id => !!id));

    // Simple rule: if a group has an ERD node as a child, it's an ERD group.
    // Otherwise it's an architecture group.
    const erdGroups = groupNodes.filter(gn => erdGroupIds.has(gn.id));
    const archGroups = groupNodes.filter(gn => !erdGroupIds.has(gn.id));

    // IMPORTANT: Parent nodes MUST come before children in React Flow
    const finalizedErdNodes = [...erdGroups, ...erdItemNodes];
    const finalizedArchNodes = [...archGroups, ...architectureItemNodes];

    // 4. Edge Separation
    const erdNodeIds = new Set(finalizedErdNodes.map((n: any) => n.id));
    const archNodeIds = new Set(finalizedArchNodes.map((n: any) => n.id));

    const allEdges = data.edges.map((edge, idx) => ({
      id: `e${edge.source}-${edge.target}-${idx}`,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: true,
      style: { stroke: '#94a3b8', strokeWidth: 2 },
      labelStyle: { fill: '#64748b', fontWeight: 500 },
    }));

    const erdEdgesList = allEdges.filter(e => erdNodeIds.has(e.source) && erdNodeIds.has(e.target));
    const archEdgesList = allEdges.filter(e => archNodeIds.has(e.source) && archNodeIds.has(e.target));

    // 5. Layout Independent Graphs
    const { nodes: layoutedArchNodes, edges: layoutedArchEdges } = getLayoutedElements(finalizedArchNodes as any, archEdgesList);
    const { nodes: layoutedErdNodes, edges: layoutedErdEdges } = getLayoutedElements(finalizedErdNodes as any, erdEdgesList);

    // 6. Update Both States
    setArchNodes(layoutedArchNodes);
    setArchEdges(layoutedArchEdges);

    setErdNodes(layoutedErdNodes);
    setErdEdges(layoutedErdEdges);

    // 7. Intelligent Tab Switching
    // If we have ERD nodes but NO Architecture nodes, switch to ERD.
    // Otherwise, typically default to Architecture (or keep current if mixed? defaulting to Arch is standard).
    if (layoutedErdNodes.length > 0 && layoutedArchNodes.length === 0) {
      setActiveTab('erd');
    } else if (layoutedArchNodes.length > 0) {
      setActiveTab('architecture');
    }
    // If mixed, it defaults to Architecture but ERD tab is populated.

  }, [setArchNodes, setArchEdges, setErdNodes, setErdEdges, setActiveTab]);

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Left Sidebar: Chat Interface */}
      <div className="w-[400px] shrink-0 h-full">
        <ChatPanel onDiagramGenerated={onDiagramGenerated} />
      </div>

      {/* Main Area: Infinite Canvas */}
      <div className="flex-1 h-full relative flex flex-col">
        {/* Navigation Tabs */}
        <DiagramTabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="flex-1 relative">
          <Canvas
            nodes={activeTab === 'architecture' ? archNodes : erdNodes}
            edges={activeTab === 'architecture' ? archEdges : erdEdges}
            nodeTypes={nodeTypes}
            onNodesChange={activeTab === 'architecture' ? onArchNodesChange : onErdNodesChange}
            onEdgesChange={activeTab === 'architecture' ? onArchEdgesChange : onErdEdgesChange}
            onConnect={onConnect}
          />

          {/* Overlay Title (Optional) */}
          <div className="absolute bottom-4 left-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-lg shadow-sm">
            <h1 className="text-sm font-semibold text-slate-800 capitalize">{activeTab} Diagram</h1>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Schema Explorer (Only on ERD tab and if nodes exist) */}
      {activeTab === 'erd' && <SchemaPanel nodes={erdNodes} />}
    </main>
  );
}
