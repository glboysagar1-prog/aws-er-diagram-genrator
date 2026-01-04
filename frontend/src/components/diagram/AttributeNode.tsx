'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface AttributeNodeProps {
    data: {
        label: string;
        isPrimaryKey?: boolean;
    };
}

const AttributeNode = ({ data }: AttributeNodeProps) => {
    return (
        <div className={`px-4 py-2 bg-white border-2 rounded-full shadow-md min-w-[80px] flex items-center justify-center transition-all hover:bg-slate-50 ${data.isPrimaryKey ? 'border-amber-400' : 'border-slate-300'
            }`}>
            <span className={`text-xs font-medium text-slate-700 ${data.isPrimaryKey ? 'underline decoration-amber-500 underline-offset-2' : ''}`}>
                {data.label}
            </span>

            {/* Target handle only as attributes are usually leaf nodes connected to entities */}
            <Handle type="target" position={Position.Top} className="opacity-0" />
            <Handle type="source" position={Position.Bottom} className="opacity-0" />
        </div>
    );
};

export default AttributeNode;
