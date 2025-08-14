import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { publicAxiosInstance } from "@utils/axiosInstance";
import { loginSuccess } from "@store/userSlice";
import { showError } from "@utils/alertUtils";
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

    // 유효성 검사 함수
    const validateForm = async (): Promise<boolean> => {
        // 아이디 검증
        if (!formState.userId.trim()) {
            await showError("아이디를 입력해주세요.");
            return false;
        }

        // 비밀번호 검증
        if (!formState.password) {
            await showError("비밀번호를 입력해주세요.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 유효성 검사
        if (!(await validateForm())) {
            return;
        }

        const requestData = {
            loginId: formState.userId.trim(),
            password: formState.password,
            adminLogin: true,
        };

        try {
            const response = await publicAxiosInstance.post("/auth/login", requestData);

            const userData = response.data;

            dispatch(loginSuccess(userData));

            // 아이디 기억하기 처리
            if (formState.rememberMe) {
                localStorage.setItem('rememberedLoginId', formState.userId.trim());
            } else {
                localStorage.removeItem('rememberedLoginId');
            }

            // 로그인 성공 후 메인 페이지로 이동
            navigate("/dashboard");

        } catch (error) {
            console.log(error);
            // 에러 메시지는 axiosInstance에서 자동으로 처리됨
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
                <img 
                        src={logo} 
                        alt="로고" 
                        className="login-logo"
                    />

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
