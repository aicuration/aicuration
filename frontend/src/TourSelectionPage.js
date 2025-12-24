import React from 'react';

const CATEGORY_CONFIG = [
  { key: 'class', label: '체험형(클래스, 강연 등)' },                       // 1
  { key: 'biggame', label: '체험형(빅게임, 스마트관광)' },           // 2
  { key: 'oneday', label: '판매형(당일 투어형)' },                          // 3
  { key: 'stay', label: '판매형(1박2일 이상 체류형)' },                     // 4
  { key: 'linked_city', label: '연계형(광주인근 도시 연계형)' },            // 5
  { key: 'linked_event', label: '연계형(축제연계, 스포츠이벤트)' },    // 6
  { key: 'activity', label: '엑티비티형(소모임, 동호회, 크루)' },       // 7
];

const TourSelectionPage = ({ onNavigateToHome, onNavigateToPage }) => {
  // 외부 투어 데이터
  const tours = {
    all: [
      {
        id: 1,
        category: 'biggame',
        name: '작가와 함께 하는 동구 예술여행 야행',
        company: '광주광역시 동구문화관광재단',
        price: '무료',
        duration: '1시간 40분',
        rating: 4.8,
        reviews: 156,
        description:
          '여행가는 달, 9월 생활관광자를 위한 야행투어입니다. 여행 전문 작가와 함께 듣고, 보고, 체험하는 밤의 별 투어',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/2762.png',
        spots: [
          '빛의 음악분수',
          '빛의 읍성',
          '전일빌딩245',
          '리얼월드 팝업스토어',
          '뷰폴리',
          '금남 나비정원',
          '대인야시장',
        ],
        benefits: ['리얼월드 스마트관광 체험', '전문 작가 가이드', '야시장 유료 체험 이벤트 참여'],
      },
      {
        id: 2,
        category: 'biggame',
        name: '광주세계양궁선구권대회 관광안내소 스마트관광 체험신청',
        company: '광주광역시',
        price: '무료',
        duration: '20분',
        rating: 4.8,
        reviews: 234,
        description:
          'AR 기술을 활용한 메타버스형 활체험과 오겜월드 게임 이벤트, 퀴즈 타임을 즐길 수 있는 스마트관광 체험입니다',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/tour_product_4028/1200x720_20250912_094108.webp',
        spots: ['광주 찾아가는 관광안내소'],
        benefits: ['AR 활체험', '오겜월드 게임', '퀴즈 이벤트', '기념품 증정'],
      },
      {
        id: 3,
        category: 'class',
        name: '사직공원 전망대, 또 다른 첨성대로',
        company: '광주광역시',
        price: '25,000원',
        duration: '2시간',
        rating: 4.7,
        reviews: 189,
        description: '사직동 전망대에서 망원경을 통해 알아보는 별자리 체험',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1500.webp',
        spots: ['사직공원 전망대'],
        benefits: ['망원경 체험', '별자리 관측', '전문 해설', '무료 참여'],
      },
      {
        id: 4,
        category: 'activity',
        name: '멍 때리기 대회',
        company: '광주광역시',
        price: '3,000원',
        duration: '2시간',
        rating: 4.5,
        reviews: 156,
        description:
          '바쁜 일상 속에서 자기만의 시간을 가지기가 어려우신 분들! 열심히 멍 때려보세요!',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1498.webp',
        spots: ['광주시청 앞 잔디밭'],
        benefits: ['마음의 평정', '스트레스 해소', '자기 시간', '무료 참여'],
      },
      {
        id: 5,
        category: 'class',
        name: '위스키 입문자 1일 클래스',
        company: '애프터워크',
        price: '50,000원',
        duration: '2시간',
        rating: 4.6,
        reviews: 89,
        description:
          '최근 각광 받고 있는 위스키, 입문자에게 맞는 위스키와 마시는 법을 배워봅니다.',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1501.webp',
        spots: ['애프터워크'],
        benefits: ['위스키 교육', '시음 체험', '전문 강사', '무료 참여'],
      },
      {
        id: 6,
        category: 'linked_event',
        name: '북구상생 힐링투어 트립 투 메모리',
        company: '광주광역시 북구',
        price: '무료',
        duration: '6시간',
        rating: 4.7,
        reviews: 124,
        description:
          '광주디자인비엔날레, 남도향토음식박물관, 말바우시장을 둘러보는 북구상생 힐링투어',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_4012/1200x720_%EC%98%A4%ED%94%8C%ED%88%AC%20%ED%8A%B8%EB%A6%BD%ED%88%AC%EB%A9%94%EB%AA%A8%EB%A6%AC-07.webp',
        spots: ['광주디자인비엔날레', '남도향토음식박물관', '말바우시장'],
        benefits: ['힐링 투어', '자연 체험', '추억 만들기', '무료 참여'],
      },
      {
        id: 7,
        category: 'activity',
        name: '야외러닝 트립 "광주천번 RUN"',
        company: '오리온플래닛투어',
        price: '20,000원',
        duration: '2시간',
        rating: 4.6,
        reviews: 98,
        description: '광주천변 야경속에서 달리자 : 도심 속 힐링 런닝 투어',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_395/1200x720_a47ae7bfa012a.webp',
        spots: ['광주천'],
        benefits: ['야경 런닝', '힐링 체험', '전문 코치', '무료 참여'],
      },
      {
        id: 8,
        category: 'oneday',
        name: '스리술쩍 미슐랭트립 광주의 숨은 술을 찾아보자',
        company: '오리온플래닛투어',
        price: '20,000원',
        duration: '3시간',
        rating: 4.5,
        reviews: 87,
        description: '주당과 함께하는 스리술쩍 미슐랭트립 광주의 숨은 술을 찾아서',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_396/1200x720_a89e0e9174dfc.webp',
        spots: ['광주 숨은 술집'],
        benefits: ['주당 가이드', '미슐랭 술집 탐방', '지역 술 문화 체험', '무료 참여'],
      },
      {
        id: 9,
        category: 'activity',
        name: '사디코 러닝트립 전문러너 DJ동행합니다',
        company: '오리온플래닛투어',
        price: '20,000원',
        duration: '2시간',
        rating: 4.4,
        reviews: 76,
        description:
          '이색적인 러닝을 즐기다 국립아시아 문화전당에서 펼쳐지는 사디코러닝',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_394/1200x720_ec661b8580e92.webp',
        spots: ['국립아시아문화전당'],
        benefits: ['전문러너 DJ 동행', '사디코 러닝', '문화전당 체험', '무료 참여'],
      },
      {
        id: 10,
        category: 'oneday',
        name: '광주사람도 모르는 동명동 힙플 투어! 광주 워킹 카페 투어!',
        company: '애프터워크',
        price: '25,000원',
        duration: '3시간',
        rating: 4.3,
        reviews: 92,
        description:
          '워킹 카페투어프로그램으로 동명동 카페를 탐방하고 참여자들과 함께 시음해봅니다!',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1469.webp',
        spots: ['동명동 카페골목'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 11,
        category: 'stay',
        name: '어썸투어 "여수시" 편',
        company: '애프터워크',
        price: '250,000원',
        duration: '1박 2일',
        rating: 4.3,
        reviews: 92,
        description: '광주에서 출발하는 여수시 캠핑낚시투어!',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1506.webp',
        spots: ['여수시'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 12,
        category: 'stay',
        name: '어썸투어 "신안군" 편',
        company: '애프터워크',
        price: '250,000원',
        duration: '1박 2일',
        rating: 4.3,
        reviews: 92,
        description: '광주에서 출발하는 신안군 생태관광투어!',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1507.webp',
        spots: ['신안군'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 13,
        category: 'oneday',
        name: '광주 맛있는 등산',
        company: '애프터워크',
        price: '89,000원',
        duration: '5시간 30분',
        rating: 4.3,
        reviews: 92,
        description: '100대 명산 중 하나인 무등산에서 즐기는 등산 + 맛집 탐방!',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/tour_product_303/1200x720_Untitled-1.jpg',
        spots: ['무등산'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 14,
        category: 'biggame',
        name: '말바우 전통시장에서 즐기는 푸드트립',
        company: '애프터워크',
        price: '58,000원',
        duration: '3시간',
        rating: 4.3,
        reviews: 92,
        description:
          '말바우 전통시장에서 동네 AR과 함께 즐기는 말바우 푸드로드트립 광주 전통시장 남도의 맛 시장 투어 동네라이프 AR 메타아처 퇴근후 즐기는 맛집기행',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/tour_product_309/1200x720_2223.jpg',
        spots: ['말바우 시장'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 15,
        category: 'linked_event',
        name: '광주FC 선수 훈련 체험',
        company: '애프터워크',
        price: '50,000원',
        duration: '5시간',
        rating: 4.3,
        reviews: 92,
        description:
          '광주FC 프로 선수들은 어떤 훈련을 받을까요? 축구에 관심 있는 분들의 능력을 키워줄 프로그램',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1409.webp',
        spots: ['전남대학교 제 2운동장'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 16,
        category: 'stay',
        name: '1박2일 온천수 물놀이 패키지',
        company: '애프터워크',
        price: '65,000원',
        duration: '1박 2일',
        rating: 4.3,
        reviews: 92,
        description:
          '화순 금호 아쿠아나에서 온천수로 즐기는 당일치기 물놀이 패키지(수영장+온천)',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1401.webp',
        spots: ['화순군'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 17,
        category: 'linked_city',
        name: '온천 투어 패키지',
        company: '애프터워크',
        price: '48,000원',
        duration: '5시간',
        rating: 4.3,
        reviews: 92,
        description:
          '담양 명소 담양 온천에서 건강도 챙기고, 담양식 돼지갈비도 맛보는 맛있는 헬스케어 투어',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1400.webp',
        spots: ['담양군'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 18,
        category: 'biggame',
        name: '광주천 힐링 바이크 투어',
        company: '애프터워크',
        price: '35,000원',
        duration: '6시간',
        rating: 4.3,
        reviews: 92,
        description:
          '타랑께를 타고 광주천을 가로질러 광주천 거점별 투어를 진행합니다.',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1410.webp',
        spots: ['광주시청', '광주 기아 챔피언스 필드', '양동시장', '아시아문화전당'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 19,
        category: 'oneday',
        name: '광주 예술 투어',
        company: '애프터워크',
        price: '40,000원',
        duration: '7시간',
        rating: 4.3,
        reviews: 92,
        description:
          '예술버스투어 프로그램으로 광주 문화예술을 체험하는 원데이 투어!',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1468.webp',
        spots: ['국립 아시아 문화거리', '펭귄마을'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 20,
        category: 'activity',
        name: '[퇴근후 프로젝트] 야시장 마스터',
        company: '애프터워크',
        price: '25,000원',
        duration: '2시간',
        rating: 4.3,
        reviews: 92,
        description: '퇴근후 야시장 마스터 크루원을 모집합니다!',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1489.webp',
        spots: ['대인시장'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 21,
        category: 'class',
        name: '직접 만드는 김치 클래스',
        company: '애프터워크',
        price: '25,000원',
        duration: '4시간',
        rating: 4.3,
        reviews: 92,
        description: '내가 직접 만들어 먹는 건강한 김치(원재료 현장 구매)',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1435.webp',
        spots: ['광주김치타운'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 22,
        category: 'oneday',
        name: '동화 마을 포토워킹',
        company: '애프터워크',
        price: '39,000원',
        duration: '6시간',
        rating: 4.3,
        reviews: 92,
        description: '동심 가득한 마을에서 인생샷 건지는 워킹 프로그램!',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/tour_product_308/1200x720_Untitled-3.jpg',
        spots: ['동화마을'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 23,
        category: 'activity',
        name: '자연 속 야외 요가',
        company: '애프터워크',
        price: '56,000원',
        duration: '2시간 30분',
        rating: 4.3,
        reviews: 92,
        description: '도심 속 자연에서 요가를 경험해보는 프로그램입니다.',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/tour_product_302/1200x720_011.jpg',
        spots: ['용봉초록습지'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 24,
        category: 'linked_event',
        name: '월곡동 세계음식야시장',
        company: '애프터워크',
        price: '30,000원',
        duration: '3시간',
        rating: 4.3,
        reviews: 92,
        description: '광주의 이태원 세계음식문화의거리 월곡동에서 야시장을 즐겨보자',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1441.webp',
        spots: ['월곡동 세계음식문화의거리'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 25,
        category: 'linked_event',
        name: '광주천 마라톤대회',
        company: '애프터워크',
        price: '5,000원',
        duration: '4시간',
        rating: 4.3,
        reviews: 92,
        description: '광주천을 따라 달리는 광주 시민 10KM 마라톤',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1432.webp',
        spots: ['광주천'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 26,
        category: 'class',
        name: '에어프라이어 제빵 클래스',
        company: '애프터워크',
        price: '48,000원',
        duration: '2시간',
        rating: 4.3,
        reviews: 92,
        description:
          '에어프라이어로도 빵을 구울 수 있다는 사실을 알고 계셨나요? 집에서 만들 수 있는 간단 레시피로 나만의 빵을 만들어보세요!',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1505.webp',
        spots: ['애프터워크'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 27,
        category: 'linked_event',
        name: '광주 체육 대전',
        company: '애프터워크',
        price: '10,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description: '광주 시민 중 이 운동은 내가 제일 잘한다를 가리는, 종목별 체육 대전',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1423.webp',
        spots: ['애프터워크'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 28,
        category: 'linked_city',
        name: '[전남·광주] 오늘,북구 투어',
        company: '애프터워크',
        price: '47,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '광주 북구 대표전통시장인 말바우시장과 디자인비엔날레를 함께 즐길 수 있는 투어!',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1510.webp',
        spots: ['말바우시장', '디자인비엔날레'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 29,
        category: 'linked_city',
        name: '[전남·광주] 오늘,동구 투어',
        company: '애프터워크',
        price: '47,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '광주 동구 대표전통시장인 대인시장과 ACC를 함께 즐길 수 있는 투어!',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1508.webp',
        spots: ['대인시장', 'ACC'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 30,
        category: 'linked_city',
        name: '[전남·광주] 오늘,서구 투어',
        company: '애프터워크',
        price: '47,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '광주 서구 대표전통시장인 양동시장과 양림동을 함께 즐길 수 있는 투어!',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXAFTERW/media_images/1509.webp',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 31,
        category: 'linked_city',
        name: '뛰어난 해수욕장 풍광과 서해낙조를 감상해보자 영광 가마미 해수욕장',
        company: '오리온플래닛투어',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '뛰어난 해수욕장 풍광과 서해낙조를 감상해보자 영광 가마미 해수욕장',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_513/1200x720_1729042712050.jpg',
        spots: ['영광', '영광해수욕장'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },

      {
        id: 32,
        category: 'linked_city',
        name: '명량 바다를 케이블카에서 감상해보자 진도 명량 해상케이블카',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '명량 바다를 케이블카에서 감상해보자 진도 명량 해상케이블카',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_512/1200x720_1729042530045.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 33,
        category: 'linked_city',
        name: '자연 환경이 주는 휴식공간 지리산 온천랜드',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '자연 환경이 주는 휴식공간 지리산 온천랜드',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_511/1200x720_1729042399856.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 34,
        category: 'linked_city',
        name: '달콤한 관광을 즐겨보자 곡성 멜론마을과 멜롱쌀롱',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '달콤한 관광을 즐겨보자 곡성 멜론마을과 멜롱쌀롱',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_510/1200x720_1729042295249.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 35,
        category: 'linked_city',
        name: '아름다운 바다 분수를 감상해보자 목포 평화광장&춤추는 바다분수',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '아름다운 바다 분수를 감상해보자 목포 평화광장&춤추는 바다분수',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_509/1200x720_1729042182601.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 36,
        category: 'linked_city',
        name: '평화롭고 한적한 시골 영화촌 장성 금곡영화촌',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '평화롭고 한적한 시골 영화촌 장성 금곡영화촌',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_508/1200x720_1729042020414.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 37,
        category: 'linked_city',
        name: '홍길동 도출 체험을 해보자 장성 홍길동 테마파크',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '홍길동 도출 체험을 해보자 장성 홍길동 테마파크',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_507/1200x720_1729041948959.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 38,
        category: 'linked_city',
        name: '월출산의 정기를 느껴보자 영암 기찬랜드',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '월출산의 정기를 느껴보자 영암 기찬랜드',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_506/1200x720_1729040806622.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 39,
        category: 'linked_city',
        name: '기차를 타고 옛 정취를 느껴보자 곡성 섬진강 기차마을',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '기차를 타고 옛 정취를 느껴보자 곡성 섬진강 기차마을',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_505/1200x720_1729040264277.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 40,
        category: 'linked_city',
        name: '고구려의 전통문화를 체험해보자 나주 영상테마파크',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '고구려의 전통문화를 체험해보자 나주 영상테마파크',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_504/1200x720_1729039693340.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 41,
        category: 'linked_city',
        name: '겨울 목포 둘러보기',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '겨울 목포 둘러보기',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_503/1200x720_1728984747976.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 42,
        category: 'linked_city',
        name: '아름다운 자연 경관을 구경해보자 영광 숲쟁이공원',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '아름다운 자연 경관을 구경해보자 영광 숲쟁이공원',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_502/1200x720_1728984667962.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 43,
        category: 'linked_city',
        name: '조상들의 농업 환경을 알아보자 영암 전라남도 농업박물관',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '조상들의 농업 환경을 알아보자 영암 전라남도 농업박물관',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_501/1200x720_1728984569830.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },   
      {
        id: 44,
        category: 'linked_city',
        name: '다양한 공룡 화석과 조형물을 볼 수 있는 해남 공룡박물관',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '다양한 공룡 화석과 조형물을 볼 수 있는 해남 공룡박물관',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_500/1200x720_1728984430880.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },   
      {
        id: 45,
        category: 'linked_city',
        name: '46억년의 자연사와 지역문화예술이 담긴 목포 자연사 박물관',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '46억년의 자연사와 지역문화예술이 담긴 목포 자연사 박물관',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_499/1200x720_1728984248070.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },   
      {
        id: 46,
        category: 'linked_city',
        name: '조상들의 생활 문화를 체험해보자 영광 우리삶문화 옥당박물관',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '조상들의 생활 문화를 체험해보자 영광 우리삶문화 옥당박물관',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_498/1200x720_1728984136739.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },   
      {
        id: 47,
        category: 'linked_city',
        name: '철새들의 천국 해남으로 가보자 해남 조류 생태관',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '철새들의 천국 해남으로 가보자 해남 조류 생태관',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_497/1200x720_1728983930186.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },   
      {
        id: 48,
        category: 'linked_city',
        name: '다양한 차 콘텐츠를 체험해보자 보성 한국차박물관',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '다양한 차 콘텐츠를 체험해보자 보성 한국차박물관',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_496/1200x720_1728983831132.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },   
      {
        id: 49,
        category: 'linked_city',
        name: '시의 향기에 흠뻑 젖어보자 강진 시문학파기념관',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '시의 향기에 흠뻑 젖어보자 강진 시문학파기념관',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_495/1200x720_1728983673153.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },   
      {
        id: 50,
        category: 'linked_city',
        name: '최서남단 섬 탐방',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '최서남단 섬 탐방',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_494/1200x720_1728983556304.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },   
      {
        id: 51,
        category: 'linked_city',
        name: '영화 살인의 추억 촬영지 장성 축령산',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '영화 살인의 추억 촬영지 장성 축령산',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_493/1200x720_1728983153085.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },         
 
      {
        id: 52,
        category: 'linked_city',
        name: '마음 충전 해남·완도 감성여행',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '마음 충전 해남·완도 감성여행',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_492/1200x720_1728982991502.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },         
 
      {
        id: 53,
        category: 'linked_city',
        name: '역사와 예술이 흐르는 해안 드라이브',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '역사와 예술이 흐르는 해안 드라이브',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_491/1200x720_1728982793499.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },         
 
      {
        id: 54,
        category: 'linked_city',
        name: '영광 백수해안도로와 함평생태공원 나주 황포돛배 여행',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '영광 백수해안도로와 함평생태공원 나주 황포돛배 여행',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_490/1200x720_1728982627313.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },         
 
      {
        id: 55,
        category: 'linked_city',
        name: '남도 예술의 혼',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '남도 예술의 혼',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_489/1200x720_1728982335157.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },         
 
      {
        id: 56,
        category: 'linked_city',
        name: '한 편의 드라마의 주인공이 될 수 있는 순천드라마촬영장',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '한 편의 드라마의 주인공이 될 수 있는 순천드라마촬영장',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_488/1200x720_1728982204214.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },         
 
      {
        id: 57,
        category: 'linked_city',
        name: '대나무 숲과 자연이 주는 휴식 담양 죽녹원',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '대나무 숲과 자연이 주는 휴식 담양 죽녹원',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_487/1200x720_1728981924166.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },         
 
      {
        id: 58,
        category: 'linked_city',
        name: '시원한 강바람과 따뜻한 햇살 영산강 황포돛배',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '시원한 강바람과 따뜻한 햇살 영산강 황포돛배',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_486/1200x720_1728981788057.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },   
      {
        id: 59,
        category: 'linked_city',
        name: '향기로운 자연 농원 보성 대한다원관광농원(보성녹차밭)',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '향기로운 자연 농원 보성 대한다원관광농원(보성녹차밭)',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_485/1200x720_1728981676794.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },        
      {
        id: 60,
        category: 'linked_city',
        name: '자연과 사람이 나란히 걷는 길 순천 은가람 길',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '자연과 사람이 나란히 걷는 길 순천 은가람 길',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_484/1200x720_1.jpg',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },        
      {
        id: 61,
        category: 'linked_city',
        name: '스리술쩍 미슐랭트립 광주의 숨은 술을 찾아보자',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '스리술쩍 미슐랭트립 광주의 숨은 술을 찾아보자',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_396/1200x720_a89e0e9174dfc.webp',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },        
      {
        id: 62,
        category: 'linked_city',
        name: '아시아문화예술투어',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '아시아문화예술투어',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_4271/1200x720_%EC%98%A4%ED%94%8C%ED%88%AC%20%EB%AC%B8%ED%99%94%20%ED%88%AC%EC%96%B4%20%EC%9B%B9%EB%94%94%EC%9E%90%EC%9D%B8%20%EC%A0%95%EB%A6%AC_%EB%8C%80%EC%A7%80%201%20%EC%82%AC%EB%B3%B8%208.webp',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },        
      {
        id: 63,
        category: 'linked_city',
        name: '문화예술버스투어',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '문화예술버스투어',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_4270/1200x720_%EC%98%A4%ED%94%8C%ED%88%AC%20%EB%AC%B8%ED%99%94%20%ED%88%AC%EC%96%B4%20%EC%9B%B9%EB%94%94%EC%9E%90%EC%9D%B8%20%EC%A0%95%EB%A6%AC_%EB%8C%80%EC%A7%80%201%20%EC%82%AC%EB%B3%B8%206.webp',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 64,
        category: 'linked_city',
        name: '구석구석 골목길 투어',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '구석구석 골목길 투어',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_4269/1200x720_%EC%98%A4%ED%94%8C%ED%88%AC%20%EB%AC%B8%ED%99%94%20%ED%88%AC%EC%96%B4%20%EC%9B%B9%EB%94%94%EC%9E%90%EC%9D%B8%20%EC%A0%95%EB%A6%AC_%EB%8C%80%EC%A7%80%201%20%EC%82%AC%EB%B3%B8%204.webp',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },     
      {
        id: 65,
        category: 'linked_city',
        name: '문화누리투어 동구편',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '문화누리투어 동구편',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_4257/1200x720_%EC%98%A4%ED%94%8C%ED%88%AC%20%EB%AC%B8%ED%99%94%20%ED%88%AC%EC%96%B4%20%EC%9B%B9%EB%94%94%EC%9E%90%EC%9D%B8%20%EC%A0%95%EB%A6%AC4_%EB%8C%80%EC%A7%80%201%20%EC%82%AC%EB%B3%B8%208.webp',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },     
      {
        id: 66,
        category: 'linked_city',
        name: '문화누리투어 화순편',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '문화누리투어 화순편',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_4256/1200x720_%EC%98%A4%ED%94%8C%ED%88%AC%20%EB%AC%B8%ED%99%94%20%ED%88%AC%EC%96%B4%20%EC%9B%B9%EB%94%94%EC%9E%90%EC%9D%B8%20%EC%A0%95%EB%A6%AC4_%EB%8C%80%EC%A7%80%201%20%EC%82%AC%EB%B3%B8%206.webp',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },     
      {
        id: 67,
        category: 'linked_city',
        name: '웰니스 남도기행(광주 출발)',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '웰니스 남도기행(광주 출발)',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_4254/1200x720_%EC%98%A4%ED%94%8C%ED%88%AC%20%EB%AC%B8%ED%99%94%20%ED%88%AC%EC%96%B4%20%EC%9B%B9%EB%94%94%EC%9E%90%EC%9D%B8%20%EC%A0%95%EB%A6%AC4_%EB%8C%80%EC%A7%80%201%20%EC%82%AC%EB%B3%B8%202.webp',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },     
      {
        id: 68,
        category: 'linked_city',
        name: '웰니스 남도기행(서울 출발)',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '웰니스 남도기행(서울 출발)',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_4255/1200x720_%EC%98%A4%ED%94%8C%ED%88%AC%20%EB%AC%B8%ED%99%94%20%ED%88%AC%EC%96%B4%20%EC%9B%B9%EB%94%94%EC%9E%90%EC%9D%B8%20%EC%A0%95%EB%A6%AC4_%EB%8C%80%EC%A7%80%201%20%EC%82%AC%EB%B3%B8%204.webp',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },     
      {
        id: 69,
        category: 'linked_city',
        name: '쓰담쓰담 담양투어',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '쓰담쓰담 담양투어',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_4233/1200x720_%EC%98%A4%ED%94%8C%ED%88%AC%20%EC%8B%A0%EC%95%88%20%EC%97%AC%EC%88%98%20%EB%8B%B4%EC%96%91%20%EC%9B%B9%EB%94%94%EC%9E%90%EC%9D%B8_%EB%8C%80%EC%A7%80%201%20%EC%82%AC%EB%B3%B8%204.webp',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },     
      {
        id: 70,
        category: 'linked_city',
        name: '한여름 워크샵&캠핑투어',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '한여름 워크샵&캠핑투어',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_4242/1200x720_%EC%98%A4%ED%94%8C%ED%88%AC%20%EB%AC%B8%ED%99%94%EB%88%84%EB%A6%AC%20%ED%95%9C%EC%97%AC%EB%A6%84%20%EC%9B%8C%ED%81%AC%EC%83%B5%20%EB%AC%B4%EB%93%B1%EC%9C%A0%EB%9E%8C%20MZ%EC%9D%B8%EB%AC%B8%EB%A0%A5%20%ED%88%AC%EC%96%B4%20%EC%9B%B9%EB%94%94%EC%9E%90%EC%9D%B8_%EB%8C%80%EC%A7%80%201%20%EC%82%AC%EB%B3%B8%202.webp',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },     
      {
        id: 71,
        category: 'linked_city',
        name: 'MZ인문력 향상 광주 동구와 해남 역사투어',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          'MZ인문력 향상 광주 동구와 해남 역사투어',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_4244/1200x720_%EC%98%A4%ED%94%8C%ED%88%AC%20%EB%AC%B8%ED%99%94%EB%88%84%EB%A6%AC%20%ED%95%9C%EC%97%AC%EB%A6%84%20%EC%9B%8C%ED%81%AC%EC%83%B5%20%EB%AC%B4%EB%93%B1%EC%9C%A0%EB%9E%8C%20MZ%EC%9D%B8%EB%AC%B8%EB%A0%A5%20%ED%88%AC%EC%96%B4%20%EC%9B%B9%EB%94%94%EC%9E%90%EC%9D%B8_%EB%8C%80%EC%A7%80%201%20%EC%82%AC%EB%B3%B8%206.webp',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
      {
        id: 72,
        category: 'linked_city',
        name: '문화누리투어(곡성편)',
        company: '애프터워크',
        price: '69,000원',
        duration: '9시간',
        rating: 4.3,
        reviews: 92,
        description:
          '문화누리투어(곡성편)',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_4241/1200x720_%EC%98%A4%ED%94%8C%ED%88%AC%20%EB%AC%B8%ED%99%94%EB%88%84%EB%A6%AC%20%ED%95%9C%EC%97%AC%EB%A6%84%20%EC%9B%8C%ED%81%AC%EC%83%B5%20%EB%AC%B4%EB%93%B1%EC%9C%A0%EB%9E%8C%20MZ%EC%9D%B8%EB%AC%B8%EB%A0%A5%20%ED%88%AC%EC%96%B4%20%EC%9B%B9%EB%94%94%EC%9E%90%EC%9D%B8_%EB%8C%80%EC%A7%80%201.webp',
        spots: ['양동시장', '양림동'],
        benefits: ['카페 투어', '커피 시음', '힙플 체험', '무료 참여'],
      },
            
                   
 

 
     



















































    ],

    
    // 나중에 쓰일 수 있으니까 일단 기존 구조는 남겨둠
    history: [
      {
        id: 6,
        name: '북구상생 힐링투어 트립 투 메모리',
        company: '광주광역시 북구',
        price: '무료',
        duration: '6시간',
        rating: 4.7,
        reviews: 124,
        description:
          '광주디자인비엔날레, 남도향토음식박물관, 말바우시장을 둘러보는 북구상생 힐링투어',
        image:
          'https://octopus.gcdn.ntruss.com/OCTOPUS/upload/DXORION/tour_product_4012/1200x720_%EC%98%A4%ED%94%8C%ED%88%AC%20%ED%8A%B8%EB%A6%BD%ED%88%AC%EB%A9%94%EB%AA%A8%EB%A6%AC-07.webp',
        spots: ['광주디자인비엔날레', '남도향토음식박물관', '말바우시장'],
        benefits: ['힐링 투어', '자연 체험', '추억 만들기', '무료 참여'],
      },
    ],
    shopping: [
      {
        id: 7,
        name: '광주 백화점 쇼핑 투어',
        company: '광주쇼핑투어',
        price: '40,000원',
        duration: '5시간',
        rating: 4.4,
        reviews: 78,
        description:
          '신세계백화점, 롯데백화점, 광주세정아울렛을 둘러보는 프리미엄 쇼핑 투어',
        image: '/images/shinsegae_gwangju.jpg',
        spots: ['신세계백화점 광주신세계점', '롯데백화점 광주점', '광주세정아울렛'],
        benefits: ['쇼핑 할인권', '전용 라운지', '배송 서비스'],
      },
    ],
    nature: [
      {
        id: 8,
        name: '무등산 등산 투어',
        company: '광주등산클럽',
        price: '18,000원',
        duration: '8시간',
        rating: 4.9,
        reviews: 145,
        description: '무등산 정상을 오르는 본격적인 등산 투어',
        image: '/images/mudeungsan.jpg',
        spots: ['무등산'],
        benefits: ['등산 장비 제공', '점심 제공', '응급 처치'],
      },
    ],
  };

  const allTours = tours.all;

  return (
    <>
      <div className="tours-container">
        {/* 전체 헤더 */}
        <div className="tours-header">
          <h2 className="section-title">외부 투어 목록</h2>
          <div className="tours-count-header">{allTours.length}개의 투어</div>
        </div>

        {/* 카테고리별 렌더링 */}
        {CATEGORY_CONFIG.map((cat) => {
          const categoryTours = allTours.filter(
            (tour) => tour.category === cat.key
          );

          if (categoryTours.length === 0) return null;

          return (
            <div key={cat.key} className="tours-category-block">
              <div className="tours-header">
                <h2 className="section-title">{cat.label}</h2>
                <div className="tours-count-header">
                  {categoryTours.length}개의 투어
                </div>
           

              </div>

              <div className="tours-list">
                {categoryTours.map((tour) => (
                  <div key={tour.id} className="tour-item">
                    <div className="tour-image">
                      <img src={tour.image} alt={tour.name} />
                    </div>

                    <div className="tour-info">
                      <h3 className="tour-name">{tour.name}</h3>
                      <div className="tour-price-row">
                        <div className="tour-price">{tour.price}</div>
                        <button
                          className="tour-button"
                          onClick={() =>
                            onNavigateToPage('tour-detail', tour.id)
                          }
                        >
                          자세히 보기
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {allTours.length === 0 && (
          <div className="no-tours">
            <div className="no-tours-icon">🔍</div>
            <h3>투어가 없습니다</h3>
            <p>나중에 다시 확인해주세요</p>
          </div>
        )}
      </div>
    </>
  );
};

export default TourSelectionPage;
