package com.braintrain.backend.security.config;

import static com.braintrain.backend.security.config.CorsConfig.withLearningPathDefaults;
import static org.springframework.security.config.Customizer.withDefaults;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

import com.braintrain.backend.security.filter.JwtAuthenticationFilter;
import com.braintrain.backend.service.UserServiceSpringSecurity;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    private JwtAuthenticationFilter authFilter;
    private UserServiceSpringSecurity userServiceSpringSecurity;
    private CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;
    private final WebsiteProperties websiteProperties;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request -> request.requestMatchers(
                                "/status",
                                "/api/auth/**",
                                "/api/roadmaps",
                                "/api/roadmaps/{id}",
                                "/api/roadmaps/findByMeta/{metaId}",
                                "/api/roadmaps/{userEmail}/resource/{roadmapMetaId}"
                        )
                        .permitAll().anyRequest().authenticated())
                .cors(withLearningPathDefaults(websiteProperties.frontend()))
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(customAuthenticationSuccessHandler))
                .sessionManagement(manager -> manager.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider()).addFilterBefore(
                        authFilter, UsernamePasswordAuthenticationFilter.class)
                .csrf(CsrfConfigurer::disable);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userServiceSpringSecurity.userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }


}
