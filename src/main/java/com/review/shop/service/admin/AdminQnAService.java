package com.review.shop.service.admin;


import com.review.shop.dto.qna.QnAListDTO;
import com.review.shop.dto.qna.QnaDTO;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.admin.AdminQnAMapper;
import jakarta.annotation.security.RolesAllowed;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@RolesAllowed("ADMIN")

public class AdminQnAService {

    private final AdminQnAMapper adminQnAMapper;

    // QnA 답변 등록/수정
    public void updateQnaAnswer(int qna_id, String adminAnswer) {
        if(adminAnswer ==null||adminAnswer.isEmpty()){
            throw new WrongRequestException("답변 내용이 비어있습니다.");
        }
        int affected = adminQnAMapper.updateQnaAnswer(qna_id, adminAnswer);
        if (affected == 0) {
            throw new ResourceNotFoundException("답변할 QnA를 찾을 수 없습니다.");
        }
    }

    //getAllQna 구현 - 전체 QnA 목록 조회, repository 실행
    public List<QnAListDTO> getAllQna() {
        return adminQnAMapper.getAllQna();
    }

    //getQnaDetail 구현 - QnA 상세 조회, repository 실행
    public QnaDTO getQnaDetail(Integer qna_id) {

        if(qna_id==null){
            throw new ResourceNotFoundException("조회할 QnA를 찾을 수 없습니다.");
        }
        return adminQnAMapper.getQnaDetail(qna_id);
    }



}