package com.review.shop.repository.qna;

import com.review.shop.dto.qna.QnaDTO;
import com.review.shop.dto.qna.QnaListResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface QnaMapper {

    // 목록 조회
    List<QnaListResponseDTO> selectQnaListByProductId(int product_id);

    // 내 문의 내역 조회
    List<QnaListResponseDTO> selectQnaListByUserId(int user_id);

    // 상세 조회
    QnaDTO selectQnaDetail(@Param("qna_id") int qna_id);

    // 등록
    int insertQna(QnaDTO qnaDTO);

    // 수정 (본인 확인 포함)
    int updateQna(QnaDTO qnaDTO);

    // 삭제 (본인 확인 포함)
    int deleteQna(@Param("qna_id") int qna_id, @Param("user_id") int user_id);
}