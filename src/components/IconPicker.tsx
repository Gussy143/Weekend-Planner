import React, { useState, useRef, useEffect } from 'react'
import type { IconType } from 'react-icons'
import {
  // 여행
  LuPlane,
  LuTrainFront,
  LuBus,
  LuCar,
  LuShip,
  LuBike,
  LuMap,
  LuMapPin,
  LuCompass,
  LuNavigation,
  LuGlobe,
  LuLuggage,
  LuTicket,
  LuFlag,
  LuSunrise,
  LuSunset,
  LuMountain,
  LuWaves,
  LuTreePalm,
  LuTentTree,
  LuFuel,
  LuSquareParking,
  // 음식
  LuUtensilsCrossed,
  LuCoffee,
  LuWine,
  LuBeer,
  LuCupSoda,
  LuIceCreamCone,
  LuCake,
  LuCroissant,
  LuPizza,
  LuSandwich,
  LuSalad,
  LuCookie,
  LuCherry,
  LuApple,
  LuGrape,
  LuCitrus,
  LuEgg,
  LuBeef,
  LuFish,
  LuPopcorn,
  LuMilk,
  LuGlassWater,
  LuCandy,
  // 활동
  LuCamera,
  LuMusic,
  LuHeadphones,
  LuGamepad2,
  LuDumbbell,
  LuBinoculars,
  LuTelescope,
  LuPencil,
  LuPaintbrush,
  LuPalette,
  LuScissors,
  LuBookOpen,
  LuLibrary,
  LuGraduationCap,
  LuMic,
  LuFilm,
  LuClapperboard,
  LuDrama,
  LuSpeaker,
  LuRadio,
  LuGuitar,
  LuDice5,
  LuPuzzle,
  LuAward,
  // 자연
  LuSun,
  LuMoon,
  LuStar,
  LuCloud,
  LuCloudRain,
  LuSnowflake,
  LuWind,
  LuRainbow,
  LuFlower,
  LuFlower2,
  LuTreePine,
  LuTreeDeciduous,
  LuLeaf,
  LuSprout,
  LuClover,
  LuFeather,
  LuBird,
  LuBug,
  LuDog,
  LuCat,
  LuRabbit,
  LuSquirrel,
  LuTurtle,
  // 장소
  LuBuilding,
  LuBuilding2,
  LuHotel,
  LuSchool,
  LuChurch,
  LuLandmark,
  LuFactory,
  LuStore,
  LuWarehouse,
  LuHouse,
  LuDoorOpen,
  LuFerrisWheel,
  LuRollerCoaster,
  LuCastle,
  LuTowerControl,
  LuHospital,
  LuBriefcase,
  LuBanknote,
  LuShoppingCart,
  LuShoppingBag,
  LuGift,
  LuPackage,
  LuMail,
  // 감정 & 기호
  LuHeart,
  LuThumbsUp,
  LuSmile,
  LuLaugh,
  LuPartyPopper,
  LuSparkles,
  LuFlame,
  LuZap,
  LuCrown,
  LuTrophy,
  LuMedal,
  LuGem,
  LuTarget,
  LuRocket,
  LuLightbulb,
  LuBell,
  LuAlarmClock,
  LuCalendar,
  LuClock,
  LuTimer,
  LuPhone,
  LuWifi,
  LuShield,
} from 'react-icons/lu'

interface IconEntry {
  name: string
  Icon: IconType
  keywords: string[]
}

const ICON_CATEGORIES: { name: string; icons: IconEntry[] }[] = [
  {
    name: '여행',
    icons: [
      { name: 'LuPlane', Icon: LuPlane, keywords: ['비행기', '여행', 'plane'] },
      {
        name: 'LuTrainFront',
        Icon: LuTrainFront,
        keywords: ['기차', '열차', 'train'],
      },
      { name: 'LuBus', Icon: LuBus, keywords: ['버스', 'bus'] },
      { name: 'LuCar', Icon: LuCar, keywords: ['자동차', '차', 'car'] },
      { name: 'LuShip', Icon: LuShip, keywords: ['배', '선박', 'ship'] },
      { name: 'LuBike', Icon: LuBike, keywords: ['자전거', 'bike'] },
      { name: 'LuMap', Icon: LuMap, keywords: ['지도', 'map'] },
      { name: 'LuMapPin', Icon: LuMapPin, keywords: ['위치', '핀', 'pin'] },
      { name: 'LuCompass', Icon: LuCompass, keywords: ['나침반', 'compass'] },
      {
        name: 'LuNavigation',
        Icon: LuNavigation,
        keywords: ['네비게이션', '방향'],
      },
      { name: 'LuGlobe', Icon: LuGlobe, keywords: ['지구', '글로벌', 'globe'] },
      { name: 'LuLuggage', Icon: LuLuggage, keywords: ['짐', '여행가방'] },
      { name: 'LuTicket', Icon: LuTicket, keywords: ['티켓', '표'] },
      { name: 'LuFlag', Icon: LuFlag, keywords: ['깃발', '목적지'] },
      { name: 'LuSunrise', Icon: LuSunrise, keywords: ['일출', '아침'] },
      { name: 'LuSunset', Icon: LuSunset, keywords: ['일몰', '저녁'] },
      { name: 'LuMountain', Icon: LuMountain, keywords: ['산', '등산'] },
      { name: 'LuWaves', Icon: LuWaves, keywords: ['바다', '파도', '물'] },
      { name: 'LuTreePalm', Icon: LuTreePalm, keywords: ['야자수', '해변'] },
      { name: 'LuTentTree', Icon: LuTentTree, keywords: ['텐트', '캠핑'] },
      { name: 'LuFuel', Icon: LuFuel, keywords: ['주유소', '연료'] },
      {
        name: 'LuSquareParking',
        Icon: LuSquareParking,
        keywords: ['주차', '파킹'],
      },
    ],
  },
  {
    name: '음식',
    icons: [
      {
        name: 'LuUtensilsCrossed',
        Icon: LuUtensilsCrossed,
        keywords: ['식사', '레스토랑', '맛집'],
      },
      { name: 'LuCoffee', Icon: LuCoffee, keywords: ['커피', '카페'] },
      { name: 'LuWine', Icon: LuWine, keywords: ['와인', '술'] },
      { name: 'LuBeer', Icon: LuBeer, keywords: ['맥주', '술집'] },
      { name: 'LuCupSoda', Icon: LuCupSoda, keywords: ['음료', '소다'] },
      {
        name: 'LuIceCreamCone',
        Icon: LuIceCreamCone,
        keywords: ['아이스크림', '디저트'],
      },
      { name: 'LuCake', Icon: LuCake, keywords: ['케이크', '생일'] },
      { name: 'LuCroissant', Icon: LuCroissant, keywords: ['빵', '베이커리'] },
      { name: 'LuPizza', Icon: LuPizza, keywords: ['피자'] },
      { name: 'LuSandwich', Icon: LuSandwich, keywords: ['샌드위치'] },
      { name: 'LuSalad', Icon: LuSalad, keywords: ['샐러드', '건강'] },
      { name: 'LuCookie', Icon: LuCookie, keywords: ['쿠키', '과자'] },
      { name: 'LuCherry', Icon: LuCherry, keywords: ['체리', '과일'] },
      { name: 'LuApple', Icon: LuApple, keywords: ['사과', '과일'] },
      { name: 'LuGrape', Icon: LuGrape, keywords: ['포도', '과일'] },
      { name: 'LuCitrus', Icon: LuCitrus, keywords: ['감귤', '오렌지'] },
      { name: 'LuEgg', Icon: LuEgg, keywords: ['계란', '달걀'] },
      { name: 'LuBeef', Icon: LuBeef, keywords: ['소고기', '고기'] },
      { name: 'LuFish', Icon: LuFish, keywords: ['생선', '회'] },
      { name: 'LuPopcorn', Icon: LuPopcorn, keywords: ['팝콘', '영화'] },
      { name: 'LuMilk', Icon: LuMilk, keywords: ['우유'] },
      { name: 'LuGlassWater', Icon: LuGlassWater, keywords: ['물', '음료'] },
      { name: 'LuCandy', Icon: LuCandy, keywords: ['사탕', '캔디'] },
    ],
  },
  {
    name: '활동',
    icons: [
      { name: 'LuCamera', Icon: LuCamera, keywords: ['카메라', '사진'] },
      { name: 'LuMusic', Icon: LuMusic, keywords: ['음악', '노래'] },
      {
        name: 'LuHeadphones',
        Icon: LuHeadphones,
        keywords: ['헤드폰', '음악'],
      },
      { name: 'LuGamepad2', Icon: LuGamepad2, keywords: ['게임', '놀이'] },
      { name: 'LuDumbbell', Icon: LuDumbbell, keywords: ['운동', '헬스'] },
      {
        name: 'LuBinoculars',
        Icon: LuBinoculars,
        keywords: ['쌍안경', '관찰'],
      },
      { name: 'LuTelescope', Icon: LuTelescope, keywords: ['망원경', '별'] },
      { name: 'LuPencil', Icon: LuPencil, keywords: ['연필', '쓰기'] },
      { name: 'LuPaintbrush', Icon: LuPaintbrush, keywords: ['붓', '그림'] },
      { name: 'LuPalette', Icon: LuPalette, keywords: ['팔레트', '미술'] },
      { name: 'LuScissors', Icon: LuScissors, keywords: ['가위', '만들기'] },
      { name: 'LuBookOpen', Icon: LuBookOpen, keywords: ['책', '독서'] },
      { name: 'LuLibrary', Icon: LuLibrary, keywords: ['도서관'] },
      {
        name: 'LuGraduationCap',
        Icon: LuGraduationCap,
        keywords: ['졸업', '학교'],
      },
      { name: 'LuMic', Icon: LuMic, keywords: ['마이크', '노래방'] },
      { name: 'LuFilm', Icon: LuFilm, keywords: ['영화', '필름'] },
      {
        name: 'LuClapperboard',
        Icon: LuClapperboard,
        keywords: ['영화', '촬영'],
      },
      { name: 'LuDrama', Icon: LuDrama, keywords: ['연극', '공연'] },
      { name: 'LuSpeaker', Icon: LuSpeaker, keywords: ['스피커', '음악'] },
      { name: 'LuRadio', Icon: LuRadio, keywords: ['라디오'] },
      { name: 'LuGuitar', Icon: LuGuitar, keywords: ['기타', '음악'] },
      { name: 'LuDice5', Icon: LuDice5, keywords: ['주사위', '보드게임'] },
      { name: 'LuPuzzle', Icon: LuPuzzle, keywords: ['퍼즐'] },
      { name: 'LuAward', Icon: LuAward, keywords: ['상', '수상'] },
    ],
  },
  {
    name: '자연',
    icons: [
      { name: 'LuSun', Icon: LuSun, keywords: ['해', '태양'] },
      { name: 'LuMoon', Icon: LuMoon, keywords: ['달', '밤'] },
      { name: 'LuStar', Icon: LuStar, keywords: ['별', '밤하늘'] },
      { name: 'LuCloud', Icon: LuCloud, keywords: ['구름', '날씨'] },
      { name: 'LuCloudRain', Icon: LuCloudRain, keywords: ['비', '우천'] },
      { name: 'LuSnowflake', Icon: LuSnowflake, keywords: ['눈', '겨울'] },
      { name: 'LuWind', Icon: LuWind, keywords: ['바람'] },
      { name: 'LuRainbow', Icon: LuRainbow, keywords: ['무지개'] },
      { name: 'LuFlower', Icon: LuFlower, keywords: ['꽃', '봄'] },
      { name: 'LuFlower2', Icon: LuFlower2, keywords: ['꽃', '봄'] },
      { name: 'LuTreePine', Icon: LuTreePine, keywords: ['소나무', '숲'] },
      {
        name: 'LuTreeDeciduous',
        Icon: LuTreeDeciduous,
        keywords: ['나무', '숲'],
      },
      { name: 'LuLeaf', Icon: LuLeaf, keywords: ['잎', '가을'] },
      { name: 'LuSprout', Icon: LuSprout, keywords: ['새싹', '봄'] },
      { name: 'LuClover', Icon: LuClover, keywords: ['클로버', '행운'] },
      { name: 'LuFeather', Icon: LuFeather, keywords: ['깃털', '새'] },
      { name: 'LuBird', Icon: LuBird, keywords: ['새'] },
      { name: 'LuBug', Icon: LuBug, keywords: ['벌레', '곤충'] },
      { name: 'LuDog', Icon: LuDog, keywords: ['강아지', '개'] },
      { name: 'LuCat', Icon: LuCat, keywords: ['고양이'] },
      { name: 'LuRabbit', Icon: LuRabbit, keywords: ['토끼'] },
      { name: 'LuSquirrel', Icon: LuSquirrel, keywords: ['다람쥐'] },
      { name: 'LuTurtle', Icon: LuTurtle, keywords: ['거북이'] },
    ],
  },
  {
    name: '장소',
    icons: [
      { name: 'LuBuilding', Icon: LuBuilding, keywords: ['건물', '빌딩'] },
      { name: 'LuBuilding2', Icon: LuBuilding2, keywords: ['건물', '사무실'] },
      { name: 'LuHotel', Icon: LuHotel, keywords: ['호텔', '숙소'] },
      { name: 'LuSchool', Icon: LuSchool, keywords: ['학교'] },
      { name: 'LuChurch', Icon: LuChurch, keywords: ['교회', '성당'] },
      { name: 'LuLandmark', Icon: LuLandmark, keywords: ['랜드마크', '관광'] },
      { name: 'LuFactory', Icon: LuFactory, keywords: ['공장'] },
      { name: 'LuStore', Icon: LuStore, keywords: ['가게', '상점'] },
      { name: 'LuWarehouse', Icon: LuWarehouse, keywords: ['창고'] },
      { name: 'LuHouse', Icon: LuHouse, keywords: ['집', '홈'] },
      { name: 'LuDoorOpen', Icon: LuDoorOpen, keywords: ['문', '입구'] },
      {
        name: 'LuFerrisWheel',
        Icon: LuFerrisWheel,
        keywords: ['관람차', '놀이공원'],
      },
      {
        name: 'LuRollerCoaster',
        Icon: LuRollerCoaster,
        keywords: ['롤러코스터'],
      },
      { name: 'LuCastle', Icon: LuCastle, keywords: ['성', '궁전'] },
      {
        name: 'LuTowerControl',
        Icon: LuTowerControl,
        keywords: ['타워', '전망대'],
      },
      { name: 'LuHospital', Icon: LuHospital, keywords: ['병원'] },
      { name: 'LuBriefcase', Icon: LuBriefcase, keywords: ['가방', '출장'] },
      {
        name: 'LuBanknote',
        Icon: LuBanknote,
        keywords: ['돈', '은행', '환전'],
      },
      {
        name: 'LuShoppingCart',
        Icon: LuShoppingCart,
        keywords: ['쇼핑', '장보기'],
      },
      { name: 'LuShoppingBag', Icon: LuShoppingBag, keywords: ['쇼핑백'] },
      { name: 'LuGift', Icon: LuGift, keywords: ['선물'] },
      { name: 'LuPackage', Icon: LuPackage, keywords: ['택배', '상자'] },
      { name: 'LuMail', Icon: LuMail, keywords: ['메일', '우편'] },
    ],
  },
  {
    name: '기호',
    icons: [
      { name: 'LuHeart', Icon: LuHeart, keywords: ['하트', '사랑'] },
      { name: 'LuThumbsUp', Icon: LuThumbsUp, keywords: ['좋아요', '추천'] },
      { name: 'LuSmile', Icon: LuSmile, keywords: ['웃음', '스마일'] },
      { name: 'LuLaugh', Icon: LuLaugh, keywords: ['웃음'] },
      {
        name: 'LuPartyPopper',
        Icon: LuPartyPopper,
        keywords: ['파티', '축하'],
      },
      { name: 'LuSparkles', Icon: LuSparkles, keywords: ['반짝', '빛'] },
      { name: 'LuFlame', Icon: LuFlame, keywords: ['불', '인기'] },
      { name: 'LuZap', Icon: LuZap, keywords: ['번개', '전기'] },
      { name: 'LuCrown', Icon: LuCrown, keywords: ['왕관', '킹'] },
      { name: 'LuTrophy', Icon: LuTrophy, keywords: ['트로피', '우승'] },
      { name: 'LuMedal', Icon: LuMedal, keywords: ['메달'] },
      { name: 'LuGem', Icon: LuGem, keywords: ['보석', '다이아몬드'] },
      { name: 'LuTarget', Icon: LuTarget, keywords: ['타겟', '목표'] },
      { name: 'LuRocket', Icon: LuRocket, keywords: ['로켓', '출발'] },
      {
        name: 'LuLightbulb',
        Icon: LuLightbulb,
        keywords: ['전구', '아이디어'],
      },
      { name: 'LuBell', Icon: LuBell, keywords: ['종', '알림'] },
      { name: 'LuAlarmClock', Icon: LuAlarmClock, keywords: ['알람', '시계'] },
      { name: 'LuCalendar', Icon: LuCalendar, keywords: ['달력', '일정'] },
      { name: 'LuClock', Icon: LuClock, keywords: ['시계', '시간'] },
      { name: 'LuTimer', Icon: LuTimer, keywords: ['타이머'] },
      { name: 'LuPhone', Icon: LuPhone, keywords: ['전화'] },
      { name: 'LuWifi', Icon: LuWifi, keywords: ['와이파이'] },
      { name: 'LuShield', Icon: LuShield, keywords: ['방패', '보안'] },
    ],
  },
]

// 아이콘 이름 → 컴포넌트 매핑 (저장/복원용)
const ICON_MAP = new Map<string, IconType>()
ICON_CATEGORIES.forEach(cat =>
  cat.icons.forEach(entry => ICON_MAP.set(entry.name, entry.Icon))
)

export function getIconComponent(name: string): IconType | null {
  return ICON_MAP.get(name) || null
}

interface IconPickerProps {
  value: string // 아이콘 이름 (예: 'LuWaves')
  onChange: (iconName: string) => void
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(0)
  const [search, setSearch] = useState('')
  const pickerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

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

  const allIcons = ICON_CATEGORIES.flatMap(c => c.icons)

  const filteredIcons = search
    ? allIcons.filter(
        entry =>
          entry.name.toLowerCase().includes(search.toLowerCase()) ||
          entry.keywords.some(k =>
            k.toLowerCase().includes(search.toLowerCase())
          )
      )
    : ICON_CATEGORIES[activeCategory]?.icons || []

  const SelectedIcon = value ? ICON_MAP.get(value) : null

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: 'var(--ios-bg-grouped)',
          border: '1px solid var(--ios-separator)',
          borderRadius: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'border-color 0.2s',
          minHeight: '48px',
          color: 'var(--ios-label-primary)',
        }}
      >
        {SelectedIcon ? (
          <SelectedIcon size={22} />
        ) : (
          <span
            style={{
              fontSize: '0.95rem',
              color: 'var(--ios-label-tertiary)',
            }}
          >
            아이콘 선택...
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
            animation: 'iconPickerFadeIn 0.15s ease-out',
          }}
        >
          {/* 검색 */}
          <div style={{ padding: '12px 12px 8px' }}>
            <input
              type="text"
              placeholder="필터"
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
                boxSizing: 'border-box',
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
              {ICON_CATEGORIES.map((cat, idx) => (
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

          {/* 아이콘 그리드 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '2px',
              padding: '4px 12px 12px',
              maxHeight: '240px',
              overflowY: 'auto',
            }}
          >
            {filteredIcons.map(entry => {
              const IconComp = entry.Icon
              const isSelected = value === entry.name
              return (
                <button
                  key={entry.name}
                  type="button"
                  title={entry.keywords[0]}
                  onClick={() => {
                    onChange(entry.name)
                    setIsOpen(false)
                    setSearch('')
                  }}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isSelected
                      ? 'var(--ios-blue-tint)'
                      : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                    color: isSelected
                      ? 'var(--ios-blue)'
                      : 'var(--ios-label-primary)',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected)
                      e.currentTarget.style.background =
                        'var(--ios-fill-tertiary)'
                  }}
                  onMouseLeave={e => {
                    if (!isSelected)
                      e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <IconComp size={20} />
                </button>
              )
            })}
            {filteredIcons.length === 0 && (
              <div
                style={{
                  gridColumn: '1 / -1',
                  padding: '1rem',
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  color: 'var(--ios-label-tertiary)',
                }}
              >
                검색 결과 없음
              </div>
            )}
          </div>

          {/* 제거 버튼 */}
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
                제거
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes iconPickerFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
