export const categories = {
  유머: ["이슈", "공포미스테리", "정치시사"],
  일상: [
    "패션",
    "운동건강",
    "웹툰웹소설",
    "음악",
    "미술",
    "공부",
    "자동차",
    "자전거",
    "바이크",
    "동물",
    "식물",
    "여행",
    "사진",
    "맛집",
    "자취",
    "직장",
    "연애",
    "요리",
  ],
  투자: ["물물거래", "쇼핑", "주식", "차트", "가상화폐", "부동산"],
  스포츠: [
    "축구",
    "야구",
    "농구",
    "배구",
    "하키",
    "미식축구",
    "격투기",
    "레슬링",
    "e스포츠",
    "골프",
    "기타스포츠",
    "롤",
    "피파",
    "메이플스토리",
    "로스트아크",
    "던전앤파이터",
    "포켓몬스터",
    "롤토체스",
    "디아블로",
    "거상",
    "이터널리턴",
    "FM",
    "원신",
    "바람:연",
    "스타레일",
    "우마무스메",
    "소녀전선",
    "던전앤파이터모바일",
  ],
  연예: ["방송", "걸그룹", "보이그룹", "연예인", "영화", "트로트"],
  물물교환: ["가전", "전자기기", "의류", "도서", "티켓·교환권", "잡화", "미용"],
};

export const categoryEN2KO = {
  humor: "유머",
  entertain: "게임·스포츠",
  life: "일상",
  brodcast: "연예·방송",
  travel: "여행",
  hobby: "취미",
  economic: "경제·금융",
  issue: "시사·이슈",
  invest: "투자",
  sports: "스포츠",
  entertain: "연예",
  barter: "물물교환",
};

export const categoryKO2EN = {
  유머: "humor",
  "게임·스포츠": "entertain",
  "연예·방송": "brodcast",
  여행: "travel",
  취미: "hobby",
  "경제·금융": "economic",
  "시사·이슈": "issue",
  일상: "life",
  투자: "invest",
  스포츠: "sports",
  연예: "entertain",
  물물교환: "barter",
};

export const meta = {
  metadataBase: new URL("https://www.clipmk.com"),
  title:
    "클립마켓 | clipmarket | 커뮤니티 | 유머/이슈/일상 | 물물교환/중고거래",
  description:
    "당신을 위한 하꼬 커뮤니티, <클립마켓>을 당신의 이야기로 채워주세요",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_URL_CLI,
    languages: {
      "ko-KR": "/ko-KR",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title:
      "클립마켓 | clipmarket | 커뮤니티 | 유머/이슈/일상 | 물물교환/중고거래",
    description:
      "당신을 위한 하꼬 커뮤니티, <클립마켓>을 당신의 이야기로 채워주세요",
    url: process.env.NEXT_PUBLIC_URL_CLI,
    siteName: "클립마켓",
    images: [
      {
        url: null,
        width: 800,
        height: 600,
        alt: "img",
      },
    ],
    locale: "ko-KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "클립마켓 | clipmarket | 커뮤니티 | 유머/이슈/일상 | 물물교환/중고거래",
    description:
      "당신을 위한 하꼬 커뮤니티, <클립마켓>을 당신의 이야기로 채워주세요",
    images: ["you_url_here"],
  },
};
