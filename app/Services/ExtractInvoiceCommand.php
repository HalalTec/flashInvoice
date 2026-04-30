<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\InvoiceParser;
use function Laravel\Prompts\textarea;

class ExtractInvoiceCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'invoice:extract';

    /**
     * The console command description.
     */
    protected $description = 'Interactively extract structured data from unstructured invoice text';

    /**
     * Execute the console command.
     */
    public function handle(InvoiceParser $parser): int
    {
        // Capture input using Laravel Prompts
        $input = textarea(
            label: 'Paste the unstructured invoice text',
            placeholder: "Sender: Shuaib Tech\nReceiver: John\nItems: Website design - 50000\nLogo design - 2 x 15000",
            required: true,
            hint: 'Format: Sender: [Name], Receiver: [Name], Items: [Item Name - Qty x Price]'
        );

        $structuredData = $parser->parse($input);

        // Strict raw JSON output for the Data Extraction Engine logic
        $this->output->write(json_encode($structuredData, JSON_PRETTY_PRINT));
        $this->line(''); // Clean trailing newline for CLI

        return self::SUCCESS;
    }
}
