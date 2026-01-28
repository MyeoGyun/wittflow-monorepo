# Wittflow Monorepo Project

## Project Overview
**Wittflow**는 확장성과 유지보수성을 고려하여 설계된 모노레포(Monorepo) 기반의 웹 애플리케이션 프로젝트입니다.
Frontend(Next.js)와 Backend(Django)를 하나의 저장소에서 통합 관리하며, 공통 로직과 타입, 설정을 패키지화하여 생산성을 극대화했습니다.

## Architecture & Directory Structure

프로젝트는 크게 애플리케이션(`apps`), 공용 패키지(`packages`), 그리고 인프라 설정(`infra`)으로 구성되어 있습니다.

### Apps (Applications)
실제 사용자에게 서빙되는 서비스 애플리케이션입니다.

- **`apps/web`** (Frontend)
  - **Tech Stack**: Next.js, React, TypeScript
  - **Description**: 사용자 인터페이스를 담당하는 웹 클라이언트입니다. SSR/CSR을 적절히 활용하여 최적의 UX를 제공합니다.
- **`apps/api`** (Backend)
  - **Tech Stack**: Django, Python
  - **Description**: 비즈니스 로직과 데이터를 처리하는 RESTful API 서버입니다.

### Packages (Shared Libraries)
여러 애플리케이션에서 공통으로 사용되는 코드와 설정을 모듈화하여 중복을 제거하고 일관성을 유지합니다.

- **`packages/ui`** (Design System)
  - **Tech Stack**: React, Tailwind CSS, Radix UI, **shadcn/ui**
  - **Description**: 재사용 가능한 UI 컴포넌트 라이브러리입니다. `shadcn/ui`를 기반으로 커스텀 디자인 시스템을 구축하여, 모든 앱에서 일관된 사용자 경험을 제공합니다.
- **`packages/shared`**
  - 유틸리티 함수(Utility Functions), 상수(Constants) 등 공통 로직을 포함합니다.
- **`packages/shared-types`**
  - Frontend와 Backend 간의 데이터 규격을 맞추기 위한 DTO(Data Transfer Object) 및 TypeScript 타입 정의, Zod 스키마 등이 위치합니다.
- **`packages/eslint-config`**
  - 프로젝트 전반에 걸쳐 통일된 코드 스타일을 적용하기 위한 ESLint 설정입니다.
- **`packages/tsconfig`**
  - TypeScript 컴파일 옵션을 중앙에서 관리하여 설정의 파편화를 방지합니다.

### Infra (Infrastructure & DevOps)
로컬 개발 환경부터 배포까지의 인프라 구성을 코드로 관리(IaC)합니다.

- **`infra/docker`** : Docker Compose 및 컨테이너 오케스트레이션 설정. Nginx 리버스 프록시 설정 포함.
- **`infra/scripts`** : 자동화된 배포(Deploy) 및 운영 스크립트.
- **`infra/github`** : GitHub Actions workflow 등 CI/CD 파이프라인 관련 리소스.
- **`.github/workflows`** : 실제 CI/CD 파이프라인 정의 파일 (Build, Test, Deploy).

### Documentation
- **`docs/`** : 아키텍처 결정 기록(ADR), API 명세서, ERD 등 프로젝트 관련 상세 문서를 관리합니다.