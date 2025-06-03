
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chat = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hi! I'm your eco-friendly shopping assistant 🌱 How can I help you find sustainable products today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (user) {
      initializeConversation();
    }
  }, [user]);

  const initializeConversation = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert([
          {
            user_id: user?.id,
            title: 'New Conversation'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setConversationId(data.id);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const saveMessage = async (message: string, senderType: 'user' | 'ai') => {
    if (!conversationId) return;

    try {
      await supabase
        .from('chat_messages')
        .insert([
          {
            conversation_id: conversationId,
            user_id: user?.id,
            message,
            sender_type: senderType
          }
        ]);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    await saveMessage(inputText, 'user');
    
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          message: currentInput,
          conversationHistory
        }
      });

      if (error) throw error;

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.response || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      await saveMessage(botResponse.text, 'ai');

    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get AI response. Please try again.');
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestedQueries = [
    "Find a laptop under ₹30,000",
    "Eco-friendly furniture near me",
    "Help me list my old bike",
    "Best sustainable fashion options"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              AI Shopping Assistant
            </h1>
            <p className="text-gray-600 text-lg">
              Get personalized recommendations for sustainable shopping
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <span>FindHere AI Assistant</span>
                    <Badge className="eco-badge">Online</Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex space-x-2 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-green-500' : 'bg-gray-300'}`}>
                            {message.sender === 'user' ? (
                              <User className="w-4 h-4 text-white" />
                            ) : (
                              <Bot className="w-4 h-4 text-gray-600" />
                            )}
                          </div>
                          <div className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex space-x-2 max-w-xs lg:max-w-md">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300">
                            <Bot className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>

                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ask me anything about sustainable shopping..."
                      className="flex-1"
                      disabled={isTyping}
                    />
                    <Button 
                      type="submit" 
                      className="bg-green-500 hover:bg-green-600"
                      disabled={isTyping || !inputText.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            </div>

            {/* Suggestions Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span>Quick Suggestions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {suggestedQueries.map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-3"
                      onClick={() => setInputText(query)}
                      disabled={isTyping}
                    >
                      {query}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Smart Recommendations</h4>
                      <p className="text-sm text-gray-600">Get personalized product suggestions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Price Alerts</h4>
                      <p className="text-sm text-gray-600">Get notified of price drops</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Listing Helper</h4>
                      <p className="text-sm text-gray-600">Auto-generate product descriptions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
