package com.braintrain.backend.model;

import com.braintrain.backend.model.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notification")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    private String id;
    private String message;
    private String senderEmail;
    private String receiverEmail;
    private String roadmapMetaId;
    private NotificationType type;
    private LocalDateTime timestamp;
    private boolean isRead;

    public Notification(
            String message,
            String senderEmail,
            String receiverEmail,
            String roadmapMetaId,
            NotificationType type) {

        this.message = message;
        this.senderEmail = senderEmail;
        this.receiverEmail = receiverEmail;
        this.roadmapMetaId = roadmapMetaId;
        this.type = type;
        this.timestamp = LocalDateTime.now();
        this.isRead = false;
    }
}
