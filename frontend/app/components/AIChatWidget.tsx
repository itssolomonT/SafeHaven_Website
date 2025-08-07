'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, User, Bot, Phone, Mail } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface AIChatWidgetProps {
  brand?: {
    name: string
    displayName: string
    phoneNumber: string
  }
  onLeadCapture: (data: { name: string; email: string; phone: string }) => void
}

export default function AIChatWidget({ brand, onLeadCapture }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi! I'm your Security Assistant. I can help you with:\n\n• Free security quotes\n• System features & pricing\n• Installation process\n• 24/7 monitoring\n• Smart home integration\n• Fire protection\n\nWhat would you like to know?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [leadData, setLeadData] = useState<{ name: string; email: string; phone: string } | null>(null)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setInputValue('')
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      sender: 'user',
          timestamp: new Date()
        }

    setMessages(prev => [...prev, newUserMessage])
    setIsTyping(true)

    // Enhanced AI response logic with better suggestions
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    const lowerMessage = userMessage.toLowerCase()
    
      // Email detected
      const emailMatch = inputValue.match(/[\w.-]+@[\w.-]+\.\w+/)
      if (emailMatch) {
        setLeadData(prev => prev ? { ...prev, email: emailMatch[0] } : { name: '', email: emailMatch[0], phone: '' })
      }
      
      // Phone detected
      const phoneMatch = inputValue.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/)
      if (phoneMatch) {
        setLeadData(prev => prev ? { ...prev, phone: phoneMatch[0] } : { name: '', email: '', phone: phoneMatch[0] })
      }
      
      // Enhanced response logic with more suggestions
      if (lowerMessage.includes('quote') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return "I'd be happy to provide you with a custom quote! Here are some popular options:\n\n• Basic Package: $29/month - Entry-level protection\n• Standard Package: $49/month - Full home coverage\n• Premium Package: $79/month - Advanced features\n\nWhat's your name and email to get started?"
      }
      
      if (lowerMessage.includes('install') || lowerMessage.includes('setup')) {
        return "Great! Our professional installation takes 2-4 hours. Here's what we offer:\n\n• Free consultation and site survey\n• Professional installation by certified technicians\n• Same-day setup available\n• 30-day satisfaction guarantee\n\nWhat type of property are you protecting?"
      }
      
      if (lowerMessage.includes('monitoring') || lowerMessage.includes('24/7')) {
        return "Our 24/7 monitoring includes:\n\n• Instant alarm response (<30 seconds)\n• Professional monitoring staff\n• Emergency dispatch coordination\n• Mobile app alerts\n• Video verification\n\nWould you like a free demo?"
      }
      
      if (lowerMessage.includes('features') || lowerMessage.includes('what') || lowerMessage.includes('how')) {
        return "Our security systems include:\n\n• HD cameras with night vision\n• Smart motion sensors\n• Mobile app control\n• 24/7 professional monitoring\n• Smart home integration\n• Environmental monitoring (fire/CO)\n\nWhich features interest you most?"
    }
    
    if (lowerMessage.includes('camera') || lowerMessage.includes('video')) {
        return "Our HD cameras offer:\n\n• 1080p HD resolution\n• Night vision up to 100ft\n• Motion detection\n• Cloud storage (30 days)\n• Mobile streaming\n• Two-way audio\n\nHow many cameras do you need?"
      }
      
      if (lowerMessage.includes('smart') || lowerMessage.includes('app')) {
        return "Our smart features include:\n\n• Mobile app control\n• Alexa & Google Assistant\n• Voice commands\n• Geofencing\n• Smart scheduling\n• Remote access\n\nWould you like a demo of the app?"
      }
      
      if (lowerMessage.includes('fire') || lowerMessage.includes('smoke')) {
        return "We offer comprehensive fire protection:\n\n• Smoke detectors\n• Heat sensors\n• Carbon monoxide monitoring\n• Water leak detection\n• Temperature monitoring\n• Professional monitoring\n\nIs fire safety a priority?"
      }
      
      if (lowerMessage.includes('wireless') || lowerMessage.includes('wifi')) {
        return "Our wireless systems provide:\n\n• Easy installation (no drilling)\n• Battery backup\n• Encrypted communication\n• Cellular backup\n• Expandable coverage\n• Professional monitoring\n\nPerfect for renters and homeowners!"
      }
      
      if (lowerMessage.includes('contract') || lowerMessage.includes('monthly')) {
        return "We offer flexible options:\n\n• No long-term contracts\n• Month-to-month plans\n• 1-year contracts (discount)\n• 3-year contracts (best value)\n• Free installation\n• 30-day money-back guarantee\n\nWhat works best for you?"
      }
      
      if (lowerMessage.includes('service') || lowerMessage.includes('support')) {
        return "Our customer service includes:\n\n• 24/7 technical support\n• Local service technicians\n• Same-day service calls\n• Online chat support\n• Video tutorials\n• Mobile app support\n\nHow can we help you today?"
      }
      
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! I'm here to help with your security needs. Here are some popular topics:\n\n• Get a free quote\n• Learn about our features\n• Installation process\n• Monitoring services\n• Smart home integration\n• Fire protection\n\nWhat would you like to know more about?"
      }
      
      // Default response with suggestions
      return "I'm here to help with your security needs! Here are some popular topics:\n\n• Get a free quote\n• Learn about our features\n• Installation process\n• Monitoring services\n• Smart home integration\n• Fire protection\n\nWhat would you like to know more about?"
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(userMessage)
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: aiResponse,
      sender: 'bot',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, botMessage])
    setIsTyping(false)

    // Capture lead if we have contact info
    if (leadData && (leadData.email || leadData.phone)) {
      const name = userMessage.split(' ')[0] || 'Unknown'
          setLeadData(prev => prev ? { ...prev, name } : { name, email: '', phone: '' })
        
          onLeadCapture({
            name: leadData.name || name,
            email: leadData.email || '',
            phone: leadData.phone || ''
          })
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                <div>
                <h3 className="font-semibold">Security Assistant</h3>
                <p className="text-sm opacity-90">Ask me anything about security</p>
                </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 