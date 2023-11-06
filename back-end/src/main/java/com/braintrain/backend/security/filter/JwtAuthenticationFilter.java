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
        // checking if auth header is present in the request, if not then return.
        // this will throw 403 forbidden exception
        if(StringUtils.isEmpty(authHeader) || !StringUtils.startsWith(authHeader,"Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }
        //if JWT token is present, then get the token.
        jwtToken = authHeader.substring(7);
        // every token will have user details, fetch the username from it
        userEmail = jwtServiceImpl.extractUsername(jwtToken);

        // If userinfo is present and is not authentication, then do authentication.
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
