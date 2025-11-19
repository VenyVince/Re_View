package com.review.shop.service.search;

import com.review.shop.dto.search.ProductReview_SearchDTO;
import com.review.shop.dto.search.ProductReview_SearchResponseDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.repository.search.pages.ProductReview_SearchMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductReview_SearchService {

    private final ProductReview_SearchMapper reviewMapper;

    public ProductReview_SearchResponseDTO search(int product_id, String keyword, String sort, float filter_rating) {
        try {
            List<ProductReview_SearchDTO> reviews = reviewMapper.searchReviews(product_id, keyword, sort,  filter_rating);

            if (reviews.isEmpty()) {
                throw new ResourceNotFoundException("검색 결과가 존재하지 않습니다");
            }

            ProductReview_SearchResponseDTO response = new ProductReview_SearchResponseDTO();
            response.setReviews(reviews);

            return response;
        } catch (DataAccessException e) {
            throw new DatabaseException("오류가 발생했습니다. 관리자에게 문의해주세요.", e); //DB오류
        }
    }
}
