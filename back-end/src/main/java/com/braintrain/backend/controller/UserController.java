package com.braintrain.backend.controller;


import com.braintrain.backend.model.UserListDTO;
import com.braintrain.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public UserListDTO getUsers() {
        return userService.getUserList();
    }

}
