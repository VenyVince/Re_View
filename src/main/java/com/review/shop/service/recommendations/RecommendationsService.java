package com.review.shop.service.recommendations;

import com.review.shop.dto.product.RecommendationDTO;
import com.review.shop.dto.recommendations.RecommendationsUserDTO;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.repository.recommendations.RecommendationsMapper;
import com.review.shop.util.Security_Util;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationsService {

    private final RecommendationsMapper recommendationsMapper;
    private final Security_Util security_util;

    // 사용자의 세션 정보를 기반으로 바우만 타입 가져오기
    public Integer getBaumannTypeByUserId(){
        Integer user_Baumann =  recommendationsMapper.getBaumannTypeByUserId(security_util.getCurrentUserId());
        if(user_Baumann==null){
            throw new ResourceNotFoundException("해당 사용자의 바우만 타입이 존재하지 않습니다.");
        }
        return user_Baumann;
    }

    //바우만 아이디를 기반으로 바우만 타입 가져오기 (FIRST, SECOND, THIRD, FOURTH)
    public RecommendationsUserDTO getBaumannDTOWithId(Integer user_Baumann){

        RecommendationsUserDTO baumannDTO = recommendationsMapper.getBaumannDTOWithId(user_Baumann);
        if (baumannDTO==null){
            throw new ResourceNotFoundException("해당 바우만 타입이 존재하지 않습니다.");
        }
        return baumannDTO;
    }


    //바우만 타입에 따른 추천 상품 필터링 메서드들
    public List<RecommendationDTO> getRecommendedProducts(RecommendationsUserDTO baumannDTO, String type){
        //사용자의 바우만 타입 정보를 리스트로 변환
        List<String> userInfo = List.of(
                baumannDTO.getFirst(),
                baumannDTO.getSecond(),
                baumannDTO.getThird(),
                baumannDTO.getFourth()
        );
        List<RecommendationDTO> recommendedProducts = switch (type) {
            case "all" ->
                    recommendationsMapper.findRecommencementsWithAll(userInfo);
            case "first" -> recommendationsMapper.findRecommencementsWithFirst(userInfo);
            case "second" -> recommendationsMapper.findRecommencementsWithSecond(userInfo);
            case "third" -> recommendationsMapper.findRecommencementsWithThird(userInfo);
            case "fourth" -> recommendationsMapper.findRecommencementsWithFourth(userInfo);
            default -> throw new IllegalArgumentException("잘못된 타입입니다: " + type);
        };

        if (recommendedProducts == null || recommendedProducts.isEmpty()) {
            throw new ResourceNotFoundException(type + " 타입 추천 상품이 존재하지 않습니다.");
        }

        return recommendedProducts;
    }
}
