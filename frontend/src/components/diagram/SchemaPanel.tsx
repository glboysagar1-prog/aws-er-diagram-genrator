
import { Node } from '@xyflow/react';

interface SchemaPanelProps {
    nodes: Node[];
}

export function SchemaPanel({ nodes }: SchemaPanelProps) {
    // Filter only Entity nodes (Database Tables)
    const entities = nodes.filter((n) => n.type === 'entity');

    if (entities.length === 0) return null;

    return (
        <div className="w-[300px] h-full bg-white border-l border-slate-200 overflow-y-auto flex flex-col shadow-xl z-20">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    Schema Explorer
                </h2>
                <p className="text-xs text-slate-500 mt-1">{entities.length} Tables Detected</p>
            </div>

            <div className="p-4 flex flex-col gap-4">
                {entities.map((node) => (
                    <div key={node.id} className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex justify-between items-center">
                            <span className="font-semibold text-sm text-slate-700">{node.data.label as string}</span>
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 rounded">Table</span>
                        </div>
                        <div className="bg-white p-2">
                            <table className="w-full text-xs">
                                <tbody>
                                    {(node.data.fields as any[])?.map((field, idx) => (
                                        <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                                            <td className="py-1 px-1 w-6">
                                                {(field.type === 'PK' || field.name === 'id') && <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1 rounded">PK</span>}
                                                {field.type === 'FK' && <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1 rounded">FK</span>}
                                            </td>
                                            <td className="py-1 px-1 font-medium text-slate-700">{field.name}</td>
                                            <td className="py-1 px-1 text-right text-slate-400 font-mono text-[10px]">{field.type !== 'PK' && field.type !== 'FK' ? field.type : ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
