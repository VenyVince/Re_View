package com.review.shop.service.product;


import com.review.shop.dto.common.PageResponse;
import com.review.shop.dto.product.ProductDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.image.ImageService;
import com.review.shop.repository.product.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

//@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductMapper productMapper;
    private final ImageService imageService;

    public PageResponse<ProductDTO> getProductList(int page, int size, String sort, String category) {
        // 유효성 검사
        if (page < 1) throw new WrongRequestException("페이지 값이 올바르지 않습니다.");
        if (size < 1 || size > 100) throw new WrongRequestException("페이지 사이즈가 올바르지 않습니다.");

        // 정렬 옵션 기본값 처리 및 검증
        if (sort == null || sort.isEmpty()) sort = "latest";
        if (!sort.equals("latest") && !sort.equals("rating") && !sort.equals("price")) {
            throw new WrongRequestException("정렬 옵션이 올바르지 않습니다.");
        }

        // DB에 요청한 개수보다 하나 더(N+1) 요청함
        int limit = size + 1;
        int offset = (page - 1) * size;

        try {
            // Mapper 호출 (dbSize인 limit을 전달)
            List<ProductDTO> products = productMapper.selectProductList(offset, limit, sort, category);

            // 다음 페이지 여부 확인 (가져온 개수가 요청한 size보다 크면 다음 페이지 있음)
            boolean hasNext = false;
            if (products.size() > size) {
                hasNext = true;
                products.remove(size); // 확인용으로 가져온 마지막 데이터(21번째)는 삭제
            }

            products = products.stream()
                    .peek(product -> {
                        if (product.getImage_url() != null && !product.getImage_url().isEmpty()) {
                            String presignedUrl = imageService.presignedUrlGet(product.getImage_url());
                            product.setImage_url(presignedUrl);
                        }
                    })
                    .toList();

            // 결과 포장 및 반환
            return PageResponse.<ProductDTO>builder()
                    .content(products)
                    .hasNext(hasNext) // 프론트에서 이 값을 보고 > 버튼 활성화 결정
                    .page(page)
                    .size(size)
                    .build();

        } catch (DataAccessException e) {
            throw new DatabaseException("상품 목록 조회 중 DB 오류가 발생했습니다.", e);
        }
    }
}
