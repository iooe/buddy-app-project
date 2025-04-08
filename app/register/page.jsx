'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function Register() {
    const router = useRouter();
    // Form state for registration data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        major: '',
        yearOfStudy: '',
    });
    // Error state for validation messages
    const [error, setError] = useState('');
    // Loading state for form submission
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // Validate required fields
            if (!formData.name || !formData.email || !formData.password) {
                throw new Error('Name, email and password are required');
            }

            // Send registration request to API
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Handle API errors
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Registration error');
            }

            // Automatically sign in after successful registration
            const signInResult = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false, // Prevent NextAuth from redirecting
            });

            // Handle sign-in errors
            if (signInResult?.error) {
                throw new Error(signInResult.error || 'Login failed after registration');
            }

            // Redirect to dashboard/home page after successful login
            router.push('/dashboard'); // Or any other page you want to redirect to

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {/* Form Container */}
            <div className="bg-white shadow-md rounded-lg p-6 w-96">
                {/* Title */}
                <h1 className="text-2xl font-bold text-black text-center mb-6">Registration</h1>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-sm">
                        {error}
                    </div>
                )}

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label className="block text-black text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-black text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-black text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="Create a password"
                        />
                    </div>

                    {/* Major/Specialty Field */}
                    <div>
                        <label className="block text-black text-sm font-medium mb-1">Specialty</label>
                        <input
                            type="text"
                            name="major"
                            value={formData.major}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="Enter your specialty (optional)"
                        />
                    </div>

                    {/* Year of Study Field (Dropdown) */}
                    <div>
                        <label className="block text-black text-sm font-medium mb-1">Year of Study</label>
                        <select
                            name="yearOfStudy"
                            value={formData.yearOfStudy}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                        >
                            <option value="">Select Year</option>
                            <option value="1">1st year</option>
                            <option value="2">2nd year</option>
                            <option value="3">3rd year</option>
                            <option value="4">4th year</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-500 text-white rounded-md py-2 mt-4 hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {isSubmitting ? 'REGISTERING...' : 'REGISTER'}
                    </button>
                </form>

                {/* Login Link */}
                <p className="mt-4 text-center text-sm">
                    Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}