import React, { useState, useEffect, useRef } from 'react';
import GoogleMapsComponent from './GoogleMapsComponent';
import ProfilePage from './ProfilePage';
import AuthPage from './AuthPage';
import HomeScreen from './HomeScreen';
import BannerPage from './BannerPage';
import TourSelectionPage from './TourSelectionPage';
import TourDetailPage from './TourDetailPage';
import StampTourPage from "./StampTourPage"; // [추가]
import SurveyPage from './SurveyPage';
import AdminDashboard from './AdminDashboard';
import CommonHeader from './CommonHeader';
import SearchModal from './SearchModal';
import Toast from './Toast';
import './App.css';

// 헬퍼 함수들 (DB 데이터와 정확히 일치) - 먼저 정의
const getThemeColor = (themeId) => {
  const colors = {
    null: '#6C5CE7', // 전체 (보라색)
    1: '#FF6B6B',   // 쇼핑
    2: '#4ECDC4',   // 역사
    3: '#45B7D1',   // 문화
    4: '#96CEB4',   // 음식
    5: '#FFEAA7',   // 자연
    6: '#FF9500',   // 체험
    7: '#A8E6CF',   // 숙박
    8: '#9B59B6',   // 근교
  };
  return colors[themeId] || '#4A90E2';
};

const getThemeIcon = (themeId) => {
  const icons = {
    null: '',      // 전체
    1: '🛍️',        // 쇼핑
    2: '🏛️',        // 역사
    3: '🎭',        // 문화
    4: '🍜',        // 음식
    5: '🌿',        // 자연
    6: '🏃‍♂️',       // 체험
    7: '🏨',        // 숙박
    8: '🏞️',        // 근교
  };
  return icons[themeId] || '📍';
};

const getSpotIcon = (themeId) => {
  const icons = {
    1: '🛍️',        // 쇼핑
    2: '🏛️',        // 역사
    3: '🎭',        // 문화
    4: '🍜',        // 음식
    5: '🌿',        // 자연
    6: '🏃‍♂️',        // 체험
    7: '🏨',        // 숙박
    8: '🏞️',        // 근교
  };
  return icons[themeId] || '📍';
};

const getThemeNameById = (themeId) => {
  const themeNames = {
    1: '쇼핑',
    2: '역사',
    3: '문화',
    4: '음식',
    5: '자연',
    6: '체험',
    7: '숙박',
    8: '근교',
  };
  return themeNames[themeId] || '기타';
};


// 관광지별 동영상 데이터
const getSpotVideoData = (spotName) => {
  const videoData = {
    // 쇼핑 테마 (ID: 1)
    '충금지하상가': 'https://www.youtube.com/embed/e3O39izEaKU?autoplay=0&mute=1',
    '신세계백화점 광주신세계점': 'https://www.youtube.com/embed/6CWHcjX4zO8?autoplay=0&mute=1',
    '롯데백화점 광주점': 'https://www.youtube.com/embed/-TcZKport80?autoplay=0&mute=1',
    '광주세정아울렛': 'https://www.youtube.com/embed/p-a_OoE9ijw?autoplay=0&mute=1',
    '광주 양동시장': 'https://www.youtube.com/embed/Mx_PE3XfJh8?autoplay=0&mute=1',
    'NC백화점 광주역점': 'https://www.youtube.com/embed/DDn4sNyGD0g?autoplay=0&mute=1',
    '상무화훼단지': 'https://www.youtube.com/embed/zIU0gpuNS_c?autoplay=0&mute=1',
    '서부농수산물도매시장': 'https://www.youtube.com/embed/B77tWLV7RGM?autoplay=0&mute=1',
    '광주각화농산물도매시장': 'https://www.youtube.com/embed/6Kh1gaGgZoM?autoplay=0&mute=1',
    '시리단길': 'https://www.youtube.com/embed/9PavQtFgt_k?autoplay=0&mute=1',
    '비아5일시장': 'https://www.youtube.com/embed/0JguPT5qPpY?autoplay=0&mute=1',
    '남광주시장': 'https://www.youtube.com/embed/AEVPkQ1OHro?autoplay=0&mute=1',
    '롯데아울렛 광주월드컵점': 'https://www.youtube.com/embed/?autoplay=0&mute=1',
    'NC웨이브 충장점': 'https://www.youtube.com/embed/h1_JRwmCMtc?autoplay=0&mute=1',
    '월곡시장': 'https://www.youtube.com/embed/wFvU1WKnuhA?autoplay=0&mute=1',
    '운암시장': 'https://www.youtube.com/embed/lFFUdBZSKoo?autoplay=0&mute=1',
    '예술의거리 개미장터': 'https://www.youtube.com/embed/HOtVdmelXUU?autoplay=0&mute=1',
    '롯데아울렛 광주수완점': 'https://www.youtube.com/embed/D3aqTvkpAlo?autoplay=0&mute=1',
    '무안요': 'https://www.youtube.com/embed/pAVFymyhw68?autoplay=0&mute=1',
    '인당국악사': 'https://www.youtube.com/embed/WQqxPzB_WAo?autoplay=0&mute=1',

    // 역사 테마 (ID: 2)
    '5.18기념공원': 'https://www.youtube.com/embed/4ZpH8t6GpCM?autoplay=0&mute=1',
    '양림동 역사문화마을': 'https://www.youtube.com/embed/6ENgJS3wLso?autoplay=0&mute=1',
    '광주향교': 'https://www.youtube.com/embed/gxpc0tb6nOo?autoplay=0&mute=1',
    '광주문화재단 전통문화관': 'https://www.youtube.com/embed/zT-_gwPejT0?autoplay=0&mute=1',
    '광주역사민속박물관': 'https://www.youtube.com/embed/pk5ulC3WjII?autoplay=0&mute=1',
    '5.18 민주화운동기록관': 'https://www.youtube.com/embed/0yCN0rABehg?autoplay=0&mute=1',
    '무각사': 'https://www.youtube.com/embed/cUTj7Ul-Ptw?autoplay=0&mute=1',
    '오방 최흥종 기념관': 'https://www.youtube.com/embed/dR7pPPIGTBE?autoplay=0&mute=1',
    '월봉서원': 'https://www.youtube.com/embed/Vs4VtQ8bUro?autoplay=0&mute=1',
    '국립5.18민주묘지': 'https://www.youtube.com/embed/YyL6ZLGs4X4?autoplay=0&mute=1',
    '증심사': 'https://www.youtube.com/embed/Z4uyFbmi_lE?autoplay=0&mute=1',
    '월곡고려인문화관 결': 'https://www.youtube.com/embed/ygGSIe7zV5U?autoplay=0&mute=1',
    '5.18민주광장': 'https://www.youtube.com/embed/bs6dP1aH1fo?autoplay=0&mute=1',
    '양림동 선교사 묘지': 'https://www.youtube.com/embed/e8v4lrXc1e0?autoplay=0&mute=1',
    '국립광주박물관': 'https://www.youtube.com/embed/d1Eywl0Q62c?autoplay=0&mute=1',
    '오웬기념각': 'https://www.youtube.com/embed/2KOHd1J69Cw?autoplay=0&mute=1',
    '유애서원': 'https://www.youtube.com/embed/zSI9ro0gVQw?autoplay=0&mute=1',
    '월계동 장고분': 'https://www.youtube.com/embed/4TXgqEMBfp8?autoplay=0&mute=1',
    '양송천 묘역': 'https://www.youtube.com/embed/1AAVFCf3iD8?autoplay=0&mute=1',
    '전남대학교 박물관': 'https://www.youtube.com/embed/Tc1bdjxm6Vw?autoplay=0&mute=1',

    // 문화 테마 (ID: 3)
    '광주 디자인 비엔날레': 'https://www.youtube.com/embed/DIv6owT001I?autoplay=0&mute=1',
    '광주 예술의전당': 'https://www.youtube.com/embed/pNgNWPxfrOE?autoplay=0&mute=1',
    '광주시립미술관': 'https://www.youtube.com/embed/uKhtISud3eQ?autoplay=0&mute=1',
    '광주 예술의거리': 'https://www.youtube.com/embed/cULx_ze_frc?autoplay=0&mute=1',
    '국립아시아문화전당': 'https://www.youtube.com/embed/qAs7gbdnF0g?autoplay=0&mute=1',
    '펭귄마을': 'https://www.youtube.com/embed/VOp_i7tpx34?autoplay=0&mute=1',
    '남도향토음식박물관': 'https://www.youtube.com/embed/unesV0H-A5s?autoplay=0&mute=1',
    '광주학생독립운동기념회관': 'https://www.youtube.com/embed/2LR_070mvus?autoplay=0&mute=1',
    '이이남스튜디오': 'https://www.youtube.com/embed/5tQNr2UarTQ?autoplay=0&mute=1',
    '광주극장': 'https://www.youtube.com/embed/ZcEbvQJYt04?autoplay=0&mute=1',
    'KPOP 스타의 거리': 'https://www.youtube.com/embed/uP4mt2ghYo8?autoplay=0&mute=1',
    '국립광주과학관': 'https://www.youtube.com/embed/uytMi5JpWyY?autoplay=0&mute=1',
    '의재미술관': 'https://www.youtube.com/embed/iJTBSJZyXQY?autoplay=0&mute=1',
    '기분좋은극장': 'https://www.youtube.com/embed/1dYcmfKvtxo?autoplay=0&mute=1',
    '김대중컨벤션센터': 'https://www.youtube.com/embed/a-Uqddt0Ia8?autoplay=0&mute=1',
    '무등갤러리': 'https://www.youtube.com/embed/8r3gEeBw9Gw?autoplay=0&mute=1',
    '광주광역시미디어아트플랫폼 GMAP': 'https://www.youtube.com/embed/BHERrODCWJs?autoplay=0&mute=1',
    '동곡미술관': 'https://www.youtube.com/embed/C8EPDhF_4mc?autoplay=0&mute=1',
    '비움박물관': 'https://www.youtube.com/embed/DMHngLPJXHI?autoplay=0&mute=1',
    '소촌아트팩토리': 'https://www.youtube.com/embed/ZI5DGAgFjYE?autoplay=0&mute=1',

    // 음식 테마 (ID: 4)
    '송정 떡갈비거리': 'https://www.youtube.com/embed/CxzJYxHLalM?autoplay=0&mute=1',
    '1913 송정역시장': 'https://www.youtube.com/embed/JzUvGUppXII?autoplay=0&mute=1',
    '동명동 카페골목': 'https://www.youtube.com/embed/e62vxZ7hRqM?autoplay=0&mute=1',
    '대인시장': 'https://www.youtube.com/embed/lXyn3S--57c?autoplay=0&mute=1',
    '시청 먹자골목': 'https://www.youtube.com/embed/Tl4j6Q8hxQY?autoplay=0&mute=1',
    '말바우시장': 'https://www.youtube.com/embed/sQ2fZMJTlp8?autoplay=0&mute=1',
    '광주 오리요리거리': 'https://www.youtube.com/embed/DU91rky3xDs?autoplay=0&mute=1',
    '광주공원 포차거리': 'https://www.youtube.com/embed/XEIgY4sVNIc?autoplay=0&mute=1',
    '서플라이': 'https://www.youtube.com/embed/S8azCDYBDs0?autoplay=0&mute=1',
    '송원식육식당': 'https://www.youtube.com/embed/5ZIB5a_RZxw?autoplay=0&mute=1',
    '칠봉이짬뽕': 'https://www.youtube.com/embed/OMyFb1bdl18?autoplay=0&mute=1',
    '장가계': 'https://www.youtube.com/embed/?autoplay=0&mute=1',
    '미미원': 'https://www.youtube.com/embed/h8Gh2hgeJPk?autoplay=0&mute=1',
    '상무초밥 상무본점': 'https://www.youtube.com/embed/C_lGnXJyv4U?autoplay=0&mute=1',
    '청수민물장어': 'https://www.youtube.com/embed/F5WyVIbMMa8?autoplay=0&mute=1',
    '농성화로본점': 'https://www.youtube.com/embed/dbiDFjc-DVo?autoplay=0&mute=1',
    '그런느낌': 'https://www.youtube.com/embed/DaoQO7AN9gg?autoplay=0&mute=1',
    '보향미': 'https://www.youtube.com/embed/Bo7HJwWXDT0?autoplay=0&mute=1',
    '하남꽃게장백반': 'https://www.youtube.com/embed/XhDkM1D2h0w?autoplay=0&mute=1',
    '갤러리24': 'https://www.youtube.com/embed/7ZZK3PtzgTA?autoplay=0&mute=1',

    // 자연 테마 (ID: 5)
    '무등산': 'https://www.youtube.com/embed/wEwvgDR_5sA?autoplay=0&mute=1',
    '광주천': 'https://www.youtube.com/embed/VNwNsbvFGF8?autoplay=0&mute=1',
    '중외공원': 'https://www.youtube.com/embed/OhMVIJSgq1Q?autoplay=0&mute=1',
    '광주광역시 우치공원': 'https://www.youtube.com/embed/WndLKh5YFDg?autoplay=0&mute=1',
    '광주호 호수생태원': 'https://www.youtube.com/embed/whY-HbzRHv8?autoplay=0&mute=1',
    '광주사직공원 전망타워': 'https://www.youtube.com/embed/wUplVVDBbA8?autoplay=0&mute=1',
    '전평제근린공원': 'https://www.youtube.com/embed/8liwT5qBS6Q?autoplay=0&mute=1',
    '운천저수지': 'https://www.youtube.com/embed/TaCMvSUlh8o?autoplay=0&mute=1',
    '쌍암공원': 'https://www.youtube.com/embed/LRkzXfWptEY?autoplay=0&mute=1',
    '조선대학교 장미원': 'https://www.youtube.com/embed/ofuJff6_aRQ?autoplay=0&mute=1',
    '광주시립수목원': 'https://www.youtube.com/embed/vKKne0AKVUs?autoplay=0&mute=1',
    '지산유원지': 'https://www.youtube.com/embed/aGkqBvScs-0?autoplay=0&mute=1',
    '광주시민의숲': 'https://www.youtube.com/embed/HjNG8BdOEWM?autoplay=0&mute=1',
    '빛고을농촌테마공원': 'https://www.youtube.com/embed/6CWRNYPpyug?autoplay=0&mute=1',
    '풍암호수': 'https://www.youtube.com/embed/IuL5pjkNPN8?autoplay=0&mute=1',
    '환벽당': 'https://www.youtube.com/embed/PvboBy6uOmE?autoplay=0&mute=1',
    '상무시민공원': 'https://www.youtube.com/embed/aqUaFutv_PI?autoplay=0&mute=1',
    '광주공원': 'https://www.youtube.com/embed/Ugps0a21trk?autoplay=0&mute=1',
    '서석대': 'https://www.youtube.com/embed/xx297McvPEQ?autoplay=0&mute=1',
    '무등산국립공원': 'https://www.youtube.com/embed/XeDvDq0ysWM?autoplay=0&mute=1',

    // 체험 테마 (ID: 6)
    '광주기아챔피언스필드': 'https://www.youtube.com/embed/-_fgyZaHPrY?autoplay=0&mute=1',
    '헬로애니멀광주점': 'https://www.youtube.com/embed/AKrAMm49tKw?autoplay=0&mute=1',
    '광주월드컵경기장': 'https://www.youtube.com/embed/TeA1XdR4Tvc?autoplay=0&mute=1',
    '광주국제양궁장': 'https://www.youtube.com/embed/mipYTICqPNQ?autoplay=0&mute=1',
    '아쿠아시티광주': 'https://www.youtube.com/embed/lAQ2zifO4_k?autoplay=0&mute=1',
    '광주김치타운': 'https://www.youtube.com/embed/B3Z90oKiMZg?autoplay=0&mute=1',
    '광주실내빙상장': 'https://www.youtube.com/embed/zAEYylKxw6A?autoplay=0&mute=1',
    '평촌도예공방': 'https://www.youtube.com/embed/WulkEiseGrI?autoplay=0&mute=1',
    '무등산수박마을': 'https://www.youtube.com/embed/GMISWOGqtfQ?autoplay=0&mute=1',
    '법무부 광주솔로몬로파크': 'https://www.youtube.com/embed/qxq_ps1tSQM?autoplay=0&mute=1',
    '여행자의 집': 'https://www.youtube.com/embed/wx6pcc8SFzs?autoplay=0&mute=1',
    '마한유적체험관': 'https://www.youtube.com/embed/oW5_JbaYXeY?autoplay=0&mute=1',
    '송산목장': 'https://www.youtube.com/embed/9J4TJ2TTQUY?autoplay=0&mute=1',
    '빛고을공예창작촌': 'https://www.youtube.com/embed/4FUI1nFKPf8?autoplay=0&mute=1',
    '충장로': 'https://www.youtube.com/embed/r1crce0To08?autoplay=0&mute=1',
    '청춘발산마을': 'https://www.youtube.com/embed/yPs7QykjdmE?autoplay=0&mute=1',
    '꿈브루어리': 'https://www.youtube.com/embed/Qt3Q8X_mi5I?autoplay=0&mute=1',
    '광주패밀리랜드': 'https://www.youtube.com/embed/DDn4sNyGD0g?autoplay=0&mute=1',
    '테라피 스파 소베': 'https://www.youtube.com/embed/LXsveN4-SCE?autoplay=0&mute=1',
    '관덕정의 각궁': 'https://www.youtube.com/embed/2wZPiu-yxB0?autoplay=0&mute=1',

    // 숙박 테마 (ID: 7)
    '광주 아우라 비즈니스 호텔': 'https://www.youtube.com/embed/?autoplay=0&mute=1',
    '탑클라우드호텔 광주점': 'https://www.youtube.com/embed/?autoplay=0&mute=1',
    '한성 마드리드 광주호텔': 'https://www.youtube.com/embed/?autoplay=0&mute=1',
    '무등파크호텔': 'https://www.youtube.com/embed/?autoplay=0&mute=1',
    '노블 스테이': 'https://www.youtube.com/embed/?autoplay=0&mute=1',
    '여로': 'https://www.youtube.com/embed/?autoplay=0&mute=1',
    '홀리데이 인 광주 호텔': 'https://www.youtube.com/embed/O3-6m-4e1ZY?autoplay=0&mute=1',
    '마스터스관광호텔': 'https://www.youtube.com/embed/?autoplay=0&mute=1',
    '아리네 게스트하우스': 'https://www.youtube.com/embed/?autoplay=0&mute=1',
    '라마다프라자 광주호텔': 'https://www.youtube.com/embed/MHwR4zbgfJw?autoplay=0&mute=1',
    '센트럴관광호텔': 'https://www.youtube.com/embed/?autoplay=0&mute=1',
    '두바이호텔': 'https://www.youtube.com/embed/?autoplay=0&mute=1',
    '다솜채': 'https://www.youtube.com/embed/OBQnCpn-EGo?autoplay=0&mute=1',
    '호텔더스팟': 'https://www.youtube.com/embed/ePTuOzZHR1Q?autoplay=0&mute=1',
    '호텔 5월': 'https://www.youtube.com/embed/?autoplay=0&mute=1',
    '금수장관광호텔': 'https://www.youtube.com/embed/?autoplay=0&mute=1',
    '유탑부지크호텔앤레지던스': 'https://www.youtube.com/embed/LcevCcbYwg0?autoplay=0&mute=1',
    '이끌림 비지니스호텔 하남': 'https://www.youtube.com/embed/?autoplay=0&mute=1',
    '라마다플라자 충장호텔': 'https://www.youtube.com/embed/YO3cP_LGxkc?autoplay=0&mute=1',
    '볼튼호텔': 'https://www.youtube.com/embed/qJrjxHxO_Vo?autoplay=0&mute=1',

    // 근교 테마 (ID: 8)
    '죽녹원': 'https://www.youtube.com/embed/AWwTS6SOxI4?autoplay=0&mute=1',
    '메타세쿼이아 가로수길': 'https://www.youtube.com/embed/kx3zWy-C9a4?autoplay=0&mute=1',
    '송강정': 'https://www.youtube.com/embed/51MjvlLaDHQ?autoplay=0&mute=1',
    '쌍교숯불갈비 담양 본점': 'https://www.youtube.com/embed/S1Usok7lZVI?autoplay=0&mute=1',
    '중흥골드스파&리조트': 'https://www.youtube.com/embed/VjxQ97VKbXk?autoplay=0&mute=1',
    '국립나주박물관': 'https://www.youtube.com/embed/p7kd9DF9HVI?autoplay=0&mute=1',
    '나주곰탕노안집': 'https://www.youtube.com/embed/XkDU620Mp8g?autoplay=0&mute=1',
    '빛가람 호수공원': 'https://www.youtube.com/embed/5fzwZ5cPEGI?autoplay=0&mute=1',
    '도곡온천단지': 'https://www.youtube.com/embed/xlE-F0f0D9Y?autoplay=0&mute=1',
    '화순 고인돌군 유적': 'https://www.youtube.com/embed/632xrkCAgNQ?autoplay=0&mute=1',
    '운주사': 'https://www.youtube.com/embed/B5ZkawVAuno?autoplay=0&mute=1',
    '만연폭포': 'https://www.youtube.com/embed/dgEFj1TmiA4?autoplay=0&mute=1',
    '황룡강 생태공원': 'https://www.youtube.com/embed/vfDpPhnzIvk?autoplay=0&mute=1',
    '백양사': 'https://www.youtube.com/embed/yYSs9olwlrg?autoplay=0&mute=1',
    '장성호수변공원': 'https://www.youtube.com/embed/7pVVTL0q_80?autoplay=0&mute=1',
    '오피먼트': 'https://www.youtube.com/embed/1qv8s8A8ADE?autoplay=0&mute=1',
    '함평엑스포공원': 'https://www.youtube.com/embed/FmHCIXjAkRI?autoplay=0&mute=1',
    '돌머리해수욕장': 'https://www.youtube.com/embed/xAtMVoansP0?autoplay=0&mute=1',
    '용천사': 'https://www.youtube.com/embed/lKDoLYQB5cI?autoplay=0&mute=1',
    '화랑식당': 'https://www.youtube.com/embed/cCt3F5kF0XI?autoplay=0&mute=1',
    '호남대학교': 'https://www.youtube.com/embed/-PFAMvziOL4?autoplay=0&mute=1'
  };
  
  return videoData[spotName] || null;
};

// 관광지별 이미지 데이터
const getSpotImageData = (spotName) => {
  // 관광지명과 이미지 파일명 매핑 (기본 이미지용)
  const imageMapping = {
    // 쇼핑 테마
    '충금지하상가': 'ChunggeumUndergroundShoppingCenter.jpg',
    '신세계백화점 광주신세계점': 'shinsegae_gwangju.jpg',
    '롯데백화점 광주점': 'lotte_gwangju.jpg',
    '광주세정아울렛': 'gwangju_sejung_outlet.jpg',
    '광주 양동시장': 'gwangju_yangdong_market.jpg',
    'NC백화점 광주역점': 'NCwave_gwangju.jpg',
    '상무화훼단지': 'sangmu_flower_complex.jpg',
    '서부농수산물도매시장': 'seobu_market.jpg',
    '광주각화농산물도매시장': 'gwangju_gakhwa_agricultural_wholesale_market.jpg',
    '시리단길': 'siridan_gil.jpg',
    '비아5일시장': 'bia_5day_market.jpg',
    '남광주시장': 'namgwangju_market.jpg',
    '롯데아울렛 광주월드컵점': 'lotte_outlet_gwangju_world_cup.jpg',
    'NC웨이브 충장점': 'nc_wave_chungjang_branch.jpg',
    '월곡시장': 'wolgok_market.jpg',
    '운암시장': 'unam_market.jpg',
    '예술의거리 개미장터': 'art_street_ant_market.jpg',
    '롯데아울렛 광주수완점': 'lotte_outlet_gwangju_suwan.jpg',
    '무안요': 'muan_yo.jpg',
    '인당국악사': 'indang_korean_music_hall.jpg',
    
    // 역사 테마
    '5.18기념공원': '5.18_memorial_park.jpg',
    '양림동 역사문화마을': 'yanglim_culture_village.jpg',
    '광주향교': 'gwangju_hyanggyo.jpg',
    '광주문화재단 전통문화관': 'gwangju_traditional_culture_center.jpg',
    '광주역사민속박물관': 'gwangju_history_folk_museum.jpg',
    '5.18 민주화운동기록관': 'democracy_memorial.jpg',
    '무각사': 'mugaksa_temple.jpg',
    '오방 최흥종 기념관': 'obangmuseum.jpg',
    '월봉서원': 'olbong_seowon.jpg',
    '국립5.18민주묘지': 'national_may_18_democratic_cemetery.jpg',
    '증심사': 'jeungsimsa_temple.jpg',
    '월곡고려인문화관 결': 'wolgok_koryoin_cultural_center_gyeol.jpg',
    '5.18민주광장': 'may_18_democracy_plaza.jpg',
    '양림동 선교사 묘지': 'yangnimdong_missionary_cemetery.jpg',
    '국립광주박물관': 'guknip_gwangju_museum.jpg',
    '오웬기념각': 'owen_memorial.jpg',
    '유애서원': 'yuae_seowon.jpg',
    '월계동 장고분': 'wolgye_dong_janggo_bun.jpg',
    '양송천 묘역': 'yangsongcheon_myoyeok.jpg',
    '전남대학교 박물관': 'chonnam_university_museum.jpg',
    
    // 문화 테마
    '광주 디자인 비엔날레': 'biennale.jpg',
    '광주 예술의전당': 'gwangju_arts_center.jpg',
    '광주시립미술관': 'gwangju_museum_of_art.jpg',
    '광주 예술의거리': 'gwangju_art_street.jpg',
    '국립아시아문화전당': 'asia_culture_center.jpg',
    '펭귄마을': 'penguin_town.jpg',
    '남도향토음식박물관': 'namdo_food_museum.jpg',
    '광주학생독립운동기념회관': 'gwangju_studenti_ndependence_movement_memorial_hall.jpg',
    '이이남스튜디오': 'iinam_studio.jpg',
    '광주극장': 'gwangju_theater.jpg',
    'KPOP 스타의 거리': 'kpop_star_street.jpg',
    '국립광주과학관': 'national_gwangju_science_museum.jpg',
    '의재미술관': 'uijae_art_museum.jpg',
    '기분좋은극장': 'good_mood_theater.jpg',
    '김대중컨벤션센터': 'kim_dae_jung_convention_center.jpg',
    '무등갤러리': 'mudeung_gallery.jpg',
    '광주광역시미디어아트플랫폼 GMAP': 'gwangju_media_art_platform_gmap.jpg',
    '동곡미술관': 'donggok_art_museum.jpg',
    '비움박물관': 'bium_museum.jpg',
    '소촌아트팩토리': 'sochon_art_factory.jpg',
    
    // 음식 테마
    '송정 떡갈비거리': 'songjeong_ddeokgalbi_street.jpg',
    '1913 송정역시장': '1913_songjeong_station_market.jpg',
    '동명동 카페골목': 'dongmyeong_cafe_alley.jpg',
    '대인시장': 'daein_market.jpg',
    '시청 먹자골목': 'cityhall_food_street.jpg',
    '말바우시장': 'malbawoo_market.jpg',
    '광주 오리요리거리': 'gwangju_duck_street.jpg',
    '광주공원 포차거리': 'gwangju_park_pocha_street.jpg',
    '서플라이': 'supply.jpg',
    '송원식육식당': 'songwon_sikyuksikdang.jpg',
    '칠봉이짬뽕': 'chilbong_jjamppong.jpg',
    '장가계': 'jangga_gye.jpg',
    '미미원': 'mimiwon.jpg',
    '상무초밥 상무본점': 'sangmu_chobap.jpg',
    '청수민물장어': 'cheongsu_freshwater_eel.jpg',
    '농성화로본점': 'nongseong_hwaro.jpg',
    '그런느낌': 'geureon_neukkkeum.jpg',
    '보향미': 'bohyangmi.jpg',
    '하남꽃게장백반': 'hanam_kkotgejang_baekban.jpg',
    '갤러리24': 'gallery24.jpg',
    
    // 자연 테마
    '무등산': 'mudeungsan.jpg',
    '광주천': 'gwangjuriver.jpg',
    '중외공원': 'jungoe_park.jpg',
    '광주광역시 우치공원': 'woochi_park.jpg',
    '광주호 호수생태원': 'Gwangjuho_Lake_Eco_Park.jpg',
    '광주사직공원 전망타워': 'sajick_park.jpg',
    '전평제근린공원': 'jeonpyeongje_neighborhood_park.jpg',
    '운천저수지': 'uncheon_reservoir.jpg',
    '쌍암공원': 'ssangam_park.jpg',
    '조선대학교 장미원': 'chosun_rose_garden.jpg',
    '광주시립수목원': 'gwangju_arboretum.jpg',
    '지산유원지': 'jisan_resort.jpg',
    '광주시민의숲': 'citizen_forest.jpg',
    '빛고을농촌테마공원': 'rural_theme_park.jpg',
    '풍암호수': 'pungam_lake.jpg',
    '환벽당': 'hwanbyeokdang.jpg',
    '상무시민공원': 'sangmu_citizen_park.jpg',
    '광주공원': 'gwangju_park.jpg',
    '서석대': 'seoseokdae.jpg',
    '무등산국립공원': 'mudeung_mountain_national_park.jpg',
    
    // 체험 테마
    '광주기아챔피언스필드': 'kia_champions_field.jpg',
    '헬로애니멀광주점': 'hello_animal.jpg',
    '광주월드컵경기장': 'worldcup_stadium.jpg',
    '광주국제양궁장': 'archery_field.jpg',
    '아쿠아시티광주': 'aqua_city.jpg',
    '광주김치타운': 'kimchi_town.jpg',
    '광주실내빙상장': 'gwangju_indoor_ice_rink.jpg',
    '평촌도예공방': 'pyeongchon_pottery_studio.jpg',
    '무등산수박마을': 'mudeung_watermelon_village.jpg',
    '법무부 광주솔로몬로파크': 'solomon_park.jpg',
    '여행자의 집': 'traveler_house.jpg',
    '마한유적체험관': 'mahan_experience_museum.jpg',
    '송산목장': 'songsan_farm.jpg',
    '빛고을공예창작촌': 'craft_village.jpg',
    '충장로': 'chungjang_ro.jpg',
    '청춘발산마을': 'youth_village.jpg',
    '꿈브루어리': 'dream_brewery.jpg',
    '광주패밀리랜드': 'gwangju_family_land.jpg',
    '테라피 스파 소베': 'therapy_spa_sobe.jpg',
    '관덕정의 각궁': 'gwandukjeong_archery.jpg',

    // 숙박 테마
    '광주 아우라 비즈니스 호텔': 'aura_business_hotel.jpg',
    '탑클라우드호텔 광주점': 'topcloud_hotel.jpg',
    '한성 마드리드 광주호텔': 'madrid_hotel.jpg',
    '무등파크호텔': 'mudeung_park_hotel.jpg',
    '노블 스테이': 'noble_stay.jpg',
    '여로': 'yeoro_guesthouse.jpg',
    '홀리데이 인 광주 호텔': 'holiday_inn.jpg',
    '마스터스관광호텔': 'masters_hotel.jpg',
    '아리네 게스트하우스': 'arine_guesthouse.jpg',
    '라마다프라자 광주호텔': 'ramada_plaza.jpg',
    '센트럴관광호텔': 'central_hotel.jpg',
    '두바이호텔': 'dubai_hotel.jpg',
    '다솜채': 'dasomchae.jpg',
    '호텔더스팟': 'hotel_the_spot.jpg',
    '호텔 5월': 'hotel_may.jpg',
    '금수장관광호텔': 'geumsujang_hotel.jpg',
    '유탑부티크호텔앤레지던스': 'utop_boutique_hotel_residence.jpg',
    '이끌림 비지니스호텔 하남': 'ikkullim_business_hotel_hanam.jpg',
    '라마다플라자 충장호텔': 'ramada_plaza_chungjang_hotel.jpg',
    '볼튼호텔': 'bolton_hotel.jpg',
    
    // 근교 테마
    '죽녹원': 'juknokwon_bamboo_garden.jpg',
    '메타세쿼이아 가로수길': 'metasequoia_avenue.jpg',
    '송강정': 'songgangjeong_pavilion.jpg',
    '쌍교숯불갈비 담양 본점': 'ssanggyo_charcoal_galbi_damyang.jpg',
    '중흥골드스파&리조트': 'joongheung_gold_spa_resort.jpg',
    '국립나주박물관': 'national_naju_museum.jpg',
    '나주곰탕노안집': 'naju_gomtang_noan_jip.jpg',
    '빛가람 호수공원': 'bitgaram_lake_park.jpg',
    '도곡온천단지': 'dogok_onsen_complex.jpg',
    '화순 고인돌군 유적': 'hwasun_dolmen_site.jpg',
    '운주사': 'unjusa_temple.jpg',
    '만연폭포': 'manyeon_waterfall.jpg',
    '황룡강 생태공원': 'hwangryong_river_eco_park.jpg',
    '백양사': 'baegyangsa_temple.jpg',
    '장성호수변공원': 'jangseong_lakeside_park.jpg',
    '오피먼트': 'opiument_complex.jpg',
    '함평엑스포공원': 'hampyeong_expo_park.jpg',
    '돌머리해수욕장': 'dolmeori_beach.jpg',
    '용천사': 'yongcheonsa_temple.jpg',
    '화랑식당': 'hwarang_restaurant.jpg',
    '호남대학교': 'honamuniv.jpg'
  };

  // 추가 이미지 데이터 (새로운 ID 구조에 맞춰 정리)
  const additionalImages = {
    '충금지하상가': [
      'https://images.weserv.nl/?url=https://postfiles.pstatic.net/MjAyMjExMjVfMTk0/MDAxNjY5MzYwMjU0NTI5.CawCZbAhRWAvypQLIyn3_IPPafcRQrcFF9riwn1rXhEg.a_ZeB236GxG-ANpfTE91WWaSpnIlN_pOZQf3SpETKqgg.JPEG.gwangjuker/A7M08910_1.jpg?type=w3840',
      'https://images.weserv.nl/?url=https://postfiles.pstatic.net/MjAyNTAyMjJfMjc0/MDAxNzQwMjA3NTg3NTQ3.EMFXgx75c5ctDNnNH-GeMxTpwD6rWY-RFNz5FJEZvLQg.dlIuuX_FF0mbiFZy8sZnx6o827MWg19QQa-s04RfN08g.JPEG/900%EF%BC%BF20250222%EF%BC%BF125422.jpg?type=w966'
    ],
    // 다른 관광지들도 기본 이미지만 표시 (추가 이미지는 나중에 추가 가능)
    '신세계백화점 광주신세계점': [
      'https://cphoto.asiae.co.kr/listimglink/1/2018082709361550396_1535330174.jpg',
      'https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https:%2F%2Fblog.kakaocdn.net%2Fdn%2FOw0n2%2FbtrXIQF3cq0%2FStA5e6UZZOoTkYZtkSfcWk%2Fimg.jpg'
    ],
    '롯데백화점 광주점': [
      'https://tong.visitkorea.or.kr/cms/resource/38/2008238_image2_1.jpg',
      'https://tong.visitkorea.or.kr/cms/resource/40/2008240_image2_1.jpg'
    ],
    '광주세정아울렛': [
      'https://mblogthumb-phinf.pstatic.net/MjAyMjAzMTZfMjcy/MDAxNjQ3MzkyOTg1NTA3.dyv-DB5e_mr_PcVAvVz7__nHPK2t2rFvWTVa_KP8HWAg.MLZx3X5i88SfIr72D4vYm6EJhbil5QmcrYbowKGa6tAg.JPEG.pjy250/SE-aa9c7bc1-a4c4-11ec-85b0-8901e90ca63b.jpg?type=w800',
      'https://tse1.mm.bing.net/th/id/OIP.0UZMSSt8DE8MpopAQT2KNgHaFj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3'
    ],
    '광주 양동시장': [
      'https://cdn.namdonews.com/news/photo/202303/719486_381092_3549.jpg',
      'https://th.bing.com/th/id/R.c6fd4a54ecebb6fd48d682c294a022f5?rik=N05qBiRmuCJRBQ&riu=http%3a%2f%2fdh.aks.ac.kr%2f%7egwangju%2fwiki%2fimages%2f1%2f1b%2f%ec%96%91%eb%8f%99%ec%8b%9c%ec%9e%a51.jpg&ehk=B3Tka8OXJdKzuYyT2D6%2fVxcmXNMK9od%2feU%2fWIciSykw%3d&risl=&pid=ImgRaw&r=0'
    ],
    'NC백화점 광주역점': [
      'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20140312_212%2Fmnb3472_1394588466488KrYBO_JPEG%2FIMG_0992.JPG&type=sc960_832',
      'https://tse1.mm.bing.net/th/id/OIP.XIoT6lUYeiyL1DTLKoordwAAAA?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3'
    ],
    '상무화훼단지': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=a45d2d86-3246-4595-8751-b5b762dc01e5',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=42aaa4bd-f74d-4e57-ba6a-25709162b6dd'
    ],
    '서부농수산물도매시장': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=b412606a-26e4-4269-a231-b0fc96bd0a7c',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=c7cca1d2-3e6d-4991-85a5-42eb4667598b'
    ],
    '광주각화농산물도매시장': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=0e28fed5-ef41-4246-865b-05056d77264f',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=409a71d2-f26f-4bce-8f14-e99c5176d679'
    ],
    '시리단길': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=5c810d07-911f-4564-9220-c20c7346bedf',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=395ee411-e06f-473d-a49b-c9c9b992120e'
    ],
    '비아5일시장': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=a7d20449-594f-4bf2-ae53-9a003f6652af',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=de4528a6-c00d-4920-ae64-d4fa86ec1ac9'
    ],
    '남광주시장': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=b36befc1-8f7a-43e7-842e-d4b1d016678c',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=85602d16-588c-4b6f-9aa1-b29ef5470a6a'
    ],
    '롯데아울렛 광주월드컵점': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=ee0e750d-c6e5-458e-8723-00b960b1d99d',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=e2780c72-2cf2-4c7f-9382-434e978e54e3'
    ],
    'NC웨이브 충장점': [
      'https://date.shopma.net/images/guinphoto/202505/20250523112003riverio.jpg',
      'https://date.shopma.net/images/cosajin/202304/20230405143254badman1629.jpg'
    ],
    '월곡시장': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=34b6b699-9c08-4217-b88a-6bf2c96f1424',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=fa49169b-a056-4bd9-a893-fcf86fed5af7'
    ],
    '운암시장': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=5dd58346-282a-4cb3-b94e-9477dbd431ed',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=d7838aa9-3f6d-46ed-ad6e-4de1c87ac91c'
    ],
    '예술의거리 개미장터': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=dff7183a-da2b-4269-bc75-00c9aa959a60',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=6291bef0-b25c-45d9-8a6f-4f7a2927c5c1'
    ],
    '롯데아울렛 광주수완점': [
      'https://date.shopma.net/images/cosajin/202209/20220901131142wlstkarnt.jpg',
      'https://img8.yna.co.kr/etc/inner/KR/2019/10/16/AKR20191016080300054_01_i_P4.jpg'
    ],
    '무안요': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=910764bd-6380-44a4-9e73-d78d61d25e32',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=b60c704a-9d79-4c8f-8c7c-91976e6f07a9'
    ],
    '인당국악사': [
      'https://news.gwangju.go.kr//upload/gallery/0001/thumb_1644920424779.JPG',
      'https://news.gwangju.go.kr//upload/gallery/0001/thumb_1644920424112.JPG'
    ],
    '5.18기념공원': [
      'https://cdn.socialfocus.co.kr/news/photo/202102/9505_15589_78.jpg',
      'https://inmun360.culture.go.kr/upload/board/image/80/2365680_201907242202222050.jpg'
    ],
    '양림동 역사문화마을': [
      'https://ojsfile.ohmynews.com/STD_IMG_FILE/2025/0326/IE003433639_STD.jpg',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/a4/5d/9e/street3.jpg?w=1400&h=800&s=1'
    ],
    '광주향교': [
      'https://museumnews.kr/wp-content/uploads/2018/06/%EA%B4%91%EC%A3%BC%ED%96%A5%EA%B5%90-%EC%A0%84%EA%B2%BD.jpg',
      'https://th.bing.com/th/id/R.12183cc42808a02e181fbe07f799340a?rik=reYzWWnJLbLW7Q&riu=http%3a%2f%2fphotos.wikimapia.org%2fp%2f00%2f04%2f58%2f40%2f67_full.jpg&ehk=zs7o%2fr5VrA6IlF8mPDpLClKsuaMvICIx80uOl0YoKP8%3d&risl=&pid=ImgRaw&r=0'
    ],
    '광주문화재단 전통문화관': [
      'https://nimage.newsway.co.kr/photo/2018/11/08/20181108000189_0700.jpg',
      'https://th.bing.com/th/id/R.40ef2741549b62fa30a51e35a3fb2e6b?rik=z%2bGU5wQ0TCuJzw&riu=http%3a%2f%2ftong.visitkorea.or.kr%2fcms%2fresource%2f47%2f2733547_image2_1.jpg&ehk=yiJqokMMoAaYmGEFLoe78jnSIRydF%2bxEdFDIlnbLH3E%3d&risl=&pid=ImgRaw&r=0'
    ],
    '광주역사민속박물관': [
      'https://live.staticflickr.com/65535/52444263662_266cdf7f31_b.jpg',
      'https://mblogthumb-phinf.pstatic.net/MjAyMjEwMjVfMTUz/MDAxNjY2NjcxMDU0OTc4.DK6O_mhXIaK9iVOoxpyO_iB2VI-pjWt6rq73Bhwm0Lsg.ELc98yKD0q4B97OgH9uhhlL6egSSTMC1InvsPaRywi0g.JPEG.photo4782/_ABH7358.JPG?type=w800'
    ],
    '5.18 민주화운동기록관': [
      'https://thumb.zumst.com/1024x0/https://static.news.zumst.com/images/14/2025/04/30/6cecc5d6608f4c6f98670813045ba821.jpg',
      'https://th.bing.com/th/id/R.863ab6be0e5fd89a766964cfb1553ded?rik=BYRodQ1Bj3RvdA&riu=http%3a%2f%2ftong.visitkorea.or.kr%2fcms%2fresource%2f71%2f2755271_image2_1.JPG&ehk=TaZlzXGf3WQufL9j1JEx1nwgIeVcTYEBOt%2fJiL5YDkk%3d&risl=&pid=ImgRaw&r=0'
    ],
    '무각사': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=09e833eb-128b-4862-b402-2d3bf8ac9508',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=9ca57b85-a635-4a25-8eba-415cd7925812'
    ],
    '오방 최흥종 기념관': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=059356c6-0d50-4f7e-9503-a495d8979911',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=4db34c4b-d942-4db1-99aa-86eca1c63f33'
    ],
    '월봉서원': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=7d2662cc-21f5-43f9-a0f2-b88834e81caf',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=be8cf894-7951-4510-aa83-085ebdb71392'
    ],
    '국립5.18민주묘지': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=f66a6e3f-814a-4649-8bbe-6e6eed7aecab',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=17ffa33e-9a23-447b-83e5-0dba6bc94772'
    ],
    '증심사': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=a96b2f18-6f8c-4af2-b58e-0e3e1e801dd8',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=039ecb69-a9bf-4c94-abfe-68194f7719e7'
    ],
    '월곡고려인문화관 결': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=13f1fdf6-fbf8-4e87-8ed2-b9bdd004ebb2',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=5ce39c3c-f19c-4ec9-b036-86020792fab7'
    ],
    '5.18민주광장': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=2a5208a3-8e78-4824-9b1d-39f4c542c349',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=052610ec-c6d4-4f04-8afa-8313078a0bb2'
    ],
    '양림동 선교사 묘지': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=597a5fce-0922-4de7-b104-9f4e19183390',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=eb8f2b9d-4790-4c69-b840-a39a825d1af5'
    ],
    '국립광주박물관': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=2ab084e0-1df6-4827-9c38-50a8e7878a91',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=f0fab786-cd90-4971-88aa-12d24d8ff9b5'
    ],
    '오웬기념각': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=a67bd36d-c31e-4231-908b-63433034e1aa',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=38218421-9cbf-4218-afc6-9705d4dfab24'
    ],
    '유애서원': [
      'https://mblogthumb-phinf.pstatic.net/MjAyNTA4MjVfMTcx/MDAxNzU2MTAwNDIwNDI5.I1TQBZhifclFWanGuDb6MVuOl7r1LSrTsF-yPqsAp30g.oJ6BRkStT89OnW69DK2wvKPtzwcGvGBhd3BijsBZED8g.JPEG/SE-b2d9738f-fa7f-4123-80ff-a30de783eeda.jpg?type=w800',
      'https://mblogthumb-phinf.pstatic.net/MjAyNTA4MjVfNDQg/MDAxNzU2MTAwNDI4MzM2.wqC7kaMIidrt51GRGPgGvgWoqx_XUZE9_JUBWkf8MbEg.3XhfZBs6EnlnctXZDPUztcjFSSd9nSULqLsNzg8f27Ig.JPEG/SE-7f6e15c4-bcdc-416d-b3bf-8691a604c9f5.jpg?type=w800'
    ],
    '월계동 장고분': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=d6b03f9b-0b9e-4bf7-9db4-070092fca49a',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=14731968-2ac4-45b8-a522-624b603e488a'
    ],
    '양송천 묘역': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=c917532c-ae0b-4aa5-8c15-6cf3128b6828',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=be98c5c0-0a64-4ad4-adf9-af940be4d89a'
    ],
    '전남대학교 박물관': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=189baca0-118d-4e68-9804-415d362c8627',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=bdaf2861-1dd8-4384-80cc-144cedd47335'
    ],
    '광주 디자인 비엔날레': [
      'https://gdb.or.kr/theme/skin/default/kr/img/main-work-08/21.jpg',
      'https://gdb.or.kr/data/image/31/a76e281b64ec335d714d86142145ab37.jpg'
    ],
    '광주 예술의전당': [
      'https://image.fnnews.com/resource/media/image/2023/06/15/202306151557118065_l.jpg',
      'https://th.bing.com/th/id/R.72ef39b72e9c9940c7727c923506a6d4?rik=o%2brJPBYf9GNlnw&riu=http%3a%2f%2fdh.aks.ac.kr%2f%7egwangju%2fwiki%2fimages%2f9%2f99%2f%ea%b4%91%ec%a3%bc%eb%ac%b8%ed%99%94%ec%98%88%ec%88%a0%ed%9a%8c%ea%b4%80_%ec%9b%90%ed%98%95%ea%b7%b9%ec%9e%a5.jpg&ehk=FvvSTz%2bEOWUmM7twaBn6X6TzYbqnBj8INWwS6ObYZik%3d&risl=&pid=ImgRaw&r=0'
    ],
    '광주시립미술관': [
      'https://www.heerim.com/data/goodsImages/71414cef9b28861ace7d25550d80f239.jpg',
      'https://t1.daumcdn.net/news/202210/06/yonhap/20221006165156194arna.jpg'
    ],
    '광주 예술의거리': [
      'https://th.bing.com/th/id/R.028b4280028bd8cdb00bf664315322df?rik=MklNd38bjs4GfQ&riu=http%3a%2f%2ftong.visitkorea.or.kr%2fcms%2fresource%2f48%2f1587548_image2_1.jpg&ehk=U5%2bU2nn6rG%2bMfxmIXAGEtBbaljXV6OP9gPrC7SW1Hq8%3d&risl=&pid=ImgRaw&r=0',
      'https://th.bing.com/th/id/R.43b8bdfc5aa6d6dcf8af87ae47202c88?rik=TD%2f71RQodYdrHw&riu=http%3a%2f%2fwww.hkmd.kr%2fdata%2fphotos%2f20190414%2fart_1554367163348_eee70c.jpg&ehk=eXFRU4tJEPeVSG51JOc2m0Lv7xh2LXdjg28fz%2bFj95U%3d&risl=&pid=ImgRaw&r=0'
    ],
    '국립아시아문화전당': [
      'https://images.pexels.com/photos/14612126/pexels-photo-14612126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://img2.yna.co.kr/photo/yna/YH/2019/12/24/PYH2019122401490005400_P4.jpg'
    ],
    '펭귄마을': [
      'https://th.bing.com/th/id/R.df3b0f219f3eb7e156ce8da2cf37d611?rik=PMdriqdLLDRznQ&riu=http%3a%2f%2fojsfile.ohmynews.com%2fPHT_IMG_FILE%2f2016%2f0807%2fIE002001883_PHT.jpg&ehk=Oxhcv3KJXR8K8Xc8QLkRm23jmuGDdscPoqSh4%2bIXNb4%3d&risl=&pid=ImgRaw&r=0',
      'https://datacdn.ibtravel.co.kr/files/2023/04/25152603/5acb70b702850acdec3878625dd1fdad_img-1.jpeg'
    ],
    '남도향토음식박물관': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=fa34118b-fd9e-4f3c-b583-de73c81c7533',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=1f1d87d1-d3bd-4f70-b08d-888d748ee0b8'
    ],
    '광주학생독립운동기념회관': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=79e3e392-347a-4630-bede-b65c121df9e5',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=84c5e18e-e84a-4f83-87ca-d8a22075850d'
    ],
    '이이남스튜디오': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=e7a83b03-b6ef-4e29-9918-fbb787572fb7',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=29994f9a-c3d0-40c7-a0e9-8e2b53d6177c'
    ],
    '광주극장': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=c13fe8c5-d1bc-46ad-9e60-e597dc451941',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=f15e2774-b5f5-4250-953e-c515ae99ecc3'
    ],
    'KPOP 스타의 거리': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=d3e899d9-f427-494e-b95e-5d2e86cd144b',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=78473a65-8b04-4fe1-9448-8341911ce9f7'
    ],
    '국립광주과학관': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=6b38d4e4-5844-4b23-ab57-958866dc282d',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=d0f29917-8e86-4dab-81bb-d03353502a72'
    ],
    '의재미술관': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=bd55aba0-5910-4008-bb96-c283a1d35944',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=7e3907c9-5483-4a6f-a757-94104b56b1b7'
    ],
    '기분좋은극장': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=25c63cf2-ffaa-45a6-8866-dc4dbb4d3979',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=e5d0dd3c-2479-4c8a-8cc6-d15fb077f670'
    ],
    '김대중컨벤션센터': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=15d5dd51-3daf-4bfc-8b5c-cacfa1b86793',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=95d4735b-9fd2-4377-a247-f4ae0e8bfd2c'
    ],
    '무등갤러리': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=c49691dc-b5f5-46d0-b50d-c4e7a446fc32',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=4a6f7ccf-5fe4-4027-adde-0b322c0bc61d'
    ],
    '광주광역시미디어아트플랫폼 GMAP': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=abba0fa3-a86c-494d-a78d-495d807e7c2e',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=96f85fd1-4660-4c39-8de5-0731c7cd905e'
    ],
    '동곡미술관': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=0b0b1426-21eb-47b9-85f5-4fcc8772d38c',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=59f55f82-09da-47fc-bed8-b46aff8f7c07'
    ],
    '비움박물관': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=0dbeb6a6-8100-446f-b72e-91ed1d6dbc45',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=6afa6ffd-cb82-415d-9c34-3785b4555d29'
    ],
    '소촌아트팩토리': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=b270092e-b948-4416-9f6f-ab0b0ffc8427',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=de4c1fb9-2ef1-4e0f-80b8-6e20cb73bff2'
    ],
    '송정 떡갈비거리': [
      'https://th.bing.com/th/id/R.43cc97512a23d8821a5e84734b77c208?rik=PudFTK7DyBSpyg&riu=http%3a%2f%2fhankuknews.com%2fdata%2ftmp%2f2209%2f20220906161205_vbzwiaei.jpg&ehk=bRjTKTI%2fbMF5wZ0tbft%2bUptKww6sPEmGodHeX6JMN4Q%3d&risl=&pid=ImgRaw&r=0',
      'https://th.bing.com/th/id/R.759009f397ef0c9272337c633b7742fa?rik=7qLgHVDvMkhLJQ&riu=http%3a%2f%2fwww.traveli.co.kr%2frepository%2fread%2fcontents%2fK201508251725421.JPG&ehk=Nj61rzvozNui7eAepFPU6WjeaBHIRxKtY1xqjaS7e4M%3d&risl=&pid=ImgRaw&r=0'
    ],
    '1913 송정역시장': [
      'https://th.bing.com/th/id/R.5c95c936093c5ad43511ddc23ea946b8?rik=udxQjAXI6lxteg&riu=http%3a%2f%2fwww.traveli.co.kr%2frepository%2fread%2fcontents%2fK201608021728434.jpg&ehk=dZ33hiWWthP8Yj9e0a6FMIFqNrhs7DHtbbsNFpljm3U%3d&risl=&pid=ImgRaw&r=0',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/52/c6/e9/good-place-to-wander.jpg?w=1200&h=-1&s=1'
    ],
    '동명동 카페골목': [
      'https://img1.daumcdn.net/thumb/S1200x630/?fname=https://t1.daumcdn.net/news/202403/20/kbc/20240320162807121kpqc.jpg',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/21/e7/7c/c8/dongmyeongdong-cafe-street.jpg?w=1200&h=-1&s=1'
    ],
    '대인시장': [
      'https://t1.daumcdn.net/cfile/tistory/23674B3753BFE4A630',
      'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https:%2F%2Fblog.kakaocdn.net%2Fdn%2FDts6G%2FbtrQFw8moPq%2FRaiECxfTFke6zUL8ZvK2Pk%2Fimg.jpg'
    ],
    '시청 먹자골목': [
      'https://tse4.mm.bing.net/th/id/OIP.lBy0XtBIP2A3lhWTPx3shwHaFj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
      'https://d2uja84sd90jmv.cloudfront.net/posts/v8atlPVZgm6ln8nvJI5XhQ/m.jpg'
    ],
    '광주 오리요리거리': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=755d1e2c-b7d9-41df-961d-3d549b81ebd1',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=24985110-42bc-4273-be25-6060d7ef0d55'
    ],
    '광주공원 포차거리': [
      'https://tse2.mm.bing.net/th/id/OIP.pl2Fde1stZv55Ht9j_nTsQHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
      'https://mblogthumb-phinf.pstatic.net/MjAyMDA1MTJfMjgg/MDAxNTg5MjExNjUzNzAx.EBZcScF4srD-8OAAb3pOIaKhb5am-pjK4tTBqzArszQg.dYZKfzpBmUaRTCcquGH-Mx068AT7vkZgu70KwWFYxZgg.JPEG.a994218/IMG_2867.jpg?type=w966'
    ],
    '말바우시장': [
      'https://th.bing.com/th/id/R.4964297115ab430cef19409e2452b26d?rik=B41YbbvqOK0zPA&riu=http%3a%2f%2fgjstory.or.kr%2f__upload%2fresources%2fvB799488b%2f1515575550_4036.jpg&ehk=FE3NT%2fKeKZrL%2fHnCGDADA0Oe67%2fmHXr5UIRwJ4bwdqI%3d&risl=&pid=ImgRaw&r=0',
      'https://mblogthumb-phinf.pstatic.net/MjAyMzA2MjVfNjkg/MDAxNjg3NjE5OTQxMzQ5.4lYi4DnYqKFjuzx-GZhXd1UaztjVrLICcVY4Mo16w9Ig.FGlMuyL2F7b3pC0GMqKTY0G_P5jAgufDNewb2j0noLwg.JPEG.hjin2517/SE-d340d99b-1275-11ee-b55b-a98ace90aa6e.jpg?type=w800'
    ],
    '서플라이': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=2ed0370a-7d59-4e35-86bf-346a5d048cf0',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=6425e13c-1cf7-4295-85f4-a32a4af607ba'
    ],
    '송원식육식당': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=dc6f90ed-1f21-45c7-8be8-468c380817ca',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=d3dad72d-05fc-42aa-bee4-f1318d5ceef8'
    ],
    '칠봉이짬뽕': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=368a5993-a19d-4fa7-9b27-cdafd01a5676',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=b708a320-92fa-4e1f-8315-43bcb9027ed1'
    ],
    '장가계': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=687e7ada-6f1d-4c5c-8a5c-d1710f71a8f7',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=5d5aff7c-b682-439a-8fc6-a6dfa2a4b63e'
    ],
    '미미원': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=7c0e5aa3-9bc3-43c3-97b5-3c3ffd00bb6e',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=1c6ea488-a67f-494b-a818-79758be5dabd'
    ],
    '상무초밥 상무본점': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=f66f0c36-0815-49ea-9833-d99e8c168127',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=8d61c7e0-13c0-4384-8db8-c0a5de66fdd2'
    ],
    '청수민물장어': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=32dc3d84-02f2-4459-9480-9f51041e1214',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=52a7a228-2f5c-42b9-a0a4-e83f0c26da4a'
    ],
    '농성화로본점': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=59f66f82-3f74-4863-a19f-c31414666eb0',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=3bea4be6-28b6-400c-b5df-8db0376aa351'
    ],
    '그런느낌': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=8f4f6db1-9ce6-40ad-996a-a8bba71af709',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=a4d02c6d-6886-43f1-b6ce-84551e677555'
    ],
    '보향미': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=8becb897-bf17-4230-813c-410daf7e9465',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=fc1d17d3-9b92-46e5-b230-3d7c98844881'
    ],
    '하남꽃게장백반': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=c8ff7411-9093-4a99-9719-9d76fb71c8e3',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=a7fffa6a-96ce-4e7d-b32b-5b18f8aa1342'
    ],
    '갤러리24': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=806389c2-4360-4503-b278-1388a809d58f',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=446f638f-866c-48f1-8079-6297ceb77ab0'
    ],
    '무등산': [
      'https://cdn.gjdream.com/news/photo/202303/624037_225398_1023.jpg',
      'https://cdn.san.chosun.com/news/photo/201912/13406_56553_1658.jpg'
    ],
    '광주천': [
      'https://th.bing.com/th/id/R.722644b0564e19ab88f6510b6532fceb?rik=YznL9ek6K9IAfg&riu=http%3a%2f%2ftong.visitkorea.or.kr%2fcms%2fresource%2f99%2f2793199_image2_1.jpg&ehk=hUD0l5NSk8zvOTLAtkXa5Cgc3QHwDYfJREJo5T0Rgms%3d&risl=&pid=ImgRaw&r=0',
      'https://cdn.gjdream.com/news/photo/202305/627753_229369_345.jpg'
    ],
    '중외공원': [
      'https://th.bing.com/th/id/R.4c521368b11b1decf3c381e2a24e560d?rik=EnhPSRNyOIQOGQ&riu=http%3a%2f%2fwww.traveli.co.kr%2frepository%2fread%2fcontents%2fK20150918151357157.jpg&ehk=yW%2bVLesfuPjTSZGSHAIenORwwnGuQYLcuuqNwaFma4Y%3d&risl=&pid=ImgRaw&r=0',
      'https://search.pstatic.net/sunny/?src=https%3A%2F%2Fi.namu.wiki%2Fi%2FHJdCTQBwoKBHnbrEgBLImNbtadV_0ishWWKam-ToGSwgLAz45SxOmep-bpj4FRnO_rcnCIBjoUUQiXgJG9-0gQ.webp&type=sc960_832'
    ],
    '광주광역시 우치공원': [
      'https://mblogthumb-phinf.pstatic.net/MjAyNTAyMjJfMTIg/MDAxNzQwMTg2NjEzMzcy.EMok9thHppxB_brAh1mEVy5Cj_2Gv6HNo4TMgzvjvq0g.M2ly16_4Hz-TyODfSgVPwhW9c2VXsht600wwXFEItVAg.JPEG/900%EF%BC%BF20221014%EF%BC%BF161933.jpg?type=w800',
      'https://th.bing.com/th/id/R.d3c3cbb8d6a022e8d6d8257a9b8d3bdf?rik=JZL6SkDe8gxcjA&riu=http%3a%2f%2ftong.visitkorea.or.kr%2fcms%2fresource%2f46%2f2739846_image2_1.JPG&ehk=GQS9tjCwMYQoHY%2fI%2fD3X2LzPxy9dvHjmYAt4T64vMic%3d&risl=&pid=ImgRaw&r=0'
    ],
    '광주호 호수생태원': [
      'https://cdn.daehanilbo.co.kr/news/photo/202203/50201_40337_1644.jpg',
      'https://cdn.st-news.co.kr/news/photo/202110/2962_6092_1036.jpg'
    ],
    '광주사직공원 전망타워': [
      'https://th.bing.com/th/id/R.93b97b9c7d9bab994c3ae8d556bc2362?rik=Xalcf%2bIHYQ3pRg&riu=http%3a%2f%2ftong.visitkorea.or.kr%2fcms%2fresource%2f66%2f2755566_image2_1.JPG&ehk=gKMZnLi1a04bb%2fUooC5Ozs4WOC55%2b2HL2LKVezHsfR0%3d&risl=&pid=ImgRaw&r=0',
      'https://tse1.mm.bing.net/th/id/OIP.7-KvTsue2Xlj8dkZSOq6uQHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3'
    ],
    '전평제근린공원': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=51eb614d-d3c0-4f40-a5a7-cbd7cfc488c1',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=b9969b2a-ad14-462a-bae4-a067b51ebc1e'
    ],
    '운천저수지': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=3de33ebe-4d55-4b1a-afc7-87dbcac1503e',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=61559aaa-2251-42f0-925f-e350250f81a7'
    ],
    '쌍암공원': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=d713c316-e26b-4bad-8714-450ccfce1634',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=b2f6b597-0f55-41b8-8f6f-cda2fae8e534'
    ],
    '조선대학교 장미원': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=911305a4-4cf7-41a1-85d1-3858fb81693c',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=6dad2522-8511-4124-8a9f-313be6002469'
    ],
    '광주시립수목원': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=dee5797c-f9ba-4648-829f-bb5610421b2b',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=f721e247-4797-4e6a-8992-bdc0aff0cd6f'
    ],
    '지산유원지': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=38c69734-eefd-4921-a88a-5d3b06ff4ec5',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=fb49df60-e559-4b16-9808-4e4e2842fa48'
    ],
    '광주시민의숲': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=e047e39b-ffe1-4782-99e6-834f7153404e',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=5a34ac96-2487-41cb-b1b2-0599e3bcc566'
    ],
    '빛고을농촌테마공원': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=dd9defdc-3c38-46f5-a39c-cc7184b71df8',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=b31e3b42-2df9-458d-b611-3d25bb66483f'
    ],
    '풍암호수': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=4e43a0c5-728e-4d59-9551-e64ba6e083d9',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=7ba17307-9681-4a40-84ff-7db119ca2350'
    ],
    '환벽당': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=a38bb81a-2046-45e5-9099-cb77e8402747',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=d256912f-fbd9-4249-9b9f-fe4475bb12e7'
    ],
    '상무시민공원': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=5ba463cd-7c07-4397-89a1-084d69f62b05',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=1ae2f321-7adc-4ca2-b9cf-59f7635ff454'
    ],
    '광주공원': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=1c19ebfa-76ac-4d24-8d34-9ddba0e660c7',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=4c8f5932-0e10-455d-b879-a99bed6127f6'
    ],
    '서석대': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=00ed5dbb-185d-4be6-87d5-ba8b2b1da7d3',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=255bd6f1-c0b6-41a5-ad4d-7b9aa81690d0'
    ],
    '무등산국립공원': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=c6baec7d-1d8e-458c-8026-cbb58dc2fddb',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=5b6b5def-a354-4742-acf9-47ef5bbcaa86'
    ],
    '광주기아챔피언스필드': [
      'https://live.staticflickr.com/7411/27630080642_852554ea44_b.jpg',
      'https://tigers.co.kr/img/sub/champ_stadium01_08.png',
    ],
    '헬로애니멀광주점': [
      'https://tse2.mm.bing.net/th/id/OIP.rIXXOnhAJLqB6fC40L6yegHaFr?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
      'https://tse4.mm.bing.net/th/id/OIP.gcnvXK6-aptt5PgvXnj0BwHaFj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3'
    ],
    '광주월드컵경기장': [
      'https://image.fmkorea.com/files/attach/new/20200726/3674493/675808214/3006605774/78c72dbfdb91c3aca5485e5421b871f0.jpg',
      'https://cdn.gukjenews.com/news/photo/202411/3134736_3233452_336.jpg'
    ],
    '광주국제양궁장': [
      'https://th.bing.com/th/id/R.a0121396de767b7eb558c12435c099bd?rik=czcY6zAkyWPRHw&riu=http%3a%2f%2ftong.visitkorea.or.kr%2fcms%2fresource%2f94%2f3032294_image2_1.jpg&ehk=ODLjsDAmGAPe49xEKkPaeIu32GVync4ppJoI2dkoebk%3d&risl=&pid=ImgRaw&r=0',
      'https://th.bing.com/th/id/R.514b698782e9a6688c1c16725f840f64?rik=1wYNPEEgesRpiA&riu=http%3a%2f%2ftong.visitkorea.or.kr%2fcms%2fresource%2f95%2f3032295_image2_1.jpg&ehk=iTYw1uip6We8qcFs7w5QrP3%2fqgXrZipkO1N0xha8Vo8%3d&risl=&pid=ImgRaw&r=0'
    ],
    '아쿠아시티광주': [
      'https://mblogthumb-phinf.pstatic.net/MjAyMjA1MDFfMTk4/MDAxNjUxMzg2NjUyODgw.z_o3EdVfBsi2oEX_aN_bBVt8OOhtmZcugw9y-Uz94CEg.UoWmZsQQpgu8srAm96pJOpuYT5DC4X1NI-T58c8-5Q0g.JPEG.yquen0905/1651386646552.jpg?type=w800',
      'https://d2mgzmtdeipcjp.cloudfront.net/files/good/2022/03/30/16486002238965.jpg'
    ],
    '광주김치타운': [
      'https://th.bing.com/th/id/R.84437ad7fd29fe60ac3b6c7dd113b855?rik=YjS1M3oBa4cC4g&riu=http%3a%2f%2fbbkk.kr%2fd%2ft%2f3%2f3111_DSC_1803.jpg&ehk=Rh0OKzGKi2slKDUU9JUHzwuZOwFFvOq4y1bep%2fncLaE%3d&risl=&pid=ImgRaw&r=0',
      'https://th.bing.com/th/id/R.dfc91955c5df1dbae0dda598d0931288?rik=g%2bGJNK7skBBokA&riu=http%3a%2f%2fdh.aks.ac.kr%2f%7egwangju%2fwiki%2fimages%2f5%2f56%2f%ea%b9%80%ec%b9%98%ed%83%80%ec%9a%b4_%ec%b9%b4%ed%8e%982.jpg&ehk=xukdIpBRUy8hH%2bcMPx%2bN2s3GWyh%2b8GKl%2bnuH2IxpjSo%3d&risl=&pid=ImgRaw&r=0'
    ],
    '광주실내빙상장': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=7928a48c-261d-4d8e-9ef5-21d992a8b5f9',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=444c708e-2659-4754-89b3-41408439f724'
    ],
    '평촌도예공방': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=f536a4e8-0e70-4f00-ad9c-4bdb3b8d7f2c',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=da9317c0-123a-430b-acd9-79c91009c1af'
    ],
    '무등산수박마을': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=50f6bd8c-8cf4-493c-b00e-241780d34072',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=6262fb19-194c-4e11-a6c8-d886134db627'
    ],
    '법무부 광주솔로몬로파크': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=9c230b45-5b0d-4e92-a833-07a687660054',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=b57b3644-ab81-48f0-b479-9b571c9c471e'
    ],
    '여행자의 집': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=5d56d16d-7192-4bf4-94cf-b31d8b196c4a',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=11cdd837-6545-469c-a059-3887476b8cce'
    ],
    '마한유적체험관': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=f630fc63-dffe-4247-b34d-aec60ad3d42d',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=0c7d1f7d-82f7-4a52-868e-20c2f96000ef'
    ],
    '송산목장': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=6acca1e6-7b5e-41c4-ad4c-f73fe9b75728',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=1f224f58-e881-4712-becb-087c78ea8e21'
    ],
    '빛고을공예창작촌': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=9daa6e20-da9e-4717-a32c-b9b726382f95',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=a54f1b87-eac4-4f7c-a8f9-82acf8c13bda'
    ],
    '충장로': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=19771b67-f271-4294-a8b1-85a0514d3fb6',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=c826e161-f326-4827-b8e2-0e2a89ac7dce'
    ],
    '청춘발산마을': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=86d733cb-fd7d-4635-93d5-bdcb81d4c1ba',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=b956c285-0940-4ccf-90fe-d1bd9559c179'
    ],
    '꿈브루어리': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=f1d6b37f-1fdc-4c46-a073-34f736c15774',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=68bb16c7-f883-44fd-9d60-4328967a343c'
    ],
    '광주패밀리랜드': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=c393678d-ea3e-462f-9a5b-5e1717f4e951',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=bde0f8c2-ac6c-4e7a-9386-fa5aba8a629a'
    ],
    '테라피 스파 소베': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=90560e96-c6e3-4c64-accb-6bf2fb1508f2',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=aba70db0-09ac-4a15-a322-c9ffa64ac97c'
    ],
    '관덕정의 각궁': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=ae4f47eb-134b-4493-95eb-ca4f3f572911',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=228ea8d1-e8ec-4b55-8315-c41aba3dc3a7'
    ], '광주 아우라 비즈니스 호텔': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=1e2c0bab-4818-4b7d-b846-37e47175d1ab',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=56469d3d-2ee7-4bbb-b352-23dbccfeff34'
    ], '탑클라우드호텔 광주점': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=1c4b605e-eefd-4221-a78c-f2397da4c124',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=806876ab-914c-4b48-b7f7-1687ad5e4bb6'
    ], '한성 마드리드 광주호텔': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=919ebe92-82d5-429b-a112-579d0d8e3223',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=55d04de2-8531-4809-afa9-1bf6a06c5654'
    ], '무등파크호텔': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=8386c851-738f-4451-ac65-ad7e62e685c5',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=a46d7e22-e3f0-42d7-ba80-5dfea1cc40ce'
    ], '노블 스테이': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=3a8d19e5-2ec1-4b9c-8573-8c5890ebb3b7',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=18a6646a-7717-469a-8e9a-88a19fbd9f93'
    ], '여로': [
      'https://tong.visitkorea.or.kr/cms/resource/73/2707573_image2_1.jpg',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=2da454b1-0957-4462-8cda-4326105e4a62'
    ], '홀리데이 인 광주 호텔': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=b5015819-7c0e-42c1-a8ef-897fabc99309',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=4e905b40-c336-492e-8f7f-262bc1df1bd6'
    ], '마스터스관광호텔': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=4d626fee-9c00-420e-9978-0c1596f5e225',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=8d385aa7-882d-478e-92dc-8040f302e0b9'
    ], '아리네 게스트하우스': [
      'https://tong.visitkorea.or.kr/cms/resource/35/2817835_image2_1.jpeg',
      'https://tong.visitkorea.or.kr/cms/resource/31/2817831_image2_1.jpeg'
    ], '라마다프라자 광주호텔': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=b1e1c876-fed8-46f5-b75a-4cb5d517e5cf',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=0b21726e-3716-44f6-889b-3e40ce9b36e3'
    ], '센트럴관광호텔': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=4fe40d08-026c-4aa1-965d-d38517479913',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=d75cdc68-573b-445c-b4b4-292eff6e5a16'
    ], '두바이호텔': [
      'https://tong.visitkorea.or.kr/cms/resource/52/2629952_image2_1.jpg',
      'https://tong.visitkorea.or.kr/cms/resource/98/2629998_image2_1.jpg'
    ], '다솜채': [
      'https://tong.visitkorea.or.kr/cms/resource/69/2992969_image2_1.jpg',
      'https://tong.visitkorea.or.kr/cms/resource/72/2992972_image2_1.jpg'
    ], '호텔더스팟': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=61470c08-c2b0-4499-b7e3-e9f7ff1ca94f',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=8cdf9222-0ba7-4d32-a331-982b1e847059'
    ], '호텔 5월': [
      'https://tong.visitkorea.or.kr/cms/resource/61/2529861_image2_1.jpg',
      'https://tong.visitkorea.or.kr/cms/resource/55/2529855_image2_1.jpg'
    ], '금수장관광호텔': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=e8d4b593-4ed3-48c2-b75c-52ee7c86882a',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=40de5a51-1cfe-4259-9bb0-676696f12197'
    ], '유탑부티크호텔앤레지던스': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=dbaf7030-0feb-4362-bae3-cb70b90f5406',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=93916e49-ded6-40ce-8dd7-3855b6b9ee00'
    ], '이끌림 비지니스호텔 하남': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=37f68a11-6a7c-46f8-b37b-cb6424a3ec33',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=01930306-d632-40eb-9131-2beae29f167f'
    ], '라마다플라자 충장호텔': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=b7bacbf9-ef54-435f-b83f-d2439bed4260',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=7efb62dc-127c-4474-9b94-c5c745d9777a'
    ], '볼튼호텔': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=7caa7bb7-9a64-41d9-9e60-032c71c5d621',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=9a034a76-76aa-4a3a-86c8-c9a2348bff41'
    ], '죽녹원': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=0a733400-93cb-4a4b-b728-e391ee715025',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=3fdd86fb-17af-45c0-a912-29410f203142'
    ], '메타세쿼이아 가로수길': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=625bde4c-7751-4452-9a84-4b199a9c60bf',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=72d7c72b-ad32-4154-b19f-3641af68494c'
    ], '송강정': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=b051ba9f-d96f-4654-a977-208d863271fa',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=0a900c9f-eb45-42f4-b890-7b0723788e72'
    ], '쌍교숯불갈비 담양 본점': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=91e2e2f0-46a7-4960-8b5b-29eaedd3927e',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=ffc71b2f-d356-4fe9-887e-0d881122c3fa'
    ], '중흥골드스파&리조트': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=ca8d451c-d009-4f9e-9c1c-c0c17905b7d1',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=968a595d-5c83-4089-9653-3d57fdcd1483'
    ], '국립나주박물관': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=503869a1-d89d-447c-ac82-55dd5c93bc8d',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=5a777a8e-4590-4a81-9332-f8a22f8751a8'
    ], '나주곰탕노안집': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=2769f325-3a74-40e8-9e29-d5cc9145ec9b',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=9da1fa44-a443-443d-b7b2-b04aae339bf0'
    ], '빛가람 호수공원': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=0d8da61d-987b-440c-95c1-1fcaafe14f35',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=9433ee08-8c02-4cb7-9e70-c8dd9f1c3c61'
    ], '도곡온천단지': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=84fbd9db-a1ad-4172-8ca0-81d367ed9bd5',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=b7ec52d2-daac-488e-8f2a-fef727b3c6ec'
    ], '화순 고인돌군 유적': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=ebf1f8ba-bebb-45a1-a1cd-e0df3a9e8f2e',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=928ab436-ff03-4445-864d-421eda5124ac'
    ], '운주사': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=7ee8fa44-2b9f-458c-bfe8-693a2d4918a7',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=dc507cf1-cb3d-403b-9032-d5abc06474e3'
    ], '만연폭포': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=cf7efce9-1807-4e6d-bcb2-b9ee5af15c97',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=103e5af1-8c91-4b45-a88b-b344c2f334bc'
    ], '황룡강 생태공원': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=e7d24bd0-3535-4543-91cd-8e66670723a7',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=3cbc0609-3d75-427f-b814-46b6415d87ae'
    ], '백양사': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=8011103a-71a0-4341-8499-3fb58563e50c',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=3d7eb323-1262-4773-8c73-af8875c5c71b'
    ], '장성호수변공원': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=967147ee-3174-4d08-873c-00b2b9c61c16',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=7ea0b92c-6af4-4123-ac91-15041abf4f0b'
    ], '오피먼트': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=00fc5f98-29af-4b3f-ba22-5b4782073258',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=00f930ac-6972-42e6-975d-9109e4ed07ba'
    ], '함평엑스포공원': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=97390233-2b7c-4580-bb0f-eda5abae78f8',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=e121d9c4-7d16-44a6-bc26-fef91c4ea828'
    ], '돌머리해수욕장': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=16ed1e2c-e478-48c5-bf3b-0ce633b1b754',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=e89a8e23-d1a6-4b9a-a1ec-84ee42d5fddb'
    ], '용천사': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=a0fccc6f-a8c9-45dc-b957-4abafd32a81b',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=e588ee7f-36cc-4a07-9172-b8467f23dc13'
    ], '화랑식당': [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=c0984529-ce83-4377-a778-b597584cc4ad',
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=9ac82fa7-1d41-4412-b83d-9f5d78d9afc2'
    ], '호남대학교': [
      'https://www.honam.ac.kr/img/campusMap/map_img2.jpg',
      'https://i.namu.wiki/i/iJ06ZpexX5bTqlI0gi6NINwFEusP9CzZMeGS0yU-h_JuPY4xeOhj90Ut2wyB5tM14llXNbkAHPpvoTzyRduOpnZWKBbVZ1GJ-OkS-Y1nfoIQ8f_3mKQtKBKmCy8ncDKTcTlXIXXcnIDSCSJFHv6FWQ.webp'
    ]
  };
  
  // 기본 이미지를 첫 번째로, 추가 이미지들을 뒤에 배치
  const baseImage = imageMapping[spotName];
  const extraImages = additionalImages[spotName] || [];
  
  if (baseImage) {
    return [`/images/${baseImage}`, ...extraImages];
  }
  
  return extraImages.length > 0 ? extraImages : null;
};

// 이미지 매핑 함수 (로컬 이미지 사용)
const getSpotImage = (imageUrl, spotId, themeId, spotName) => {
  console.log('🔍 이미지 URL 확인:', imageUrl, 'spotId:', spotId, 'spotName:', spotName);
  
  // 관광지명과 이미지 파일명 매핑 (정확한 매핑)
  const imageMapping = {
    // 쇼핑 테마
    '충금지하상가': 'ChunggeumUndergroundShoppingCenter.jpg',
    '신세계백화점 광주신세계점': 'shinsegae_gwangju.jpg',
    '롯데백화점 광주점': 'lotte_gwangju.jpg',
    '광주세정아울렛': 'gwangju_sejung_outlet.jpg',
    '광주 양동시장': 'gwangju_yangdong_market.jpg',
    'NC백화점 광주역점': 'NCwave_gwangju.jpg',
    '상무화훼단지': 'sangmu_flower_complex.jpg',
    '서부농수산물도매시장': 'seobu_market.jpg',
    '광주각화농산물도매시장': 'gwangju_gakhwa_agricultural_wholesale_market.jpg',
    '시리단길': 'siridan_gil.jpg',
    '비아5일시장': 'bia_5day_market.jpg',
    '남광주시장': 'namgwangju_market.jpg',
    '롯데아울렛 광주월드컵점': 'lotte_outlet_gwangju_world_cup.jpg',
    'NC웨이브 충장점': 'nc_wave_chungjang_branch.jpg',
    '월곡시장': 'wolgok_market.jpg',
    '운암시장': 'unam_market.jpg',
    '예술의거리 개미장터': 'art_street_ant_market.jpg',
    '롯데아울렛 광주수완점': 'lotte_outlet_gwangju_suwan.jpg',
    '무안요': 'muan_yo.jpg',
    '인당국악사': 'indang_korean_music_hall.jpg',
    
    // 역사 테마
    '5.18기념공원': '5.18_memorial_park.jpg',
    '양림동 역사문화마을': 'yanglim_culture_village.jpg',
    '광주향교': 'gwangju_hyanggyo.jpg',
    '광주문화재단 전통문화관': 'gwangju_traditional_culture_center.jpg',
    '광주역사민속박물관': 'gwangju_history_folk_museum.jpg',
    '5.18 민주화운동기록관': 'democracy_memorial.jpg',
    '무각사': 'mugaksa_temple.jpg',
    '오방 최흥종 기념관': 'obangmuseum.jpg',
    '월봉서원': 'olbong_seowon.jpg',
    '국립5.18민주묘지': 'national_may_18_democratic_cemetery.jpg',
    '증심사': 'jeungsimsa_temple.jpg',
    '월곡고려인문화관 결': 'wolgok_koryoin_cultural_center_gyeol.jpg',
    '5.18민주광장': 'may_18_democracy_plaza.jpg',
    '양림동 선교사 묘지': 'yangnimdong_missionary_cemetery.jpg',
    '국립광주박물관': 'guknip_gwangju_museum.jpg',
    '오웬기념각': 'owen_memorial.jpg',
    '유애서원': 'yuae_seowon.jpg',
    '월계동 장고분': 'wolgye_dong_janggo_bun.jpg',
    '양송천 묘역': 'yangsongcheon_myoyeok.jpg',
    '전남대학교 박물관': 'chonnam_university_museum.jpg',
    
    // 문화 테마
    '광주 디자인 비엔날레': 'biennale.jpg',
    '광주 예술의전당': 'gwangju_arts_center.jpg',
    '광주시립미술관': 'gwangju_museum_of_art.jpg',
    '광주 예술의거리': 'gwangju_art_street.jpg',
    '국립아시아문화전당': 'asia_culture_center.jpg',
    '펭귄마을': 'penguin_town.jpg',
    '남도향토음식박물관': 'namdo_food_museum.jpg',
    '광주학생독립운동기념회관': 'gwangju_studenti_ndependence_movement_memorial_hall.jpg',
    '이이남스튜디오': 'iinam_studio.jpg',
    '광주극장': 'gwangju_theater.jpg',
    'KPOP 스타의 거리': 'kpop_star_street.jpg',
    '국립광주과학관': 'national_gwangju_science_museum.jpg',
    '의재미술관': 'uijae_art_museum.jpg',
    '기분좋은극장': 'good_mood_theater.jpg',
    '김대중컨벤션센터': 'kim_dae_jung_convention_center.jpg',
    '무등갤러리': 'mudeung_gallery.jpg',
    '광주광역시미디어아트플랫폼 GMAP': 'gwangju_media_art_platform_gmap.jpg',
    '동곡미술관': 'donggok_art_museum.jpg',
    '비움박물관': 'bium_museum.jpg',
    '소촌아트팩토리': 'sochon_art_factory.jpg',
    
    // 음식 테마
    '송정 떡갈비거리': 'songjeong_ddeokgalbi_street.jpg',
    '1913 송정역시장': '1913_songjeong_station_market.jpg',
    '동명동 카페골목': 'dongmyeong_cafe_alley.jpg',
    '대인시장': 'daein_market.jpg',
    '시청 먹자골목': 'cityhall_food_street.jpg',
    '말바우시장': 'malbawoo_market.jpg',
    '광주 오리요리거리': 'gwangju_duck_street.jpg',
    '광주공원 포차거리': 'gwangju_park_pocha_street.jpg',
    '서플라이': 'supply.jpg',
    '송원식육식당': 'songwon_sikyuksikdang.jpg',
    '칠봉이짬뽕': 'chilbong_jjamppong.jpg',
    '장가계': 'jangga_gye.jpg',
    '미미원': 'mimiwon.jpg',
    '상무초밥 상무본점': 'sangmu_chobap.jpg',
    '청수민물장어': 'cheongsu_freshwater_eel.jpg',
    '농성화로본점': 'nongseong_hwaro.jpg',
    '그런느낌': 'geureon_neukkkeum.jpg',
    '보향미': 'bohyangmi.jpg',
    '하남꽃게장백반': 'hanam_kkotgejang_baekban.jpg',
    '갤러리24': 'gallery24.jpg',
    
    // 자연 테마
    '무등산': 'mudeungsan.jpg',
    '광주천': 'gwangjuriver.jpg',
    '중외공원': 'jungoe_park.jpg',
    '광주광역시 우치공원': 'woochi_park.jpg',
    '광주호 호수생태원': 'Gwangjuho_Lake_Eco_Park.jpg',
    '광주사직공원 전망타워': 'sajick_park.jpg',
    '전평제근린공원': 'jeonpyeongje_neighborhood_park.jpg',
    '운천저수지': 'uncheon_reservoir.jpg',
    '쌍암공원': 'ssangam_park.jpg',
    '조선대학교 장미원': 'chosun_rose_garden.jpg',
    '광주시립수목원': 'gwangju_arboretum.jpg',
    '지산유원지': 'jisan_resort.jpg',
    '광주시민의숲': 'citizen_forest.jpg',
    '빛고을농촌테마공원': 'rural_theme_park.jpg',
    '풍암호수': 'pungam_lake.jpg',
    '환벽당': 'hwanbyeokdang.jpg',
    '상무시민공원': 'sangmu_citizen_park.jpg',
    '광주공원': 'gwangju_park.jpg',
    '서석대': 'seoseokdae.jpg',
    '무등산국립공원': 'mudeung_mountain_national_park.jpg',
    
    // 체험 테마
    '광주기아챔피언스필드': 'kia_champions_field.jpg',
    '헬로애니멀광주점': 'hello_animal.jpg',
    '광주월드컵경기장': 'worldcup_stadium.jpg',
    '광주국제양궁장': 'archery_field.jpg',
    '아쿠아시티광주': 'aqua_city.jpg',
    '광주김치타운': 'kimchi_town.jpg',
    '광주실내빙상장': 'gwangju_indoor_ice_rink.jpg',
    '평촌도예공방': 'pyeongchon_pottery_studio.jpg',
    '무등산수박마을': 'mudeung_watermelon_village.jpg',
    '법무부 광주솔로몬로파크': 'solomon_park.jpg',
    '여행자의 집': 'traveler_house.jpg',
    '마한유적체험관': 'mahan_experience_museum.jpg',
    '송산목장': 'songsan_farm.jpg',
    '빛고을공예창작촌': 'craft_village.jpg',
    '충장로': 'chungjang_ro.jpg',
    '청춘발산마을': 'youth_village.jpg',
    '꿈브루어리': 'dream_brewery.jpg',
    '광주패밀리랜드': 'gwangju_family_land.jpg',
    '테라피 스파 소베': 'therapy_spa_sobe.jpg',
    '관덕정의 각궁': 'gwandukjeong_archery.jpg',

    // 숙박 테마
    '광주 아우라 비즈니스 호텔': 'aura_business_hotel.jpg',
    '탑클라우드호텔 광주점': 'topcloud_hotel.jpg',
    '한성 마드리드 광주호텔': 'madrid_hotel.jpg',
    '무등파크호텔': 'mudeung_park_hotel.jpg',
    '노블 스테이': 'noble_stay.jpg',
    '여로': 'yeoro_guesthouse.jpg',
    '홀리데이 인 광주 호텔': 'holiday_inn.jpg',
    '마스터스관광호텔': 'masters_hotel.jpg',
    '아리네 게스트하우스': 'arine_guesthouse.jpg',
    '라마다프라자 광주호텔': 'ramada_plaza.jpg',
    '센트럴관광호텔': 'central_hotel.jpg',
    '두바이호텔': 'dubai_hotel.jpg',
    '다솜채': 'dasomchae.jpg',
    '호텔더스팟': 'hotel_the_spot.jpg',
    '호텔 5월': 'hotel_may.jpg',
    '금수장관광호텔': 'geumsujang_hotel.jpg',
    '유탑부티크호텔앤레지던스': 'utop_boutique_hotel_residence.jpg',
    '이끌림 비지니스호텔 하남': 'ikkullim_business_hotel_hanam.jpg',
    '라마다플라자 충장호텔': 'ramada_plaza_chungjang_hotel.jpg',
    '볼튼호텔': 'bolton_hotel.jpg',
    
    // 근교 테마
    '죽녹원': 'juknokwon_bamboo_garden.jpg',
    '메타세쿼이아 가로수길': 'metasequoia_avenue.jpg',
    '송강정': 'songgangjeong_pavilion.jpg',
    '쌍교숯불갈비 담양 본점': 'ssanggyo_charcoal_galbi_damyang.jpg',
    '중흥골드스파&리조트': 'joongheung_gold_spa_resort.jpg',
    '국립나주박물관': 'national_naju_museum.jpg',
    '나주곰탕노안집': 'naju_gomtang_noan_jip.jpg',
    '빛가람 호수공원': 'bitgaram_lake_park.jpg',
    '도곡온천단지': 'dogok_onsen_complex.jpg',
    '화순 고인돌군 유적': 'hwasun_dolmen_site.jpg',
    '운주사': 'unjusa_temple.jpg',
    '만연폭포': 'manyeon_waterfall.jpg',
    '황룡강 생태공원': 'hwangryong_river_eco_park.jpg',
    '백양사': 'baegyangsa_temple.jpg',
    '장성호수변공원': 'jangseong_lakeside_park.jpg',
    '오피먼트': 'opiument_complex.jpg',
    '함평엑스포공원': 'hampyeong_expo_park.jpg',
    '돌머리해수욕장': 'dolmeori_beach.jpg',
    '용천사': 'yongcheonsa_temple.jpg',
    '화랑식당': 'hwarang_restaurant.jpg',
    '호남대학교': 'honamuniv.jpg'
  };
  
  // 관광지명으로 이미지 파일 찾기
  const imageFileName = imageMapping[spotName];
  
  if (imageFileName) {
    const imageUrl = `/images/${imageFileName}`;
    console.log('✅ 로컬 이미지 사용:', spotName, '→', imageUrl);
    return imageUrl;
  }
  
  // 매핑되지 않은 경우 기본 이미지 사용
  console.log('⚠️ 매핑되지 않은 관광지:', spotName, '→ 기본 이미지 사용');
  return `/images/mudeungsan.jpg`; // 기본 이미지
};

export default function App() {
  // 상태 관리
  const [showSplash, setShowSplash] = useState(true);
  const [themes, setThemes] = useState([]);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false); // 데이터 로딩 완료 상태
  // 인증 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // 페이지별 스크롤 위치 저장을 위한 ref
  const scrollPositions = useRef({});
  const pageContainerRef = useRef(null);
  const sentinelRef = useRef(null);
  
  // 페이지 전환 시 현재 스크롤 위치 저장하고 새 페이지로 이동하는 함수
  const navigateToPage = (page, tourId = null) => {
    // 현재 페이지의 스크롤 위치 저장 (.content의 스크롤 위치)
    const currentContent = document.querySelector('.content');
    if (currentContent) {
      scrollPositions.current[currentPage] = currentContent.scrollTop;
      console.log(`📍 페이지 '${currentPage}' 스크롤 위치 저장:`, currentContent.scrollTop);
    }
    
    // 새 페이지로 이동
    setCurrentPage(page);
    if (tourId) {
      setSelectedTourId(tourId);
    }
    
    // 페이지 전환 시 저장된 스크롤 위치 복원
    setTimeout(() => {
      const newContent = document.querySelector('.content');
      if (newContent) {
        const savedScrollPosition = scrollPositions.current[page] || 0;
        newContent.scrollTop = savedScrollPosition;
        console.log(`📍 페이지 '${page}' 스크롤 위치 복원:`, savedScrollPosition);
      }
    }, 50);
  };

  // 검색 관련 함수들
  const handleSearchClick = () => {
    setSearchModalVisible(true);
  };

  const handleSearchClose = () => {
    setSearchModalVisible(false);
  };

  const handleSpotSelect = (spot) => {
    setSelectedSpot(spot);
    setModalVisible(true);
    setSearchModalVisible(false);
  };

  // 하단 네비게이션 바 토글 기능 제거
  const [selectedSpot, setSelectedSpot] = useState(null); // 선택된 관광지
  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 여부
  const [showImageModal, setShowImageModal] = useState(false); // 이미지 확대 모달
  const [selectedImage, setSelectedImage] = useState(''); // 선택된 이미지 URL
  const [selectedSpots, setSelectedSpots] = useState([]); // 선택된 관광지들 (루트용)
  const [routes, setRoutes] = useState([]); // 저장된 루트들
  const [routeNameModalVisible, setRouteNameModalVisible] = useState(false); // 루트 이름 입력 모달
  const [newRouteName, setNewRouteName] = useState(''); // 새 루트 이름
  const [isSaving, setIsSaving] = useState(false); // 루트 저장 중 상태
  const [selectedTransportMode, setSelectedTransportMode] = useState('auto'); // 이동 수단 선택 (auto, walking, bike, car)
  const [currentRouteDistance, setCurrentRouteDistance] = useState(0); // 현재 루트의 총 거리
  const [currentPage, setCurrentPage] = useState('home'); // 현재 페이지 (home, spots, map, profile)
  const [selectedTourId, setSelectedTourId] = useState(null); // 선택된 투어 ID
  const [isMobile, setIsMobile] = useState(false); // 모바일 여부
  const [editingRoute, setEditingRoute] = useState(null); // 편집 중인 루트
  const [editingSpots, setEditingSpots] = useState([]); // 편집 중인 루트의 관광지들
  const [editRouteNameModalVisible, setEditRouteNameModalVisible] = useState(false); // 루트 이름 편집 모달
  const [editingRouteName, setEditingRouteName] = useState(''); // 편집 중인 루트 이름
  const [selectedRouteForMap, setSelectedRouteForMap] = useState(null); // 지도에 표시할 루트
  const [addSpotSearch, setAddSpotSearch] = useState(''); // 관광지 추가 검색 입력
  const [aiRecommendations, setAiRecommendations] = useState([]); // 추천 루트들
  const [aiAnalysis, setAiAnalysis] = useState(null); // 분석 정보
  const [realRouteDistance, setRealRouteDistance] = useState(null); // 실제 도로 거리
  const [sidebarVisible, setSidebarVisible] = useState(false); // 사이드바 표시 상태
  const [searchModalVisible, setSearchModalVisible] = useState(false); // 검색 모달 표시 상태
  const [selectedTheme, setSelectedTheme] = useState('all'); // 선택된 테마 (all = 전체, theme_id = 특정 테마)
  const [toast, setToast] = useState(null); // Toast 알림 상태

  // Toast 알림 표시 함수
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Toast 닫기 함수
  const closeToast = () => {
    setToast(null);
  };

  // API 호출 함수
  const fetchThemes = async () => {
    // 이미 데이터가 로드되었으면 중복 호출 방지
    if (dataLoaded) {
      console.log('🎨 데이터가 이미 로드됨, 중복 호출 방지');
      return;
    }
    
    try {
      console.log('🎨 테마 데이터 로딩 시작...');
      const response = await fetch('/api/themes', { credentials: 'include' });
      const data = await response.json();
      if (data.themes) {
        setThemes(data.themes);
      }
    } catch (err) {
      console.error('테마 데이터 가져오기 실패:', err);
      setError('테마 데이터를 불러올 수 없습니다.');
    }
  };

  const fetchSpots = async () => {
    // 이미 데이터가 로드되었으면 중복 호출 방지
    if (dataLoaded) {
      console.log('🔍 데이터가 이미 로드됨, 중복 호출 방지');
      return;
    }
    
    try {
      console.log('🔍 관광지 데이터 로딩 시작...');
      const response = await fetch('/api/spots', { credentials: 'include' });
      const data = await response.json();
      if (data.spots) {
        console.log('🔍 실제 관광지 데이터:', data.spots.map(spot => ({ name: spot.name, theme_id: spot.theme_id })));
        setSpots(data.spots);
      }
    } catch (err) {
      console.error('관광지 데이터 가져오기 실패:', err);
      setError('관광지 데이터를 불러올 수 없습니다.');
    }
  };

  // 이미지 클릭 핸들러
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  // 이미지 모달 닫기
  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImage('');
  };

  // 스플래시 화면 8초 후 배너 페이지로 이동
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setCurrentPage('banner');
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  // 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      if (!dataLoaded) {
        console.log('🚀 초기 데이터 로딩 시작...');
      await Promise.all([fetchThemes(), fetchSpots()]);
        setDataLoaded(true);
        console.log('✅ 모든 데이터 로딩 완료!');
      }
    };
    loadData();
  }, [dataLoaded]);

  // 서버의 내 루트 로드
  const fetchServerRoutes = async () => {
    try {
      const response = await fetch('/api/routes', { credentials: 'include' });
      if (response.status === 401) {
        setIsLoggedIn(false);
        setCurrentUser(null);
        return;
      }
      const data = await response.json();
      console.log('🔍 /api/routes 응답:', data);
      
      if (data.routes) {
        console.log('🔍 루트 목록 개수:', data.routes.length);
        // 각 루트의 상세(관광지들)까지 함께 불러와서 저장
        const detailedRoutes = await Promise.all(
          data.routes.map(async (r) => {
            try {
              console.log(`🔍 루트 ${r.id} 상세 조회 시작: ${r.name}`);
              const detailRes = await fetch(`/api/routes/${r.id}`, { credentials: 'include' });
              const detail = await detailRes.json();
              console.log(`🔍 루트 ${r.id} 상세 응답:`, detail);
              
              if (detail && detail.spots) {
                console.log(`🔍 루트 ${r.id} (${r.name}) 관광지 개수: ${detail.spots.length}`);
                console.log(`🔍 루트 ${r.id} 관광지 목록:`, detail.spots.map(s => ({ id: s.id, name: s.name })));
                
                // 중복 제거: 서버에서 받은 데이터에도 중복이 있을 수 있으므로
                const uniqueSpots = [...new Map(detail.spots.map(spot => [spot.id, spot])).values()];
                if (uniqueSpots.length !== detail.spots.length) {
                  console.warn(`⚠️ 루트 ${r.id}에서 중복 관광지 발견! 원본: ${detail.spots.length}, 중복제거후: ${uniqueSpots.length}`);
                }
                
                return {
                  id: r.id,
                  name: r.name,
                  spots: uniqueSpots, // 중복 제거된 목록 사용
                  created_at: r.created_at
                };
              }
            } catch (e) {
              console.error(`❌ 루트 ${r.id} 상세 조회 실패:`, e);
            }
            return { id: r.id, name: r.name, spots: [], created_at: r.created_at };
          })
        );
        
        console.log('🔍 최종 detailedRoutes:', detailedRoutes);
        console.log('🔍 각 루트별 관광지 개수:', detailedRoutes.map(r => ({ id: r.id, name: r.name, count: r.spots.length })));
        
        setRoutes(detailedRoutes);
      }
    } catch (e) {
      console.error('서버 루트 불러오기 실패:', e);
    }
  };

  // 3-1. 스탬프 상태 조회 API
  const fetchStampStatus = async (routeId) => {
    if (!currentUser) {
      console.warn('로그인한 사용자 없음, 스탬프 상태 조회 생략');
      return null;
    }

    try {
      const response = await fetch(
        `/api/stamps/status?route_id=${routeId}&user_id=${currentUser.id}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        console.error('스탬프 상태 조회 실패:', response.status);
        return null;
      }

      const data = await response.json();
      return data; // 예: { collected_count: 2, total_count: 5, is_completed: false } 이런 형식이라고 가정
    } catch (error) {
      console.error('스탬프 상태 조회 중 에러:', error);
      return null;
    }
  };

  // 3-1. 스탬프 찍기(체크인) API
  const checkinStamp = async ({ routeId, spotId, userLat = null, userLng = null }) => {
    if (!currentUser) {
      alert('스탬프를 찍으려면 로그인이 필요합니다.');
      return null;
    }

    try {
      const response = await fetch('/api/stamps/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user_id: currentUser.id,
          route_id: routeId,
          spot_id: spotId,
          user_lat: userLat,
          user_lng: userLng,
        }),
      });

      if (response.status === 401) {
        // 토큰 만료 등
        setIsLoggedIn(false);
        setCurrentUser(null);
        console.warn('로그인 만료됨');
        return null;
      }

      if (!response.ok) {
        console.error('스탬프 체크인 실패:', response.status);
        return null;
      }

      const data = await response.json();
      return data; // 예: { success: true } 라고 가정
    } catch (error) {
      console.error('스탬프 체크인 중 에러:', error);
      return null;
    }
  };


  // 추천 루트 가져오기
  const fetchAIRecommendations = async () => {
    if (!isLoggedIn) return;
    
    try {
      const response = await fetch('/api/ai/recommendations/routes', { 
        credentials: 'include' 
      });
      const data = await response.json();
      
              if (data.error) {
          console.log('추천 오류:', data.error);
        setAiRecommendations([]);
        setAiAnalysis(null);
      } else {
        setAiRecommendations(data.recommended_routes || []);
        setAiAnalysis(data.analysis || null);
      }
          } catch (err) {
        console.error('추천 가져오기 실패:', err);
      setAiRecommendations([]);
      setAiAnalysis(null);
    }
  };

  // 회원가입 / 로그인 / 로그아웃
  const registerUser = async (email, password, username, setErrorCallback) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, username })
      });
      const data = await response.json();
      if (data.error) {
        // 사용자 친화적인 에러 메시지로 변경
        let userFriendlyMessage = data.error;
        
        // 중복 사용자명 에러
        if (data.error.includes('username') && data.error.includes('중복')) {
          userFriendlyMessage = '이미 사용 중인 사용자명입니다. 다른 사용자명을 입력해주세요.';
        }
        // 중복 이메일 에러
        else if (data.error.includes('email') && data.error.includes('중복')) {
          userFriendlyMessage = '이미 사용 중인 이메일입니다. 다른 이메일을 입력해주세요.';
        }
        // 기타 에러는 간단하게 처리
        else if (data.error.includes('UniqueViolation') || data.error.includes('중복')) {
          userFriendlyMessage = '이미 사용 중인 정보입니다. 다른 정보를 입력해주세요.';
        }
        // 서버 에러
        else if (data.error.includes('서버')) {
          userFriendlyMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
        
        if (setErrorCallback) setErrorCallback(userFriendlyMessage);
        return false;
      }
      // 회원가입 성공 메시지
      if (setErrorCallback) setErrorCallback('회원가입이 완료되었습니다. 로그인해주세요.');
      return true;
    } catch (e) {
      if (setErrorCallback) setErrorCallback('회원가입에 실패했습니다.');
      return false;
    }
  };

  const loginUser = async (email, password, setErrorCallback) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.error) {
        if (setErrorCallback) setErrorCallback(data.error);
        setIsLoggedIn(false);
        setCurrentUser(null);
        return false;
      }
      setIsLoggedIn(true);
      setCurrentUser({ id: data.user_id, username: data.username, email });
      if (setErrorCallback) setErrorCallback('');
      // 로그인 후 홈화면으로 이동
      setCurrentPage('home');
      // 로그인 후 내 루트와 추천 불러오기
      fetchServerRoutes();
      fetchAIRecommendations();
      return true;
    } catch (e) {
      if (setErrorCallback) setErrorCallback('로그인에 실패했습니다.');
      return false;
    }
  };

  const loginWithGoogle = async (idToken, setErrorCallback) => {
    try {
      console.log('🔵 Google 로그인 API 호출 시작...');
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id_token: idToken })
      });
      console.log('🔵 Google 로그인 API 응답 상태:', response.status);
      const data = await response.json();
      console.log('🔵 Google 로그인 API 응답 데이터:', data);
      if (data.error) {
        console.error('❌ Google 로그인 오류:', data.error);
        if (setErrorCallback) setErrorCallback(data.error);
        setIsLoggedIn(false);
        setCurrentUser(null);
        return false;
      }
      console.log('✅ Google 로그인 성공!');
      setIsLoggedIn(true);
      setCurrentUser({ id: data.user_id, username: data.username, email: data.email || '' });
      if (setErrorCallback) setErrorCallback('');
      // 로그인 후 홈화면으로 이동
      setCurrentPage('home');
      // 로그인 후 내 루트와 추천 불러오기
      fetchServerRoutes();
      fetchAIRecommendations();
      return true;
    } catch (e) {
      console.error('❌ Google 로그인 예외 발생:', e);
      if (setErrorCallback) setErrorCallback('Google 로그인에 실패했습니다.');
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      // ignore
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
    setRoutes([]);
  };

  const deleteAccount = async () => {
    if (!window.confirm('정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }
    
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        showToast('회원 탈퇴가 완료되었습니다.', 'success');
        setIsLoggedIn(false);
        setCurrentUser(null);
        setRoutes([]);
        navigateToPage('home');
      } else {
        const data = await response.json();
        showToast(data.message || '회원 탈퇴에 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('회원 탈퇴 오류:', error);
      showToast('회원 탈퇴 중 오류가 발생했습니다.', 'error');
    }
  };

  // 디버깅용 useEffect 추가
  useEffect(() => {
    if (selectedSpot) {
      console.log('🔍 selectedSpot 변경됨:', selectedSpot);
      console.log('🔍 image_url:', selectedSpot.image_url);
      console.log('🖼️ getSpotImage 결과:', getSpotImage(selectedSpot.image_url, selectedSpot.id, selectedSpot.theme_id, selectedSpot.name));
    }
  }, [selectedSpot]);

  // 선택된 관광지가 변경될 때마다 거리 계산
  useEffect(() => {
    if (selectedSpots.length >= 1) {
      const distance = calculateRouteDistance(selectedSpots);
      setCurrentRouteDistance(distance);
    } else {
      setCurrentRouteDistance(0);
    }
  }, [selectedSpots]);

  // 루트 이름 입력 모달이 열릴 때 selectedSpots 확인
  useEffect(() => {
    if (routeNameModalVisible) {
      console.log('🔍 루트 이름 입력 모달 열림, 현재 selectedSpots:', selectedSpots);
      console.log('🔍 관광지 개수:', selectedSpots.length);
      console.log('🔍 관광지 목록:', selectedSpots.map(s => ({ id: s.id, name: s.name })));
    }
  }, [routeNameModalVisible, selectedSpots]);

  // 테마별로 관광지 그룹화
  const spotsByTheme = themes.map(theme => ({
    theme: theme,
    spots: spots.filter(spot => spot.theme_id === theme.id)
  }));

  // 선택된 테마에 따른 필터링된 데이터
  const filteredSpotsByTheme = selectedTheme === 'all' 
    ? spotsByTheme 
    : spotsByTheme.filter(({theme}) => theme.id.toString() === selectedTheme);


  // 루트 관련 함수들
  const addSpotToRoute = (spot) => {
    if (!isLoggedIn) {
      showToast('루트에 관광지를 추가하려면 로그인해 주세요.', 'info');
      navigateToPage('profile'); // 프로필 페이지로 이동하여 로그인 유도
      return;
    }
    
    // 함수형 업데이트를 사용하여 항상 최신 상태를 확인하고 중복 체크
    setSelectedSpots(prevSpots => {
      // 중복 체크: 같은 ID가 이미 있으면 추가하지 않음
      if (prevSpots.some(s => s.id === spot.id)) {
        console.log('⚠️ 이미 추가된 관광지:', spot.name);
        return prevSpots; // 이미 있으면 변경하지 않음
      }
      
      console.log('✅ 관광지 추가:', spot.name, '현재 개수:', prevSpots.length + 1);
      return [...prevSpots, spot];
    });
  };

  const removeSpotFromRoute = (index) => {
    setSelectedSpots(prevSpots => {
      const removed = prevSpots.filter((_, i) => i !== index);
      console.log('🗑️ 관광지 제거, 남은 개수:', removed.length);
      return removed;
    });
  };

  // 간단한 직선 거리 계산 함수
  const calculateSimpleDistance = async (spots) => {
    try {
      const response = await fetch('/api/calculate-simple-distance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          spots: spots.map(spot => ({
            name: spot.name,
            latitude: spot.latitude,
            longitude: spot.longitude
          }))
        })
      });
      
      const data = await response.json();
      if (data.error) {
        console.warn('실제 거리 계산 실패, 직선 거리 사용:', data.error);
        return calculateRouteDistance(spots);
      }
      
      return data.total_distance_km;
    } catch (error) {
      console.warn('실제 거리 계산 API 호출 실패, 직선 거리 사용:', error);
      return calculateRouteDistance(spots);
    }
  };

  const saveRoute = async () => {
    if (selectedSpots.length > 0 && newRouteName.trim() && !isSaving) {
      setIsSaving(true); // 저장 시작
      try {
        // 디버깅: 저장 전 selectedSpots 확인
        console.log('🔍 루트 저장 전 selectedSpots:', selectedSpots);
        console.log('🔍 저장할 관광지 ID:', selectedSpots.map(s => s.id));
        console.log('🔍 저장할 관광지 개수:', selectedSpots.length);
        
        // 중복 제거 (같은 ID가 여러 개 있는 경우)
        const uniqueSpots = [...new Map(selectedSpots.map(spot => [spot.id, spot])).values()];
        if (uniqueSpots.length !== selectedSpots.length) {
          console.warn('⚠️ 중복된 관광지 발견! 중복 제거 중...', {
            원본: selectedSpots.length,
            중복제거후: uniqueSpots.length
          });
          // 중복 제거된 목록으로 상태 업데이트
          setSelectedSpots(uniqueSpots);
        }
        
        // 중복 제거된 목록 사용
        const spotsToSave = uniqueSpots.map(s => s.id);
        console.log('🔍 실제로 서버에 전송할 spots (중복 제거 후):', spotsToSave);
        console.log('🔍 저장할 관광지 개수 (중복 제거 후):', spotsToSave.length);
        
        // 간단한 직선 거리 계산 (중복 제거된 목록 사용)
        const simpleDistance = await calculateSimpleDistance(uniqueSpots);
        const estimatedTime = calculateRouteTime(simpleDistance, selectedTransportMode);
        
        // 서버에 전송할 데이터 로그
        const requestData = {
          name: newRouteName,
          description: '',
          estimated_time: estimatedTime,
          total_distance: simpleDistance,
          spots: spotsToSave
        };
        console.log('🔍 서버에 전송할 루트 데이터:', requestData);
        console.log('🔍 spots 배열 상세:', spotsToSave);
        console.log('🔍 spots 배열 길이:', spotsToSave.length);
        console.log('🔍 spots 배열 중복 체크:', new Set(spotsToSave).size === spotsToSave.length ? '중복 없음' : `중복 발견! (고유값: ${new Set(spotsToSave).size}개)`);
        
        const response = await fetch('/api/routes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(requestData)
        });
        const data = await response.json();
        if (data.error) {
          showToast(`루트 저장 실패: ${data.error}`, 'error');
          setIsSaving(false); // 저장 실패 시 상태 초기화
          return;
        }
        
        console.log('✅ 루트 저장 성공, 서버 응답:', data);
        
        // 저장 성공 시 서버 루트 목록 갱신
        await fetchServerRoutes();
        
        // 상태 초기화 (저장 성공 후)
        setSelectedSpots([]);
        setNewRouteName('');
        setSelectedTransportMode('auto'); // 이동 수단 선택 초기화
        setRouteNameModalVisible(false);
        
        console.log('✅ selectedSpots 초기화 완료');
        
        showToast(`루트가 저장되었습니다! (총 거리: ${simpleDistance.toFixed(2)}km)`, 'success');
      } catch (e) {
        showToast('루트 저장 중 오류가 발생했습니다.', 'error');
      } finally {
        setIsSaving(false); // 저장 완료 후 상태 초기화
      }
    }
  };

  // 루트 편집 관련 함수들
  const startEditing = (route) => {
    setEditingRoute(route);
    setEditingSpots([...route.spots]);
    setEditingRouteName(route.name);
  };

  const cancelEditing = () => {
    setEditingRoute(null);
    setEditingSpots([]);
    setEditingRouteName('');
  };

  const saveEditing = async () => {
    if (editingRoute && editingSpots.length > 0 && editingRouteName.trim()) {
      try {
        // 백엔드에 루트 수정 요청
        const response = await fetch(`/api/routes/${editingRoute.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            name: editingRouteName,
            description: editingRoute.description || '',
            spots: editingSpots.map(s => s.id)
          })
        });

        if (response.ok) {
          // 로컬 상태 즉시 업데이트 (Optimistic Update)
      const updatedRoutes = routes.map(route => 
        route.id === editingRoute.id 
          ? { ...route, name: editingRouteName, spots: [...editingSpots] }
          : route
      );
      setRoutes(updatedRoutes);

          // 지도페이지에서 편집 중인 루트가 표시되고 있다면 업데이트
          if (selectedRouteForMap && selectedRouteForMap.id === editingRoute.id) {
            const updatedRouteForMap = updatedRoutes.find(route => route.id === editingRoute.id);
            setSelectedRouteForMap(updatedRouteForMap);
          }

          // 편집 모드 종료
      setEditingRoute(null);
      setEditingSpots([]);
          setEditingRouteName('');
          setEditRouteNameModalVisible(false);
          
          showToast('루트가 성공적으로 수정되었습니다!', 'success');
          
          // 프로필 통계 업데이트 (방문한 관광지 개수 재계산)
          // ProfilePage에서 자체적으로 fetchProfile을 호출하므로 여기서는 알림만
        } else {
          throw new Error('루트 수정 실패');
        }
      } catch (error) {
        console.error('루트 수정 오류:', error);
        showToast('루트 수정 중 오류가 발생했습니다.', 'error');
        // 실패 시 서버에서 최신 데이터 다시 가져오기
        fetchServerRoutes();
      }
    }
  };

  const moveSpotUp = (index) => {
    if (index > 0) {
      const newSpots = [...editingSpots];
      [newSpots[index], newSpots[index - 1]] = [newSpots[index - 1], newSpots[index]];
      setEditingSpots(newSpots);
    }
  };

  const moveSpotDown = (index) => {
    if (index < editingSpots.length - 1) {
      const newSpots = [...editingSpots];
      [newSpots[index], newSpots[index + 1]] = [newSpots[index + 1], newSpots[index]];
      setEditingSpots(newSpots);
    }
  };

  const removeSpotFromEditing = (index) => {
    setEditingSpots(editingSpots.filter((_, i) => i !== index));
  };

  const addSpotToEditing = (spot) => {
    if (!editingSpots.find(s => s.id === spot.id)) {
      setEditingSpots([...editingSpots, spot]);
    }
  };

  // 지도 관련 함수들
  const viewRouteOnMap = (route) => {
    console.log('🔍 viewRouteOnMap 호출됨');
    console.log('🔍 전달받은 route:', route);
    console.log('🔍 route.spots:', route.spots);
    console.log('🔍 route.spots 개수:', route.spots ? route.spots.length : 0);
    if (route.spots) {
      console.log('🔍 route.spots 상세:', route.spots.map(s => ({ id: s.id, name: s.name })));
      // 중복 체크
      const spotIds = route.spots.map(s => s.id);
      const uniqueIds = [...new Set(spotIds)];
      if (spotIds.length !== uniqueIds.length) {
        console.warn(`⚠️ viewRouteOnMap - 중복 관광지 발견! 원본: ${spotIds.length}, 중복제거후: ${uniqueIds.length}`);
        console.warn('⚠️ 중복된 spot_id:', spotIds.filter((id, index) => spotIds.indexOf(id) !== index));
        // 중복 제거 후 설정
        const uniqueSpots = [...new Map(route.spots.map(spot => [spot.id, spot])).values()];
        route = { ...route, spots: uniqueSpots };
        console.log('🔍 중복 제거 후 route:', route);
      }
    }
    setSelectedRouteForMap(route);
    navigateToPage('map');
  };

  // AI 추천 루트를 지도에서 보기
  const viewAIRecommendationOnMap = (route) => {
    setSelectedRouteForMap(route);
    navigateToPage('map');
  };

  // 추천 루트를 실제로 저장
  const saveAIRecommendationRoute = async (routeName, spots) => {
    try {
      // 먼저 중복 체크
      const checkResponse = await fetch('/api/routes/check-duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: routeName,
          spots: spots.map(s => s.id)
        })
      });
      const checkData = await checkResponse.json();
      
      if (checkData.error) {
        showToast(`중복 체크 실패: ${checkData.error}`, 'error');
        return false;
      }
      
      if (checkData.is_duplicate) {
        showToast(`루트 저장 실패: ${checkData.reason}`, 'error');
        return false;
      }
      
      // 중복이 없으면 저장 진행
      const totalDistance = calculateRouteDistance(spots);
      const estimatedTime = calculateRouteTime(totalDistance);
      const response = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
                  body: JSON.stringify({
            name: routeName,
            description: '추천 루트',
          estimated_time: estimatedTime,
          total_distance: totalDistance,
          spots: spots.map(s => s.id)
        })
      });
      const data = await response.json();
      if (data.error) {
        showToast(`루트 저장 실패: ${data.error}`, 'error');
        return false;
      }
      // 저장 성공 시 서버 루트 목록 갱신
      await fetchServerRoutes();
      showToast('루트가 저장되었습니다!', 'success');
      return true;
    } catch (e) {
      showToast('루트 저장 중 오류가 발생했습니다.', 'error');
      return false;
    }
  };

  // 루트 삭제 후 지도 페이지 routes 업데이트
  const handleRouteDelete = async (routeId) => {
    // 즉시 UI에서 루트 제거 (낙관적 업데이트)
    setRoutes(prevRoutes => prevRoutes.filter(route => route.id !== routeId));
    
    // 삭제된 루트가 현재 지도에 표시되고 있다면 지도 초기화
    if (selectedRouteForMap && selectedRouteForMap.id === routeId) {
      setSelectedRouteForMap(null);
      if (mapRef.current) {
        mapRef.current.clearMap();
      }
    }
    
    try {
      let response = await fetch(`/api/routes/${routeId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      // DELETE가 안되면 POST로 시도
      if (response.status === 405) {
        response = await fetch(`/api/routes/${routeId}/delete`, {
          method: 'POST',
          credentials: 'include'
        });
      }

      const data = await response.json();
      
      if (data.error) {
        // 삭제 실패 시 원래 상태로 복원
        await fetchServerRoutes();
        showToast('루트 삭제 실패: ' + data.error, 'error');
        return false;
      } else {
        // 삭제 성공 시 서버 루트 목록 갱신 (지도 페이지 routes도 업데이트됨)
        await fetchServerRoutes();
        showToast('루트가 삭제되었습니다.', 'success');
        return true;
      }
    } catch (err) {
      // 삭제 실패 시 원래 상태로 복원
      await fetchServerRoutes();
      console.error('루트 삭제 실패:', err);
      showToast('루트 삭제 중 오류가 발생했습니다.', 'error');
      return false;
    }
  };

  const handleRouteUpdate = (updatedRoute) => {
    // 루트 수정 시 routes 상태 즉시 업데이트
    setRoutes(prevRoutes => 
      prevRoutes.map(route => 
        route.id === updatedRoute.id ? updatedRoute : route
      )
    );
    
    // 지도페이지에서 수정된 루트가 표시되고 있다면 업데이트
    if (selectedRouteForMap && selectedRouteForMap.id === updatedRoute.id) {
      setSelectedRouteForMap(updatedRoute);
    }
  };

  const handleProfileUpdate = () => {
    // 프로필 통계 업데이트를 위한 콜백 (ProfilePage에서 호출)
    // 현재는 ProfilePage에서 자체적으로 fetchProfile을 호출하므로 빈 함수
  };

  const mapRef = useRef(null);

  const clearMapRoute = () => {
    setSelectedRouteForMap(null);
    // 지도 초기화
    if (mapRef.current) {
      mapRef.current.clearMap();
    }
  };

  const calculateRouteDistance = (spots) => {
    if (spots.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 0; i < spots.length - 1; i++) {
      const spot1 = spots[i];
      const spot2 = spots[i + 1];
      
      if (spot1.latitude && spot1.longitude && spot2.latitude && spot2.longitude) {
        const distance = calculateDistance(
          spot1.latitude, spot1.longitude,
          spot2.latitude, spot2.longitude
        );
        totalDistance += distance;
      }
    }
    return totalDistance;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateRouteTime = (distance, transportMode = null) => {
    let speed, mode;
    
    // 이동 수단이 지정되지 않았거나 'auto'인 경우 거리 기반 자동 선택
    if (!transportMode || transportMode === 'auto') {
      if (distance <= 5) {
        speed = 4;
        mode = '도보';
      } else if (distance <= 15) {
        speed = 15;
        mode = '자전거';
      } else {
        speed = 40;
        mode = '자동차';
      }
    } else {
      // 사용자가 직접 선택한 이동 수단 사용
      switch (transportMode) {
        case 'walking':
          speed = 4;
          mode = '도보';
          break;
        case 'bike':
          speed = 15;
          mode = '자전거';
          break;
        case 'car':
          speed = 40;
          mode = '자동차';
          break;
        default:
          speed = 4;
          mode = '도보';
      }
    }
    
    const timeInHours = distance / speed;
    const hours = Math.floor(timeInHours);
    const minutes = Math.round((timeInHours - hours) * 60);
    
    let timeString;
    if (hours === 0) timeString = `${minutes}분`;
    else if (minutes === 0) timeString = `${hours}시간`;
    else timeString = `${hours}시간 ${minutes}분`;
    
    return `${timeString} (${mode})`;
  };


  // 에러 상태 표시
  if (error) {
    return (
      <div className="error-container">
        <div className="error-text">{error}</div>
        <button className="retry-button" onClick={() => window.location.reload()}>
          다시 시도
        </button>
      </div>
    );
  }

  // 스플래시 화면 렌더링
  if (showSplash) {
  return (
      <div className="splash-screen">
        <div className="splash-content">
          <img src="/splash/splash_1.gif" alt="광주관광 스플래시" className="splash-gif" />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* 공통 헤더 */}
          <CommonHeader 
            onNavigateToHome={() => navigateToPage('home')}
            onMenuClick={() => setSidebarVisible(true)}
            onBackClick={() => navigateToPage('home')}
            onSearchClick={handleSearchClick}
          />

      {/* 메인 콘텐츠 */}
      <div className="main-content">
      {currentPage === 'home' ? (
        <div className="page-container">
          <div className="content">
            <HomeScreen onNavigateToPage={navigateToPage} isLoggedIn={isLoggedIn} showToast={showToast} />
          </div>
        </div>
      ) : currentPage === "stamp-tour" ? (   // [추가] 스탬프 투어 페이지
        <StampTourPage
          onNavigateToHome={() => setCurrentPage("home")}
        />  
      ) : currentPage === 'banner' ? (
        <BannerPage onNavigateToHome={() => navigateToPage('home')} />
      ) : currentPage === 'tours' ? (
        <div className="page-container">
          <div className="content">
            <TourSelectionPage 
              onNavigateToHome={() => navigateToPage('home')}
              onNavigateToPage={navigateToPage}
            />
          </div>
        </div>
      ) : currentPage === 'tour-detail' ? (
        <div className="page-container">
          <div className="content">
            <TourDetailPage 
              tourId={selectedTourId}
              onNavigateToPage={navigateToPage}
            />
          </div>
        </div>
      ) : currentPage === 'profile' ? (
        <div className="page-container">
          <div className={`content ${isLoggedIn ? 'profile-page' : 'auth-page'}`}>
            {isLoggedIn ? (
        <ProfilePage 
                onBack={null} 
                onNavigateToHome={() => navigateToPage('home')}
          spots={spots}
          themes={themes}
          isLoggedIn={isLoggedIn}
          routes={routes}
          onLogin={loginUser}
          onLogout={logoutUser}
          onRegister={registerUser}
          onNavigateToMap={viewAIRecommendationOnMap}
          aiRecommendations={aiRecommendations}
          aiAnalysis={aiAnalysis}
          onRefreshAI={fetchAIRecommendations}
          onAddToRoute={addSpotToRoute}
          onSaveRoute={saveAIRecommendationRoute}
          onDeleteRoute={handleRouteDelete}
                onRouteUpdate={handleRouteUpdate}
                onProfileUpdate={handleProfileUpdate}
                editingRoute={editingRoute}
                setEditingRoute={setEditingRoute}
                editingSpots={editingSpots}
                setEditingSpots={setEditingSpots}
                editingRouteName={editingRouteName}
                setEditingRouteName={setEditingRouteName}
                editRouteNameModalVisible={editRouteNameModalVisible}
                setEditRouteNameModalVisible={setEditRouteNameModalVisible}
                addSpotSearch={addSpotSearch}
                setAddSpotSearch={setAddSpotSearch}
                onSaveEditing={saveEditing}
                onCancelEditing={cancelEditing}
                onAddSpotToEditing={addSpotToEditing}
                onRemoveSpotFromEditing={removeSpotFromEditing}
                getThemeNameById={getThemeNameById}
                getSpotIcon={getSpotIcon}
                calculateRouteTime={calculateRouteTime}
                calculateRouteDistance={calculateRouteDistance}
                showToast={showToast}
              />
            ) : (
              <AuthPage 
                onLogin={loginUser}
                onRegister={registerUser}
                onGoogleLogin={loginWithGoogle}
                onBack={() => navigateToPage('home')}
              />
            )}
              </div>
              </div>
      ) : currentPage === 'survey' ? (
        <SurveyPage onNavigateToPage={navigateToPage} />
      ) : currentPage === 'admin' ? (
        <AdminDashboard onNavigateToPage={navigateToPage} />
      ) : currentPage === 'settings' ? (
        <div className="page-container">
        <div className="content">
          <div className="section">
              <h2 className="section-title">환경설정</h2>
              <div className="settings-section">
                <h3>알림 설정</h3>
                <div className="setting-item">
                  <span>푸시 알림</span>
                  <input type="checkbox" defaultChecked />
              </div>
                <div className="setting-item">
                  <span>이메일 알림</span>
                  <input type="checkbox" />
              </div>
            </div>
              <div className="settings-section">
                <h3>일반 설정</h3>
                <div className="setting-item">
                  <span>언어</span>
                  <select>
                    <option>한국어</option>
                  </select>
          </div>
                <div className="setting-item">
                  <span>테마</span>
                  <select>
                    <option>라이트 모드</option>
                  </select>
                </div>
              </div>
              <div className="settings-section">
                <h3>정보</h3>
                <div className="setting-item">
                  <span>앱 버전</span>
                  <span>1.0.0</span>
                </div>
                <div className="setting-item">
                  <span>개발자</span>
                  <span>광주관광</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : currentPage === 'spots' ? (
        <div className="page-container">
          <div className="content">

          {/* 루트 만들기 섹션 - 상단 고정 */}
          {selectedSpots.length > 0 && (
            <div className="section route-creation-section">
              <div className="selected-spots-container">
                <div className="selected-spots-header">
                  <h3>선택된 관광지 ({selectedSpots.length}개)</h3>
                </div>
                {selectedSpots.map((spot, index) => (
                  <div key={`${spot.id}-${index}`} className="selected-spot-item">
                    <span className="selected-spot-number">{index + 1}</span>
                    <span className="selected-spot-theme">{getThemeNameById(spot.theme_id)}</span>
                    <span className="selected-spot-name">{spot.name}</span>
                    <button 
                      className="remove-spot-btn"
                      onClick={() => removeSpotFromRoute(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              <button 
                  className="create-route-btn"
                onClick={() => {
                  console.log('🔍 루트 만들기 버튼 클릭, 현재 selectedSpots:', selectedSpots);
                  console.log('🔍 관광지 개수:', selectedSpots.length);
                  setRouteNameModalVisible(true);
                }}
              >
                루트 만들기
              </button>
              </div>
            </div>
          )}

          {/* 테마별 관광지 섹션 */}
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">테마별 관광지</h2>
              <select 
                className="theme-dropdown"
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
              >
                <option value="all">전체</option>
                {themes.map(theme => (
                  <option key={theme.id} value={theme.id.toString()}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>
            {filteredSpotsByTheme.map(({ theme, spots }) => (
              <div key={theme.id} className="theme-section">
                <h3 className="theme-section-title">
                  {theme.name}
                </h3>
                <div className="spots-grid">
                  {spots.map((spot) => (
              <div 
                key={spot.id} 
                className="spot-card"
                onClick={() => {
                  setSelectedSpot(spot);
                  setModalVisible(true);
                }}
              >
                      <div className={`spot-card-image ${getSpotImage(spot.image_url, spot.id, spot.theme_id, spot.name) ? 'has-image' : ''}`}>
                        <img 
                          src={getSpotImage(spot.image_url, spot.id, spot.theme_id, spot.name)} 
                          alt={spot.name}
                          className="spot-image"
                          onError={(e) => {
                            console.log('❌ 이미지 로드 실패:', spot.name, 'URL:', e.target.src);
                            e.target.style.display = 'none';
                            const placeholder = e.target.parentNode.querySelector('.image-placeholder');
                            const container = e.target.parentNode;
                            if (placeholder) placeholder.style.display = 'flex';
                            if (container) container.classList.remove('has-image');
                          }}
                          onLoad={(e) => {
                            console.log('✅ 이미지 로드 성공:', spot.name, 'URL:', e.target.src);
                            const placeholder = e.target.parentNode.querySelector('.image-placeholder');
                            const container = e.target.parentNode;
                            if (placeholder) placeholder.style.display = 'none';
                            if (container) container.classList.add('has-image');
                          }}
                        />
                        <div className="image-placeholder">
                          📸
                </div>
                      </div>
                      <div className="spot-card-content">
                        <h4>{spot.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          </div>
        </div>
      ) : (
        /* 지도 페이지 */
        <div className="page-container">
        <div className="content">
        <div className="map-container">
          
          {selectedRouteForMap ? (
            /* 선택된 루트 정보 */
            <div className="selected-route-section">
              <div className="route-info-card">
                <h3 className="route-info-title">{selectedRouteForMap.name}</h3>
                <p className="route-info-subtitle">
                  총 {selectedRouteForMap.spots.length}개 관광지
                </p>
                
                {/* 루트 거리 및 시간 정보 */}
                <div className="route-stats-container">
                  <div className="route-details">
                    <span>
                      {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} · 
                      {calculateRouteTime(calculateRouteDistance(selectedRouteForMap.spots))} · 
                      {calculateRouteDistance(selectedRouteForMap.spots).toFixed(1)}km
                    </span>
                  </div>
                </div>
                
                {/* 루트 순서 표시 */}
                <div className="route-order-section">
                  <h4 className="section-label">방문 순서</h4>
                  {selectedRouteForMap.spots.map((spot, index) => (
                    <div key={spot.id} className="route-order-item">
                      <span className="route-order-number">{index + 1}</span>
                      <span className="route-order-theme">{getThemeNameById(spot.theme_id)}</span>
                      <span className="route-order-text">{spot.name}</span>
                      {spot.name === '양림동 역사문화마을' && (
                        <button 
                          className="booking-button"
                          onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfH-gcYAZEzrePgvPN7JyoUOY-GtJYYTe6XuOu1VTk2UZcd1g/viewform', '_blank')}
                          title="양림동 역사공감 3! 4! 5! 예약하기"
                        >
                          예약하기
                        </button>
                      )}
                      {spot.name === '광주향교' && (
                        <button 
                          className="booking-button"
                          onClick={() => window.open('https://www.hyanggyo.co.kr/program/11', '_blank')}
                          title="광주향교 다례 체험 예약하기"
                        >
                          예약하기
                        </button>
                      )}
                      {spot.name === '광주문화재단 전통문화관' && (
                        <button 
                          className="booking-button"
                          onClick={() => window.open('https://www.kctg.or.kr/index.do', '_blank')}
                          title="광주문화재단 전통문화관 문화관광해설사 예약하기"
                        >
                          예약하기
                        </button>
                      )}
                      {spot.name === '광주역사민속박물관' && (
                        <button 
                          className="booking-button"
                          onClick={() => window.open('https://www.gwangju.go.kr/reserve/bookingView.do', '_blank')}
                          title="광주역사민속박물관 견학/체험 예약하기"
                        >
                          예약하기
                        </button>
                      )}
                      {spot.name === '무각사' && (
                        <button 
                          className="booking-button"
                          onClick={() => window.open('https://templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Mugaksa&bookmarkFlag=&areaCd=&pageIndex=1&areaSelect=&searchCondition=&searchKeyword=%EB%AC%B4%EA%B0%81%EC%82%AC', '_blank')}
                          title="무각사 템플스테이 예약하기"
                        >
                          예약하기
                        </button>
                      )}
                      {spot.name === '광주 디자인 비엔날레' && (
                        <button 
                          className="booking-button"
                          onClick={() => window.open('https://tickets.interpark.com/goods/25007892', '_blank')}
                          title="광주 디자인 비엔날레 티켓 예약하기"
                        >
                          예약하기
                        </button>
                      )}
                      {spot.name === '광주 예술의전당' && (
                        <button 
                          className="booking-button"
                          onClick={() => window.open('https://gjart.gwangju.go.kr/ko/cmd.do?opencode=pg_login&redirect_url=DR64L2tvL2NtZC5kbz9vcGVuY29kZT10aWNrZXRsaW5r', '_blank')}
                          title="광주 예술의전당 공연 티켓 예약하기"
                        >
                          예약하기
                        </button>
                      )}
                      {spot.name === '광주시립미술관' && (
                        <button 
                          className="booking-button"
                          onClick={() => window.open('https://artmuse.gwangju.go.kr/pj/pjEducate.php?pageID=artmuse0417000000&action=view&cat=220&seq=3534&cat=220', '_blank')}
                          title="광주시립미술관 교육 프로그램 예약하기"
                        >
                          예약하기
                        </button>
                      )}
                      {spot.name === '국립아시아문화전당' && (
                        <button 
                          className="booking-button"
                          onClick={() => window.open('https://www.accf.or.kr/main/product/detail/ko/278', '_blank')}
                          title="국립아시아문화전당 프로그램 예약하기"
                        >
                          예약하기
                        </button>
                      )}
                      {spot.name === '남도향토음식박물관' && (
                        <button 
                          className="booking-button"
                          onClick={() => window.open('https://gbfmc.or.kr/appointment.es?mid=a40805040000&act=cal_list&eap_seq=2', '_blank')}
                          title="남도향토음식박물관 체험 프로그램 예약하기"
                        >
                          예약하기
                        </button>
                      )}
                      {spot.name === '광주학생독립운동기념회관' && (
                        <button 
                          className="booking-button"
                          onClick={() => window.open('https://lib.gen.go.kr/student/edusat/list.do?sh_ct_idx=&sh_ct_idx2=15#javascript:;', '_blank')}
                          title="광주학생독립운동기념회관 프로그램 예약하기"
                        >
                          예약하기
                        </button>
                      )}
                      {spot.name === '광주김치타운' && (
                        <button 
                          className="booking-button"
                          onClick={() => window.open('https://www.gwangju.go.kr/reserve/bookingView.do', '_blank')}
                          title="광주김치타운 체험 프로그램 예약하기"
                        >
                          예약하기
                        </button>
                      )}
                      {spot.name === '아쿠아시티광주' && (
                        <button 
                          className="booking-button"
                          onClick={() => window.open('https://leisure-web.yanolja.com/leisure/10266374', '_blank')}
                          title="아쿠아시티광주 워터파크 이용권 예약하기"
                        >
                          예약하기
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* 다른 루트 보기 버튼 */}
                <button 
                  className="clear-route-button"
                  onClick={clearMapRoute}
                >
                  다른 루트 보기
                </button>
              </div>
            </div>
          ) : (
            /* 루트 선택 안내 */
            <div className="route-selection-section">
              <h3 className="route-selection-title">지도에서 보기</h3>
              
              {/* 저장된 루트 목록 */}
              {routes.length > 0 ? (
                <div className="route-selection-list">
                  {routes.map((route) => (
                    <button 
                      key={route.id} 
                      className="route-selection-item"
                      onClick={() => viewRouteOnMap(route)}
                    >
                      <span className="route-selection-text">{route.name}</span>
                      <span className="route-selection-info">
                        {route.spots.length}개 관광지 • {calculateRouteDistance(route.spots).toFixed(1)}km
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="empty-routes-container">
                  <p className="empty-routes-text">저장된 루트가 없습니다</p>
                  <p className="empty-routes-subtext">
                    홈에서 루트를 만들어보세요!
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* 실제 도로 거리 정보 표시 */}
          {selectedRouteForMap && realRouteDistance && (
            <div className="real-distance-info">
              <div className="distance-card">
                <h3>🛣️ 실제 도로 거리</h3>
                <div className="route-details">
                  <span>
                    {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} · 
                    {calculateRouteTime(realRouteDistance)} · 
                    {realRouteDistance.toFixed(2)}km
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Google Maps JavaScript API 지도 */}
          <div className="map-container">
            <div className="map-wrapper">
              <GoogleMapsComponent
                ref={mapRef}
                selectedRoute={selectedRouteForMap}
                spots={spots}
                onMapClick={(data) => {
                  if (data && data.type === 'distance_update') {
                    setRealRouteDistance(data.distance);
                  } else {
                    console.log('지도 클릭:', data);
                  }
                }}
                onMarkerClick={(spot) => {
                  setSelectedSpot(spot);
                  setModalVisible(true);
                }}
                center={{ lat: 35.1595, lng: 126.8526 }}
                zoom={12}
              />
            </div>
          </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* 사이드바 */}
      {sidebarVisible && (
        <div className="sidebar-overlay" onClick={() => setSidebarVisible(false)}>
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-header">
              <h2>메뉴</h2>
              <button className="sidebar-close" onClick={() => setSidebarVisible(false)}>
                ✕
              </button>
            </div>
            <div className="sidebar-content">
              <div className="sidebar-menu">
                {isLoggedIn ? (
                  <>
                    <button className="sidebar-menu-item" onClick={() => { navigateToPage('profile'); setSidebarVisible(false); }}>
                      <span>마이 페이지</span>
                    </button>
                    <button className="sidebar-menu-item" onClick={() => { navigateToPage('survey'); setSidebarVisible(false); }}>
                      <span>설문조사</span>
                    </button>
                    <button className="sidebar-menu-item" onClick={() => { logoutUser(); setSidebarVisible(false); }}>
                      <span>로그아웃</span>
                    </button>
                    <button className="sidebar-menu-item" onClick={() => { navigateToPage('settings'); setSidebarVisible(false); }}>
                      <span>환경설정</span>
                    </button>
                    <button className="sidebar-menu-item" onClick={() => { deleteAccount(); setSidebarVisible(false); }}>
                      <span>회원 탈퇴</span>
                    </button>
                    <button className="sidebar-menu-item" onClick={() => { navigateToPage('admin'); setSidebarVisible(false); }}>
                      <span>관리자 대시보드</span>
                    </button>
                  </>
                ) : (
                  <button className="sidebar-menu-item" onClick={() => { navigateToPage('profile'); setSidebarVisible(false); }}>
                    <span>로그인/회원가입</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 하단 네비게이션 */}
      <div className="bottom-nav">
        <button 
          className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => navigateToPage('home')}
        >
          <img src="/icons/home-icon.png" alt="홈" className="nav-icon" />
          <span className="nav-text">홈</span>
        </button>
        <button 
          className={`nav-item ${currentPage === 'tours' ? 'active' : ''}`}
          onClick={() => navigateToPage('tours')}
        >
          <img src="/icons/reservation-icons.png" alt="예약" className="nav-icon" />
          <span className="nav-text">예약</span>
        </button>
        <button 
          className={`nav-item ${currentPage === 'spots' ? 'active' : ''}`}
          onClick={() => navigateToPage('spots')}
        >
          <img src="/icons/spots-icon.png" alt="관광지" className="nav-icon" />
          <span className="nav-text">관광지</span>
        </button>
        <button 
          className={`nav-item ${currentPage === 'map' ? 'active' : ''}`}
          onClick={() => navigateToPage('map')}
        >
          <img src="/icons/map-icon.png" alt="지도" className="nav-icon" />
          <span className="nav-text">지도</span>
        </button>
        <button 
          className={`nav-item ${currentPage === 'profile' ? 'active' : ''}`}
          onClick={() => navigateToPage('profile')}
        >
          <img src="/icons/profile-icon.png" alt="프로필" className="nav-icon" />
          <span className="nav-text">프로필</span>
        </button>
      </div>

      {/* 상세페이지 모달 */}
      {modalVisible && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* 모달 헤더 */}
            <div className="modal-header">
              <button 
                className="close-button"
                onClick={() => {
                  setModalVisible(false);
                  setSelectedSpot(null);
                }}
              >
                ✕
              </button>
            </div>
            
            {/* 모달 내용 */}
            {selectedSpot && (
              <div className="modal-body">
                {/* 관광지 이름과 테마 배지 */}
                <div className="spot-title-section">
                <h2 className="spot-detail-title">
                  {selectedSpot.name}
                </h2>
                  <div className="theme-badge">
                    <span className="theme-badge-text">
                      {getThemeNameById(selectedSpot.theme_id)}
                    </span>
                  </div>
                </div>
                
                {/* 영상 섹션 */}
                <div className="video-section">
                  <h4 className="section-label">관광지 영상</h4>
                  {getSpotVideoData(selectedSpot.name) ? (
                    <div className="video-container">
                      <iframe
                        src={getSpotVideoData(selectedSpot.name)}
                        title={`${selectedSpot.name} 영상`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="spot-video"
                      ></iframe>
                    </div>
                  ) : (
                    <div className="video-placeholder">
                      <div className="video-icon">🎥</div>
                      <p>해당 스팟의 영상 삽입</p>
                    </div>
                  )}
                </div>
                
                {/* SNS 사진 갤러리 */}
                <div className="sns-gallery">
                  <h4 className="section-label">SNS 사진</h4>
                  {getSpotImageData(selectedSpot.name) ? (
                    <div className="gallery-grid">
                      {getSpotImageData(selectedSpot.name).map((photo, index) => (
                        <div key={index} className="gallery-item">
                          <img 
                            src={photo} 
                            alt={`${selectedSpot.name} 사진 ${index + 1}`}
                            className="gallery-image"
                            onClick={() => handleImageClick(photo)}
                            style={{ cursor: 'pointer' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="gallery-placeholder" style={{display: 'none'}}>
                            <div className="gallery-icon">📸</div>
                            <p>사진 로딩 중...</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="gallery-grid">
                      <div className="gallery-item">
                        <div className="gallery-placeholder">📸</div>
                        <p>인스타그램 사진 1</p>
                      </div>
                      <div className="gallery-item">
                        <div className="gallery-placeholder">📸</div>
                        <p>인스타그램 사진 2</p>
                      </div>
                      <div className="gallery-item">
                        <div className="gallery-placeholder">📸</div>
                        <p>인스타그램 사진 3</p>
                      </div>
  </div>
)}
                </div>
                
                {/* 혜택 정보 */}
                <div className="benefits-section">
                  <h4 className="section-label">혜택 정보</h4>
                  <div className="benefits-grid">
                    <div className="benefit-item">
                      <div className="benefit-icon">🎫</div>
                      <div className="benefit-info">
                        <h5>온누리상품권</h5>
                        <p>
                          {selectedSpot.name === '충금지하상가' ? '사용 가능, 2만원 이상 사용시 1만원 환급' :
                           selectedSpot.name === '신세계백화점 광주신세계점' ? '사용 불가' :
                           selectedSpot.name === '롯데백화점 광주점' ? '사용 불가' :
                           selectedSpot.name === '광주세정아울렛' ? '사용 불가' :
                           selectedSpot.name === '양동시장' ? '사용 가능' :
                           selectedSpot.name === 'NC백화점 광주역점' ? '사용 불가' :
                           selectedSpot.name === '상무화훼단지' ? '사용 불가' :
                           selectedSpot.name === '서부농수산물도매시장' ? '사용 가능' :
                           selectedSpot.name === '광주역사민속박물관' ? '해당사항 없음' :
                           selectedSpot.name === '광주문화재단 전통문화관' ? '해당사항 없음' :
                           selectedSpot.name === '광주향교' ? '해당사항 없음' :
                           selectedSpot.name === '5.18기념공원' ? '해당사항 없음' :
                           selectedSpot.name === '양림동 역사문화마을' ? '해당사항 없음' :
                           selectedSpot.name === '5.18 민주화운동기록관' ? '해당사항 없음' :
                           selectedSpot.name === '무각사' ? '해당사항 없음' :
                           selectedSpot.name === '오방 최흥종 기념관' ? '해당사항 없음' :
                           selectedSpot.name === '광주 예술의전당' ? '해당사항 없음' :
                           selectedSpot.name === '광주 예술의거리' ? '해당사항 없음' :
                           selectedSpot.name === '국립아시아문화전당' ? '해당사항 없음' :
                           selectedSpot.name === '광주시립미술관' ? '해당사항 없음' :
                           selectedSpot.name === '광주 디자인 비엔날레' ? '해당사항 없음' :
                           selectedSpot.name === '남도향토음식박물관' ? '해당사항 없음' :
                           selectedSpot.name === '펭귄마을' ? '해당사항 없음' :
                           selectedSpot.name === '광주학생독립운동기념회관' ? '해당사항 없음' :
                           selectedSpot.name === '광주천' ? '해당사항 없음' :
                           selectedSpot.name === '광주호 호수생태원' ? '해당사항 없음' :
                           selectedSpot.name === '중외공원' ? '해당사항 없음' :
                           selectedSpot.name === '광주사직공원 전망타워' ? '해당사항 없음' :
                           selectedSpot.name === '광주광역시 우치공원' ? '해당사항 없음' :
                           selectedSpot.name === '전평제근린공원' ? '해당사항 없음' :
                           selectedSpot.name === '무등산' ? '해당사항 없음' :
                           selectedSpot.name === '운천저수지' ? '해당사항 없음' :
                           selectedSpot.name === '송정 떡갈비거리' ? '사용 가능' :
                           selectedSpot.name === '송정역시장' ? '사용 가능' :
                           selectedSpot.name === '동명동 카페골목' ? '사용 가능' :
                           selectedSpot.name === '대인시장' ? '사용 가능' :
                           selectedSpot.name === '시청 먹자골목' ? '사용 불가' :
                           selectedSpot.name === '말바우 시장' ? '사용 가능' :
                           selectedSpot.name === '광주 오리요리거리' ? '사용 불가' :
                           selectedSpot.name === '광주공원 포차거리' ? '사용 불가' :
                           selectedSpot.name === '광주기아챔피언스필드' ? '사용 불가' :
                           selectedSpot.name === '헬로애니멀 광주점' ? '사용 가능' :
                           selectedSpot.name === '광주월드컵경기장' ? '해당사항 없음' :
                           selectedSpot.name === '광주국제양궁장' ? '해당사항 없음' :
                           selectedSpot.name === '광주김치타운' ? '해당사항 없음' :
                           selectedSpot.name === '평촌도예공방' ? '해당사항 없음' :
                           selectedSpot.name === '아쿠아시티광주' ? '사용 불가' :
                           selectedSpot.name === '호남대학교' ? '사용 불가' :
                           selectedSpot.name === '광주실내빙상장' ? '사용 불가' : '사용 가능'}
                        </p>
                      </div>
                    </div>
                    <div className="benefit-item">
                      <div className="benefit-icon">💳</div>
                      <div className="benefit-info">
                        <h5>상생카드</h5>
                        <p>
                          {selectedSpot.name === '충금지하상가' ? '사용 가능, 월 구매 한도 내에서 캐시백 제공' :
                           selectedSpot.name === '신세계백화점 광주신세계점' ? '사용 불가' :
                           selectedSpot.name === '롯데백화점 광주점' ? '사용 불가' :
                           selectedSpot.name === '광주세정아울렛' ? '사용 가능' :
                           selectedSpot.name === '양동시장' ? '사용 가능' :
                           selectedSpot.name === 'NC백화점 광주역점' ? '사용 불가' :
                           selectedSpot.name === '상무화훼단지' ? '사용 가능' :
                           selectedSpot.name === '서부농수산물도매시장' ? '사용 가능' :
                           selectedSpot.name === '광주역사민속박물관' ? '해당사항 없음' :
                           selectedSpot.name === '광주문화재단 전통문화관' ? '해당사항 없음' :
                           selectedSpot.name === '광주향교' ? '해당사항 없음' :
                           selectedSpot.name === '5.18기념공원' ? '해당사항 없음' :
                           selectedSpot.name === '양림동 역사문화마을' ? '해당사항 없음' :
                           selectedSpot.name === '5.18 민주화운동기록관' ? '해당사항 없음' :
                           selectedSpot.name === '무각사' ? '해당사항 없음' :
                           selectedSpot.name === '오방 최흥종 기념관' ? '해당사항 없음' :
                           selectedSpot.name === '광주 예술의전당' ? '해당사항 없음' :
                           selectedSpot.name === '광주 예술의거리' ? '해당사항 없음' :
                           selectedSpot.name === '국립아시아문화전당' ? '해당사항 없음' :
                           selectedSpot.name === '광주시립미술관' ? '해당사항 없음' :
                           selectedSpot.name === '광주 디자인 비엔날레' ? '해당사항 없음' :
                           selectedSpot.name === '남도향토음식박물관' ? '해당사항 없음' :
                           selectedSpot.name === '펭귄마을' ? '해당사항 없음' :
                           selectedSpot.name === '광주학생독립운동기념회관' ? '해당사항 없음' :
                           selectedSpot.name === '광주천' ? '해당사항 없음' :
                           selectedSpot.name === '광주호 호수생태원' ? '해당사항 없음' :
                           selectedSpot.name === '중외공원' ? '해당사항 없음' :
                           selectedSpot.name === '광주사직공원 전망타워' ? '해당사항 없음' :
                           selectedSpot.name === '광주광역시 우치공원' ? '해당사항 없음' :
                           selectedSpot.name === '전평제근린공원' ? '해당사항 없음' :
                           selectedSpot.name === '무등산' ? '해당사항 없음' :
                           selectedSpot.name === '운천저수지' ? '해당사항 없음' :
                           selectedSpot.name === '송정 떡갈비거리' ? '사용 가능' :
                           selectedSpot.name === '송정역시장' ? '사용 가능' :
                           selectedSpot.name === '동명동 카페골목' ? '사용 가능' :
                           selectedSpot.name === '대인시장' ? '사용 가능' :
                           selectedSpot.name === '시청 먹자골목' ? '사용 가능' :
                           selectedSpot.name === '말바우 시장' ? '사용 가능' :
                           selectedSpot.name === '광주 오리요리거리' ? '사용 가능' :
                           selectedSpot.name === '광주공원 포차거리' ? '사용 불가' :
                           selectedSpot.name === '광주기아챔피언스필드' ? '사용 가능' :
                           selectedSpot.name === '헬로애니멀 광주점' ? '사용 불가' :
                           selectedSpot.name === '광주월드컵경기장' ? '해당사항 없음' :
                           selectedSpot.name === '광주국제양궁장' ? '해당사항 없음' :
                           selectedSpot.name === '광주김치타운' ? '해당사항 없음' :
                           selectedSpot.name === '평촌도예공방' ? '해당사항 없음' :
                           selectedSpot.name === '아쿠아시티광주' ? '사용 가능' :
                           selectedSpot.name === '호남대학교' ? '사용 가능' :
                           selectedSpot.name === '광주실내빙상장' ? '사용 가능' : '할인 혜택'}
                        </p>
                      </div>
                    </div>
                    <div className="benefit-item">
                      <div className="benefit-icon">🎁</div>
                      <div className="benefit-info">
                        <h5>기타 혜택</h5>
                        <p>
                          {selectedSpot.name === '충금지하상가' ? '시즌별 행사 및 자체 회원 할인, 특정 요일 할인' :
                           selectedSpot.name === '신세계백화점 광주신세계점' ? '명절, 백화점 행사 시즌에 특별 할인/기프트 행사 진행' :
                           selectedSpot.name === '롯데백화점 광주점' ? '계절별 정기세일, 마일리지 / 포인트 적립 혜택' :
                           selectedSpot.name === '광주세정아울렛' ? '시즌 특가, 추가 할인 쿠폰 / 멤버십 쿠폰' :
                           selectedSpot.name === '양동시장' ? '현금 결제 시 추가 할인' :
                           selectedSpot.name === 'NC백화점 광주역점' ? '포인트 적립 혜택' :
                           selectedSpot.name === '상무화훼단지' ? '365일 연중무휴 운영' :
                           selectedSpot.name === '서부농수산물도매시장' ? '지역 특산물 구매, 시장 특가 및 세일 이벤트' :
                           selectedSpot.name === '광주역사민속박물관' ? '해당사항 없음' :
                           selectedSpot.name === '광주문화재단 전통문화관' ? '해당사항 없음' :
                           selectedSpot.name === '광주향교' ? '해당사항 없음' :
                           selectedSpot.name === '5.18기념공원' ? '해당사항 없음' :
                           selectedSpot.name === '양림동 역사문화마을' ? '해당사항 없음' :
                           selectedSpot.name === '5.18 민주화운동기록관' ? '해당사항 없음' :
                           selectedSpot.name === '무각사' ? '해당사항 없음' :
                           selectedSpot.name === '오방 최흥종 기념관' ? '해당사항 없음' :
                           selectedSpot.name === '광주 예술의전당' ? '해당사항 없음' :
                           selectedSpot.name === '광주 예술의거리' ? '해당사항 없음' :
                           selectedSpot.name === '국립아시아문화전당' ? '해당사항 없음' :
                           selectedSpot.name === '광주시립미술관' ? '해당사항 없음' :
                           selectedSpot.name === '광주 디자인 비엔날레' ? '해당사항 없음' :
                           selectedSpot.name === '남도향토음식박물관' ? '해당사항 없음' :
                           selectedSpot.name === '펭귄마을' ? '해당사항 없음' :
                           selectedSpot.name === '광주학생독립운동기념회관' ? '해당사항 없음' :
                           selectedSpot.name === '광주천' ? '해당사항 없음' :
                           selectedSpot.name === '광주호 호수생태원' ? '해당사항 없음' :
                           selectedSpot.name === '중외공원' ? '해당사항 없음' :
                           selectedSpot.name === '광주사직공원 전망타워' ? '해당사항 없음' :
                           selectedSpot.name === '광주광역시 우치공원' ? '해당사항 없음' :
                           selectedSpot.name === '전평제근린공원' ? '해당사항 없음' :
                           selectedSpot.name === '무등산' ? '해당사항 없음' :
                           selectedSpot.name === '운천저수지' ? '해당사항 없음' :
                           selectedSpot.name === '송정 떡갈비거리' ? '-' :
                           selectedSpot.name === '송정역시장' ? '정기적 문화 행사' :
                           selectedSpot.name === '동명동 카페골목' ? '데이트 명소 및 인스타그램 핫플레이스' :
                           selectedSpot.name === '대인시장' ? '다양한 먹거리 및 문화 행사' :
                           selectedSpot.name === '시청 먹자골목' ? '-' :
                           selectedSpot.name === '말바우 시장' ? '온누리상품권 환급 생사' :
                           selectedSpot.name === '광주 오리요리거리' ? '-' :
                           selectedSpot.name === '광주공원 포차거리' ? '-' :
                           selectedSpot.name === '광주기아챔피언스필드' ? '-' :
                           selectedSpot.name === '헬로애니멀 광주점' ? '-' :
                           selectedSpot.name === '광주월드컵경기장' ? '해당사항 없음' :
                           selectedSpot.name === '광주국제양궁장' ? '해당사항 없음' :
                           selectedSpot.name === '광주김치타운' ? '해당사항 없음' :
                           selectedSpot.name === '평촌도예공방' ? '해당사항 없음' :
                           selectedSpot.name === '아쿠아시티광주' ? '-' :
                           selectedSpot.name === '호남대학교' ? '-' :
                           selectedSpot.name === '광주실내빙상장' ? '-' : '특별 할인'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 설명 */}
                {selectedSpot.description && (
                  <div className="description-section">
                    <h4 className="section-label">설명</h4>
                    <p className="description-text">{selectedSpot.description}</p>
                  </div>
                )}
                
                {/* 주소 */}
                {selectedSpot.address && (
                  <div className="address-section">
                    <h4 className="section-label">주소</h4>
                    <p className="address-text">{selectedSpot.address}</p>
                  </div>
                )}
                
                {/* 영업 정보 */}
                {selectedSpot.operating_hours && (
                  <div className="operating-hours-section">
                    <h4 className="section-label">영업 정보</h4>
                    <p className="operating-hours-text">{selectedSpot.operating_hours}</p>
                  </div>
                )}
                
                {/* 전화번호 */}
                {selectedSpot.contact_info && (
                  <div className="contact-section">
                    <h4 className="section-label">전화번호</h4>
                    <p className="contact-text">
                      <a href={`tel:${selectedSpot.contact_info}`} className="contact-link">
                        {selectedSpot.contact_info}
                      </a>
                    </p>
                  </div>
                )}

                {/* 루트에 추가하기 버튼 */}
                <button 
                  className="add-to-route-button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (!isLoggedIn) {
                      showToast('루트에 관광지를 추가하려면 로그인해 주세요.', 'info');
                      setModalVisible(false);
                      setSelectedSpot(null);
                      navigateToPage('profile'); // 프로필 페이지로 이동하여 로그인 유도
                      return;
                    }
                    
                    if (!selectedSpot) {
                      return;
                    }
                    
                    addSpotToRoute(selectedSpot);
                    setModalVisible(false);
                    setSelectedSpot(null);
                    showToast(`${selectedSpot.name}이(가) 루트에 추가되었습니다!`, 'success');
                  }}
                >
                  루트에 추가하기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 이미지 확대 모달 */}
      {showImageModal && (
        <div className="modal-overlay image-modal-overlay" onClick={handleCloseImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-button image-close-button"
              onClick={handleCloseImageModal}
            >
              ✕
            </button>
            <img 
              src={selectedImage} 
              alt="확대 이미지"
              className="expanded-image"
              onClick={handleCloseImageModal}
            />
          </div>
        </div>
      )}

      {/* 루트 이름 입력 모달 */}
      {routeNameModalVisible && (
        <div className="modal-overlay" onClick={() => setRouteNameModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button 
                className="close-button"
                onClick={() => setRouteNameModalVisible(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <h2 className="section-title">루트 이름 입력</h2>
              <input
                className="route-name-input"
                placeholder="루트 이름을 입력하세요"
                value={newRouteName}
                onChange={(e) => setNewRouteName(e.target.value)}
              />
              
              <div className="selected-spots-preview">
                <h4 className="section-label">선택된 관광지 ({selectedSpots.length}개)</h4>
                {selectedSpots.map((spot, index) => (
                  <div key={`${spot.id}-${index}`} className="selected-spot-preview">
                    <span className="selected-spot-number">{index + 1}</span>
                    <span className="selected-spot-theme">{getThemeNameById(spot.theme_id)}</span>
                    <span className="selected-spot-name">{spot.name}</span>
                  </div>
                ))}
              </div>

              {/* 루트 정보 미리보기 */}
              {selectedSpots.length >= 1 && (
                <div className="route-preview-info">
                  <h4 className="section-label">루트 정보</h4>
                  <div className="route-preview-stats">
                    <div className="route-details">
                      <span>
                        {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} · 
                        {calculateRouteTime(currentRouteDistance, selectedTransportMode)} · 
                        {currentRouteDistance.toFixed(2)}km
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 이동 수단 선택 */}
              <div className="transport-mode-selection">
                <h4 className="section-label">이동 수단 선택</h4>
                <div className="transport-options">
                  <label className="transport-option">
                    <input
                      type="radio"
                      name="transportMode"
                      value="auto"
                      checked={selectedTransportMode === 'auto'}
                      onChange={(e) => setSelectedTransportMode(e.target.value)}
                    />
                    <span>🚶‍♂️ 자동 선택 (거리 기반)</span>
                  </label>
                  <label className="transport-option">
                    <input
                      type="radio"
                      name="transportMode"
                      value="walking"
                      checked={selectedTransportMode === 'walking'}
                      onChange={(e) => setSelectedTransportMode(e.target.value)}
                    />
                    <span>🚶‍♂️ 도보 (4km/h)</span>
                  </label>
                  <label className="transport-option">
                    <input
                      type="radio"
                      name="transportMode"
                      value="bike"
                      checked={selectedTransportMode === 'bike'}
                      onChange={(e) => setSelectedTransportMode(e.target.value)}
                    />
                    <span>🚴‍♂️ 자전거 (15km/h)</span>
                  </label>
                  <label className="transport-option">
                    <input
                      type="radio"
                      name="transportMode"
                      value="car"
                      checked={selectedTransportMode === 'car'}
                      onChange={(e) => setSelectedTransportMode(e.target.value)}
                    />
                    <span>🚗 자동차 (40km/h)</span>
                  </label>
                </div>
              </div>
              
              <button 
                className={`confirm-route-name-button ${selectedSpots.length === 0 || isSaving ? 'disabled' : ''}`}
                onClick={saveRoute}
                disabled={selectedSpots.length === 0 || isSaving}
              >
                {isSaving ? '저장 중...' : '루트 저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 편집 모드 모달 */}
      {editingRoute && (
        <div className="modal-overlay" onClick={() => setEditingRoute(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button 
                className="close-button"
                onClick={() => setEditingRoute(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <h2 className="section-title">루트 편집</h2>
              
              {/* 루트 이름 입력 */}
              <div className="edit-route-name-section">
                <h4 className="section-label">루트 이름</h4>
                <input
                  className="edit-route-name-input"
                  placeholder="루트 이름을 입력하세요"
                  value={editingRouteName}
                  onChange={(e) => setEditingRouteName(e.target.value)}
                />
              </div>

              {/* 편집 중인 관광지들 */}
              <div className="editing-spots-container">
                <h4 className="editing-spots-title">관광지 목록 ({editingSpots.length}개)</h4>
                {editingSpots.map((spot, index) => (
                  <div key={spot.id} className="editing-spot-item">
                    <div className="editing-spot-info">
                      <span className="editing-spot-number">{index + 1}</span>
                      <span className="editing-spot-icon">{getSpotIcon(spot.theme_id)}</span>
                      <span className="editing-spot-name">{spot.name}</span>
                      <span className="editing-spot-theme">{getThemeNameById(spot.theme_id)}</span>
                    </div>
                    
                    {/* 편집 액션 버튼들 */}
                    <div className="editing-spot-actions">
                      <button 
                        className="editing-action-button move-up"
                        onClick={() => moveSpotUp(index)} 
                        disabled={index === 0}
                        title="위로 이동"
                      >
                        ⬆️
                      </button>
                      <button 
                        className="editing-action-button move-down"
                        onClick={() => moveSpotDown(index)} 
                        disabled={index === editingSpots.length - 1}
                        title="아래로 이동"
                      >
                        ⬇️
                      </button>
                      <button 
                        className="editing-action-button remove"
                        onClick={() => removeSpotFromEditing(index)}
                        title="제거"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 관광지 추가 섹션 */}
              <div className="add-spot-section">
                <h4 className="add-spot-title">관광지 추가</h4>
                <div className="add-spot-search">
                  <input
                    type="text"
                    placeholder="관광지 이름이나 테마로 검색..."
                    className="add-spot-search-input"
                    value={addSpotSearch}
                    onChange={(e) => setAddSpotSearch(e.target.value)}
                  />
                </div>
                <div className="add-spot-results">
                  {spots
                    .filter(spot => !editingSpots.find(s => s.id === spot.id))
                    .filter(spot => 
                      addSpotSearch === '' || 
                      spot.name.toLowerCase().includes(addSpotSearch.toLowerCase()) ||
                      getThemeNameById(spot.theme_id).toLowerCase().includes(addSpotSearch.toLowerCase())
                    )
                    .map(spot => (
                      <button
                        key={spot.id}
                        className="add-spot-item"
                        onClick={() => addSpotToEditing(spot)}
                      >
                        <span className="add-spot-icon">{getSpotIcon(spot.theme_id)}</span>
                        <span className="add-spot-name">{spot.name}</span>
                        <span className="add-spot-theme">{getThemeNameById(spot.theme_id)}</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* 편집 완료 버튼 */}
              <div className="edit-actions">
                <button 
                  className="cancel-edit-button"
                  onClick={cancelEditing}
                >
                  취소
                </button>
                <button 
                  className="save-edit-button"
                  onClick={saveEditing}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 검색 모달 */}
      <SearchModal
        isOpen={searchModalVisible}
        onClose={handleSearchClose}
        spots={spots}
        onSpotSelect={handleSpotSelect}
        getThemeNameById={getThemeNameById}
        getSpotImage={getSpotImage}
      />

      {/* Toast 알림 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
          duration={3000}
        />
      )}
    </div>
  );
}
