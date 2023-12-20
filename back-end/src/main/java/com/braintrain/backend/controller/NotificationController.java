package com.braintrain.backend.controller;

import com.braintrain.backend.controller.dtos.NotificationRequestDTO;
import com.braintrain.backend.controller.dtos.NotificationResponseDTO;
import com.braintrain.backend.exceptionHandler.exception.UserNotFoundException;
import com.braintrain.backend.model.Notification;
import com.braintrain.backend.service.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/notification")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class NotificationController {
    private final NotificationService service;

    @GetMapping("/user/{userEmail}/all")
    public ResponseEntity<List<NotificationResponseDTO>> getAllNotifications(
            @PathVariable String userEmail) {

        if (userEmail == null) {
            throw new UserNotFoundException("User not found for email: " + userEmail);
        }

        List<NotificationResponseDTO> notificationDTOS =
                service.getAllNotificationsOfUser(userEmail);

        return ResponseEntity.ok(notificationDTOS);
    }

    @GetMapping("/user/{userEmail}/unread")
    public ResponseEntity<List<NotificationResponseDTO>> getUnreadNotifications(
            @PathVariable String userEmail) {

        if (userEmail == null) {
            throw new UserNotFoundException("User not found for email: " + userEmail);
        }

        List<NotificationResponseDTO> notificationDTOS =
                service.getUnreadNotificationsOfUser(userEmail);

        return ResponseEntity.ok(notificationDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponseDTO> getNotificationById(
            @PathVariable String id) {

        NotificationResponseDTO notificationDTO = service.getNotificationById(id);
        return ResponseEntity.ok(notificationDTO);
    }

    @PostMapping
    public ResponseEntity<Notification> addNotification(
            @RequestBody NotificationRequestDTO dto) {

        Notification notification = service.addNotification(dto);
        URI uri = URI.create("api/notification" + notification.getId());
        return ResponseEntity.created(uri).body(notification);
    }

    @PutMapping("{id}/read")
    public ResponseEntity<NotificationResponseDTO> markAsRead(
            @PathVariable String id) {
        NotificationResponseDTO notificationDTO = service.markNotificationAsRead(id);
        return ResponseEntity.ok(notificationDTO);
    }

    @PutMapping("{id}/unread")
    public ResponseEntity<NotificationResponseDTO> markAsUnRead(
            @PathVariable String id) {
        NotificationResponseDTO notificationDTO = service.markNotificationAsUnRead(id);
        return ResponseEntity.ok(notificationDTO);
    }
}
