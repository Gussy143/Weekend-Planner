// localStorage 초기화 유틸리티
// 브라우저 콘솔에서 실행: clearEventStorage()

export const clearEventStorage = () => {
  localStorage.removeItem('event-storage');
  console.log('Event storage cleared. Please refresh the page.');
};

// 개발 환경에서만 window에 노출
if (import.meta.env.DEV) {
  (window as any).clearEventStorage = clearEventStorage;
}
