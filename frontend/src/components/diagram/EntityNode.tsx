
import { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';

export type EntityField = {
    name: string;
    type?: string; // e.g. "PK", "FK", "VARCHAR"
};

export type EntityNodeData = {
    label: string; // Table Name
    subtitle?: string; // Description
    fields?: EntityField[];
};

export type EntityNode = Node<EntityNodeData, 'entity'>;

function EntityNode({ data, selected }: NodeProps<EntityNode>) {
    return (
        <div className={`flex flex-col min-w-[180px] bg-white rounded-lg shadow-lg border-2 overflow-hidden transition-all ${selected ? 'border-indigo-500 shadow-indigo-100' : 'border-slate-200'}`}>
            {/* Header */}
            <div className="bg-indigo-600 px-3 py-2 border-b border-indigo-700">
                <div className="text-white font-bold text-sm">{data.label}</div>
                {data.subtitle && <div className="text-indigo-200 text-[10px] truncate">{data.subtitle}</div>}
            </div>

            {/* Fields List */}
            <div className="p-2 flex flex-col gap-1">
                {data.fields?.map((field, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs px-1 py-0.5 hover:bg-slate-50 rounded">
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                            {/* Key Indicators */}
                            {(field.type === 'PK' || field.name === 'id') && (
                                <span className="text-[8px] bg-amber-100 text-amber-700 px-1 rounded font-bold">PK</span>
                            )}
                            {(field.type === 'FK') && (
                                <span className="text-[8px] bg-blue-100 text-blue-700 px-1 rounded font-bold">FK</span>
                            )}
                            <span>{field.name}</span>
                        </div>
                        {/* Optional Type (e.g. VARCHAR) */}
                        {field.type && field.type !== 'PK' && field.type !== 'FK' && (
                            <span className="text-[10px] text-slate-400 font-mono">{field.type}</span>
                        )}
                    </div>
                ))}

                {(!data.fields || data.fields.length === 0) && (
                    <div className="text-slate-300 text-[10px] italic text-center py-2">No fields defined</div>
                )}
            </div>

            {/* Inputs/Outputs - Layout Handles */}
            <Handle type="target" position={Position.Top} className="w-2 h-2 bg-indigo-500" />
            <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-indigo-500" />
            <Handle type="target" position={Position.Left} className="w-2 h-2 bg-indigo-500" />
            <Handle type="source" position={Position.Right} className="w-2 h-2 bg-indigo-500" />
        </div>
    );
}

export default memo(EntityNode);
