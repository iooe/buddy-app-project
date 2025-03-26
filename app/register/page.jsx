'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        major: '',
        yearOfStudy: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Ошибка регистрации');
            }

            router.push('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
       /* <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Регистрация</h1>

            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Имя</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1">Пароль</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1">Специальность</label>
                    <input
                        type="text"
                        name="major"
                        value={formData.major}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1">Год обучения</label>
                    <select
                        name="yearOfStudy"
                        value={formData.yearOfStudy}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Выберите год</option>
                        <option value="1">1 курс</option>
                        <option value="2">2 курс</option>
                        <option value="3">3 курс</option>
                        <option value="4">4 курс</option>
                    </select>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                    Зарегистрироваться
                </button>
            </form>

            <p className="mt-4 text-center">
                Уже есть аккаунт? <Link href="/login" className="text-blue-600">Войти</Link>
            </p>
        </div>*/
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {/* Form Container */}
            <div className="bg-white shadow-md rounded-lg p-6 w-96">
                {/* Title */}
                <h1 className="text-2xl font-bold text-black text-center mb-6">Registration</h1>

                {/* Form Fields */}
                <form className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label className="block text-black text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder=""
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-black text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder=""
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-black text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder=""
                        />
                    </div>

                    {/* Specialty Field */}
                    <div>
                        <label className="block text-black text-sm font-medium mb-1">Specialty</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder=""
                        />
                    </div>

                    {/* Year of Study Field (Dropdown) */}
                    <div>
                        <label className="block text-black text-sm font-medium mb-1">Year of Study</label>
                        <select className="w-full border border-gray-300 rounded-md p-2 text-gray-500">
                            <option value="">Select Year</option>
                            {/* Add additional options here as needed, e.g., <option value="1">1</option> */}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white rounded-md py-2 mt-4 hover:bg-blue-600"
                    >
                        REGISTER
                    </button>
                </form>
            </div>
        </div>
    );
}