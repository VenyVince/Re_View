package com.review.shop.service.search;

import com.review.shop.dto.search.MyPageProductPage.MyPage.MyPageReviewDTO;
import com.review.shop.dto.search.MyPageProductPage.MyPage.MyPageReviewResponseDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.image.ImageService;
import com.review.shop.repository.UserIdMapper;
import com.review.shop.repository.search.MyPageProductPage.MyPageReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MyPageReviewService {
    private final UserIdMapper userIdMapper;
    private final MyPageReviewMapper myPageReviewMapper;
    private final ImageService imageService;
    public int getUser_id(String id){
        return userIdMapper.getUser_id(id);
    }

    public MyPageReviewResponseDTO search(int user_id, String keyword, String sort, float filter_rating) {
        try {
            // Mapper 호출 (파라미터 4개)
            List<MyPageReviewDTO> myreviews = myPageReviewMapper.SearchMyReviews(user_id, keyword, sort, filter_rating);

            if (myreviews.isEmpty()) {
                throw new ResourceNotFoundException("리뷰를 작성한 적이 없습니다!");
            }

            myreviews.forEach(dto -> {
                // 이미지 리스트가 null이 아닐 경우에만 수행 (NullPointerException 방지)
                if (dto.getImage_urls() != null && !dto.getImage_urls().isEmpty()) {
                    List<String> presignedUrls = dto.getImage_urls().stream()
                            .map(key -> imageService.presignedUrlGet(key)) // 각 key를 presigned url로 변환
                            .collect(Collectors.toList()); // 다시 리스트로 수집

                    dto.setImage_urls(presignedUrls); // 변환된 리스트를 DTO에 다시 Set
                }
            });

            // ResponseDTO에 담아서 반환
            MyPageReviewResponseDTO response = new MyPageReviewResponseDTO();
            response.setMyPageReviews(myreviews);

            return response;
        } catch (DataAccessException e) {
            throw new DatabaseException("오류가 발생했습니다. 관리자에게 문의해주세요.", e);
        }
    }

}