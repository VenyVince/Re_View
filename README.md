# Re_View

리뷰 기반 개인 맞춤 스킨케어 추천 커머스 서비스

- Review (기획서 및 Wbs, 발표자료등의) 문서: https://github.com/VenyVince/5.Re_View_Doc
- Review 시연 영상:  https://www.youtube.com/watch?v=kP2HrcrGmvU

---

## 프로젝트 소개

Re_View는 사용자 리뷰와 Baumann 피부 타입 데이터를 기반으로 스킨케어 상품과 리뷰를 추천하는 풀스택 웹 서비스입니다.

사용자는 자신의 피부 타입을 등록하고 상품을 구매한 뒤 리뷰를 작성할 수 있습니다. 서비스는 사용자 피부 타입, 상품 피부 타입, 리뷰 작성자의 피부 타입, 리뷰 반응 데이터를 활용해 사용자에게 적합한 상품과 참고할 만한 리뷰를 제공합
니다.

단순 상품 조회 중심의 쇼핑몰이 아니라, 리뷰 데이터와 피부 타입 정보를 활용한 개인화 추천 기능을 핵심으로 구현했습니다.

## 주요 기능

### 사용자 기능

- 회원가입 / 로그인 / 로그아웃
- 상품 목록 및 상세 조회
- 리뷰 작성 / 조회 / 수정 / 삭제
- 리뷰 좋아요 / 싫어요
- 리뷰 댓글 작성 / 삭제
- 리뷰 신고
- 장바구니 관리
- 위시리스트 관리
- 주문 처리
- 포인트 적립 및 사용
- 주소 및 결제수단 관리
- QnA 작성 및 조회
- Baumann 피부 타입 등록 및 수정
- 피부 타입 기반 상품 / 리뷰 추천

### 관리자 기능

- 상품 등록 / 수정 / 삭제
- 주문 상태 관리
- 사용자 관리
- 사용자 포인트 관리
- 리뷰 관리
- 리뷰 신고 처리
- QnA 답변 관리
- 관리자 추천 리뷰 선정

## 기술 스택

### Backend

- Java 21
- Spring Boot 3.5
- Spring Security
- MyBatis
- Oracle XE
- Spring Mail
- springdoc OpenAPI / Swagger
- MinIO SDK
- Lombok

### Frontend

- React
- React Router
- Axios
- Styled Components
- React Icons

### Infra

- Docker
- Docker Compose
- Nginx
- Oracle XE
- MinIO

## 시스템 구조

  ```text <이미지 삽입해야함>
  Client
    |
    | HTTP Request
    v
  React Frontend
    |
    | /api proxy
    v
  Spring Boot Backend
    |
    | MyBatis
    v
  Oracle Database

  Spring Boot Backend
    |
    | Presigned URL
    v
  MinIO Object Storage
```
  ## 백엔드 구조
```
  src/main/java/com/review/shop
  ├── config          # Security, CORS, 예외 처리 설정
  ├── controller      # REST API Controller
  ├── service         # 비즈니스 로직
  ├── repository      # MyBatis Mapper Interface
  ├── dto             # 요청 / 응답 DTO
  ├── image           # MinIO 이미지 처리
  ├── exception       # 커스텀 예외
  └── util            # 인증 유틸, 스케줄러
```
  ## 핵심 구현 내용

  ### 1. Baumann 피부 타입 기반 추천

  Re_View는 Baumann 피부 타입의 4가지 요소를 기준으로 사용자와 상품, 리뷰의 적합도를 계산합니다.

  추천 로직은 단순 카테고리 필터링이 아니라 SQL 기반 점수 계산 방식으로 구현했습니다. 상품 추천과 리뷰 추천은 각각 별도의 점수 계산 기준을 가지며, 계산된 점수를 기준으로 상위 결과를 제공합니다.

  상품 추천에는 다음 요소가 반영됩니다.

  - 사용자 피부 타입과 상품 피부 타입의 일치 여부
  - 상품 리뷰 수
  - 상품 대표 이미지

  리뷰 추천에는 다음 요소가 반영됩니다.

  - 리뷰 작성자의 피부 타입과 현재 사용자의 피부 타입 일치 여부
  - 리뷰 대상 상품의 피부 타입 적합도
  - 리뷰 평점과 상품 평균 평점의 유사도
  - 검증 리뷰 여부
  - 좋아요 수

  이를 통해 사용자에게 적합한 상품뿐 아니라, 구매 판단에 도움이 되는 리뷰까지 함께 추천합니다.

  ### 2. MinIO Presigned URL 기반 이미지 업로드

  이미지 업로드는 백엔드 서버가 직접 파일을 받는 방식이 아니라 MinIO Presigned URL 방식을 사용했습니다.

  업로드 흐름은 다음과 같습니다.

  1. 프론트엔드가 백엔드에 파일명을 전달합니다.
  2. 백엔드는 MinIO Presigned PUT URL과 object key를 생성합니다.
  3. 프론트엔드는 Presigned URL을 통해 이미지를 MinIO에 직접 업로드합니다.
  4. 백엔드는 object key를 DB에 저장합니다.
  5. 이미지 조회 시 object key를 Presigned GET URL로 변환하여 응답합니다.

  이 구조를 통해 백엔드 서버의 파일 처리 부담을 줄이고, 객체 스토리지 기반 이미지 관리 구조를 구현했습니다.

  ### 3. 주문 / 포인트 / 재고 트랜잭션 처리

  주문 처리 과정에서는 다음 작업을 하나의 트랜잭션으로 처리합니다.

  - 사용자 포인트 차감
  - 상품 재고 차감
  - 주문 정보 저장
  - 주문 상세 정보 저장

  또한 클라이언트가 전달한 가격을 그대로 신뢰하지 않고, 서버에서 상품 가격을 다시 조회해 최종 주문 금액을 계산하도록 구현했습니다.

  ### 4. 리뷰 보상 시스템

  사용자가 리뷰를 작성하면 포인트를 지급하고, 베스트 리뷰 또는 관리자 선정 리뷰에 대해 추가 포인트를 지급할 수 있도록 설계했습니다.

  리뷰 활동이 서비스 내 사용자 참여로 이어지도록 포인트 시스템과 리뷰 기능을 연결했습니다.

  ### 5. 관리자 기능 분리

  관리자 API를 별도 경로로 분리하여 상품, 주문, 사용자, 리뷰, 신고, QnA를 관리할 수 있도록 구현했습니다.

  관리자는 상품 등록 및 수정, 리뷰 신고 처리, 사용자 관리, 주문 상태 변경 등의 운영 기능을 수행할 수 있습니다.

  ## Docker 구성

  Docker Compose를 통해 다음 서비스를 함께 실행할 수 있도록 구성했습니다.

  - be: Spring Boot 백엔드 서버
  - fe: React 빌드 결과를 Nginx로 서빙
  - oracle-db: Oracle XE 데이터베이스
  - minio: 이미지 저장용 객체 스토리지

  프론트엔드는 Nginx에서 정적 파일로 제공되며, /api/ 요청은 백엔드 컨테이너로 프록시됩니다.

  ## 실행 방법

`주의: Oracle 스키마와 MinIO bucket은 별도로 생성되어 있어야 합니다. DB 초기화 SQL과 샘플 데이터는 정리 예정입니다.`

  ### 1. 환경 변수 설정

  infra/.env 파일을 생성하고 필요한 환경 변수를 설정합니다.
```
  SPRING_DATASOURCE_URL=jdbc:oracle:thin:@//oracle-db:1521/XEPDB1
  SPRING_DATASOURCE_USERNAME=app_user
  SPRING_DATASOURCE_PASSWORD=password

  MINIO_URL=http://minio:9000
  MINIO_ROOT_USER=minioadmin
  MINIO_ROOT_PASSWORD=minioadmin
  MINIO_BUCKET=review

  CORS_ALLOWED_ORIGINS=http://localhost:3000
  REACT_APP_API_BASE_URL=http://localhost:8080
```
  ### 2. Docker Compose 실행

  `cd infra`
  `docker-compose up -d`

  ### 3. 백엔드 로컬 실행

  `mvnw.cmd spring-boot:run`

  ### 4. 프론트엔드 로컬 실행
  `cd View`
  `npm install`
  `npm start`

  ## API 문서

  Springdoc OpenAPI를 통해 Swagger UI를 제공합니다.

  http://localhost:8080/swagger-ui/index.html

## 👥 팀 구성 및 역할

| 이름 | 역할 | 담당 영역 |
|------|------|-----------|
| 김석현 | 팀장 / 백엔드·인프라 | DB 설계, 회원·포인트·결제수단·장바구니·이미지 처리·MinIO·배포 |
| 이재빈 | 백엔드 | 로그인·결제·구매·추천 알고리즘 |
| 정윤성 | 백엔드 | 상품·리뷰·QnA·커뮤니티 |
| 오승환 | 프론트엔드 | 마이페이지 전체 UI |
| 김시연 | 프론트엔드 | 관리자 페이지·설문조사 UI |
| 박진성 | 프론트엔드 | 검색·상품·리뷰 페이지 UI |

  ## 주요 API

  ### 인증

  | Method | URL | Description |
  | --- | --- | --- |
  | POST | `/api/auth/register` | 회원가입 |
  | POST | `/api/auth/login` | 로그인 |
  | POST | `/api/auth/logout` | 로그아웃 |
  | GET | `/api/auth/me` | 현재 로그인 사용자 조회 |

  ### 상품 / 리뷰

  | Method | URL | Description |
  | --- | --- | --- |
  | GET | `/api/products` | 상품 목록 조회 |
  | GET | `/api/products/{product_id}` | 상품 상세 조회 |
  | GET | `/api/reviews` | 리뷰 목록 조회 |
  | GET | `/api/reviews/{review_id}` | 리뷰 상세 조회 |
  | POST | `/api/reviews/{product_id}` | 리뷰 작성 |
  | PATCH | `/api/reviews/{review_id}` | 리뷰 수정 |
  | DELETE | `/api/reviews/{product_id}/{review_id}` | 리뷰 삭제 |

  ### 추천

  | Method | URL | Description |
  | --- | --- | --- |
  | POST | `/api/recommendations/all` | 피부 타입 기반 상품 / 리뷰 추천 |
  | GET | `/api/recommendations/admin-pick` | 관리자 추천 리뷰 조회 |

  ### 이미지

  | Method | URL | Description |
  | --- | --- | --- |
  | POST | `/api/images/reviews` | 리뷰 이미지 업로드 URL 발급 |
  | POST | `/api/images/products` | 상품 이미지 업로드 URL 발급 |
  | GET | `/api/images/banners` | 배너 이미지 조회 |

  ### 주문

  | Method | URL | Description |
  | --- | --- | --- |
  | POST | `/api/orders/checkout` | 주문 미리보기 |
  | POST | `/api/orders` | 주문 처리 |
  | GET | `/api/orders` | 주문 목록 조회 |
  | GET | `/api/orders/{order_id}` | 주문 상세 조회 |

  ## 프로젝트에서 중점적으로 구현한 부분

  - Spring Security 기반 세션 인증
  - MyBatis XML 기반 SQL 처리
  - Baumann 피부 타입 기반 점수형 추천 로직
  - MinIO Presigned URL 기반 이미지 업로드
  - 주문, 포인트, 재고 차감 트랜잭션 처리
  - 사용자 기능과 관리자 기능 분리
  - Docker Compose 기반 통합 실행 환경
    - 현재 개발 및 실행 환경에서는 AWS S3 대신 S3 호환 객체 스토리지인 MinIO를 사용합니다.
  - React SPA와 Spring Boot REST API 분리 구조

  ## 개선 예정 사항

  - API별 인증 / 인가 정책 세분화
  - Docker 환경 변수 관리 개선
  - 테스트 프로파일 및 테스트 코드 보강
  - 예외 응답 형식 표준화
  - Swagger API 설명 정리
  - DB 초기화 SQL 및 샘플 데이터 정리
  - 추천 알고리즘 고도화
  - CI/CD 파이프라인 추가

  ## 회고

  이 프로젝트를 통해 단순 CRUD 중심의 쇼핑몰 기능뿐 아니라, 사용자 데이터와 리뷰 데이터를 활용한 추천 로직을 직접 설계하고 구현했습니다.

  특히 이미지 업로드를 Presigned URL 방식으로 분리하고, 주문 처리 과정에서 포인트와 재고를 트랜잭션으로 관리하면서 실제 서비스에서 고려해야 하는 데이터 정합성과 서버 부하 문제를 함께 다뤘습니다.
