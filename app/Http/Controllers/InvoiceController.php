<?php

namespace App\Http\Controllers;

use App\Services\InvoiceParser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /**
     * Extract structured data from unstructured invoice text.
     *
     * @param Request $request
     * @param InvoiceParser $parser
     * @return JsonResponse
     */
    public function extract(Request $request, InvoiceParser $parser): JsonResponse
    {
        $validated = $request->validate([
            'text' => 'required|string',
        ]);

        $structuredData = $parser->parse($validated['text']);

        // Returning JSON as expected by the Data Extraction Engine logic
        return response()->json($structuredData);
    }
}
