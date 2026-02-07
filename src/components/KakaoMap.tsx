import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  address: string;
  placeName: string;
}

export const KakaoMap: React.FC<KakaoMapProps> = ({ address, placeName }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout>;

    const waitForKakao = (attempt = 0) => {
      if (cancelled) return;

      // SDK 스크립트 로드 대기 (최대 10초)
      if (typeof window.kakao === 'undefined') {
        if (attempt < 30) {
          retryTimer = setTimeout(() => waitForKakao(attempt + 1), 300);
        } else {
          setErrorMsg('카카오맵 SDK 로드 실패\n인터넷 연결을 확인해주세요');
          setStatus('error');
        }
        return;
      }

      // autoload=false: kakao.maps.load()로 실제 초기화
      if (typeof window.kakao.maps?.load === 'function') {
        try {
          window.kakao.maps.load(() => {
            if (!cancelled) createMap();
          });
        } catch {
          // load가 이미 완료된 경우
          if (window.kakao.maps.LatLng) {
            createMap();
          } else {
            setErrorMsg('카카오맵 초기화 실패');
            setStatus('error');
          }
        }
      } else if (window.kakao.maps?.LatLng) {
        // 이미 완전히 로드됨
        createMap();
      } else {
        // 아직 불완전 - 재시도
        if (attempt < 30) {
          retryTimer = setTimeout(() => waitForKakao(attempt + 1), 300);
        } else {
          setErrorMsg('카카오맵 API 초기화 실패');
          setStatus('error');
        }
      }
    };

    const createMap = () => {
      if (cancelled || !mapRef.current || mapInstanceRef.current) return;

      try {
        const kakao = window.kakao;
        const defaultCoords = new kakao.maps.LatLng(37.8228, 128.8555);

        const map = new kakao.maps.Map(mapRef.current, {
          center: defaultCoords,
          level: 4,
        });
        mapInstanceRef.current = map;
        setStatus('ready');

        // 주소 → 좌표 검색
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, (result: any[], geocodeStatus: any) => {
          if (geocodeStatus === kakao.maps.services.Status.OK && result.length > 0) {
            const coords = new kakao.maps.LatLng(+result[0].y, +result[0].x);
            placeMarker(map, coords);
          } else {
            // 폴백: 장소명으로 키워드 검색
            const ps = new kakao.maps.services.Places();
            ps.keywordSearch(placeName, (data: any[], psStatus: any) => {
              if (psStatus === kakao.maps.services.Status.OK && data.length > 0) {
                const coords = new kakao.maps.LatLng(+data[0].y, +data[0].x);
                placeMarker(map, coords);
              } else {
                placeMarker(map, defaultCoords);
              }
            });
          }
        });
      } catch (err) {
        console.error('KakaoMap error:', err);
        setErrorMsg('지도를 표시할 수 없습니다');
        setStatus('error');
      }
    };

    const placeMarker = (map: any, coords: any) => {
      const kakao = window.kakao;
      const marker = new kakao.maps.Marker({ map, position: coords });
      const iw = new kakao.maps.InfoWindow({
        content: `<div style="padding:5px 10px;font-size:12px;font-weight:600;white-space:nowrap;">${placeName}</div>`,
      });
      iw.open(map, marker);
      map.setCenter(coords);
    };

    waitForKakao();

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
    };
  }, [address, placeName]);

  if (status === 'error') {
    return (
      <div style={{
        height: '240px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        background: 'var(--ios-fill-tertiary)',
        borderRadius: '12px',
        color: 'var(--ios-label-tertiary)',
        fontSize: '13px',
        textAlign: 'center',
        whiteSpace: 'pre-line',
        padding: '20px',
      }}>
        <span>{errorMsg}</span>
        <button
          onClick={() => {
            setStatus('loading');
            setErrorMsg('');
            mapInstanceRef.current = null;
            // 재시도
            const el = mapRef.current;
            if (el) el.innerHTML = '';
            window.location.reload();
          }}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--ios-blue)',
            color: 'white',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {status === 'loading' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--ios-fill-tertiary)',
          borderRadius: '12px',
          color: 'var(--ios-label-tertiary)',
          fontSize: '13px',
          zIndex: 1,
        }}>
          지도를 불러오는 중...
        </div>
      )}
      <div
        ref={mapRef}
        style={{ width: '100%', height: '240px', borderRadius: '12px' }}
      />
    </div>
  );
};
