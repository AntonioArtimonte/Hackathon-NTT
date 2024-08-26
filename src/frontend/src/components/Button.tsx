import { FunctionComponent } from 'react'

interface ButtonProps {
    content: string;
    functionality: () => void;
}

const Button: FunctionComponent<ButtonProps> = (props) => {
    return (
            <button onClick={props.functionality} className='bg-gray-700 w-fit px-8 h-12 text-white mx-2 rounded-lg text-base'>
            {props.content} 
            </button>
    )
}

export default Button