import { useForm } from 'react-hook-form';
import { Input } from '../input';
import { SubmitButton } from '../submitButton';
import axios from 'axios';
import { setAccessToken, setRefreshToken } from '../../services/tokenStorage';
import { useState } from 'react';
import loginMain from "../../assets/images/login_main.jpg";

type FormValues = {
    username: string;
    password: string;
};

type LoginResponse = {
    accessToken: string;
    refreshToken: string;
};

export const LoginForm = ({}) => {
    const { register, handleSubmit } = useForm<FormValues>();
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (body: any) => {
        try {
            const { data } = await axios.post<LoginResponse>('/api/auth', body);
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            window.location.href = '/dashboard';
        } catch (err: any) {
            if (err.response.status === 400) {
                setError(err.response.data.error);
            } else {
                throw Error('Invalid exception occurred');
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={'flex flex-col gap-2 items-center'}
        >
            <div>
                <img src={loginMain} alt={"test"} height={200} width={200}/>
            </div>

            <div>
                <h2 className={'text-pink-500 font-bold text-3xl mb-3'}>
                    Home expenses
                </h2>
            </div>

            <Input
                name={'username'}
                type={'text'}
                required={true}
                register={register}
                placeholder={'Enter your username'}
            />

            <Input
                name={'password'}
                type={'password'}
                required={true}
                register={register}
                placeholder={'Enter your password'}
                error={error}
            />

            <SubmitButton value={'Sign in'} />
        </form>
    );
};
