import {UseFormRegister} from "react-hook-form";

export interface InputProps {
    name: string;
    type: 'text' | 'number' | 'password';
    required: boolean;
    placeholder: string;
    register: UseFormRegister<any>;
    className?: string;
    error?: string|null
}
