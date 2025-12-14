import React, { useState } from 'react'

const FriendPortal = () => {
  const [selectedFriend, setSelectedFriend] = useState(null)

  const friends = [
    {
      id: 1,
      name: "ElevenWaffles",
      avatar: "🧇",
      status: "online",
      currentGame: "Dead by Daylight",
      lastPlayed: "Now",
      gamesPlayed: 247,
      friendSince: "2019",
      timezone: "EST",
      mood: "Ready to slay some monsters!",
      achievements: ["Night Owl", "Duo Legend", "100 Wins Together"]
    },
    {
      id: 2,
      name: "DustinHenderson",
      avatar: "🦷",
      status: "playing",
      currentGame: "Phasmophobia",
      lastPlayed: "Now",
      gamesPlayed: 189,
      friendSince: "2020",
      timezone: "CST",
      mood: "Ghost hunting hours 👻",
      achievements: ["Science Bros", "Late Night Legends"]
    },
    {
      id: 3,
      name: "ThingAddams",
      avatar: "🖐️",
      status: "online",
      currentGame: null,
      lastPlayed: "Waiting...",
      gamesPlayed: 312,
      friendSince: "2018",
      timezone: "PST",
      mood: "Contemplating existence...",
      achievements: ["OG Bestie", "Marathon Master", "Ride or Die"]
    },
    {
      id: 4,
      name: "WillByers",
      avatar: "🎨",
      status: "away",
      currentGame: null,
      lastPlayed: "2 hours ago",
      gamesPlayed: 156,
      friendSince: "2021",
      timezone: "GMT",
      mood: "brb vibing in the upside down",
      achievements: ["Survivor", "Art Buddy"]
    },
    {
      id: 5,
      name: "EnidSinclair",
      avatar: "🐺",
      status: "offline",
      currentGame: null,
      lastPlayed: "Yesterday",
      gamesPlayed: 98,
      friendSince: "2023",
      timezone: "CET",
      mood: "Werewolf mode activated 🌙",
      achievements: ["New Blood", "Social Butterfly"]
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#20e3b2'
      case 'playing': return '#7b2cbf'
      case 'away': return '#d4af37'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online'
      case 'playing': return 'In Game'
      case 'away': return 'Away'
      default: return 'Offline'
    }
  }

  return (
    <section id="friends" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p 
            className="font-elite text-sm tracking-[0.3em] mb-4"
            style={{ color: '#7b2cbf' }}
          >
            👻 YOUR SUPERNATURAL SQUAD 👻
          </p>
          <h2 
            className="font-creepy text-5xl md:text-6xl mb-6"
            style={{
              background: 'linear-gradient(135deg, #7b2cbf, #ff6b9d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            BFF ZONE
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#a0a0b0' }}>
            Your long-distance gaming partners. Distance is just a number when you're slaying together.
          </p>
        </div>

        {/* Friends Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {friends.map((friend) => (
            <div
              key={friend.id}
              onClick={() => setSelectedFriend(friend)}
              className="group cursor-pointer rounded-2xl p-6 transition-all duration-500"
              style={{
                background: 'rgba(26, 26, 46, 0.7)',
                border: `1px solid ${friend.status === 'playing' ? 'rgba(123, 44, 191, 0.5)' : 'rgba(255, 8, 68, 0.2)'}`,
                backdropFilter: 'blur(10px)',
                boxShadow: friend.status === 'playing' ? '0 0 30px rgba(123, 44, 191, 0.2)' : 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 8, 68, 0.2)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = friend.status === 'playing' ? '0 0 30px rgba(123, 44, 191, 0.2)' : 'none'
              }}
            >
              {/* Friend Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(123, 44, 191, 0.3), rgba(255, 8, 68, 0.3))',
                      border: '2px solid rgba(255, 8, 68, 0.3)'
                    }}
                  >
                    {friend.avatar}
                  </div>
                  <div 
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2"
                    style={{
                      background: getStatusColor(friend.status),
                      borderColor: '#0a0a0f',
                      boxShadow: `0 0 10px ${getStatusColor(friend.status)}`
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-gothic text-xl font-semibold">{friend.name}</h3>
                  <p className="text-sm" style={{ color: getStatusColor(friend.status) }}>
                    {getStatusText(friend.status)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: '#6b7280' }}>{friend.timezone}</p>
                </div>
              </div>

              {/* Current Activity */}
              {friend.currentGame && (
                <div 
                  className="mb-4 p-3 rounded-lg"
                  style={{
                    background: 'rgba(123, 44, 191, 0.15)',
                    border: '1px solid rgba(123, 44, 191, 0.3)'
                  }}
                >
                  <p className="text-xs mb-1" style={{ color: '#7b2cbf' }}>🎮 NOW PLAYING</p>
                  <p className="font-semibold">{friend.currentGame}</p>
                </div>
              )}

              {/* Mood */}
              <p 
                className="font-elite text-sm mb-4 italic"
                style={{ color: '#a0a0b0' }}
              >
                "{friend.mood}"
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm" style={{ color: '#6b7280' }}>
                <span>🎮 {friend.gamesPlayed} games</span>
                <span>💀 Since {friend.friendSince}</span>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 pt-4 flex gap-2" style={{ borderTop: '1px solid rgba(255, 8, 68, 0.1)' }}>
                <button 
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 8, 68, 0.2), rgba(123, 44, 191, 0.2))',
                    border: '1px solid rgba(255, 8, 68, 0.3)'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  🎮 Invite
                </button>
                <button 
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: 'rgba(26, 26, 46, 0.8)',
                    border: '1px solid rgba(123, 44, 191, 0.3)'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  💬 Message
                </button>
              </div>
            </div>
          ))}

          {/* Add Friend Card */}
          <div
            className="rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[300px]"
            style={{
              background: 'rgba(26, 26, 46, 0.4)',
              border: '2px dashed rgba(255, 8, 68, 0.3)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 8, 68, 0.6)'
              e.currentTarget.style.background = 'rgba(255, 8, 68, 0.1)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 8, 68, 0.3)'
              e.currentTarget.style.background = 'rgba(26, 26, 46, 0.4)'
            }}
          >
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
              style={{
                background: 'rgba(255, 8, 68, 0.1)',
                border: '2px solid rgba(255, 8, 68, 0.3)'
              }}
            >
              ➕
            </div>
            <p className="font-gothic text-lg" style={{ color: '#ff6b9d' }}>Add New BFF</p>
            <p className="text-sm mt-2 text-center" style={{ color: '#6b7280' }}>
              Expand your supernatural squad
            </p>
          </div>
        </div>

        {/* Friend Detail Modal */}
        {selectedFriend && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(10, 10, 15, 0.9)' }}
            onClick={() => setSelectedFriend(null)}
          >
            <div 
              className="max-w-lg w-full rounded-2xl p-8"
              style={{
                background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.95), rgba(10, 10, 15, 0.95))',
                border: '1px solid rgba(255, 8, 68, 0.3)',
                boxShadow: '0 0 50px rgba(255, 8, 68, 0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center gap-6 mb-6">
                <div 
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(123, 44, 191, 0.4), rgba(255, 8, 68, 0.4))',
                    border: '2px solid rgba(255, 8, 68, 0.4)'
                  }}
                >
                  {selectedFriend.avatar}
                </div>
                <div>
                  <h3 className="font-creepy text-3xl mb-2">{selectedFriend.name}</h3>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        background: getStatusColor(selectedFriend.status),
                        boxShadow: `0 0 10px ${getStatusColor(selectedFriend.status)}`
                      }}
                    />
                    <span style={{ color: getStatusColor(selectedFriend.status) }}>
                      {getStatusText(selectedFriend.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mood */}
              <div 
                className="p-4 rounded-xl mb-6"
                style={{
                  background: 'rgba(123, 44, 191, 0.1)',
                  border: '1px solid rgba(123, 44, 191, 0.2)'
                }}
              >
                <p className="font-elite text-lg italic" style={{ color: '#a0a0b0' }}>
                  "{selectedFriend.mood}"
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(255, 8, 68, 0.1)' }}>
                  <p className="text-2xl font-bold" style={{ color: '#ff0844' }}>{selectedFriend.gamesPlayed}</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>Games Played</p>
                </div>
                <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(123, 44, 191, 0.1)' }}>
                  <p className="text-2xl font-bold" style={{ color: '#7b2cbf' }}>{selectedFriend.friendSince}</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>BFFs Since</p>
                </div>
                <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(32, 227, 178, 0.1)' }}>
                  <p className="text-2xl font-bold" style={{ color: '#20e3b2' }}>{selectedFriend.timezone}</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>Timezone</p>
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-6">
                <p className="text-sm font-semibold mb-3" style={{ color: '#d4af37' }}>🏆 Shared Achievements</p>
                <div className="flex flex-wrap gap-2">
                  {selectedFriend.achievements.map((achievement, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        background: 'rgba(212, 175, 55, 0.1)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        color: '#d4af37'
                      }}
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button 
                  className="flex-1 py-3 rounded-xl font-gothic font-semibold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #ff0844, #7b2cbf)',
                    boxShadow: '0 0 20px rgba(255, 8, 68, 0.3)'
                  }}
                >
                  🎮 Start Playing
                </button>
                <button 
                  className="py-3 px-6 rounded-xl font-gothic transition-all"
                  style={{
                    background: 'transparent',
                    border: '2px solid rgba(123, 44, 191, 0.5)'
                  }}
                  onClick={() => setSelectedFriend(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default FriendPortal
