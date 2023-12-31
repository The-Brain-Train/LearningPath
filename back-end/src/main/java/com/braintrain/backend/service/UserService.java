package com.braintrain.backend.service;

import com.braintrain.backend.controller.dtos.FileDTO;
import com.braintrain.backend.controller.dtos.UpVoteDownVoteDTO;
import com.braintrain.backend.exceptionHandler.exception.InvalidFileContentTypeException;
import com.braintrain.backend.model.RoadmapMeta;
import com.braintrain.backend.model.User;
import com.braintrain.backend.controller.dtos.UserFavoritesDTO;
import com.braintrain.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    public UpVoteDownVoteDTO getUserUpVoteDownVotes(String userEmail) {
        User user = getUserByEmail(userEmail);
        List<String> upVoteMetaIdList = user.getUpVotes().stream()
                .map(RoadmapMeta::getId).toList();
        List<String> downVoteMetaIdList = user.getDownVotes().stream()
                .map(RoadmapMeta::getId).toList();
        return new UpVoteDownVoteDTO(upVoteMetaIdList, downVoteMetaIdList);
    }

    public String saveProfilePicture(String userEmail, MultipartFile file) {
        if (!file.getContentType().contains("image/")) {
            throw new InvalidFileContentTypeException("Invalid image upload.");
        }
        User user = userRepository.findByEmail(userEmail);
        String profilePictureUrl = uploadFile(file);
        user.setProfilePicture(profilePictureUrl);
        userRepository.save(user);
        return profilePictureUrl;
    }

    private String uploadFile(MultipartFile file) {
        FileDTO fileDTO = fileService.uploadFile(file, file.getOriginalFilename(), file.getContentType());
        return fileDTO.fileUrl();
    }
}
