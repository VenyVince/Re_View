package com.review.shop.repository.qna;

import com.review.shop.dto.qna.QnaDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface QnaMapper {

    // 목록 조회
    List<QnaDTO> selectQnaListByProductId(@Param("productId") int productId);

    // 상세 조회
    QnaDTO selectQnaDetail(@Param("qnaId") int qnaId);

    // 등록
    int insertQna(QnaDTO qnaDTO);

    // 수정 (본인 확인 포함)
    int updateQna(QnaDTO qnaDTO);

    // 삭제 (본인 확인 포함)
    int deleteQna(@Param("qnaId") int qnaId, @Param("userId") int userId);
}