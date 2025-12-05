package com.review.shop.image;

import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.image.minio.MinioProperties;
import com.review.shop.repository.ImageMapper;
import com.review.shop.util.Security_Util;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final Security_Util security_util;

    private final MinioClient minioClient;
    private final MinioProperties minioProperties;
    private final ImageMapper imageMapper;

    // presigned url : 임의로 생성된 url(post, get요청등)
    // object key: 실질적인 저장소 키값
    // MinIO는 창고
    // object(박스) key는 창고의 주소(창고의 어디에 위치한지)
    // presigned url은 임시 출입증(기한이 지나면 사라짐)

    // FE : file_name(단일 개체) 업로드 요청(이미지 여러 개이면 여러 번 호출) -> BE : 요청 확인 후 return PresignedUrl, Object key를 Fe에 반환
    // -> FE : 받은 PresignedUrl을 통해 업로드 -> FE: 상품 등록 및 리뷰 작성 api호출시 Object key를 imageUrls 대신 BE에 전달
    // -> BE : db에 Object key 저장

    // post 8080/api/images/products -> presigned url, object key반환 -> presigned url 입력 후 이미지(Binary)업로드
    // 이미지가 여러 개라면 호출 여러 번 반복
    // -> post 8080/api/admin(review)~~ 를 통해 object key db에 저장

    // FE: 리뷰/상품 확인 및 상세 api호출 -> BE: 내부적으로 object key를 찾아 presigned url로 반환

    //  [
    //  "http://localhost:9000/review-bucket/...presigned-url-1...",
    //  "http://localhost:9000/review-bucket/...presigned-url-2..."
    //  ]

    //  {imageUrls.map((url) => (
    //      <img
    //      key={url}
    //      src={url}
    //      alt="product"
    //      style={{ width: "300px", height: "auto" }}
    //      />
    //      ))
    //   }

    // 리뷰 이미지 업로드(권한 체크)
    public Map<String, Object> uploadReviewImages(String file_name) {
        String role = security_util.getCurrentUserRole();
        if ("ADMIN".equalsIgnoreCase(role)) {
            throw new WrongRequestException("관리자는 리뷰를 작성할 수 없습니다.");
        }
        return presignedUrlPost("reviews", file_name);
    }

    // 상품 이미지 업로드(권한 체크)
    public Map<String, Object> uploadProductImages(String file_name) {
        String role = security_util.getCurrentUserRole();
        if ("USER".equalsIgnoreCase(role)) {
            throw new WrongRequestException("사용자는 접근할 수 없습니다.");
        }
        return presignedUrlPost("products", file_name);
    }

    //전달받은 objectKey 상품 이미지 테이블에 저장하기
    public void saveProductImageObjectKey(int product_id, List<String> objectKeyList, String thumbnail_objectKey) {
        if(!objectKeyList.contains(thumbnail_objectKey)){
            throw new WrongRequestException("썸네일 이미지가 이미지 목록에 포함되어 있지 않습니다.");
        }

        for(String objectKey : objectKeyList){

            String isThumbnail = (objectKey.equals(thumbnail_objectKey)) ? "Y" : "N";

            int result = imageMapper.insertProductObjectKey(product_id, objectKey, isThumbnail);
            if(result == 0){
                throw new DatabaseException("이미지 삽입에 실패했습니다.", null);
            }
        }
    }

    public void saveReviewImageObjectKey(int review_id, List<String> objectKeyList) {
        for(String objectKey : objectKeyList){
            int result = imageMapper.insertReviewObjectKey(review_id, objectKey);
            if(result == 0){
                throw new DatabaseException("이미지 삽입에 실패했습니다.", null);
            }
        }
    }




    // presigned post URL 생성
    private Map<String, Object> presignedUrlPost(String folder, String file_name) {

        String ext = "";
        int idx = file_name.lastIndexOf(".");
        if (idx != -1) {
            ext = file_name.substring(idx);
        }

        String objectKey = folder + "/" + UUID.randomUUID() + ext;

        try {
            String url = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.PUT)
                            .bucket(minioProperties.getBucket())
                            .object(objectKey)
                            .expiry(60 * 10) // 10분
                            .build()
            );

            return Map.of(
                    "objectKey", objectKey,
                    "presignedUrl", url
            );

        } catch (Exception e) {
            throw new RuntimeException("Presigned URL 생성 실패: " + e.getMessage());
        }
    }


    // 조회 시 objectKey → presigned GET URL 변환
    public String presignedUrlGet(String objectKey) {
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(minioProperties.getBucket())
                            .object(objectKey)
                            .expiry(60 * 5)
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("[Minio] GET URL 생성 실패: " + e.getMessage());
        }
    }
}
