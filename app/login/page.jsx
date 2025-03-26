
"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (result.error) {
                throw new Error(result.error);
            }

            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
      /*  <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Вход</h1>

            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
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

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                    Войти
                </button>
            </form>

            <p className="mt-4 text-center">
                Нет аккаунта? <Link href="/register" className="text-blue-600">Зарегистрироваться</Link>
            </p>
        </div>*/
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {/* Form Container */}
            <div className="bg-white shadow-md rounded-lg p-6 w-80">
                {/* Title */}
                <h1 className="text-2xl font-bold text-black text-center mb-4">Login</h1>

                {/* Form Fields */}
                <form className="space-y-4">
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white rounded-md py-2 mt-4 hover:bg-blue-600"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}