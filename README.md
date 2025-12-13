📌 Re_View — 리뷰 기반 스킨케어 추천 서비스
Re_View는 사용자 리뷰(텍스트·이미지)와 Baumann 피부타입 분석을 결합하여, 개인 맞춤형 스킨케어 상품과 리뷰를 추천하는 기초 화장품 쇼핑몰

🚀 서비스 목적

* 리뷰 데이터(텍스트·이미지)의 체계적인 수집 및 관리
* Baumann 피부타입 기반 개인 맞춤 추천 제공
* 리뷰·사용자·배너 등 운영자 관리 기능 지원
* 리뷰 기반 추천 로직 실험 및 고도화를 위한 플랫폼 구축

🧠 상품 추천 로직
* 개요
  - Baumann 피부 타입(FIRST, SECOND, THIRD, FOURTH)을 기반으로
  상품과 리뷰를 각각 점수화하여 독립적으로 추천.
  - 추천 결과는 하나의 응답으로 함께 제공.

* 상품 추천 기준 
  - 바우만 타입 매칭: FIRST/SECOND/THIRD/FOURTH 각 항목 일치 시 +30, NULL 시 +10
  - 리뷰 수 가중치: 리뷰 >=50 +20, >=30 +15, >=10 +10 10< +0
  - 총 점수 = 바우만 매칭 점수 + 리뷰 수 가중치
  - 총 점수가 높은 상품 우선 추천

* 리뷰 추천 기준
  - 작성자 바우만 타입과 사용자 바우만 타입 비교
  - FIRST/SECOND/THIRD/FOURTH 각 항목 일치 시 +25
  - 상품 평점 가중치: 상품 평점 × 5
  - 총 점수 = 바우만 매칭 점수 + 상품 평점 가중치
  - 총 점수와 좋아요 수 기준으로 리뷰 우선 추천

* 설계 의도
  - 상품과 리뷰를 분리하여 점수화함으로써 추천 책임을 명확히 분리
  - 상품은 구매 적합도, 리뷰는 신뢰 가능한 경험에 초점
  - Baumann 타입을 정성적 분류가 아닌 정량 점수로 변환하여 정렬 가능하도록 설계

* 향후 추천 고도화 방향
  - 리뷰 작성자 신뢰도 반영
  - 최근 리뷰 가중치 적용
  - 사용자 행동 데이터 기반 개인화 점수 추가
  - 상품–리뷰 교차 추천 로직 도입

🧩 서비스 구성

- BE: Spring Boot 3.5 / Java 21 / MyBatis
- FE: React (SPA, /View)
- DB: Oracle XE (prod), H2 (test)
- S3: MinIO (S3 compatible)
- Infra: Docker, Docker-compose

🔑 핵심 기능
* 사용자 기능
  - 이미지 업로드 및 MinIO 저장
  - Baumann 피부 타입 기반 상품·리뷰 추천
* 관리자 기능
  - 리뷰 신고 처리 
  - 사용자 관리
  - 배너 관리
* 개발 지원 기능
  - springdoc–OpenAPI 기반 API 문서 제공
  - Docker 기반 로컬 개발 및 배포 환경 지원

📁 레포지토리 구조 (요약)
/
├─ API 명세서
├─ infra/                 # docker-compose, MinIO, DB 설정
├─ src/main/java/         # Spring Boot Backend
├─ src/main/resources/
└─ View/                  # React Frontend

⚙️ 필수 환경 변수

* Backend
  - SPRING_DATASOURCE_URL
  - SPRING_DATASOURCE_USERNAME
  - SPRING_DATASOURCE_PASSWORD
  - MINIO_URL
  - MINIO_ROOT_USER
  - MINIO_ROOT_PASSWORD
  - MINIO_BUCKET
  - CORS_ALLOWED_ORIGINS 
* Frontend
  - REACT_APP_API_BASE_URL

🛠 로컬 개발 실행 방법
1) 환경 변수 설정 (예시)
   $env: SPRING_DATASOURCE_URL="jdbc:oracle:thin:@//localhost:1521/XEPDB1";
   $env: SPRING_DATASOURCE_USERNAME="app_user"
   $env: SPRING_DATASOURCE_PASSWORD="password"
   $env: MINIO_URL="http://localhost:9000"
   $env: MINIO_ROOT_USER="minioadmin"
   $env: MINIO_ROOT_PASSWORD="minioadmin"
   $env: MINIO_BUCKET="review"

2) Backend 실행
   mvnw.cmd spring-boot:run

3) Frontend 실행
   cd View
   npm install
   npm start

4) Infra 실행 (DB, MinIO)
   cd infra
   docker-compose up -d