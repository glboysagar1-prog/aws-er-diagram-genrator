
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User } from 'lucide-react';
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getAwsIconPath } from '@/utils/aws-icons';

type DiagramData = {
    nodes: any[];
    edges: any[];
    groups?: any[];
};

type ChatPanelProps = {
    onDiagramGenerated?: (data: DiagramData) => void;
};

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

export function ChatPanel({ onDiagramGenerated }: ChatPanelProps) {
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! Describe your AWS architecture, and I will draw it for you.',
        },
    ]);
    const sendMessage = useAction(api.chat.sendMessage);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');

        // Call Convex action
        try {
            const response = await sendMessage({ content: input });
            let contentToDisplay = response;

            try {
                // Try to parse as JSON
                const parsed = JSON.parse(response);
                if (parsed.summary) {
                    contentToDisplay = parsed.summary;
                }

                // Update diagram if nodes/edges exist
                if (parsed.nodes && parsed.edges && onDiagramGenerated) {
                    onDiagramGenerated({
                        nodes: parsed.nodes, // Pass ALL properties - title, subtitle, fields, groupId, etc.
                        edges: parsed.edges,
                        groups: parsed.groups // Also pass groups for architecture diagrams
                    });
                }
            } catch (e) {
                // Not JSON, assume plain text
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: contentToDisplay,
                },
            ]);
        } catch (error) {
            console.error("Failed to send message:", error);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: "Sorry, I encountered an error processing your request.",
                },
            ]);
        }
    };

    return (
        <div className="flex flex-col h-full border-r bg-background">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    Morek.AI
                </h2>
                <p className="text-xs text-muted-foreground">AWS Architecture Assistant</p>
            </div>

            <div className="flex-1 min-h-0">
                <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                        }`}
                                >
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div
                                    className={`rounded-lg p-3 text-sm max-w-[80%] ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>
            </div>

            <div className="p-4 border-t gap-2 flex flex-col">
                <Textarea
                    placeholder="Describe your architecture..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[80px] resize-none"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <Button onClick={handleSend} className="w-full" size="sm">
                    <Send className="w-4 h-4 mr-2" />
                    Generate Diagram
                </Button>
            </div>
        </div>
    );
}
