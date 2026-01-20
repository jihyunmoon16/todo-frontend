# 📋 Smart Todo List (Frontend)

> **생산성을 극대화하는 스마트한 할 일 관리 애플리케이션**  
> 아이젠하워 매트릭스와 뽀모도로 타이머를 결합하여 업무의 우선순위를 정하고 집중력을 높여보세요.

## 📖 프로젝트 소개 (Project Overview)

이 프로젝트는 단순한 할 일 목록을 넘어, 사용자가 **가장 중요한 일에 집중할 수 있도록 돕는 웹 애플리케이션**입니다.  
**React 19**와 **Vite**를 기반으로 구축되었으며, 모던한 UI와 빠른 성능을 제공합니다.  
사용자는 **아이젠하워 매트릭스**를 통해 할 일의 우선순위를 시각적으로 파악하고, 내장된 **뽀모도로 타이머**를 통해 집중 시간을 관리할 수 있습니다.

### ✨ 주요 기능 (Key Features)

-   **🔐 안전한 인증 시스템 (Secure Authentication)**
    -   JWT 기반의 회원가입 및 로그인
    -   Redux Toolkit을 이용한 전역 인증 상태 관리
    -   Axios Interceptor를 통한 자동 토큰 및 에러 핸들링

-   **🎯 스마트 우선순위 관리 (Smart Prioritization - Eisenhower Matrix)**
    -   할 일을 4가지 분면(Quadrant)으로 분류하여 관리
        -   🔥 **긴급하고 중요함 (Critical)**
        -   ⭐ **긴급하지 않지만 중요함 (High)**
        -   ⚡ **긴급하지만 중요하지 않음 (Medium)**
        -   📝 **긴급하지도 중요하지도 않음 (Low)**
    -   직관적인 이모지와 컬러 코딩으로 우선순위 시각화

-   **🍅 뽀모도로 타이머 (Pomodoro Timer)**
    -   **집중 모드 (25분)** 와 **휴식 모드 (5분)** 자동 전환
    -   SVG 기반의 부드러운 원형 프로그래스 타이머 UI
    -   할 일 별 집중 시간 기록 및 서버 동기화
    -   메인 대시보드에서 바로 타이머 시작 가능

-   **🎨 모던하고 반응형 UI**
    -   Glassmorphism 디자인이 적용된 깔끔한 인터페이스
    -   부드러운 모달 및 인터랙션 애니메이션

---

## 🛠 기술 스택 (Tech Stack)

### Frontend
-   **Core**: React 19, Vite
-   **State Management**: Redux Toolkit (Auth & Global State)
-   **Routing**: React Router v7
-   **Styling**: Vanilla CSS (Modular & Responsive Design)
-   **Icons**: Lucide React
-   **Network**: Axios (Instance configuration with Interceptors)
-   **Date Utility**: Day.js

### Tools & DevOps
-   **Package Manager**: NPM
-   **Linting**: ESLint
-   **Version Control**: Git

---

## 📂 프로젝트 구조 (Project Structure)

```
todo-frontend/
├── src/
│   ├── api/            # Axios 설정 및 API 호출 로직
│   ├── assets/         # 이미지 및 정적 파일
│   ├── components/     # 재사용 가능한 UI 컴포넌트
│   ├── pages/          # 페이지 단위 컴포넌트 (Login, Signup, TodoPage)
│   ├── store/          # Redux Store 및 Slice 설정
│   ├── App.jsx         # 메인 앱 컴포넌트 및 라우팅
│   └── main.jsx        # 앱 진입점 (Entry Point)
├── .env                # 환경 변수 설정
└── package.json        # 의존성 및 스크립트 관리
```

---

## 🚀 시작하기 (Getting Started)

이 프로젝트를 로컬 환경에서 실행하려면 다음 단계를 따라주세요.

### 1. 필수 요구사항 (Prerequisites)
-   Node.js (v18 이상 권장)
-   NPM 또는 Yarn

### 2. 설치 (Installation)

```bash
# 저장소 클론
git clone <repository-url>

# 프로젝트 폴더로 이동
cd todo-frontend

# 의존성 설치
npm install
```

### 3. 환경 변수 설정 (Environment Setup)
프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 API 서버 주소를 입력하세요.

```env
VITE_API_URL=http://localhost:8080/api/v1
```

### 4. 실행 (Run)

```bash
# 개발 서버 실행
npm run dev
```
브라우저에서 `http://localhost:5173` 으로 접속하여 확인합니다.

---

## 📸 스크린샷 (Screenshots)

<!-- 포트폴리오용 스크린샷을 여기에 추가하세요 -->
| 로그인 화면 | 할 일 대시보드 |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/ede7a8d8-e8c1-4abd-9f18-022ca965540a" alt="Login Page" width="400"/> | <img src="" alt="Todo Dashboard" width="400"/> |

| 뽀모도로 타이머 | 우선순위 설정 |
|:---:|:---:|
| <img src="" alt="Pomodoro Timer" width="400"/> | <img src="" alt="Priority Modal" width="400"/> |

---

## 🔗 관련 프로젝트 (Related Project)
-   **Backend Repository**: (Spring Boot API Server)
