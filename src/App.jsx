import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import FriendPortal from './components/FriendPortal'
import GameLibrary from './components/GameLibrary'
import GameNightScheduler from './components/GameNightScheduler'
import ChatPortal from './components/ChatPortal'
import Achievements from './components/Achievements'
import Footer from './components/Footer'
import ParticleBackground from './components/ParticleBackground'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [showChat, setShowChat] = useState(false)

  return (
    <div className="bg-upside-down min-h-screen relative">
      <ParticleBackground />
      
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main>
        <Hero />
        <FriendPortal />
        <GameLibrary />
        <GameNightScheduler />
        <Achievements />
      </main>

      {/* Floating Chat Button */}
      <button 
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-demogorgon-red to-wednesday-purple flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        style={{
          background: 'linear-gradient(135deg, #ff0844, #7b2cbf)',
          boxShadow: '0 0 30px rgba(255, 8, 68, 0.5)'
        }}
        aria-label="Open chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">3</span>
      </button>

      {showChat && <ChatPortal onClose={() => setShowChat(false)} />}

      <Footer />
    </div>
  )
}

export default App
