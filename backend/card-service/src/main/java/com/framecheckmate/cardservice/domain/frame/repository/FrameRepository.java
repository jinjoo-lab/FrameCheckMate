package com.framecheckmate.cardservice.domain.frame.repository;

import com.framecheckmate.cardservice.domain.frame.entity.Frame;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FrameRepository extends MongoRepository<Frame, UUID> {
    List<Frame> findByProjectId(UUID projectId);
    Frame findByFrameId(UUID frameId);
    Frame findByProjectIdAndSequence(UUID projectId, int sequence);
}
