import { LoginForm } from '../../components/loginForm';

export function Login({}) {
    return (
        <div className={'grid h-screen place-items-center'}>
            <div className={'lg:w-1/4'}>
                <LoginForm />
            </div>
        </div>
    );
}
