import React, { useState } from 'react'

const Achievements = () => {
  const [filter, setFilter] = useState('all')

  const achievements = [
    {
      id: 1,
      title: "First Blood",
      description: "Complete your first gaming session with your BFF",
      icon: "🩸",
      rarity: "common",
      unlocked: true,
      unlockedDate: "Jan 15, 2020",
      progress: 100,
      color: "#20e3b2"
    },
    {
      id: 2,
      title: "Night Owl Duo",
      description: "Game together past 3 AM for 10 nights",
      icon: "🦉",
      rarity: "rare",
      unlocked: true,
      unlockedDate: "Mar 22, 2021",
      progress: 100,
      color: "#7b2cbf"
    },
    {
      id: 3,
      title: "Upside Down Survivors",
      description: "Win 100 horror game matches together",
      icon: "👻",
      rarity: "epic",
      unlocked: true,
      unlockedDate: "Oct 31, 2023",
      progress: 100,
      color: "#ff0844"
    },
    {
      id: 4,
      title: "Wednesday's Champions",
      description: "Maintain a 30-day gaming streak",
      icon: "🖤",
      rarity: "legendary",
      unlocked: true,
      unlockedDate: "Dec 1, 2024",
      progress: 100,
      color: "#d4af37"
    },
    {
      id: 5,
      title: "Time Zone Warriors",
      description: "Coordinate 50 gaming sessions across different time zones",
      icon: "🌍",
      rarity: "epic",
      unlocked: true,
      unlockedDate: "Aug 15, 2023",
      progress: 100,
      color: "#00d4ff"
    },
    {
      id: 6,
      title: "The Chosen Ones",
      description: "Reach max level together in any co-op game",
      icon: "⭐",
      rarity: "legendary",
      unlocked: false,
      progress: 78,
      color: "#ff6b9d"
    },
    {
      id: 7,
      title: "Demogorgon Slayers",
      description: "Defeat 500 monsters/enemies together",
      icon: "⚔️",
      rarity: "epic",
      unlocked: false,
      progress: 89,
      color: "#ff0844"
    },
    {
      id: 8,
      title: "Thing's Best Friends",
      description: "Send 10,000 messages to your BFF",
      icon: "💬",
      rarity: "rare",
      unlocked: false,
      progress: 67,
      color: "#7b2cbf"
    },
    {
      id: 9,
      title: "Portal Masters",
      description: "Play 50 different games together",
      icon: "🌀",
      rarity: "rare",
      unlocked: false,
      progress: 42,
      color: "#00d4ff"
    },
    {
      id: 10,
      title: "Eternal Bond",
      description: "Be gaming BFFs for 5 years",
      icon: "💀",
      rarity: "mythic",
      unlocked: false,
      progress: 80,
      color: "#d4af37"
    },
  ]

  const rarityColors = {
    common: { bg: 'rgba(32, 227, 178, 0.1)', border: 'rgba(32, 227, 178, 0.3)', text: '#20e3b2' },
    rare: { bg: 'rgba(123, 44, 191, 0.1)', border: 'rgba(123, 44, 191, 0.3)', text: '#7b2cbf' },
    epic: { bg: 'rgba(255, 8, 68, 0.1)', border: 'rgba(255, 8, 68, 0.3)', text: '#ff0844' },
    legendary: { bg: 'rgba(212, 175, 55, 0.1)', border: 'rgba(212, 175, 55, 0.3)', text: '#d4af37' },
    mythic: { bg: 'rgba(255, 107, 157, 0.1)', border: 'rgba(255, 107, 157, 0.3)', text: '#ff6b9d' },
  }

  const filteredAchievements = achievements.filter(a => {
    if (filter === 'all') return true
    if (filter === 'unlocked') return a.unlocked
    if (filter === 'locked') return !a.unlocked
    return true
  })

  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.unlocked).length,
    points: achievements.filter(a => a.unlocked).reduce((acc, a) => {
      const pointMap = { common: 10, rare: 25, epic: 50, legendary: 100, mythic: 200 }
      return acc + pointMap[a.rarity]
    }, 0)
  }

  return (
    <section id="achievements" className="py-24 relative">
      {/* Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 20% 80%, rgba(212, 175, 55, 0.2) 0%, transparent 50%)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p 
            className="font-elite text-sm tracking-[0.3em] mb-4"
            style={{ color: '#d4af37' }}
          >
            🏆 YOUR DARK LEGACY 🏆
          </p>
          <h2 
            className="font-creepy text-5xl md:text-6xl mb-6"
            style={{
              background: 'linear-gradient(135deg, #d4af37, #ff0844)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ACHIEVEMENTS
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#a0a0b0' }}>
            Badges of honor earned in the shadows. Every achievement tells a story of friendship forged in gaming.
          </p>
        </div>

        {/* Stats Overview */}
        <div 
          className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto p-6 rounded-2xl"
          style={{
            background: 'rgba(26, 26, 46, 0.7)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="text-center">
            <p className="text-4xl font-bold font-gothic" style={{ color: '#d4af37' }}>
              {stats.unlocked}/{stats.total}
            </p>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Unlocked</p>
          </div>
          <div className="text-center border-x" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
            <p className="text-4xl font-bold font-gothic" style={{ color: '#ff0844' }}>
              {stats.points}
            </p>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Points</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold font-gothic" style={{ color: '#7b2cbf' }}>
              {Math.round((stats.unlocked / stats.total) * 100)}%
            </p>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Complete</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-3 mb-8">
          {['all', 'unlocked', 'locked'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-6 py-2 rounded-xl font-medium capitalize transition-all"
              style={{
                background: filter === f 
                  ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(255, 8, 68, 0.2))' 
                  : 'rgba(26, 26, 46, 0.6)',
                border: filter === f 
                  ? '1px solid rgba(212, 175, 55, 0.4)' 
                  : '1px solid rgba(255, 8, 68, 0.2)',
                color: filter === f ? '#d4af37' : '#a0a0b0'
              }}
            >
              {f === 'all' ? '🏆 All' : f === 'unlocked' ? '✨ Unlocked' : '🔒 In Progress'}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`group rounded-2xl p-5 transition-all duration-500 ${
                achievement.unlocked ? '' : 'opacity-80'
              }`}
              style={{
                background: achievement.unlocked 
                  ? `linear-gradient(135deg, ${rarityColors[achievement.rarity].bg}, rgba(26, 26, 46, 0.8))` 
                  : 'rgba(26, 26, 46, 0.6)',
                border: `1px solid ${achievement.unlocked ? rarityColors[achievement.rarity].border : 'rgba(107, 114, 128, 0.2)'}`,
                backdropFilter: 'blur(10px)'
              }}
              onMouseOver={(e) => {
                if (achievement.unlocked) {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = `0 10px 30px ${achievement.color}30`
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div 
                  className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0 transition-transform duration-500 ${
                    achievement.unlocked ? 'group-hover:scale-110 group-hover:rotate-12' : 'grayscale'
                  }`}
                  style={{
                    background: achievement.unlocked 
                      ? `linear-gradient(135deg, ${achievement.color}40, ${achievement.color}20)` 
                      : 'rgba(107, 114, 128, 0.2)',
                    border: `2px solid ${achievement.unlocked ? `${achievement.color}60` : 'rgba(107, 114, 128, 0.3)'}`,
                    boxShadow: achievement.unlocked ? `0 0 20px ${achievement.color}30` : 'none'
                  }}
                >
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-gothic font-semibold text-lg">
                      {achievement.title}
                    </h4>
                    <span 
                      className="px-2 py-0.5 rounded-full text-xs uppercase font-bold"
                      style={{
                        background: rarityColors[achievement.rarity].bg,
                        color: rarityColors[achievement.rarity].text,
                        border: `1px solid ${rarityColors[achievement.rarity].border}`
                      }}
                    >
                      {achievement.rarity}
                    </span>
                  </div>

                  <p className="text-sm mb-3" style={{ color: '#a0a0b0' }}>
                    {achievement.description}
                  </p>

                  {/* Progress or Unlock Date */}
                  {achievement.unlocked ? (
                    <p className="text-xs" style={{ color: '#20e3b2' }}>
                      ✓ Unlocked on {achievement.unlockedDate}
                    </p>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span style={{ color: '#6b7280' }}>Progress</span>
                        <span style={{ color: achievement.color }}>{achievement.progress}%</span>
                      </div>
                      <div 
                        className="h-2 rounded-full overflow-hidden"
                        style={{ background: 'rgba(107, 114, 128, 0.2)' }}
                      >
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${achievement.progress}%`,
                            background: `linear-gradient(90deg, ${achievement.color}, ${achievement.color}80)`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🏆</span>
            <p className="font-gothic text-xl" style={{ color: '#6b7280' }}>
              No achievements found...
            </p>
          </div>
        )}

        {/* Secret Achievement Teaser */}
        <div 
          className="mt-12 p-6 rounded-2xl text-center"
          style={{
            background: 'rgba(26, 26, 46, 0.5)',
            border: '2px dashed rgba(255, 107, 157, 0.3)'
          }}
        >
          <span className="text-4xl mb-4 block">❓</span>
          <p className="font-gothic text-lg mb-2" style={{ color: '#ff6b9d' }}>
            Secret Achievement
          </p>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            "Some bonds are forged in darkness. Keep playing together to discover this hidden trophy..."
          </p>
        </div>
      </div>
    </section>
  )
}

export default Achievements
