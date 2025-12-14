import React, { useState } from 'react'

const GameNightScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const upcomingNights = [
    {
      id: 1,
      title: "Horror Movie Night Gaming",
      date: "Fri, Dec 15",
      time: "9:00 PM EST",
      game: "Dead by Daylight",
      participants: ["ElevenWaffles", "ThingAddams", "You"],
      icon: "🎃",
      theme: "Halloween Special",
      color: "#ff0844"
    },
    {
      id: 2,
      title: "Weekend Slay Session",
      date: "Sat, Dec 16",
      time: "8:00 PM EST",
      game: "Phasmophobia",
      participants: ["DustinHenderson", "You"],
      icon: "👻",
      theme: "Ghost Investigation",
      color: "#7b2cbf"
    },
    {
      id: 3,
      title: "Chill Vibes Co-op",
      date: "Sun, Dec 17",
      time: "7:00 PM EST",
      game: "Stardew Valley",
      participants: ["ThingAddams", "ElevenWaffles", "You"],
      icon: "🌾",
      theme: "Cozy Farm Night",
      color: "#20e3b2"
    },
    {
      id: 4,
      title: "Competitive Tryhard Tuesday",
      date: "Tue, Dec 19",
      time: "10:00 PM EST",
      game: "Valorant",
      participants: ["ElevenWaffles", "You"],
      icon: "🎯",
      theme: "Rank Up Session",
      color: "#00d4ff"
    },
  ]

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const currentDate = new Date()
  
  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    const days = []
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const hasEvent = (day) => {
    // Simulate events on certain days
    const eventDays = [15, 16, 17, 19, 22, 24, 28]
    return eventDays.includes(day)
  }

  return (
    <section id="schedule" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 80% 50%, rgba(255, 8, 68, 0.15) 0%, transparent 50%)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p 
            className="font-elite text-sm tracking-[0.3em] mb-4"
            style={{ color: '#d4af37' }}
          >
            🌙 WHEN THE MOON RISES 🌙
          </p>
          <h2 
            className="font-creepy text-5xl md:text-6xl mb-6"
            style={{
              background: 'linear-gradient(135deg, #d4af37, #ff6b9d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            GAME NIGHT
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#a0a0b0' }}>
            Plan your supernatural gaming sessions. The stars align when BFFs play together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <div 
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(26, 26, 46, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-gothic text-2xl">
                December 2024
              </h3>
              <div className="flex gap-2">
                <button 
                  className="p-2 rounded-lg transition-all"
                  style={{ background: 'rgba(255, 8, 68, 0.2)' }}
                >
                  ←
                </button>
                <button 
                  className="p-2 rounded-lg transition-all"
                  style={{ background: 'rgba(255, 8, 68, 0.2)' }}
                >
                  →
                </button>
              </div>
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map((day) => (
                <div 
                  key={day} 
                  className="text-center text-sm font-semibold py-2"
                  style={{ color: '#6b7280' }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {getCalendarDays().map((day, index) => (
                <div
                  key={index}
                  onClick={() => day && setSelectedDate(day)}
                  className={`aspect-square flex items-center justify-center rounded-lg relative cursor-pointer transition-all ${
                    day ? 'hover:scale-110' : ''
                  }`}
                  style={{
                    background: selectedDate === day 
                      ? 'linear-gradient(135deg, #ff0844, #7b2cbf)' 
                      : day === currentDate.getDate() 
                        ? 'rgba(212, 175, 55, 0.2)' 
                        : 'transparent',
                    border: day === currentDate.getDate() 
                      ? '1px solid rgba(212, 175, 55, 0.5)' 
                      : '1px solid transparent',
                    color: day ? '#e8e8e8' : 'transparent'
                  }}
                >
                  {day}
                  {day && hasEvent(day) && (
                    <div 
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                      style={{ background: '#ff0844' }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Quick Schedule Button */}
            <button 
              onClick={() => setShowModal(true)}
              className="w-full mt-6 py-4 rounded-xl font-gothic font-semibold transition-all flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 8, 68, 0.2), rgba(123, 44, 191, 0.2))',
                border: '1px solid rgba(255, 8, 68, 0.3)'
              }}
            >
              <span>📅</span>
              <span>Schedule New Game Night</span>
            </button>
          </div>

          {/* Upcoming Events */}
          <div className="space-y-4">
            <h3 className="font-gothic text-2xl mb-6 flex items-center gap-3">
              <span>⚡</span>
              <span>Upcoming Sessions</span>
            </h3>

            {upcomingNights.map((night) => (
              <div
                key={night.id}
                className="rounded-xl p-5 transition-all duration-300 cursor-pointer group"
                style={{
                  background: 'rgba(26, 26, 46, 0.8)',
                  border: `1px solid ${night.color}40`,
                  backdropFilter: 'blur(10px)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateX(8px)'
                  e.currentTarget.style.boxShadow = `0 0 30px ${night.color}30`
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{
                      background: `${night.color}20`,
                      border: `1px solid ${night.color}40`
                    }}
                  >
                    {night.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold truncate">{night.title}</h4>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs shrink-0"
                        style={{
                          background: `${night.color}20`,
                          color: night.color
                        }}
                      >
                        {night.theme}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm mb-3" style={{ color: '#6b7280' }}>
                      <span>📅 {night.date}</span>
                      <span>🕐 {night.time}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm" style={{ color: '#a0a0b0' }}>
                      <span>🎮 {night.game}</span>
                      <span>•</span>
                      <span>👥 {night.participants.length} players</span>
                    </div>

                    {/* Participant Avatars */}
                    <div className="flex items-center mt-3 -space-x-2">
                      {night.participants.map((participant, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2"
                          style={{
                            background: 'linear-gradient(135deg, #7b2cbf, #ff0844)',
                            borderColor: '#0a0a0f'
                          }}
                          title={participant}
                        >
                          {participant === 'You' ? '🦇' : participant[0]}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <button 
                    className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(255, 8, 68, 0.2)' }}
                  >
                    ⋮
                  </button>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {upcomingNights.length === 0 && (
              <div 
                className="text-center py-12 rounded-xl"
                style={{
                  background: 'rgba(26, 26, 46, 0.6)',
                  border: '2px dashed rgba(255, 8, 68, 0.2)'
                }}
              >
                <span className="text-5xl mb-4 block">🌑</span>
                <p style={{ color: '#6b7280' }}>No upcoming game nights...</p>
                <p className="text-sm" style={{ color: '#ff6b9d' }}>Time to summon your BFFs!</p>
              </div>
            )}
          </div>
        </div>

        {/* Schedule Modal */}
        {showModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(10, 10, 15, 0.95)' }}
            onClick={() => setShowModal(false)}
          >
            <div 
              className="max-w-md w-full rounded-2xl p-8"
              style={{
                background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.98), rgba(10, 10, 15, 0.98))',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 0 50px rgba(212, 175, 55, 0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-creepy text-3xl mb-6 text-center" style={{ color: '#d4af37' }}>
                🌙 New Game Night
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#a0a0b0' }}>Session Name</label>
                  <input 
                    type="text" 
                    placeholder="Epic Horror Marathon..."
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      background: 'rgba(26, 26, 46, 0.9)',
                      border: '1px solid rgba(255, 8, 68, 0.3)',
                      color: '#e8e8e8'
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: '#a0a0b0' }}>Date</label>
                    <input 
                      type="date"
                      className="w-full px-4 py-3 rounded-xl"
                      style={{
                        background: 'rgba(26, 26, 46, 0.9)',
                        border: '1px solid rgba(255, 8, 68, 0.3)',
                        color: '#e8e8e8'
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: '#a0a0b0' }}>Time</label>
                    <input 
                      type="time"
                      className="w-full px-4 py-3 rounded-xl"
                      style={{
                        background: 'rgba(26, 26, 46, 0.9)',
                        border: '1px solid rgba(255, 8, 68, 0.3)',
                        color: '#e8e8e8'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: '#a0a0b0' }}>Select Game</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      background: 'rgba(26, 26, 46, 0.9)',
                      border: '1px solid rgba(255, 8, 68, 0.3)',
                      color: '#e8e8e8'
                    }}
                  >
                    <option>Dead by Daylight</option>
                    <option>Phasmophobia</option>
                    <option>It Takes Two</option>
                    <option>Lethal Company</option>
                    <option>Valorant</option>
                    <option>Stardew Valley</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: '#a0a0b0' }}>Invite BFFs</label>
                  <div className="flex flex-wrap gap-2">
                    {['ElevenWaffles', 'ThingAddams', 'DustinHenderson', 'WillByers'].map((friend) => (
                      <label 
                        key={friend}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all"
                        style={{
                          background: 'rgba(123, 44, 191, 0.1)',
                          border: '1px solid rgba(123, 44, 191, 0.3)'
                        }}
                      >
                        <input type="checkbox" className="accent-pink-500" />
                        <span className="text-sm">{friend}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  className="flex-1 py-3 rounded-xl font-gothic font-semibold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #d4af37, #ff6b9d)',
                    boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
                  }}
                >
                  🌙 Create Session
                </button>
                <button 
                  className="py-3 px-6 rounded-xl font-gothic transition-all"
                  style={{
                    background: 'transparent',
                    border: '2px solid rgba(123, 44, 191, 0.5)'
                  }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default GameNightScheduler
