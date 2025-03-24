export default function Card({ children, title, className = '' }) {
    return (
        <div className={`border rounded-lg overflow-hidden bg-white ${className}`}>
            {title && (
                <div className="border-b px-4 py-3 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                </div>
            )}
            <div className="p-4">
                {children}
            </div>
        </div>
    );
}
