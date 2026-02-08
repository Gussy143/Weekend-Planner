import React, { useState, useRef, useEffect } from 'react'

interface EmojiPickerProps {
  value: string
  onChange: (emoji: string) => void
}

const EMOJI_CATEGORIES: { name: string; emojis: string[] }[] = [
  {
    name: '여행',
    emojis: [
      '🌊',
      '🏖️',
      '🏔️',
      '⛰️',
      '🌅',
      '🌄',
      '🗻',
      '🏕️',
      '🚗',
      '🚆',
      '🚌',
      '✈️',
      '🚂',
      '🛤️',
      '⛵',
      '🚢',
      '🗺️',
      '🧳',
      '🎒',
      '📸',
      '🏨',
      '🏠',
      '⛺',
      '🌉',
    ],
  },
  {
    name: '음식',
    emojis: [
      '🍽️',
      '🍚',
      '🍜',
      '🍲',
      '🍣',
      '🍱',
      '🥘',
      '🍳',
      '☕',
      '🍵',
      '🧋',
      '🍺',
      '🍷',
      '🥂',
      '🍰',
      '🍩',
      '🦀',
      '🦐',
      '🐟',
      '🍖',
      '🥩',
      '🌮',
      '🍕',
      '🥗',
    ],
  },
  {
    name: '활동',
    emojis: [
      '🎭',
      '🎪',
      '🎨',
      '🎬',
      '🎤',
      '🎵',
      '🎶',
      '🎮',
      '🏊',
      '🚴',
      '🧗',
      '⛷️',
      '🏄',
      '🤿',
      '🎣',
      '🚶',
      '📷',
      '🖼️',
      '🎠',
      '🎡',
      '🎢',
      '⛱️',
      '🏓',
      '🧘',
    ],
  },
  {
    name: '자연',
    emojis: [
      '🌸',
      '🌺',
      '🌻',
      '🌹',
      '🌷',
      '🌿',
      '🍀',
      '🍁',
      '🌳',
      '🌲',
      '🌴',
      '🌵',
      '🍂',
      '🍃',
      '🌾',
      '💐',
      '🦋',
      '🐚',
      '🌈',
      '⭐',
      '🌙',
      '☀️',
      '🌤️',
      '❄️',
    ],
  },
  {
    name: '감정',
    emojis: [
      '❤️',
      '💙',
      '💚',
      '💛',
      '🧡',
      '💜',
      '🤍',
      '💖',
      '✨',
      '🔥',
      '💫',
      '🎉',
      '🎊',
      '💯',
      '🏆',
      '👑',
      '😊',
      '🥰',
      '😎',
      '🤩',
      '😍',
      '🥳',
      '😌',
      '🙏',
    ],
  },
  {
    name: '장소',
    emojis: [
      '🏛️',
      '⛩️',
      '🕌',
      '🏯',
      '🏰',
      '🗼',
      '🗽',
      '⛪',
      '🏪',
      '🏬',
      '🏥',
      '🏫',
      '🏟️',
      '🎪',
      '🌃',
      '🌆',
      '🛒',
      '💈',
      '🏡',
      '🛖',
      '🏗️',
      '🏢',
      '🏘️',
      '🧭',
    ],
  },
]

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(0)
  const [search, setSearch] = useState('')
  const pickerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const allEmojis = EMOJI_CATEGORIES.flatMap(c => c.emojis)
  const filteredEmojis = search
    ? allEmojis.filter(() => true) // 이모지 필터는 카테고리 전체를 보여줌
    : EMOJI_CATEGORIES[activeCategory]?.emojis || []

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '1.5rem',
          background: 'var(--ios-bg-grouped)',
          border: '1px solid var(--ios-separator)',
          borderRadius: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'border-color 0.2s',
          minHeight: '48px',
        }}
      >
        {value ? (
          <span style={{ fontSize: '1.5rem' }}>{value}</span>
        ) : (
          <span
            style={{
              fontSize: '0.95rem',
              color: 'var(--ios-label-tertiary)',
            }}
          >
            이모지 선택...
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={pickerRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            background: 'var(--ios-bg-secondary)',
            border: '1px solid var(--ios-separator)',
            borderRadius: '16px',
            boxShadow:
              '0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'emojiPickerFadeIn 0.15s ease-out',
          }}
        >
          {/* 검색 */}
          <div style={{ padding: '12px 12px 8px' }}>
            <input
              type="text"
              placeholder="검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '0.85rem',
                background: 'var(--ios-bg-grouped)',
                border: '1px solid var(--ios-separator)',
                borderRadius: '10px',
                outline: 'none',
                color: 'var(--ios-label-primary)',
              }}
              autoFocus
            />
          </div>

          {/* 카테고리 탭 */}
          {!search && (
            <div
              style={{
                display: 'flex',
                gap: '2px',
                padding: '0 12px 8px',
                overflowX: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              {EMOJI_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setActiveCategory(idx)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: activeCategory === idx ? '700' : '500',
                    color:
                      activeCategory === idx
                        ? 'var(--ios-blue)'
                        : 'var(--ios-label-tertiary)',
                    background:
                      activeCategory === idx
                        ? 'var(--ios-blue-tint)'
                        : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* 이모지 그리드 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '2px',
              padding: '4px 12px 12px',
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            {(search ? allEmojis : filteredEmojis).map((emoji, idx) => (
              <button
                key={`${emoji}-${idx}`}
                type="button"
                onClick={() => {
                  onChange(emoji)
                  setIsOpen(false)
                  setSearch('')
                }}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e =>
                  (e.currentTarget.style.background =
                    'var(--ios-fill-tertiary)')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.background = 'transparent')
                }
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* 선택 해제 버튼 */}
          {value && (
            <div
              style={{
                borderTop: '1px solid var(--ios-separator)',
                padding: '8px 12px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  onChange('')
                  setIsOpen(false)
                }}
                style={{
                  width: '100%',
                  padding: '6px',
                  fontSize: '0.8rem',
                  color: 'var(--ios-red)',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                이모지 제거
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes emojiPickerFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
