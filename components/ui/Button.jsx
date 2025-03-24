export default function Button({ children, type = 'button', variant = 'primary', className = '', ...props }) {
    const baseClasses = 'px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors';

    const variantClasses = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    };

    return (
        <button
            type={type}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}