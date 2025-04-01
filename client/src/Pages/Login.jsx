import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import './styles/login.css'
import { check, login, registration } from '../http/userAPI.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import setChatNames from '../functions/setChatNames';
import { Notification } from 'rsuite';

const Login = observer(() => {

    const { user, chat } = useContext(Context);

    const { register, formState: { errors }, handleSubmit } = useForm();

    const location = useLocation();
    const isLogin = location.pathname === '/login';

    let [data, setData] = useState({});

    const navigate = useNavigate()

    useEffect(() => {

        const fetchData = async () => {

            const token = await check();
            if (token && token.data && token.data.message !== "Not authorised") navigate('/');

        };

        fetchData();

    }, []);

    const onSubmit = async values => {
        user.setLoading(true);
        let newData;
        try {
            if (isLogin) {
                newData = await login(values);
            } else {
                newData = await registration(values);
            }

            user.setLoading(false);
            setData(newData);

            if (newData === undefined) {
                user.setLoginError(true);
            }

            if (newData?._id) {
                user.setUser(newData);
                chat.setChats(setChatNames(newData.chats, newData));
                user.setIsAuth(true);
                navigate('/');
            }
        } catch (e) {
            user.setLoginError(true);
        }
    };

    const onChange = () => {
        setData({})
    }

    return (
        <div className='login'>
            <div className="container">
                <h2>{isLogin ? 'Login' : 'Registration'}</h2>
                <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
                    {isLogin ? (
                        <>
                            <input placeholder='Enter tag or email' type="text" style={errors?.login && { borderColor: "rgb(182, 44, 44)" }} {...register("login", { required: { value: true, message: 'Enter tag or email' }, minLength: { value: 3, message: 'Login must be at least 3 characters' }, maxLength: { value: 16, message: 'Login must not exceed 16 characters' } })} name="login" />
                            {errors?.login && <p className='login-error'>{errors?.login?.message}</p>}
                            <input placeholder='Enter password' type="password" style={errors?.password && { borderColor: "rgb(182, 44, 44)" }} {...register("password", { required: { value: true, message: 'Enter password' }, minLength: { value: 3, message: 'Password must be at least 3 characters' }, maxLength: { value: 16, message: 'Password must not exceed 16 characters' } })} name="password" />
                            {errors?.password && <p className='login-error'>{errors?.password?.message}</p>}
                            <div className='change-link'>
                                <p>Don't have an account?</p>
                                <p className='goto-link' onClick={() => navigate("/registration")}>Register</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <input placeholder='Enter your name' type="text" style={errors?.name && { borderColor: "rgb(182, 44, 44)" }} {...register("name", { required: { value: true, message: 'Enter name' }, minLength: { value: 3, message: 'Name must be at least 3 characters' }, maxLength: { value: 30, message: 'Name must not exceed 30 characters' } })} name="name" />
                            {errors?.name && <p className='login-error'>{errors?.name?.message}</p>}

                            <input placeholder='Enter your email' type="email" style={errors?.email && { borderColor: "rgb(182, 44, 44)" }} {...register("email", { required: { value: true, message: 'Enter email' }, minLength: { value: 4, message: 'Email must be at least 4 characters' }, maxLength: { value: 40, message: 'Email must not exceed 40 characters' } })} name="email" />
                            {errors?.email && <p className='login-error'>{errors?.email?.message}</p>}

                            <input placeholder='Enter your tag' type="text" style={errors?.tag && { borderColor: "rgb(182, 44, 44)" }} {...register("tag", { required: { value: true, message: 'Enter tag' }, minLength: { value: 3, message: 'Tag must be at least 3 characters' }, maxLength: { value: 16, message: 'Tag must not exceed 16 characters' } })} name="tag" />
                            {errors?.tag && <p className='login-error'>{errors?.tag?.message}</p>}

                            <input placeholder='Enter your phone' type="text" style={errors?.phone && { borderColor: "rgb(182, 44, 44)" }} {...register("phone", {
                                required: false,
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: 'Enter a valid phone number (10 digits)'
                                }
                            })} name="phone" />
                            {errors?.phone && <p className='login-error'>{errors?.phone?.message}</p>}

                            <input placeholder='Enter password' type="password" style={errors?.password && { borderColor: "rgb(182, 44, 44)" }} {...register("password", { required: { value: true, message: 'Enter password' }, minLength: { value: 6, message: 'Password must be at least 6 characters' }, maxLength: { value: 16, message: 'Password must not exceed 16 characters' } })} name="password" />
                            {errors?.password && <p className='login-error'>{errors?.password?.message}</p>}
                            <div className='change-link'>
                                <p>Already have an account?</p>
                                <p className='goto-link' onClick={() => navigate("/login")}>Log in</p>
                            </div>
                        </>
                    )}
                    {data?.status === 400 ? <p className='login-error' style={{ fontSize: '18px', fontWeight: "bold" }}>{data.data}</p> : <></>}
                    <div className="submit-container">
                        <input className='submit' type="submit" value={isLogin ? 'Login' : 'Register'} />
                    </div>
                </form>
            </div>
            <Notification className='error-notification' onClose={() => user.setLoginError(false)} type="error" header="Something went wrong with the server" closable style={{ display: user.loginError ? 'inline-block' : 'none' }}>Server might work slow. Please try again later</Notification>
        </div>
    );
})

export default Login;
