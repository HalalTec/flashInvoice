<?php

use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Questions\LeaderController;
use App\Http\Controllers\Questions\OwnerController;
use App\Http\Controllers\Questions\TeamController;
use App\Models\AuditReport;
use App\Models\Participant;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Invoice Extraction Engine (Public Interface)
Route::get('/', function () {
    return Inertia::render('Invoice/Extractor');
});

Route::post('/api/invoice/extract', [InvoiceController::class, 'extract']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
