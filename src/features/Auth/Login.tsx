import React, { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logo from "@images/company-logo.png";

type FormState = {
    userId: string;
    password: string;
    rememberMe: boolean;
};


export default function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    const [formState, setFormState] = useState<FormState>({
        userId: "",
        password: "",
        rememberMe: false,
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

    };

    return (
        <>
            <div className="form-signin w-100 m-auto">
                <form onSubmit={handleSubmit}>
                    <img className="mb-4" src={logo} alt="로고" width="100%" height="100%" />

                    <div className="form-floating">
                        <input
                            id="userId"
                            className="form-control"
                            placeholder="아이디"
                            value={formState.userId}
                            onChange={handleChange}
                            autoComplete="username"
                        />
                        <label htmlFor="userId">아이디</label>
                    </div>
                    <div className="form-floating">
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            placeholder="비밀번호"
                            value={formState.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                        <label htmlFor="password">비밀번호</label>
                    </div>
                    <div className="form-check text-start my-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="rememberMe"
                            checked={formState.rememberMe}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="rememberMe">
                            Remember me
                        </label>
                    </div>
                    <button id="sign-in-btn" className="btn btn-primary w-100 py-2">
                        Sign in
                    </button>
                </form>
            </div>
        </>
    );
}
