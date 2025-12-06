package com.review.shop.service.admin;

import com.review.shop.dto.product.ProductDetailDTO;
import com.review.shop.dto.product.ProductDetailWithThumbnailDTO;
import com.review.shop.dto.product.ProductUpdateOnlyPrdInfoDTO;
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

//        현재 db에 변환용 데이터가 없어서 주석처리

//        for(ProductDetailWithThumbnailDTO product : products){
//            String thumbnailUrl = product.getThumbnail_url();
//            product.setThumbnail_url(imageService.presignedUrlGet(thumbnailUrl));
//        }

        return adminProductMapper.getAllProducts();
    }



    // 상품 등록
    public void insertProduct(ProductDetailDTO product) {
        if (product == null) {
            throw new WrongRequestException("상품 정보가 전달되지 않았습니다.");
        }
        int affected = adminProductMapper.insertProduct(product);
        if (affected == 0) {
            throw new DatabaseException("상품 등록에 실패했습니다.", null);
        }
    }

    // 상품 수정
    public void updateProduct(int product_id, ProductUpdateOnlyPrdInfoDTO product) {
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

    // 상품 상세조회
    public ProductDetailWithThumbnailDTO getProductDetail(int product_id) {
        ProductDetailWithThumbnailDTO result = adminProductMapper.readProduct(product_id);
        if (result == null) {
            throw new ResourceNotFoundException("조회할 상품을 찾을 수 없습니다.");
        }
        return result;
    }




    //상품 등록과 이미지 등록 트랜잭션처리
    @Transactional
    public void uploadProductAndImages(ProductDetailDTO product, String thumbnailUrl) {

        //상품 테이블에 데이터 먼저 삽입
        insertProduct(product);
        int prd_id = product.getProduct_id();
        List<String> product_images = product.getProduct_images();

        //상품 이미지 테이블에 데이터 삽입
        imageService.saveProductImageObjectKey(prd_id, product_images, thumbnailUrl);
    }

    //이미지 불러오기
    public String readImage(int product_id) {
        String result = adminProductMapper.readImage(product_id);
        if(result == null){
            throw new ResourceNotFoundException("해당 상품의 이미지를 찾을 수 없습니다.");
        }
        return result;
    }


    //이미지 삭제하기
    public void deleteProductImages(int product_id) {
        int affected = adminProductMapper.deleteProductImages(product_id);
        if (affected == 0) {
            throw new ResourceNotFoundException("해당 상품의 기존 이미지를 찾을 수 없습니다.");
        }
    }

    // 추후에 사용할 수도 있어서 일단 남겨둠 (모든 썸네일 초기화)
//
//    public void restImagesThumbnail(int product_id){
//        int affected = adminProductMapper.updateAllImagesToNo(product_id);
//        if (affected == 0) {
//            throw new ResourceNotFoundException("해당 상품의 기존 이미지를 찾을 수 없습니다.");
//        }
//    }

    //이미지 삭제하고 삽입하기 트랜잭션
    @Transactional
    public void updateProductImages(int product_id, List<String> imageUrls, String thumbnailUrl) {
        //기존 이미지 삭제
        deleteProductImages(product_id);
        //새 이미지 삽입
        imageService.saveProductImageObjectKey(product_id, imageUrls, thumbnailUrl);
    }
}
