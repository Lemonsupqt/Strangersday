import React, { useState, useRef, useEffect } from 'react'

const ChatPortal = ({ onClose }) => {
  const [message, setMessage] = useState('')
  const [activeChat, setActiveChat] = useState('ElevenWaffles')
  const messagesEndRef = useRef(null)

  const chats = {
    ElevenWaffles: {
      avatar: '🧇',
      status: 'online',
      messages: [
        { id: 1, sender: 'ElevenWaffles', text: "Ready for tonight's horror marathon? 👻", time: '8:32 PM' },
        { id: 2, sender: 'You', text: "YESSS been waiting all week for this!!", time: '8:33 PM' },
        { id: 3, sender: 'ElevenWaffles', text: "I've been practicing my survivor skills. No more getting caught first 😤", time: '8:34 PM' },
        { id: 4, sender: 'You', text: "Lmao we'll see about that 💀", time: '8:35 PM' },
        { id: 5, sender: 'ElevenWaffles', text: "Friends don't lie... but I might camp the exit gate", time: '8:36 PM' },
        { id: 6, sender: 'You', text: "That's so Wednesday coded of you 🖤", time: '8:37 PM' },
      ]
    },
    ThingAddams: {
      avatar: '🖐️',
      status: 'online',
      messages: [
        { id: 1, sender: 'ThingAddams', text: "*tap tap tap* (Translation: Game?)", time: '7:15 PM' },
        { id: 2, sender: 'You', text: "You know I can't say no to you Thing 🖤", time: '7:16 PM' },
        { id: 3, sender: 'ThingAddams', text: "*excited tapping*", time: '7:16 PM' },
      ]
    },
    DustinHenderson: {
      avatar: '🦷',
      status: 'playing',
      messages: [
        { id: 1, sender: 'DustinHenderson', text: "BRO we need to finish the Phasmo investigation tonight!", time: '6:45 PM' },
        { id: 2, sender: 'You', text: "I swear that ghost was cheating last time 😭", time: '6:47 PM' },
        { id: 3, sender: 'DustinHenderson', text: "Science doesn't lie! We just need better equipment", time: '6:48 PM' },
      ]
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeChat])

  const handleSend = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    // In a real app, this would send the message
    setMessage('')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#20e3b2'
      case 'playing': return '#7b2cbf'
      default: return '#6b7280'
    }
  }

  return (
    <div 
      className="fixed bottom-24 right-6 z-50 w-96 h-[500px] rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.98), rgba(10, 10, 15, 0.98))',
        border: '1px solid rgba(255, 8, 68, 0.3)',
        boxShadow: '0 0 50px rgba(255, 8, 68, 0.2)'
      }}
    >
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 8, 68, 0.2), rgba(123, 44, 191, 0.2))',
          borderBottom: '1px solid rgba(255, 8, 68, 0.2)'
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, #7b2cbf, #ff0844)' }}
          >
            {chats[activeChat].avatar}
          </div>
          <div>
            <h4 className="font-semibold">{activeChat}</h4>
            <div className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ 
                  background: getStatusColor(chats[activeChat].status),
                  boxShadow: `0 0 5px ${getStatusColor(chats[activeChat].status)}`
                }}
              />
              <span className="text-xs" style={{ color: '#6b7280' }}>
                {chats[activeChat].status === 'playing' ? 'In Game' : 'Online'}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-lg transition-all hover:bg-red-500/20"
        >
          ✕
        </button>
      </div>

      {/* Chat Tabs */}
      <div 
        className="flex gap-2 p-2 overflow-x-auto"
        style={{ borderBottom: '1px solid rgba(255, 8, 68, 0.1)' }}
      >
        {Object.entries(chats).map(([name, data]) => (
          <button
            key={name}
            onClick={() => setActiveChat(name)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeChat === name ? 'bg-opacity-100' : 'bg-opacity-50'
            }`}
            style={{
              background: activeChat === name 
                ? 'linear-gradient(135deg, rgba(255, 8, 68, 0.2), rgba(123, 44, 191, 0.2))' 
                : 'transparent',
              border: activeChat === name 
                ? '1px solid rgba(255, 8, 68, 0.3)' 
                : '1px solid transparent'
            }}
          >
            <span>{data.avatar}</span>
            <span className="text-sm">{name.split(/(?=[A-Z])/).join(' ')}</span>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chats[activeChat].messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.sender === 'You' ? 'rounded-br-sm' : 'rounded-bl-sm'
              }`}
              style={{
                background: msg.sender === 'You' 
                  ? 'linear-gradient(135deg, #ff0844, #7b2cbf)' 
                  : 'rgba(26, 26, 46, 0.9)',
                border: msg.sender === 'You' 
                  ? 'none' 
                  : '1px solid rgba(255, 8, 68, 0.2)'
              }}
            >
              <p className="text-sm">{msg.text}</p>
              <p 
                className="text-xs mt-1 text-right"
                style={{ color: msg.sender === 'You' ? 'rgba(255,255,255,0.7)' : '#6b7280' }}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reactions */}
      <div 
        className="px-4 py-2 flex gap-2"
        style={{ borderTop: '1px solid rgba(255, 8, 68, 0.1)' }}
      >
        {['👻', '💀', '🎮', '🖤', '😂', '🔥'].map((emoji) => (
          <button
            key={emoji}
            className="text-xl hover:scale-125 transition-transform"
            onClick={() => setMessage(message + emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 pt-2">
        <div 
          className="flex gap-2 p-2 rounded-xl"
          style={{
            background: 'rgba(26, 26, 46, 0.9)',
            border: '1px solid rgba(255, 8, 68, 0.3)'
          }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message from the void..."
            className="flex-1 bg-transparent border-none outline-none text-sm px-2"
            style={{ color: '#e8e8e8' }}
          />
          <button 
            type="submit"
            className="p-2 rounded-lg transition-all"
            style={{
              background: message.trim() 
                ? 'linear-gradient(135deg, #ff0844, #7b2cbf)' 
                : 'rgba(107, 114, 128, 0.3)'
            }}
            disabled={!message.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatPortal
