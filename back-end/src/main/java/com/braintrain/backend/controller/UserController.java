package com.braintrain.backend.controller;


import com.braintrain.backend.model.User;
import com.braintrain.backend.model.UserListDTO;
import com.braintrain.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/user")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public UserListDTO getUsers() {
        return userService.getUserList();
    }

    @PostMapping
    public User addUser(@RequestBody User user) {
        User existingUser = userService.getUserByEmail(user.getEmail());
        if (existingUser == null) {
            return userService.createUser(user);
        }
        return existingUser;
    }


}
