import React, { useEffect } from 'react';
import {useForm} from 'react-hook-form';
import './styles/login.css'

const Login = () => {
    const {register, formState: {errors, isValid}, handleSubmit} = useForm();

    const onSubmit = values => console.log(values);

    const isLogin = window.location.pathname === '/login';

    return (
        <div className='login'>
            <div className="container">
                <h2>{isLogin ? 'Login' : 'Registration'}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input placeholder='Enter tag or email' type="text" style={errors?.username && {borderColor: "rgb(182, 44, 44)"}} {...register("username", { required: { value: true, message: 'Enter tag or email' }, minLength: { value: 3, message: 'Login must be at least 3 characters' }, maxLength: { value: 16, message: 'Username must not exceed 16 characters' } })} name="username" />
                    {errors?.username && <p className='login-error'>{errors?.username?.message}</p>}
                    <input placeholder='Enter password' type="password" style={errors?.password && {borderColor: "rgb(182, 44, 44)"}} {...register("password", { required: { value: true, message: 'Enter password' }, minLength: { value: 3, message: 'Password must be at least 3 characters' }, maxLength: { value: 16, message: 'Password must not exceed 16 characters' } })} name="password" />
                    {errors?.password && <p className='login-error'>{errors?.password?.message}</p>}
                    <div className="submit-container">
                        <input className='submit' type="submit" value={isLogin ? 'Login' : 'Register'}/>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
