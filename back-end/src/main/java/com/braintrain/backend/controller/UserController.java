package com.braintrain.backend.controller;

import com.braintrain.backend.model.User;
import com.braintrain.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/users")
@AllArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService userService;
    @PostMapping("/{userEmail}/profileImage")
    public ResponseEntity<String> updateProfilePicture(@PathVariable String userEmail, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(userService.uploadFile(userEmail, file));
    }

    @GetMapping("/{userEmail}/profileImage")
    public ResponseEntity<String> getProfilePicture(@PathVariable String userEmail) {
        User user = userService.getUserByEmail(userEmail);
        return ResponseEntity.ok(user.getProfilePicture());
    }

}
