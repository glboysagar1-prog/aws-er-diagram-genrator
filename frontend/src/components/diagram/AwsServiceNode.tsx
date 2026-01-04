
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import Image from 'next/image';

// Defines the data structure for our AWS Custom Node
export type AwsNodeData = {
    label?: string; // For backward compatibility
    title?: string;
    subtitle?: string;
    category?: string;
    iconPath: string; // Path relative to /public/aws-icons
};

export type AwsNode = Node<AwsNodeData, 'awsService'>;

export function AwsServiceNode({ data }: NodeProps<AwsNode>) {
    return (
        <div className="flex flex-col items-center p-3 border-2 border-slate-100 hover:border-blue-500 rounded-lg transition-colors bg-white shadow-md min-w-[140px] pt-6 relative">
            {/* Category Tag (Orange Box) */}
            {data.category && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm border border-white">
                    {data.category}
                </div>
            )}

            <div className="relative w-12 h-12 mb-2 mt-1">
                <Image
                    src={data.iconPath?.startsWith('http') ? data.iconPath : `/${data.iconPath || ''}`}
                    alt={data.title || data.label || 'AWS Service'}
                    fill
                    className="object-contain"
                />
            </div>

            {/* Title (Role) */}
            <span className="text-xs font-bold text-center text-slate-900 max-w-[140px] leading-tight mb-0.5">
                {data.title || data.label}
            </span>

            {/* Subtitle (Service Name) */}
            {data.subtitle && (
                <span className="text-[10px] font-medium text-center text-slate-500 max-w-[140px] leading-tight">
                    {data.subtitle}
                </span>
            )}

            {/* Input Handle (Top) */}
            <Handle type="target" position={Position.Top} className="w-2 h-2 bg-blue-400" />

            {/* Output Handle (Bottom) */}
            <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-blue-400" />

            {/* We can add Left/Right handles later if needed for different layouts */}
        </div>
    );
}
