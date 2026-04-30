<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\AuditReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AdminController extends Controller
{
    private const ADMIN_USERNAME = 'admin';
    private const ADMIN_PASSWORD = 'Admin!2#';

    /**
     * Show admin login page
     */
    public function showLogin()
    {
        // If already authenticated, redirect to dashboard
        if (session()->has('admin_authenticated') && session()->get('admin_authenticated')) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Admin/Login');
    }

    /**
     * Handle admin login
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Check credentials against hardcoded values
        if ($validated['username'] === self::ADMIN_USERNAME && $validated['password'] === self::ADMIN_PASSWORD) {
            session()->put('admin_authenticated', true);
            session()->put('admin_login_time', now());
            return redirect()->route('admin.dashboard');
        }

        return Redirect::back()->withErrors(['credentials' => 'Invalid username or password']);
    }

    /**
     * Show admin dashboard with all team information
     */
    public function dashboard()
    {
        // Get all participants with their responses
        $participants = Participant::with([
            'user',
            'leaderResponse',
            'teamResponse',
            'ownerResponse'
        ])
            ->orderBy('code')
            ->orderBy('role')
            ->get();

        // Group by code and transform to array for React
        $groupedTeams = $participants->groupBy('code');
        $teams = $groupedTeams->map(function ($group, $code) {
            return [
                'code' => $code,
                'participants' => $group->values()
            ];
        })->values();

        // Get all audit reports
        $reports = AuditReport::orderByDesc('created_at')->get();

        return Inertia::render('Admin/Dashboard', [
            'teams' => $teams,
            'reports' => $reports,
            'totalParticipants' => $participants->count(),
            'totalTeams' => $teams->count(),
        ]);
    }

    /**
     * Show detailed view of a specific team
     */
    public function viewTeam($code)
    {
        $participants = Participant::where('code', $code)
            ->with([
                'user',
                'leaderResponse',
                'teamResponse',
                'ownerResponse'
            ])
            ->orderBy('role')
            ->get();

        if ($participants->isEmpty()) {
            abort(404, 'Team not found');
        }

        $report = AuditReport::where('code', $code)->first();

        return Inertia::render('Admin/ViewTeam', [
            'code' => $code,
            'participants' => $participants,
            'report' => $report,
        ]);
    }

    /**
     * Show detailed view of a specific participant
     */
    public function viewParticipant($id)
    {
        $participant = Participant::with([
            'user',
            'leaderResponse',
            'teamResponse',
            'ownerResponse'
        ])->findOrFail($id);

        return Inertia::render('Admin/ViewParticipant', [
            'participant' => $participant,
        ]);
    }

    /**
     * Update leader team size from the admin panel.
     */
    public function updateLeaderTeamSize(Request $request, $id)
    {
        $validated = $request->validate([
            'team_size' => 'required|integer|min:1',
        ]);

        $participant = Participant::with('leaderResponse')->findOrFail($id);

        if ($participant->role !== 'leader') {
            return Redirect::back()->withErrors([
                'team_size' => 'Only leader participants can have a team size updated.',
            ]);
        }

        if (!$participant->leaderResponse) {
            return Redirect::back()->withErrors([
                'team_size' => 'Leader response not found for this participant.',
            ]);
        }

        $participant->leaderResponse()->update([
            'team_size' => $validated['team_size'],
        ]);

        return Redirect::back()->with('success', 'Leader team size updated successfully.');
    }

    /**
     * Show audit report details
     */
    public function viewReport($code)
    {
        $report = AuditReport::where('code', $code)->firstOrFail();

        $participants = Participant::where('code', $code)
            ->with([
                'user',
                'leaderResponse',
                'teamResponse',
                'ownerResponse'
            ])
            ->get();

        return Inertia::render('Admin/ViewReport', [
            'code' => $code,
            'report' => $report,
            'participants' => $participants,
        ]);
    }

    /**
     * Handle admin logout
     */
    public function logout()
    {
        session()->forget('admin_authenticated');
        session()->forget('admin_login_time');
        return redirect()->route('admin.login')->with('success', 'Logged out successfully');
    }
}
