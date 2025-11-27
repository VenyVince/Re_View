package com.review.shop.service.recommendations;

import com.review.shop.util.Security_Util;
import com.review.shop.dto.product.RecommendationProductDTO;
import com.review.shop.dto.recommendations.RecommendationsUserDTO;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.recommendations.RecommendationsMapper;
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
            throw new WrongRequestException("해당 사용자의 바우만 타입이 존재하지 않습니다.");
        }
        return user_Baumann;
    }

    //바우만 아이디를 기반으로 바우만 타입 가져오기 (FIRST, SECOND, THIRD, FOURTH)
    public RecommendationsUserDTO getBaumannDTOWithId(Integer user_Baumann){

        RecommendationsUserDTO baumannDTO = recommendationsMapper.getBaumannDTOWithId(user_Baumann);
        if (baumannDTO==null){
            throw new WrongRequestException("해당 바우만 타입이 존재하지 않습니다.");
        }
        return baumannDTO;
    }

    public List<RecommendationProductDTO> findAllProductsSortedByBaumann(RecommendationsUserDTO baumannDTO){

        //바우만 타입을 꺼내서 상품 추천 리스트 조회
        List<RecommendationProductDTO> recommendedProducts =
        recommendationsMapper.findAllProductsSortedByBaumann(baumannDTO.getFirst(), baumannDTO.getSecond(), baumannDTO.getThird(), baumannDTO.getFourth());
        if (recommendedProducts == null || recommendedProducts.isEmpty()){
            throw new WrongRequestException("추천 상품이 존재하지 않습니다.");
        }
        return recommendedProducts;
    }
}
