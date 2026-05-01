import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        department: '', // Added to match your backend logic
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Create Audit Account" />

            {/* Header Section */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create your account</h2>
                <p className="text-slate-500 text-sm mt-2">Join the Ownership Outcome Audit platform</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                {/* Full Name */}
                <div>
                    <InputLabel htmlFor="name" value="Full Name" className="text-slate-700 font-semibold" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        placeholder="John Doe"
                    />
                    <InputError message={errors.name} className="mt-1" />
                </div>

                {/* Email Address */}
                <div>
                    <InputLabel htmlFor="email" value="Work Email" className="text-slate-700 font-semibold" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        placeholder="john@company.com"
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                {/* Department (The missing piece for your Participant logic!) */}
                <div>
                    <InputLabel htmlFor="department" value="Department" className="text-slate-700 font-semibold" />
                    <TextInput
                        id="department"
                        name="department"
                        value={data.department}
                        className="mt-1 block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
                        onChange={(e) => setData('department', e.target.value)}
                        placeholder="e.g. Operations, Engineering"
                    />
                    <InputError message={errors.department} className="mt-1" />
                </div>

                {/* Password Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="password" value="Password" className="text-slate-700 font-semibold" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirm" className="text-slate-700 font-semibold" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-1" />
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full justify-center py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-lg shadow-indigo-100" 
                        disabled={processing}
                    >
                        Create Account
                    </PrimaryButton>
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            className="font-bold text-indigo-600 hover:text-indigo-500 transition underline decoration-2 underline-offset-4"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}