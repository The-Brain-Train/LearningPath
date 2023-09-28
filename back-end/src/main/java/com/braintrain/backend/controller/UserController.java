package com.braintrain.backend.controller;


import com.braintrain.backend.model.User;
import com.braintrain.backend.model.UserListDTO;
import com.braintrain.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

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
    public ResponseEntity<User> addUser(@RequestBody User user) {
        User existingUser = userService.getUserByEmail(user.getEmail());
        if (existingUser == null) {
            User newUser = userService.createUser(user);
            URI uri = URI.create("/api/user/" + user.getId());
            return ResponseEntity.created(uri).body(newUser);
        }
        return ResponseEntity.ok(existingUser);
    }


}
