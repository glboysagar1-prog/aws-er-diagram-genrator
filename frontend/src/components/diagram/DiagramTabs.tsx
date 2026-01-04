
interface DiagramTabsProps {
    activeTab: 'architecture' | 'erd';
    onChange: (tab: 'architecture' | 'erd') => void;
}

export function DiagramTabs({ activeTab, onChange }: DiagramTabsProps) {
    return (
        <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2">
            <button
                onClick={() => onChange('architecture')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'architecture'
                        ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/10'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Architecture
            </button>

            <button
                onClick={() => onChange('erd')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'erd'
                        ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-700/10'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                ER Diagram
            </button>
        </div>
    );
}
