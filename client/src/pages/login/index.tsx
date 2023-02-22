import { LoginForm } from '../../components/loginForm';

export function Login({}) {
    return (
        <div className={"grid grid-cols-10"}>
            <div className={"col-start-3 col-end-9"}>

            <LoginForm />
            </div>
        </div>
    );
}
