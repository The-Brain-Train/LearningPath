package com.braintrain.backend.controller;


import com.braintrain.backend.model.User;
import com.braintrain.backend.service.FileService;
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
    private final FileService fileService;

    @PostMapping("/{userEmail}/profileImage")
    public ResponseEntity<String> updateProfilePicture(@PathVariable String userEmail, @RequestParam("file") MultipartFile file) {
        User user = userService.getUserByEmail(userEmail);
        String userProfilePictureUrl = user.getProfilePicture();
        if (userProfilePictureUrl != null){
            fileService.deleteFile(userProfilePictureUrl);
        }
        return ResponseEntity.ok(userService.saveProfilePicture(userEmail, file));
    }

    @GetMapping("/{userEmail}/profileImage")
    public ResponseEntity<String> getProfilePicture(@PathVariable String userEmail) {
        User user = userService.getUserByEmail(userEmail);
        return ResponseEntity.ok(user.getProfilePicture());
    }
}
