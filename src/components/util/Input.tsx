function InputWrapper(props: { children: React.ReactNode, label?: string }) {
    if (!props.label) return <>{props.children}</>
    return (
        <div className="flex flex-col space-y-1 w-full">
            <label className="font-semibold text-xs">{props.label}</label>
            {props.children}
        </div>
    );
}

const Input = {
    Text: ({ label, value, onChange, placeholder, ...props }:
        {
            label?: string,
            value?: number | string,
            onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
            placeholder?: string,
            [key: string]: any
        }) => {

        if (!placeholder && label) placeholder = `Enter the ${label.toLowerCase()} here...`;
        if (!placeholder) placeholder = 'Type here...';

        return (
            <InputWrapper label={label}>
                <input
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    {...props}
                    className={`px-4 py-3 bg-gray-100 border rounded-md text-sm outline-none ${props.className}`}
                />
            </InputWrapper>
        )
    },
    Textarea: ({ label, value, onChange, placeholder, ...props }: 
        { label?: string, 
            value?: number | string, 
            onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, 
            placeholder?: string, 
            [key: string]: any 
        }) => {
        if (!placeholder && label) placeholder = `Enter the ${label.toLowerCase()} here...`;
        if (!placeholder) placeholder = 'Type here...';

        return (
            <InputWrapper label={label}>
                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    {...props}
                    className={`px-4 py-3 bg-gray-100 border rounded-md text-sm outline-none min-h-[10rem] ${props.className}`}
                />
            </InputWrapper>
        )
    },
}

export default Input;