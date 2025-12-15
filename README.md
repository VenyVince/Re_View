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