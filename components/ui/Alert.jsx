export default function Alert({ type = 'info', message }) {
    if (!message) return null;

    const alertClasses = {
        info: 'bg-blue-50 text-blue-700 border-blue-400',
        success: 'bg-green-50 text-green-700 border-green-400',
        warning: 'bg-yellow-50 text-yellow-700 border-yellow-400',
        error: 'bg-red-50 text-red-700 border-red-400',
    };

    return (
        <div className={`p-4 mb-4 rounded-md border-l-4 ${alertClasses[type]}`}>
            {message}
        </div>
    );
}
