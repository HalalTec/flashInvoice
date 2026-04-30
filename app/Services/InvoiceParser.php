<?php

namespace App\Services;

class InvoiceParser
{
    /**
     * Parse unstructured invoice text into a structured array for Inertia/React.
     *
     * @param string $text
     * @return array
     */
    public function parse(string $text): array
    {
        $lines = explode("\n", $text);
        $invoice = [
            'invoice_number' => 'INV-' . str_pad((string) rand(1000, 9999), 4, '0', STR_PAD_LEFT),
            'date'           => '2026-03-27',
            'sender_name'    => 'Unknown Sender',
            'receiver_name'  => 'Unknown Receiver',
            'items'          => [],
            'subtotal'       => 0,
            'total'          => 0,
        ];

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) {
                continue;
            }

            // Extract Sender / Receiver
            if (preg_match('/^Sender:\s*(.+)$/i', $line, $matches)) {
                $invoice['sender_name'] = trim($matches[1]);
                continue;
            }
            if (preg_match('/^Receiver:\s*(.+)$/i', $line, $matches)) {
                $invoice['receiver_name'] = trim($matches[1]);
                continue;
            }

            // Parse Items (strip optional "Items:" label)
            $itemLine = preg_replace('/^Items:\s*/i', '', $line);
            if (empty($itemLine)) continue;

            // Regex for: Item Name - [Quantity x] Price
            if (preg_match('/^(.+?)\s*-\s*(?:(\d+)\s*x\s*)?(\d+)$/i', $itemLine, $m)) {
                $quantity = !empty($m[2]) ? (int)$m[2] : 1;
                $price    = (int)$m[3];
                $itemTotal = $quantity * $price;

                $invoice['items'][] = [
                    'name'     => trim($m[1]),
                    'quantity' => $quantity,
                    'price'    => $price,
                    'total'    => $itemTotal,
                ];
                $invoice['subtotal'] += $itemTotal;
            }
        }

        $invoice['total'] = $invoice['subtotal'];

        return $invoice;
    }
}
