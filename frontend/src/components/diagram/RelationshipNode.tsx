'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface RelationshipNodeProps {
    data: {
        label: string;
    };
}

const RelationshipNode = ({ data }: RelationshipNodeProps) => {
    return (
        <div className="relative flex items-center justify-center">
            {/* Diamond Shape using CSS transform */}
            <div className="w-24 h-24 bg-lime-100 border-2 border-lime-600 rotate-45 flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                <div className="-rotate-45 text-[10px] font-bold text-lime-800 uppercase text-center px-1 leading-tight">
                    {data.label}
                </div>
            </div>

            {/* Handles at the points of the diamond */}
            <Handle type="target" position={Position.Top} className="opacity-0" />
            <Handle type="source" position={Position.Bottom} className="opacity-0" />
            <Handle type="target" position={Position.Left} className="opacity-0" />
            <Handle type="source" position={Position.Right} className="opacity-0" />
        </div>
    );
};

export default RelationshipNode;
