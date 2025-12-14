import React, { useState, useEffect } from 'react'

const Header = ({ activeSection, setActiveSection }) => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'home', label: 'Portal', icon: '🌀' },
    { id: 'friends', label: 'BFF Zone', icon: '👻' },
    { id: 'games', label: 'Game Vault', icon: '🎮' },
    { id: 'schedule', label: 'Game Night', icon: '🌙' },
    { id: 'achievements', label: 'Trophies', icon: '🏆' },
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-void-black/95 backdrop-blur-lg shadow-2xl' 
          : 'bg-transparent'
      }`}
      style={{
        background: scrolled ? 'rgba(10, 10, 15, 0.95)' : 'transparent',
        boxShadow: scrolled ? '0 0 30px rgba(255, 8, 68, 0.2)' : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #ff0844, #7b2cbf)',
                boxShadow: '0 0 20px rgba(255, 8, 68, 0.4)'
              }}
            >
              <span className="text-2xl transform group-hover:rotate-180 transition-transform duration-700">⚔</span>
              <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </div>
            <div>
              <h1 
                className="font-gothic text-xl font-bold tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, #ff0844, #ff6b9d)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 30px rgba(255, 8, 68, 0.3)'
                }}
              >
                UPSIDE DOWN
              </h1>
              <p className="text-xs text-tomb-gray font-elite tracking-widest" style={{ color: '#6b7280' }}>
                GAMING PORTAL
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveSection(item.id)
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeSection === item.id 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
                style={{
                  background: activeSection === item.id 
                    ? 'linear-gradient(135deg, rgba(255, 8, 68, 0.2), rgba(123, 44, 191, 0.2))' 
                    : 'transparent',
                  border: activeSection === item.id 
                    ? '1px solid rgba(255, 8, 68, 0.3)' 
                    : '1px solid transparent'
                }}
              >
                <span>{item.icon}</span>
                <span className="font-gothic">{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Profile & Status */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full glass-card"
              style={{
                background: 'rgba(26, 26, 46, 0.8)',
                border: '1px solid rgba(255, 8, 68, 0.2)'
              }}
            >
              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{
                    background: 'linear-gradient(135deg, #7b2cbf, #ff0844)'
                  }}
                >
                  🦇
                </div>
                <div 
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2"
                  style={{
                    background: '#20e3b2',
                    borderColor: '#0a0a0f',
                    boxShadow: '0 0 10px #20e3b2'
                  }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold">WednesdayGamer</p>
                <p className="text-xs" style={{ color: '#20e3b2' }}>Online</p>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'rgba(255, 8, 68, 0.2)',
              border: '1px solid rgba(255, 8, 68, 0.3)'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div 
            className="md:hidden py-4 border-t"
            style={{ borderColor: 'rgba(255, 8, 68, 0.2)' }}
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveSection(item.id)
                  setMenuOpen(false)
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white transition-colors"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-gothic">{item.label}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
