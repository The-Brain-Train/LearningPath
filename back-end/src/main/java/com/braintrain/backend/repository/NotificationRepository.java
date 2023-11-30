package com.braintrain.backend.repository;

import com.braintrain.backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findAllByReceiverEmail(String receiverEmail);

}
