package com.review.shop.service.admin;

import com.review.shop.dto.product.ProductDetailWithThumbnailDTO;
import com.review.shop.dto.product.ProductUpdateOnlyPrdInfoDTO;
import com.review.shop.dto.product.ProductUploadDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.image.ImageService;
import com.review.shop.repository.admin.AdminProductMapper;
import jakarta.annotation.security.RolesAllowed;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@RolesAllowed("ADMIN")
public class AdminProductService {

    private final AdminProductMapper adminProductMapper;
    private final ImageService imageService;

    //getAllProducts
    public List<ProductDetailWithThumbnailDTO> getAllProducts() {

        List<ProductDetailWithThumbnailDTO> products = adminProductMapper.getAllProducts();
        if (products == null || products.isEmpty()) {
            throw new ResourceNotFoundException("등록된 상품이 없습니다.");
        }

        products.forEach(product -> {
            String objectKey = product.getThumbnail_url();
            if (objectKey != null && !objectKey.isEmpty()) {
                String presignedUrl = imageService.presignedUrlGet(objectKey);
                product.setThumbnail_url(presignedUrl);
            }
            }
        );

        return products;
    }



    // 상품 등록
    public void insertOnlyProduct(ProductUpdateOnlyPrdInfoDTO product) {
        if (product == null) {
            throw new WrongRequestException("상품 정보가 전달되지 않았습니다.");
        }
        int affected = adminProductMapper.insertProduct(product);
        if (affected == 0) {
            throw new DatabaseException("상품 등록에 실패했습니다.", null);
        }
    }

    // 상품 수정
    public void updateProduct(int product_id, ProductUploadDTO product) {
        if (product == null) {
            throw new WrongRequestException("수정할 상품 정보가 전달되지 않았습니다.");
        }
        int affected = adminProductMapper.updateProduct(product_id, product);
        if (affected == 0) {
            throw new ResourceNotFoundException("수정할 상품을 찾을 수 없습니다.");
        }
    }

    // 상품 삭제
    public void deleteProduct(int product_id) {
        int affected = adminProductMapper.deleteProduct(product_id);
        if (affected == 0) {
            throw new ResourceNotFoundException("삭제할 상품을 찾을 수 없습니다.");
        }
    }

    //상품 등록과 이미지 등록 트랜잭션처리
    @Transactional
    public void uploadProductAndImages(ProductUpdateOnlyPrdInfoDTO product, String thumbnailUrl, String detailImageUrl) {

        //상품을 먼저 삽입
        insertOnlyProduct(product);
        int prd_id = product.getProduct_id();

        //상품 이미지 테이블에 데이터 삽입
        imageService.saveProductImageObjectKey(prd_id, thumbnailUrl, detailImageUrl);
    }

    public ProductUploadDTO getProductInfo(int productId) {
        ProductUploadDTO prdInfo = adminProductMapper.getProductInfo(productId);

        if(prdInfo == null){
            throw new ResourceNotFoundException("해당 상품의 정보를 찾을 수 없습니다.");
        }


        //썸네일 변환
        String thumbnailImageKey = prdInfo.getThumbnail_image();
        if (thumbnailImageKey == null) {
            throw new ResourceNotFoundException("해당 상품의 이미지를 찾을 수 없습니다.");
        }
        String presignedThumbnailUrl = imageService.presignedUrlGet(thumbnailImageKey);
        prdInfo.setThumbnail_image(presignedThumbnailUrl);

        //상세보기 변환
        String detailImageKey = adminProductMapper.readImage(productId);
        if (detailImageKey == null) {
            throw new ResourceNotFoundException("해당 상품의 상세 이미지를 찾을 수 없습니다.");
        }
        String presignedDetailUrl = imageService.presignedUrlGet(detailImageKey);
        prdInfo.setDetail_image(presignedDetailUrl);

        return prdInfo;
    }
}
