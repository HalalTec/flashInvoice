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
        Schema::create('team_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participant_id')->constrained()->onDelete('cascade');

            // 1–5 scale (stored as integers)
            $table->integer('t1_truth_surfacing')->default(0);
            $table->integer('t2_escalation_speed')->default(0);
            $table->integer('t3_initiative_positive')->default(0);
            $table->integer('t4_fix_not_blame')->default(0);
            $table->integer('t5_done_stability')->default(0);
            $table->integer('t6_ownership_rewarded')->default(0);
            $table->integer('t7_keep_head_down')->default(0); // reverse scored in analysis layer

            // Optional open text
            $table->text('t8_tripwire_text')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_responses');
    }
};
