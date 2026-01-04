
import { memo } from 'react';
import { NodeProps, Node } from '@xyflow/react';

export type GroupNodeData = {
    label: string;
    type: 'layer' | 'region' | 'vpc' | 'subnet';
    isInner?: boolean; // Prop to signal if this is a nested group
};

export type GroupNode = Node<GroupNodeData, 'group'>;

function ArchitectureGroupNode({ data, selected }: NodeProps<GroupNode>) {
    // Style variations
    // Region/Outer Layer: Solid, Tinted Background
    // Subnet/Inner Layer: Dashed, White/Transparent Background

    // If explicit type is 'vpc' or 'region', prioritize that style
    // Otherwise use nesting depth hint
    const isSolid = data.type === 'region' || data.type === 'vpc' || !data.isInner;

    const borderColor = isSolid ? 'border-orange-300' : 'border-slate-300';
    const borderStyle = isSolid ? 'border-2' : 'border-2 border-dashed';
    const bg = isSolid ? 'bg-orange-50/30' : 'bg-white/50';

    return (
        <div className={`w-full h-full rounded-lg ${borderColor} ${borderStyle} ${bg} flex flex-col pt-6 relative transition-colors ${selected ? 'border-blue-500' : ''}`}>
            <div className="absolute top-0 left-0 px-3 py-1 bg-white/90 rounded-br-lg border-b border-r border-slate-200 backdrop-blur-sm z-10">
                <span className={`text-[11px] uppercase font-bold tracking-wider ${isSolid ? 'text-orange-700' : 'text-slate-500'}`}>
                    {data.label}
                </span>
            </div>
        </div>
    );
}

export default memo(ArchitectureGroupNode);
