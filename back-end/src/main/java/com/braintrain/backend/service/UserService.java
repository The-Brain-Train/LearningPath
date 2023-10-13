package com.braintrain.backend.service;

import com.braintrain.backend.model.User;
import com.braintrain.backend.controller.dtos.UserFavoritesDTO;
import com.braintrain.backend.controller.dtos.UserListDTO;
import com.braintrain.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserListDTO getUserList() {
        return new UserListDTO(userRepository.findAll());
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    public UserFavoritesDTO getUsersFavorites(User user) {
        return new UserFavoritesDTO(user.getFavorites());
    }
}
