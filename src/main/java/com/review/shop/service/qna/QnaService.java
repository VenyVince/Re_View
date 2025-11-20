package com.review.shop.service.qna;

import com.review.shop.dto.qna.QnaDTO;
import com.review.shop.dto.qna.QnaListResponseDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
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

    public List<QnaListResponseDTO> getQnaList(int productId) {
        try {
            return qnaMapper.selectQnaListByProductId(productId);
        } catch (DataAccessException e) {
            throw new DatabaseException("QnA 목록 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    public List<QnaListResponseDTO> getMyQnaList(int userId) {
        try {
            return qnaMapper.selectQnaListByUserId(userId);
        } catch (DataAccessException e) {
            throw new DatabaseException("내 문의 내역 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    public QnaDTO getQnaDetail(int qnaId) {
        try {
            QnaDTO qna = qnaMapper.selectQnaDetail(qnaId);
            if (qna == null) {
                throw new ResourceNotFoundException("존재하지 않는 게시글입니다.");
            }
            return qna;
        } catch (DataAccessException e) {
            throw new DatabaseException("QnA 상세 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    @Transactional
    public void registerQna(QnaDTO qnaDTO) {
        try {
            qnaMapper.insertQna(qnaDTO);
        } catch (DatabaseException e) {
            throw new DatabaseException("QnA 등록 중 DB 오류가 발생했습니다.", e);
        }
    }

    @Transactional
    public void modifyQna(QnaDTO qnaDTO) {
        try {
            int result = qnaMapper.updateQna(qnaDTO);
            if (result == 0) {
                throw new RuntimeException("수정 권한이 없거나 존재하지 않는 글입니다.");
            }
        } catch (DatabaseException e) {
            throw new DatabaseException("QnA 수정 중 DB 오류가 발생했습니다.", e);
        }
    }

    @Transactional
    public void removeQna(int qnaId, int userId) {
        try {
            int result = qnaMapper.deleteQna(qnaId, userId);
            if (result == 0) {
                throw new RuntimeException("삭제 권한이 없거나 존재하지 않는 글입니다.");
            }
        } catch (DatabaseException e) {
            throw new DatabaseException("QnA 삭제 중 DB 오류가 발생했습니다.", e);
        }
    }
}