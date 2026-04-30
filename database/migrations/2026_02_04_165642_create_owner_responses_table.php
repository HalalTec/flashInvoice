<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('owner_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participant_id')->constrained()->onDelete('cascade');

            // Owner info (free text)
            $table->string('owner_name');
            $table->string('owner_email');
            $table->string('deliverable_label');

            // Definition of Done
            $table->enum('owner_done_type', ['A', 'B', 'C', 'D']);

            // Proof & last update
            $table->text('owner_last_update_text');

            $table->enum('owner_claimed_proof_level', [
                'L1',
                'L2',
                'L3',
                'L4',
                'L5'
            ]);

            $table->enum('owner_selected_proof_type', [
                'A',
                'B',
                'C',
                'D',
                'E',
                'F'
            ]);

            $table->string('owner_proof_upload')->nullable();

            // Dependencies
            $table->enum('owner_dependency_type', [
                'A',
                'B',
                'C',
                'D'
            ]);

            $table->enum('owner_dependency_lock', [
                'A',
                'B',
                'C',
                'D'
            ])->nullable();

            // Blockers & escalation
            $table->enum('owner_blocker_14d', [
                'A',
                'B',
                'C',
                'D',
                'E'
            ]);

            $table->enum('owner_blocker_escalation_time', [
                'A',
                'B',
                'C',
                'D',
                'E'
            ])->nullable();

            $table->enum('owner_when_blocked_usual', [
                'A',
                'B',
                'C',
                'D',
                'E'
            ]);

            // Closure habit
            $table->enum('owner_closure_typical', [
                'A',
                'B',
                'C',
                'D'
            ]);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('owner_responses');
    }
};
