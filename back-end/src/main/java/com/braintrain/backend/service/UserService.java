package com.braintrain.backend.service;

import com.braintrain.backend.controller.dtos.FileDTO;
import com.braintrain.backend.model.User;
import com.braintrain.backend.controller.dtos.UserFavoritesDTO;
import com.braintrain.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final FileService fileService;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    public UserFavoritesDTO getUsersFavorites(User user) {
        return new UserFavoritesDTO(user.getFavorites());
    }

    public String uploadFile(String userEmail, MultipartFile file) {
        User user = userRepository.findByEmail(userEmail);
        FileDTO fileDTO = fileService.uploadFile(file, file.getOriginalFilename(), file.getContentType());
        String profilePictureUrl = fileDTO.fileUrl();

        user.setProfilePicture(profilePictureUrl);
        userRepository.save(user);

        return profilePictureUrl;
    }
}
