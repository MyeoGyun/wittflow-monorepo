# AI Agent & Development Guidelines (AI_CONVENTION)

이 문서는 AI 에이전트 및 개발자가 **Wittflow** 프로젝트를 진행할 때 반드시 준수해야 할 규칙과 가이드라인을 정의합니다.

## 1. 🛠️ Tech Stack & Versions

프로젝트는 다음 기술 스택의 최신 안정 버전 사용을 원칙으로 합니다.

### Frontend (`apps/web`)
- **Framework**: Next.js 14+ (App Router 필수)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS, **shadcn/ui** (components/ui), Radix UI
- **State Management**: Zustand (Global), React Query (Server State)
- **Form**: React Hook Form + Zod

### Backend (`apps/api`)
- **Framework**: Django 5+
- **Language**: Python 3.12+
- **Database**: PostgreSQL 16
- **API**: Django REST Framework (DRF)
- **Validation**: Pydantic (Internal), DRF Serializers (API)

### shared (`packages/*`)
- **Manager**: pnpm (workspace)
- **Validation**: Zod (Shared Types & DTO)

---

## 2. 👨‍💻 Coding Standards

### General
- **Naming**: 변수/함수는 `camelCase`, 클래스/컴포넌트는 `PascalCase`, 상수는 `UPPER_SNAKE_CASE`를 사용합니다.
- **Comments**: 복잡한 로직에는 반드시 한국어로 주석을 작성합니다.

### Frontend Rules
1. **Component Design**:
    - 모든 컴포넌트는 `Arrow Function`으로 작성합니다. (`const Component = () => {}`)
    - `shadcn/ui` 컴포넌트는 `packages/ui`에서 import 하여 사용하거나, 프로젝트 내 설정된 경로를 따릅니다.
2. **Type Safety**:
    - `any` 사용을 엄격히 금지합니다.
    - API 응답 타입은 반드시 `@wittflow/shared-types`의 DTO를 사용합니다.

### Backend Rules
1. **Directory Structure**:
    - `Service Layer` 패턴을 적용하여 비즈니스 로직을 View에서 분리합니다. (`services/`)
    - `Selectors` 패턴을 사용하여 복잡한 쿼리를 분리합니다. (`selectors/`)
2. **Respose Format**:
    - 모든 API 응답은 `shared-types`에 정의된 `ApiResponse` 형식을 따릅니다.
    ```json
    { "success": true, "data": { ... }, "error": null }
    ```

---

## 3. 🏗️ Monorepo Architecture

- **`packages/shared-types`**:
    - 프론트엔드와 백엔드 간의 데이터 계약(Contract)입니다.
    - API 요청/응답 스펙 변경 시 이곳을 가장 먼저 수정해야 합니다.
    - Zod 스키마를 기반으로 타입을 생성(`z.infer`)하여 사용합니다.

---

## 4. 🔄 Git Workflow & AI Interaction

AI 에이전트와 협업 시 아래의 Git 워크플로우를 **엄격히 준수**해야 합니다.

### 4.1 Branching Strategy (브랜치 전략)
작업 단위는 명확하고 작게 유지하며, 작업 내용에 맞는 브랜치를 생성하여 진행합니다.

1.  **브랜치 생성**: 작업 명을 기반으로 `feat/`, `fix/`, `refactor/` 등의 접두어를 사용하여 생성합니다.
    - 예: `feat/login-page-ui`, `fix/api-cors-issue`
2.  **작업 진행 (Commit & Push)**:
    - 해당 브랜치에서 작업을 진행합니다.
    - 작업 중간중간 의미 있는 단위로 커밋합니다.
3.  **사용자 확인 (Review)**:
    - 작업이 완료되면 사용자에게 알리고(`notify_user`), 코드 리뷰를 요청합니다.
4.  **Merge to `dev`**:
    - 사용자의 승인이 떨어지면 `dev` 브랜치로 병합(Merge)합니다. (현재 `dev`가 없다면 생성 필요)

### 4.2 Commit Message Convention (커밋 메시지 규칙)
모든 커밋 메시지는 **한국어**로 작성합니다.

- **Format**: `[타입] 작업 내용 요약`
- **Types**:
    - `[기능]`: 새로운 기능 추가 (feat)
    - `[버그]`: 버그 수정 (fix)
    - `[리팩]`: 코드 리팩토링 (refactor)
    - `[문서]`: 문서 수정 (docs)
    - `[설정]`: 빌드, 패키지 매니저 등 설정 변경 (chore)
- **Example**:
    - `[기능] 로그인 페이지 UI 구현`
    - `[버그] 회원가입 API 유효성 검사 오류 수정`
    - `[설정] pnpm 워크스페이스 설정 추가`

### 4.3 AI Agent Process
AI는 작업을 시작하기 전 스스로 다음을 자문해야 합니다.
1. "이 작업이 어떤 브랜치에서 진행되어야 하는가?"
2. "커밋 메시지는 한국어로 작성했는가?"
3. "사용자의 최종 확인을 받았는가?"

---

## 5. 🧪 Testing & Quality Assurance

- **Mandatory Testing**: 주요 비즈니스 로직은 반드시 테스트 코드를 작성해야 합니다.
    - **Frontend**: 유틸리티 함수 및 복잡한 컴포넌트 로직은 `vitest`로 테스트합니다.
    - **Backend**: API 엔드포인트 및 서비스 로직은 `django.test` (Pytest)로 테스트합니다.
- **Verification**: 구현 후에는 반드시 테스트를 실행하여 무결성을 검증해야 합니다.

## 6. 📝 Documentation & Implementation Hygiene

AI 및 개발자는 구현 작업 시 다음 규칙을 준수하여 프로젝트의 투명성과 정합성을 유지해야 합니다.

### 6.1 Work Logging (작업 내역 기록)
기능 구현이나 주요 업데이트 완료 후, 해당 디렉토리에 **작업 내역을 기록하는 Markdown 파일** (예: `HISTORY.md` 또는 `README_DEV.md`)을 생성하거나 갱신합니다.

- **필수 포함 내용**:
    - **구현 기능 요약**: 무엇을 만들었는지 설명
    - **판단의 근거**: 기술적 의사결정의 이유 및 배경 (Why?)
    - **변경 사항**: 수정된 파일 및 영향 범위

### 6.2 File Management (파일 및 구조 관리)
- **임의 조작 금지**: 명확한 이유나 지시 없이 파일을 생성, 삭제, 수정하지 않습니다.
- **Role Separation (역할 분담 준수)**:
    - 모노레포의 구조적 이점을 해치지 않도록 주의합니다.
    - 공통 로직은 `packages/shared`에, UI 컴포넌트는 `packages/ui`에 위치시킵니다.
    - `apps/web`과 `apps/api` 간의 경계를 명확히 지킵니다.

## 7. 🔒 Environment & Security

- **Environment Variables**:
    - Frontend 변수는 `NEXT_PUBLIC_` 접두사를 사용합니다.
    - 새로운 변수 추가 시 `.env.example`을 반드시 동기화하여 문서화합니다.
- **Data Fetching & Auth**:
    - **Stacks**: Data Fetching은 `fetch` API와 `React Query` 조합을 표준으로 사용합니다.
    - **Auth**: 인증 토큰은 `Authorization: Bearer <token>` 헤더 표준을 따릅니다.
