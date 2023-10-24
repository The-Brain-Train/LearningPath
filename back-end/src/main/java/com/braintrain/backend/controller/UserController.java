package com.braintrain.backend.controller;

import com.braintrain.backend.model.User;
import com.braintrain.backend.controller.dtos.UserFavoritesDTO;
import com.braintrain.backend.controller.dtos.UserListDTO;
import com.braintrain.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("api/users")
@AllArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService userService;

}
