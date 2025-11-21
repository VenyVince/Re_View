package com.review.shop.service.qna;

import com.review.shop.dto.qna.QnaDTO;
import com.review.shop.dto.qna.QnaListResponseDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
// import com.review.shop.exception.WrongRequestException; // 필요시 사용
import com.review.shop.repository.qna.QnaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QnaService {

    private final QnaMapper qnaMapper;

    // 목록 조회
    @Transactional(readOnly = true)
    public List<QnaListResponseDTO> getQnaList(int product_id) {
        try {
            return qnaMapper.selectQnaListByProductId(product_id);
        } catch (DataAccessException e) {
            throw new DatabaseException("QnA 목록 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    // 내 문의 내역 조회
    @Transactional(readOnly = true)
    public List<QnaListResponseDTO> getMyQnaList(int user_id) {
        try {
            return qnaMapper.selectQnaListByUserId(user_id);
        } catch (DataAccessException e) {
            throw new DatabaseException("내 문의 내역 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    // 상세 조회
    @Transactional(readOnly = true)
    public QnaDTO getQnaDetail(int qna_id) {
        try {
            QnaDTO qna = qnaMapper.selectQnaDetail(qna_id);

            if (qna == null) {
                throw new ResourceNotFoundException("존재하지 않는 게시글입니다.");
            }
            return qna;
        } catch (DataAccessException e) {
            throw new DatabaseException("QnA 상세 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    // 등록
    @Transactional
    public void registerQna(QnaDTO qnaDTO) {
        try {
            qnaMapper.insertQna(qnaDTO);
        } catch (DataAccessException e) {
            throw new DatabaseException("QnA 등록 중 DB 오류가 발생했습니다.", e);
        }
    }

    // 수정
    @Transactional
    public void modifyQna(QnaDTO qnaDTO) {
        try {
            int result = qnaMapper.updateQna(qnaDTO);

            if (result == 0) {
                throw new ResourceNotFoundException("수정 권한이 없거나 존재하지 않는 글입니다.");
            }
        } catch (DataAccessException e) {
            throw new DatabaseException("QnA 수정 중 DB 오류가 발생했습니다.", e);
        }
    }

    // 삭제
    @Transactional
    public void removeQna(int qna_id, int user_id) {
        try {
            int result = qnaMapper.deleteQna(qna_id, user_id);

            if (result == 0) {
                throw new ResourceNotFoundException("삭제 권한이 없거나 존재하지 않는 글입니다.");
            }
        } catch (DataAccessException e) {
            throw new DatabaseException("QnA 삭제 중 DB 오류가 발생했습니다.", e);
        }
    }
}