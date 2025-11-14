package com.review.shop.service.review;

import com.review.shop.dto.review.MyPageReviewDTO;
import com.review.shop.dto.review.MyPageReviewResponseDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFountException;
import com.review.shop.repository.UserIdMapper;
import com.review.shop.repository.review.MyPageReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyPageReviewService {
    private final UserIdMapper userIdMapper;
    private final MyPageReviewMapper myPageReviewMapper;

    public int getUser_id(String id){
        return userIdMapper.getUser_id(id);
    }

    public MyPageReviewResponseDTO search(int user_id, String keyword, String sort, float filter_rating) {
        try {
            // DTO 하나로 파라미터 전달
            MyPageReviewResponseDTO dto = new MyPageReviewResponseDTO(user_id, keyword, sort, filter_rating);

            // Mapper 호출 → 반환 타입은 List<MyPageReviewDTO>
            List<MyPageReviewDTO> myreviews = myPageReviewMapper.SearchMyReviews(dto);

            if (myreviews.isEmpty()) {
                throw new ResourceNotFountException("리뷰를 작성한 적이 없습니다!");
            }

            // ResponseDTO에 List<MyPageReviewDTO> 세팅
            MyPageReviewResponseDTO response = new MyPageReviewResponseDTO();
            response.setMyPageReviews(myreviews);

            return response;
        } catch (DataAccessException e) {
            throw new DatabaseException("오류가 발생했습니다. 관리자에게 문의해주세요.", e);
        }
    }

}
