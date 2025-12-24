// 서비스 워커 - PWA 오프라인 지원
const CACHE_NAME = 'gwangju-tour-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png'
];

// 설치 이벤트
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('캐시 열기');
        return cache.addAll(urlsToCache);
      })
  );
});

// 페치 이벤트 (네트워크 요청 인터셉트)
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 캐시에서 찾으면 캐시된 버전 반환
        if (response) {
          return response;
        }
        
        // 네트워크 요청 복사
        var fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          function(response) {
            // 응답이 유효하지 않으면 그대로 반환
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 응답 복사
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// 활성화 이벤트
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('이전 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});



