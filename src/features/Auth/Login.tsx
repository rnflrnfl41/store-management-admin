import React, { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { publicAxiosInstance } from "@utils/axiosInstance";
import { loginSuccess, loginStart, loginFailure } from "@store/userSlice";
import logo from "@images/company-logo.png";
import "@css/login.css";

type FormState = {
    userId: string;
    password: string;
    rememberMe: boolean;
};

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const savedLoginId = localStorage.getItem('rememberedLoginId');
        if (savedLoginId) {
            setFormState(s => ({ ...s, userId: savedLoginId, rememberMe: true }));
        }
    }, []);

    const [formState, setFormState] = useState<FormState>({
        userId: "",
        password: "",
        rememberMe: false,
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            dispatch(loginStart());

            // 테스트용: 실제 API 호출 대신 임시 데이터 사용
            // const response = await publicAxiosInstance.post("/auth/login", {
            //     loginId: formState.userId,
            //     password: formState.password,
            // });

            // 임시 사용자 데이터 (테스트용)
            const userData = {
                userId: 1,
                loginId: formState.userId,
                storeId: 1,
                userName: "테스트 사용자",
                token: "test-token-123"
            };

            dispatch(loginSuccess(userData));

            if (formState.rememberMe) localStorage.setItem('rememberedLoginId', formState.userId);
            else localStorage.removeItem('rememberedLoginId');

            // 로그인 성공 후 메인 페이지로 이동
            navigate("/dashboard");

        } catch (error) {
            dispatch(loginFailure());
            console.error("로그인 실패:", error);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        setFormState(prev => ({
            ...prev,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <img 
                        src={logo} 
                        alt="로고" 
                        className="login-logo"
                    />
                    <h2 className="login-title">
                        로그인
                    </h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label 
                            htmlFor="userId" 
                            className="form-label"
                        >
                            아이디
                        </label>
                        <input
                            id="userId"
                            type="text"
                            className="form-input"
                            placeholder="아이디를 입력하세요"
                            value={formState.userId}
                            onChange={handleChange}
                            autoComplete="username"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label 
                            htmlFor="password" 
                            className="form-label"
                        >
                            비밀번호
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="비밀번호를 입력하세요"
                            value={formState.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                    </div>
                    
                    <div className="remember-me-container">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            className="remember-me-checkbox"
                            checked={formState.rememberMe}
                            onChange={handleChange}
                        />
                        <label 
                            htmlFor="rememberMe"
                            className="remember-me-label"
                        >
                            아이디 기억하기
                        </label>
                    </div>
                    
                    <button 
                        type="submit"
                        className="login-button"
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
}
