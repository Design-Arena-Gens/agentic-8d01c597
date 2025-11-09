'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ListingAnalysis {
  keywords: string[];
  suggestions: string[];
  optimizedTitle?: string;
  optimizedDescription?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listingData, setListingData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
  });
  const [analysis, setAnalysis] = useState<ListingAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'listing' | 'chat'>('listing');

  const analyzeListing = async () => {
    if (!listingData.title || !listingData.description) {
      alert('कृपया शीर्षक और विवरण भरें');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingData),
      });

      const data = await response.json();
      setAnalysis(data);
      setActiveTab('chat');

      // Add initial message from AI
      setMessages([{
        role: 'assistant',
        content: `मैंने आपकी listing का विश्लेषण किया है। यहाँ मेरे सुझाव हैं:\n\n**सुझावित Keywords:**\n${data.keywords.join(', ')}\n\n**सुधार के लिए सुझाव:**\n${data.suggestions.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}\n\nआप मुझसे कोई भी सवाल पूछ सकते हैं!`
      }]);
    } catch (error) {
      alert('कुछ गलत हो गया। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          listingData,
          analysis,
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'माफ़ी चाहता हूँ, कुछ गलत हो गया। कृपया पुनः प्रयास करें।'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-700 dark:text-indigo-400 mb-2">
            🤖 Facebook Marketplace AI Agent
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            अपनी listing को optimize करें और ज्यादा sales पाएं
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('listing')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'listing'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              📝 Listing Details
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
              disabled={!analysis}
            >
              💬 AI Chat
            </button>
          </div>

          {/* Listing Form */}
          {activeTab === 'listing' && (
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Product Title (शीर्षक)
                  </label>
                  <input
                    type="text"
                    value={listingData.title}
                    onChange={(e) => setListingData({ ...listingData, title: e.target.value })}
                    placeholder="उदाहरण: Brand New iPhone 15 Pro Max 256GB"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Description (विवरण)
                  </label>
                  <textarea
                    value={listingData.description}
                    onChange={(e) => setListingData({ ...listingData, description: e.target.value })}
                    placeholder="अपने product के बारे में विस्तार से बताएं..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Category (श्रेणी)
                    </label>
                    <input
                      type="text"
                      value={listingData.category}
                      onChange={(e) => setListingData({ ...listingData, category: e.target.value })}
                      placeholder="Electronics, Furniture, आदि"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Price (कीमत)
                    </label>
                    <input
                      type="text"
                      value={listingData.price}
                      onChange={(e) => setListingData({ ...listingData, price: e.target.value })}
                      placeholder="₹ 50,000"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={analyzeListing}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? '🔄 विश्लेषण हो रहा है...' : '🚀 AI से Analyze करें'}
                </button>

                {analysis && (
                  <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">
                      ✅ Analysis Complete! Chat tab पर जाएं
                    </h3>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chat Interface */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[600px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
                    <p className="text-lg">पहले अपनी listing analyze करें 📊</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="अपना सवाल पूछें..."
                    disabled={!analysis || loading}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || loading || !analysis}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    भेजें
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center mt-8 text-gray-600 dark:text-gray-400">
          <p>💡 AI-powered by Claude • बेहतर listings के लिए बनाया गया</p>
        </footer>
      </div>
    </div>
  );
}
