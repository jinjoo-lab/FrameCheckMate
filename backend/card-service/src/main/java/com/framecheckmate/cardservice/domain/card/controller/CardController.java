package com.framecheckmate.cardservice.domain.card.controller;

import com.framecheckmate.cardservice.domain.card.dto.request.AssignCardWorkRequest;
import com.framecheckmate.cardservice.domain.card.dto.request.ConfirmRequest;
import com.framecheckmate.cardservice.domain.card.dto.request.CreateCardRequest;
import com.framecheckmate.cardservice.domain.card.entity.Card;
import com.framecheckmate.cardservice.domain.card.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/card")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping("{cardId}/assign")
    public ResponseEntity<Card> assignCardWork(@PathVariable("cardId") UUID cardId,
                                               @RequestBody AssignCardWorkRequest assignCardWorkRequest) {
        return ResponseEntity.ok(cardService.assignCardWork(cardId, assignCardWorkRequest));
    }

    /**
     * 테스트를 위한 메서드로 삭제 예정
     */
    @PostMapping
    public ResponseEntity<Card> createCard(@RequestBody CreateCardRequest request) {
        return ResponseEntity.ok(cardService.createCard(request));
    }

    @PatchMapping("/{cardId}/toDo")
    public ResponseEntity<Card> moveToToDo(@PathVariable UUID cardId) {
        return ResponseEntity.ok(cardService.moveToToDo(cardId));
    }

    @PatchMapping("/{cardId}/inProgress")
    public ResponseEntity<Card> moveToInProgress(@PathVariable UUID cardId) {
        return ResponseEntity.ok(cardService.moveToInProgress(cardId));
    }

    @PatchMapping("/{cardId}/confirm")
    public ResponseEntity<Card> moveToConfirm(@PathVariable UUID cardId) {
        return ResponseEntity.ok(cardService.moveToConfirm(cardId));
    }

    @PatchMapping("/{cardId}/completion")
    public ResponseEntity<Card> moveToCompletion(@PathVariable UUID cardId) {
        return ResponseEntity.ok(cardService.moveToCompletion(cardId));
    }

    @PostMapping("/{cardId}/confirm")
    public ResponseEntity<Card> addConfirm(@PathVariable UUID cardId, @RequestBody ConfirmRequest confirmRequest) {
        return ResponseEntity.ok(cardService.addConfirm(cardId, confirmRequest));
    }
}
