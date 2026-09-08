import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, Sparkles, Atom, FlaskConical, Shield, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS_EN = [
  "What is the periodic table and how is it organized?",
  "Explain the safety precautions for handling acids",
  "What is the difference between ionic and covalent bonds?",
  "How do I balance a chemical equation?",
];

const SUGGESTED_PROMPTS_AM = [
  "ፔሪዮዲክ ሰንጠረዥ ምንድነው እና እንዴት ተደራጅቷል?",
  "አሲዶችን ሲይዙ ምን ጥንቃቄዎች ያስፈልጋሉ?",
  "በአዮኒክ እና ኮቫለንት ቦንዶች መካከል ያለው ልዩነት ምንድነው?",
  "የኬሚካል ቀመር እንዴት ማመጣጠን ይቻላል?",
];

const AIAssistantPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isAm = language === 'am';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMsg: Message = { role: 'user', content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const systemPrompt = `You are ደህንነት ኬሚ AI Assistant, an expert chemistry tutor specializing in Ethiopian chemistry education and laboratory safety. 
You help students learn chemistry concepts, understand safety protocols, and solve chemistry problems.
Always prioritize safety in your responses. When discussing experiments, always mention required safety equipment.
Respond in ${isAm ? 'Amharic' : 'English'}. Be concise but thorough. Use examples relevant to Ethiopian context when possible.
IMPORTANT: Do NOT use markdown formatting like ** for bold, ## for headers, or * for bullets. Write in plain text with clear paragraphs. Use numbered lists (1. 2. 3.) and simple dashes (-) for lists. Keep responses clean and readable without any special formatting characters.`;

      const { data, error } = await supabase.functions.invoke('ai-chemistry-assistant', {
        body: {
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: messageText },
          ],
        },
      });

      if (error) throw error;

      let reply = data?.reply || (isAm ? 'ይቅርታ፣ መልስ ማግኘት አልተቻለም።' : 'Sorry, I could not generate a response.');
      // Strip any remaining markdown bold/italic markers
      reply = reply.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}\s/g, '');

      const assistantMsg: Message = {
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('AI error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isAm ? 'ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።' : 'An error occurred. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrompts = isAm ? SUGGESTED_PROMPTS_AM : SUGGESTED_PROMPTS_EN;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isAm ? 'AI የኬሚስትሪ ረዳት' : 'AI Chemistry Assistant'}</h1>
            <p className="text-muted-foreground text-sm">{isAm ? 'ስለ ኬሚስትሪ ማንኛውንም ጥያቄ ይጠይቁ' : 'Ask anything about chemistry'}</p>
          </div>
        </div>

        <Card className="h-[calc(100vh-280px)] flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 space-y-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">{isAm ? 'እንኳን ደህና መጡ!' : 'Welcome!'}</h3>
                  <p className="text-muted-foreground text-sm max-w-md">
                    {isAm ? 'ስለ ኬሚስትሪ፣ የላብ ደህንነት፣ ወይም ማንኛውም ሳይንሳዊ ጥያቄ ይጠይቁኝ።' : 'Ask me about chemistry, lab safety, or any science question.'}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(prompt)}
                      className="text-left p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/50 transition-all text-sm"
                    >
                      <div className="flex items-center gap-2">
                        {[Atom, Shield, FlaskConical, Sparkles][i % 4] &&
                          React.createElement([Atom, Shield, FlaskConical, Sparkles][i % 4], { className: 'h-4 w-4 text-primary flex-shrink-0' })
                        }
                        <span className="line-clamp-2">{prompt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted rounded-bl-md'
                    }`}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            )}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={isAm ? 'ጥያቄዎን ይጻፉ...' : 'Type your question...'}
                className="min-h-[44px] max-h-32 resize-none"
                rows={1}
              />
              <Button onClick={() => sendMessage()} disabled={!input.trim() || loading} size="icon" className="h-11 w-11 flex-shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AIAssistantPage;
