package com.shiftlink.backend.auth;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.shiftlink.backend.common.GlobalExceptionHandler;
import com.shiftlink.backend.security.JwtService;

@ExtendWith(MockitoExtension.class)
class AuthControllerDemoTest {

    @Mock
    private AuthService authService;

    @Mock
    private DemoSessionService demoSessionService;

    @Mock
    private JwtService jwtService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {

        AuthController controller = new AuthController(
            authService,
            demoSessionService,
            jwtService
        );

        mockMvc = MockMvcBuilders
            .standaloneSetup(controller)
            .setControllerAdvice(
                new GlobalExceptionHandler()
            )
            .build();
    }

    @Test
    void demoReturnsTooManyRequestsWhenLimitIsReached()
            throws Exception {

        when(demoSessionService.createDemoSession())
            .thenThrow(new DemoSessionLimitException());

        mockMvc.perform(post("/api/auth/demo"))
            .andExpect(status().isTooManyRequests());
    }
}
