<?php

namespace Database\Seeders;

use App\Models\LeaderResponse;
use App\Models\OwnerResponse;
use App\Models\Participant;
use App\Models\TeamResponse;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $uL1 = User::create(['name' => 'Leader 1', 'email' => 'l1@grit.com', 'password' => bcrypt('pass')]);
        $pL1 = Participant::create(['user_id' => $uL1->id, 'role' => 'leader']);
        LeaderResponse::create(['participant_id' => $pL1->id, 'late_surprises' => 1, 'who_saves' => 'A']);

        // Create O1 (Owner)
        $uO1 = User::create(['name' => 'Owner 1', 'email' => 'o1@grit.com', 'password' => bcrypt('pass')]);
        $pO1 = Participant::create(['user_id' => $uO1->id, 'role' => 'owner']);
        OwnerResponse::create(['participant_id' => $pO1->id, 'c1_done' => 2, 'c2_proof' => 2]);

        // Create T1 (Team)
        $uT1 = User::create(['name' => 'Team 1', 'email' => 't1@grit.com', 'password' => bcrypt('pass')]);
        $pT1 = Participant::create(['user_id' => $uT1->id, 'role' => 'team']);
        TeamResponse::create(['participant_id' => $pT1->id, 't1_truth_surfacing' => 1]);
    }

    //     User::factory()->create([
    //         'name' => 'Test User',
    //         'email' => 'test@example.com',
    //     ]);
    // }
}
