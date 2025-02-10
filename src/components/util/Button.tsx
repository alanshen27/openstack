const Button = {
    Primary: ({ children, onClick, ...props }: Readonly<{
        children: React.ReactNode,
        onClick?: () => void,
        [key: string]: any,
    }>) => {
        return (<button onClick={onClick} {...props} className={`bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-md ${props.className}`} >
            {children}
        </button>);
    },
    Light: ({ children, onClick, ...props }: Readonly<{
        children: React.ReactNode,
        onClick?: () => void,
        [key: string]: any,
    }>) => {
        return (<button onClick={onClick} {...props} className={`border bg-gray-100 hover:bg-gray-200 text-black py-2 px-4 rounded-md ${props.className}`}>
            {children}
        </button>);
    },
    Select: ({ children, onClick, ...props }: Readonly<{
        children: React.ReactNode,
        onClick?: () => void,
        [key: string]: any,
    }>) => {
        return (<a onClick={onClick} {...props} className={`bg-white hover:bg-primary-100 text-black py-3 px-4 rounded-md ${props.className}`}>
            {children}
        </a>);
    },
    SM: ({ children, onClick, ...props }: Readonly<{
        children: React.ReactNode,
        onClick?: () => void,
        [key: string]: any,
    }>) => {
        return (<a onClick={onClick} {...props} className={`text-lg ${props.className ? props.className : 'text-gray-700 hover:text-gray-800'}`}>
            {children}
        </a>);
    }
}

export default Button;