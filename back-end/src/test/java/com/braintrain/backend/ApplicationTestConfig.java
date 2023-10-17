package com.braintrain.backend;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.context.annotation.Bean;


@Configuration
public class ApplicationTestConfig {
    @Bean
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}

