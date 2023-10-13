package com.braintrain.backend.controller.dtos;

import com.braintrain.backend.model.User;

import java.util.List;

public record UserListDTO(List<User> userList) {
}
