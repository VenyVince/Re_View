# 📌 Re_View — 리뷰 기반 스킨케어 추천 서비스

**Re_View는 상품 리뷰와 이미지 데이터를 기반으로 하여, Baumann(바우만) 피부타입 분석을 적용한 개인 맞춤 스킨케어 추천 기능을 제공하는 풀스택 전자상거래 지원 서비스입니다.**

---

## 🚀 주요 목적

* 사용자 리뷰(텍스트 + 이미지)의 수집 및 관리
* Baumann 피부타입 분류를 활용한 맞춤형 스킨케어 추천
* 리뷰·사용자 관리 등 운영자를 위한 관리 기능 제공
* 리뷰 기반 개인화 로직 실험을 위한 플랫폼 구축

---

## 🧩 서비스 구성

* **Backend**: Spring Boot 3.5 / Java 21 / MyBatis
* **Frontend**: React (SPA, `/View`)
* **DB**: Oracle XE (prod), H2 (test)
* **Storage**: MinIO (S3 compatible)
* **Infra**: Docker & docker-compose

---

## 🔑 핵심 기능

### 상품 추천 알고리즘

Re_View는 Baumann(바우만) 피부 타입 기반 추천 방식을 사용합니다.
사용자의 Baumann 타입(4요소)을 기준으로 상품의 동일 요소를 비교하여 **매칭 점수(match score)**를 계산하고,
점수가 높은 상품을 우선적으로 추천합니다.

* 매칭 규칙

  * 동일 요소: +50

  * 정보 없음: +10

  * 불일치: –10

* 추천 로직

  * 4요소 전체 비교하여 점수 계산

  * 정확한 매칭 상품이 부족한 경우, 단계적으로 조건을 완화하여 더 넓은 상품을 추천

  * 점수 기준 정렬 → 리뷰 수 → 일부 랜덤성으로 결과 다양화

이 방식은 사용자의 피부 특성과 상품 특성을 매칭하여
개인화된 스킨케어 추천을 제공하는 구조입니다.

### 사용자 기능

* 리뷰 작성 / 조회 / 수정 / 삭제
* 이미지 업로드 및 MinIO 저장
* Baumann 피부 타입 기반 스킨케어 추천
* 회원가입 및 로그인

### 관리자 기능

* 리뷰 신고 처리
* 사용자 관리
* 배너 관리

### 개발 지원 기능

* springdoc–OpenAPI 기반 API 문서 제공
* Docker 기반 로컬 실행 및 배포 지원 구조

---

## 📁 레포지토리 구조 (요약)

```
/
├─ API 명세서
├─ infra/                 # docker-compose, MinIO 데이터
├─ src/main/java/         # Spring Boot Backend
├─ src/main/resources/
├─ View/                  # React Frontend
└─ target/
```

---

## ⚙️ 필수 환경 변수

### Backend

* `SPRING_DATASOURCE_URL`
* `SPRING_DATASOURCE_USERNAME`
* `SPRING_DATASOURCE_PASSWORD`
* `MINIO_URL`
* `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`
* `MINIO_BUCKET`
* `CORS_ALLOWED_ORIGINS`

### Frontend

* `REACT_APP_API_BASE_URL`

---

## 🛠 로컬 개발 빠른 실행

### 1) 환경변수 설정 (예시)

```
$env:SPRING_DATASOURCE_URL="jdbc:oracle:thin:@//localhost:1521/XEPDB1";
$env:SPRING_DATASOURCE_USERNAME="app_user";
$env:SPRING_DATASOURCE_PASSWORD="password";
$env:MINIO_URL="http://localhost:9000";
$env:MINIO_ROOT_USER="minioadmin";
$env:MINIO_ROOT_PASSWORD="minioadmin";
$env:MINIO_BUCKET="review";
```

### 2) Backend 실행

```
mvnw.cmd spring-boot:run
```

### 3) Frontend 실행

```
cd View
npm install
npm start
```

### 4) Infra (Oracle, MinIO 등) 실행

```
cd infra
docker-compose up -d
```

---

## 🧪 테스트 실행

```
# Backend
mvnw.cmd test

# Frontend
cd View
npm test
```


## 추가예정 사항

1. 기존 16가지의 값만 가지는 바우만 타입을 더욱 세분화하여 퍼센테이지로 구분 및 상품에 대한 추천도 이와 더불어 더욱 정밀하게 제공(바우만 타입의 문자열로 매칭된 10진수화 ex. D83S10W92T53의 경우 DSWT이지만 DNWT와도 유사)
2. 상품의 성분을 기반으로 바우만 타입을 추천하는 로직 또는 AI를 통해 관리자의 상품 등록 시 편의성 증대
3. 상품 추천 봇을 통해 상품을 추천하고 즉각적인 피드백
4. 리뷰를 영상 매체와 같은 더욱 많은 콘텐츠로 접할 수 있도록 수정
