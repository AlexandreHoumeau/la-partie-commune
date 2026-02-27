"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Copy, Clock } from "lucide-react";

import { toast } from "sonner";
import { getAIGeneratedMessages } from "@/actions/ai-messages";

type AIMessage = {
    id: string;
    channel: string;
    tone: string;
    length: string;
    subject: string | null;
    body: string;
    created_at: string;
};

export function AIMessageHistory({ opportunityId }: { opportunityId: string }) {
    const [messages, setMessages] = useState<AIMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadMessages();
    }, [opportunityId]);

    const loadMessages = async () => {
        setIsLoading(true);
        const result = await getAIGeneratedMessages(opportunityId);
        if (result.success) {
            setMessages(result.data);
        }
        setIsLoading(false);
    };

    const copyMessage = (message: AIMessage) => {
        const text = message.subject
            ? `${message.subject}\n\n${message.body}`
            : message.body;
        navigator.clipboard.writeText(text);
        toast.success("Copié !");
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case "email":
                return <Mail className="h-4 w-4" />;
            case "linkedin":
            case "instagram":
                return <MessageSquare className="h-4 w-4" />;
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-sm text-gray-500">Chargement...</p>
                </CardContent>
            </Card>
        );
    }

    if (messages.length === 0) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-sm text-gray-500">
                        Aucun message généré pour le moment
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Historique des messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                    {getChannelIcon(message.channel)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            {message.channel}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {message.tone}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(message.created_at)}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyMessage(message)}
                                    className="h-7"
                                >
                                    <Copy className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>

                        {message.subject && (
                            <p className="font-medium text-sm text-gray-900 mb-2">
                                {message.subject}
                            </p>
                        )}

                        <p className="text-sm text-gray-600 line-clamp-3">
                            {message.body}
                        </p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}