package com.review.shop.service.qna;

import com.review.shop.dto.qna.QnaDTO;
import com.review.shop.repository.qna.QnaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QnaService {

    private final QnaMapper qnaMapper;

    public List<QnaDTO> getQnaList(int productId) {
        return qnaMapper.selectQnaListByProductId(productId);
    }

    public QnaDTO getQnaDetail(int qnaId) {
        QnaDTO qna = qnaMapper.selectQnaDetail(qnaId);
        if (qna == null) throw new RuntimeException("존재하지 않는 게시글입니다.");
        return qna;
    }

    @Transactional
    public void registerQna(QnaDTO qnaDTO) {
        qnaMapper.insertQna(qnaDTO);
    }

    @Transactional
    public void modifyQna(QnaDTO qnaDTO) {
        int result = qnaMapper.updateQna(qnaDTO);
        if (result == 0) {
            throw new RuntimeException("수정 권한이 없거나 존재하지 않는 글입니다.");
        }
    }

    @Transactional
    public void removeQna(int qnaId, int userId) {
        int result = qnaMapper.deleteQna(qnaId, userId);
        if (result == 0) {
            throw new RuntimeException("삭제 권한이 없거나 존재하지 않는 글입니다.");
        }
    }

    // answerQna 메서드 삭제 완료!
}