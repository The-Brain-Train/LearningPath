package com.braintrain.backend.service;

import com.braintrain.backend.model.UserListDTO;
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
}
