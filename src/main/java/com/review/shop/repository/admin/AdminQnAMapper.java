package com.review.shop.repository.admin;

import com.review.shop.dto.qna.QnAListDTO;
import com.review.shop.dto.qna.QnaAdminDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminQnAMapper {
    //    QnA
    //QnA 답변 업뎃
    int updateQnaAnswer(@Param("qna_id") int qna_id,
                        @Param("adminAnswer") String adminAnswer);

    // QnA 전체 조회
    List<QnAListDTO> getAllQna();

    // QnA  상세보기
    QnaAdminDTO getQnaDetail(int qna_id);
}