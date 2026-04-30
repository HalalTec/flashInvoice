import React from 'react';
import { useForm } from '@inertiajs/react';

import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { LEADER_QUESTIONS } from '@/components/questions/Leader';
import { OWNER_QUESTIONS } from '@/components/questions/Owner';
import { TEAM_QUESTIONS } from '@/components/questions/Team';

export default function AuditFormEngine({ role, user, submitted }) {
    const questions = {
        leader: LEADER_QUESTIONS,
        owner: OWNER_QUESTIONS,
        team: TEAM_QUESTIONS,
    }[role] || [];

    const { data, setData, post, processing, errors } = useForm(() => {
        const initialData = questions.reduce((acc, q) => {
            if (q.id) {
                // Initialize file inputs to null instead of '' to prevent validation errors
                acc[q.id] = q.type === 'scale' ? 3 : (q.type === 'file' ? null : '');
            }
            return acc;
        }, {});
        if (role === 'leader' && user) {
            initialData.leader_name = user.name;
            initialData.leader_email = user.email;
        }else if (role === 'owner' && user) {
            initialData.owner_name = user.name;
            initialData.owner_email = user.email;
        } else if (role === 'team' && user) {
            initialData.team_name = user.name;
            initialData.team_email = user.email;
        }

        return initialData;
    });

    const submit = (e) => {
        e.preventDefault();
        console.log('Submitting Audit Payload:', data); // Debug: Check what is being sent
        post(route(`${role}.store`), {
            preserveScroll: true,
            onSuccess: () => console.log('Audit submitted successfully'),
            onError: (err) => console.error('Audit submission failed:', err),
        });
    };

    if (submitted) {
        return (
            <div className="w-full py-12 bg-emerald-50 rounded-3xl border border-emerald-100 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 text-3xl">
                    ✓
                </div>
                <h3 className="text-2xl font-bold text-emerald-900">Assessment Complete</h3>
                <p className="mt-2 text-emerald-700 text-lg">
                    You have completed your assessment. Please wait for the result.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-8 animate-in fade-in duration-500">
            {questions.map((q, index) => {
                if (q.condition && !q.condition(data)) return null;
                return (
                    <div key={q.id || index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                        {q.type === 'header' && (
                            <div className="border-l-4 border-indigo-500 pl-4 py-2 mb-4">
                                <h3 className="text-xl font-black text-slate-800">{q.label}</h3>
                                <p className="text-sm text-slate-500">{q.description}</p>
                            </div>
                        )}
                        {q.question && (
                            <div className="mb-4">
                                <label className="block text-lg font-bold text-slate-700">{q.question}</label>
                                {q.help && <p className="text-xs text-slate-500 mt-1 italic">{q.help}</p>}
                            </div>
                        )}
                        {(q.type === 'text' || q.type === 'number' || q.type === 'textarea') && (
                            <div className="mt-2">
                                {q.type === 'textarea' ? (
                                    <textarea 
                                        className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 min-h-[100px]"
                                        onChange={e => setData(q.id, e.target.value)}
                                        value={data[q.id]}
                                    />
                                ) : (
                                    <TextInput 
                                        type={q.type} 
                                        className="w-full" 
                                        onChange={e => setData(q.id, e.target.value)}
                                        value={data[q.id]}
                                    />
                                )}
                            </div>
                        )}
                        {q.type === 'radio' && (
                            <div className="grid gap-3 mt-2">
                                {q.options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setData(q.id, opt.value)}
                                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                                            data[q.id] === opt.value 
                                            ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                                            : 'border-slate-100 hover:border-indigo-200'
                                        }`}
                                    >
                                        <div className="font-bold text-slate-800">{opt.label}</div>
                                        {opt.desc && <div className="text-xs text-slate-500">{opt.desc}</div>}
                                    </button>
                                ))}
                            </div>
                        )}

                        {q.type === 'scale' && (
                            <div className="flex flex-col items-center gap-6 py-4 bg-slate-50 rounded-xl">
                                <div className="flex justify-between w-full px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Disagree</span>
                                    <span>Agree</span>
                                </div>
                                <div className="flex gap-2 sm:gap-4">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setData(q.id, num)}
                                            className={`w-12 h-12 rounded-full font-black text-lg transition-all border-2 ${
                                                data[q.id] === num
                                                    ? 'bg-indigo-600 text-white border-indigo-600 scale-110 shadow-lg shadow-indigo-200'
                                                    : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-400 hover:text-indigo-500'
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {q.type === 'file' && (
                            <div className="mt-2 p-4 border-2 border-dashed border-slate-200 rounded-xl text-center">
                                <input 
                                    type="file" 
                                    id={q.id}
                                    className="hidden"
                                    onChange={e => setData(q.id, e.target.files[0])}
                                />
                                <label htmlFor={q.id} className="cursor-pointer text-indigo-600 font-bold hover:underline">
                                    {data[q.id] ? `Selected: ${data[q.id].name}` : 'Click to upload forensic artifact'}
                                </label>
                            </div>
                        )}
                    </div>
                );
            })}

            <div className="pt-6">
                <PrimaryButton className="w-full justify-center py-5 text-xl rounded-2xl shadow-xl shadow-indigo-100 bg-slate-900" disabled={processing}>
                    Submit Audit Result
                </PrimaryButton>
            </div>
        </form>
    );
}