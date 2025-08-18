# 🏪 Store Management Admin

매장 관리 시스템의 관리자 웹 애플리케이션입니다. React 19, TypeScript, Redux Toolkit을 기반으로 구축되었으며, 매장과 사용자 정보를 효율적으로 관리할 수 있습니다.

## ✨ 주요 기능

- 🔐 **인증 시스템**: JWT 기반 로그인/로그아웃
- 🏪 **매장 관리**: 매장 생성, 수정, 삭제
- 👥 **사용자 관리**: 매장별 사용자 계정 관리
- 📊 **대시보드**: 전체 현황 요약 정보
- 📱 **반응형 디자인**: 모바일과 데스크톱 지원
- 🎯 **통합 알림 시스템**: 성공, 에러, 확인 다이얼로그, 토스트 알림
- 🚀 **자동 에러 처리**: API 에러 및 성공 메시지 자동 표시
- 🔄 **자동 토큰 갱신**: 401 에러 시 자동으로 refreshToken으로 새 토큰 발급
- 🛡️ **보안 토큰 관리**: 쿠키 기반 refreshToken, 메모리 기반 accessToken
- 🚪 **자동 인증 복구**: 페이지 새로고침 시 자동으로 인증 상태 복구

## 🛠️ 기술 스택

### Frontend
- **React 19** - 최신 React 버전
- **TypeScript 5.9** - 타입 안전성
- **Vite 7** - 빠른 개발 서버 및 빌드 도구
- **Redux Toolkit** - 상태 관리
- **React Router DOM 7** - 클라이언트 사이드 라우팅

### UI/UX
- **CSS Modules** - 스타일 관리
- **SweetAlert2** - 사용자 친화적 알림
- **반응형 디자인** - 모바일 최적화

### 개발 도구
- **ESLint** - 코드 품질 관리
- **TypeScript ESLint** - TypeScript 전용 린팅
- **Vite** - 개발 서버 및 빌드 최적화

## 📁 프로젝트 구조

```
store-management-admin/
├── public/                 # 정적 파일
│   └── admin.png
├── src/
│   ├── app/               # 앱 진입점
│   │   ├── App.tsx        # 메인 앱 컴포넌트
│   │   ├── App.css        # 앱 스타일
│   │   ├── main.tsx       # 앱 마운트
│   │   └── index.css      # 글로벌 스타일
│   ├── assets/            # 에셋 파일
│   │   └── images/        # 이미지 파일
│   ├── features/          # 기능별 컴포넌트
│   │   ├── Auth/          # 인증 관련
│   │   │   └── Login.tsx  # 로그인 컴포넌트
│   │   ├── Dashboard/     # 대시보드
│   │   │   └── Dashboard.tsx
│   │   ├── Store/         # 매장 관리
│   │   │   ├── StoreList.tsx
│   │   │   └── StoreModal.tsx
│   │   └── User/          # 사용자 관리
│   │       ├── UserList.tsx
│   │       └── UserModal.tsx
│   ├── shared/            # 공통 컴포넌트 및 유틸리티
│   │   ├── components/    # 공통 컴포넌트
│   │   │   └── Layout/    # 레이아웃 컴포넌트
│   │   │       ├── Header.tsx
│   │   │       ├── MainLayout.tsx
│   │   │       └── Sidebar.tsx
│   │   ├── styles/        # 스타일 파일
│   │   ├── types/         # TypeScript 타입 정의
│   │   │   ├── auth.types.ts
│   │   │   ├── api.types.ts
│   │   │   ├── store.types.ts
│   │   │   └── index.ts
│   │   └── utils/         # 유틸리티 함수
│   │       ├── axiosInstance.ts
│   │       ├── alertUtils.ts
│   │       └── useAppInitialization.ts
│   └── store/             # Redux 상태 관리
│       ├── store.ts        # Redux 스토어 설정
│       ├── userSlice.ts    # 사용자 상태 관리
│       └── loadingSlice.ts # 로딩 상태 관리
├── package.json            # 프로젝트 의존성
├── tsconfig.json          # TypeScript 설정
├── vite.config.ts         # Vite 설정
└── README.md              # 프로젝트 문서
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **빌드**
   ```bash
   npm run build
   ```

4. **코드 린팅**
   ```bash
   npm run lint
   ```

## 🔧 개발 환경 설정

### 환경 변수
백엔드 API 서버 URL을 설정해야 합니다:
```typescript
// src/shared/utils/axiosInstance.ts
const baseUrl = 'http://localhost:8080/api'; // 백엔드 서버 URL
```

### TypeScript 경로 별칭
프로젝트에서는 경로 별칭을 사용하여 깔끔한 import를 지원합니다:
```typescript
import { Store } from '@types';           // src/shared/types
import { axiosInstance } from '@utils';    // src/shared/utils
import { Header } from '@components';      // src/shared/components
```

## 📱 주요 컴포넌트

### 인증 시스템
- **Login.tsx**: 사용자 로그인 폼
- **useAppInitialization**: 앱 시작 시 자동 인증 상태 확인

### 매장 관리
- **StoreList.tsx**: 매장 목록 표시 및 관리
- **StoreModal.tsx**: 매장 생성/수정 모달

### 사용자 관리
- **UserList.tsx**: 매장별 사용자 목록 관리
- **UserModal.tsx**: 사용자 생성/수정 모달

### 레이아웃
- **MainLayout.tsx**: 메인 레이아웃 구조
- **Header.tsx**: 상단 헤더 (로그아웃, 사용자 정보)
- **Sidebar.tsx**: 사이드바 네비게이션

### 공통 유틸리티
- **alertUtils.ts**: 통합된 알림 시스템 (성공, 에러, 확인 다이얼로그, 토스트)
- **axiosInstance.ts**: HTTP 클라이언트 및 인터셉터 설정
- **useAppInitialization.ts**: 앱 시작 시 자동 인증 상태 확인 및 토큰 갱신

### 인증 상태 관리
```typescript
// useAppInitialization.ts - 앱 시작 시 자동 실행
useEffect(() => {
  const initializeApp = async () => {
    try {
      // 1. 쿠키의 refreshToken으로 자동 로그인 시도
      const response = await publicAxiosInstance.post("/auth/admin/refresh-token");
      
      // 2. 새로운 Access Token으로 Redux store 업데이트
      dispatch(loginSuccess(response.data));
      
      // 3. 대시보드로 자동 리다이렉트
      navigate("/dashboard");
    } catch (error) {
      // 4. 토큰이 유효하지 않으면 로그인 페이지로 이동
      navigate("/login");
    }
  };

  initializeApp();
}, []);
```

## 🔐 인증 및 보안

### JWT 토큰 기반 인증
- **Access Token**: API 요청 시 사용되는 단기 토큰
- **Refresh Token**: Access Token 갱신용 장기 토큰 (쿠키에 저장)
- **자동 토큰 갱신**: 토큰 만료 시 자동으로 새로운 Access Token 발급

### 토큰 관리 시스템
```typescript
// Redux store에서 사용자 정보 및 토큰 관리
interface UserState {
  userInfo: UserInfo | null;  // 사용자 정보 + Access Token
}

// 토큰 자동 갱신 흐름
1. API 요청 → 401 에러 (토큰 만료)
2. axiosInstance 인터셉터에서 자동 감지
3. refreshToken으로 새로운 Access Token 요청
4. Redux store 업데이트
5. 원래 요청 자동 재시도
```

### 보안 기능
- **쿠키 기반 Refresh Token**: XSS 공격 방지
- **자동 로그아웃**: Refresh Token 만료 시 자동 로그아웃
- **보안된 API 엔드포인트**: 인증이 필요한 모든 요청에 토큰 자동 추가

## 🌐 API 통신

### HTTP 클라이언트 설정
- **Axios 기반**: 안정적이고 확장 가능한 HTTP 클라이언트
- **요청/응답 인터셉터**: 모든 API 요청/응답에 대한 자동 처리
- **자동 에러 핸들링**: `alertUtils`를 통한 일관된 사용자 피드백
- **자동 성공 메시지**: 서버 응답에서 성공 메시지 자동 표시
- **로딩 상태 관리**: 전역 로딩 인디케이터

### 요청 인터셉터
- **자동 토큰 추가**: 모든 인증이 필요한 요청에 `Authorization` 헤더 자동 추가
- **로딩 상태 관리**: 요청 시작/종료 시 전역 로딩 상태 자동 업데이트

## 📊 상태 관리

Redux Toolkit을 사용한 전역 상태 관리:

### 사용자 상태 관리 (userSlice)
```typescript
interface UserState {
  userInfo: UserInfo | null;
}

interface UserInfo {
  userId: number;
  loginId: string;
  storeId: number;
  userName: string;
  accessToken: string;  // JWT Access Token
}

// 주요 액션들
- loginSuccess(userData): 로그인 성공 시 사용자 정보 저장
- updateAccessToken(token): 토큰 갱신 시 새 토큰으로 업데이트
- logout(): 로그아웃 시 사용자 정보 초기화
```

### 로딩 상태 관리 (loadingSlice)
```typescript
interface LoadingState {
  isLoading: boolean;
}

// 모든 API 요청에 대해 자동으로 로딩 상태 관리
- startLoading(): 요청 시작 시 로딩 시작
- stopLoading(): 요청 완료 시 로딩 종료
```

### 상태 지속성
- **메모리 기반**: 페이지 새로고침 시 자동으로 `useAppInitialization` 실행
- **자동 복구**: 유효한 refreshToken이 있으면 자동으로 로그인 상태 복구

## 🎨 스타일링

- CSS Modules를 사용한 컴포넌트별 스타일 관리
- 반응형 디자인으로 모바일 최적화
- 일관된 UI/UX 패턴 적용

## �� 개발 및 테스트

### 개발 서버
```bash
npm run dev
```
- Vite HMR 지원
- TypeScript 컴파일
- ESLint 실시간 검사

### 빌드 최적화
```bash
npm run build
```
- TypeScript 타입 체크
- Vite 빌드 최적화
- 번들 크기 분석

## 📝 코드 컨벤션

- **TypeScript**: 엄격한 타입 체크
- **ESLint**: 코드 품질 및 일관성
- **컴포넌트 구조**: 기능별 폴더 구조
- **타입 정의**: 공통 타입을 shared/types에 집중
- **알림 시스템**: `alertUtils`를 통한 일관된 사용자 피드백
- **에러 처리**: API 에러는 인터셉터에서 자동 처리, 컴포넌트에서는 직접 `showError()` 호출
- **토큰 관리**: Access Token은 Redux store에서 관리, Refresh Token은 쿠키에서 자동 처리
- **인증 상태**: `useAppInitialization` 훅을 통한 앱 시작 시 자동 인증 상태 확인

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**Store Management Admin** - 효율적인 매장 관리 시스템 🏪✨
