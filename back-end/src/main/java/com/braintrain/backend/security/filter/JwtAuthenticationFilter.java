package com.braintrain.backend.security.filter;

import com.braintrain.backend.service.JwtServiceImpl;
import com.braintrain.backend.service.UserServiceSpringSecurity;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import org.apache.commons.lang3.StringUtils;

@Component
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private JwtServiceImpl jwtServiceImpl;

    private final UserServiceSpringSecurity userServiceSpringSecurity;

    @Override
    protected void doFilterInternal(jakarta.servlet.http.HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response, jakarta.servlet.FilterChain filterChain) throws jakarta.servlet.ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String jwtToken = null;
        String userEmail = null;

        if(StringUtils.isEmpty(authHeader) || !StringUtils.startsWith(authHeader,"Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        jwtToken = authHeader.substring(7);

        userEmail = jwtServiceImpl.extractUsername(jwtToken);

        if(StringUtils.isNotEmpty(userEmail)
                && SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails = userServiceSpringSecurity.userDetailsService().loadUserByUsername(userEmail);

            if(jwtServiceImpl.isTokenValid(jwtToken, userDetails)){
                SecurityContext context = SecurityContextHolder.createEmptyContext();
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                context.setAuthentication(authToken);
                SecurityContextHolder.setContext(context);
            }
        }
        filterChain.doFilter(request, response);
    }
}
