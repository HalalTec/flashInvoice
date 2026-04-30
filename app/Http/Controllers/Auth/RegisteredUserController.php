<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\InviteUserMail;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    private $accessLevels = ['admin', 'auditor', 'viewer'];
    private $role = ['leader', 'owner', 'team'];

    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $formFields = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'department' => 'nullable|string|max:255',
        ]);

        $user = DB::transaction(function () use ($formFields) {
            $user = User::create([
                'name' => $formFields['name'],
                'email' => $formFields['email'],
                'password' => Hash::make($formFields['password']),
                'access_level' => $this->accessLevels[1],
            ]);

            $user->participant()->create([
                'role' => $this->role[0],
                'department' => $formFields['department'] ?? null,
                'code' => $this->generateUniqueCode(),
            ]);

            return $user;
        });

        event(new Registered($user));
        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }

    private function generateUniqueCode($length = 8): string
    {
        do {
            $code = Str::upper(Str::random($length));
        } while (\App\Models\Participant::where('code', $code)->exists());

        return $code;
    }

    public function sendInvitation(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email',
            'role' => 'required|string|in:team,owner,viewer',
            'code' => 'required|string',
            'department' => 'nullable|string|max:255',
        ]);


        DB::transaction(function () use ($validated) {

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['code']),
                'access_level' => $this->accessLevels[2],
                'code' => $validated['code']
            ]);

            $user->participant()->create([
                'role' => $validated['role'],
                'department' => $validated['department'] ?? null,
                'code' => $validated['code'],
            ]);

            Mail::to($validated['email'])->send(
                new InviteUserMail(
                    $validated['name'],
                    $validated['email'],
                    ucfirst($validated['role']),
                    $validated['code']
                )
            );
        });

        return response()->json(['message' => 'Invite sent successfully!'], 200);
    }
}
