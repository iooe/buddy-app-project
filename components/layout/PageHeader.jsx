export default function PageHeader({ title, description, actions }) {
    return (
        <div className="mb-6 sm:flex sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            </div>
            {actions && <div className="mt-4 sm:mt-0">{actions}</div>}
        </div>
    );
}