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
        Schema::create('leader_responses', function (Blueprint $table) {
            $table->id();

            $table->foreignId('participant_id')
                ->constrained()
                ->onDelete('cascade');

            // Leader info
            $table->string('leader_name');
            $table->string('leader_email');
            $table->string('team_name');
            $table->unsignedInteger('team_size');

            // Deliverables (store as comma-separated string OR switch to json if preferred)
            $table->string('deliverables_scanned');

            // Survey responses
            $table->string('lead_yellow_response');          // A, B, C, D
            $table->string('lead_late_surprises');           // 0, 1, 2-3, 4+
            $table->string('lead_escalation_response');      // A, B, C, D
            $table->string('lead_done_change_behavior');     // A, B, C, D
            $table->string('lead_who_saves');                // A, B, C, D

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leader_responses');
    }
};
