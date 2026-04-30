import { useState, useRef } from 'react';
import axios from 'axios';

const PLACEHOLDER = `Sender: Acme Corp
Receiver: John Doe
Items:
Apple - 3 X 100
Beans - 2 X 200
Orange Juice - 1 X 150`;

const SAMPLE_INVOICE = `Sender: Abdul
Receiver: Majid
Items:
Apple - 3 X 100
Beans - 3 X 200`;

function buildPrettyShareMessage(result) {
    if (!result) return 'INVOICE\n\nTotal: 0';

    return `
🧾 *INVOICE*

━━━━━━━━━━━━━━━
Invoice #: ${result.invoice_number || 'N/A'}
━━━━━━━━━━━━━━━

*FROM*
${result.sender_name || 'N/A'}

*TO*
${result.receiver_name || 'N/A'}

━━━━━━━━━━━━━━━
*ITEMS*
${(result.items || [])
        .slice(0, 5)
        .map((item, i) => `${i + 1}. ${item.name} x${item.quantity} = ${item.total}`)
        .join('\n')}

━━━━━━━━━━━━━━━
*TOTAL: ${result.total || 0}*
━━━━━━━━━━━━━━━
`.trim();
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text || 'N/A').split(' ');
    let line = '';
    let cursorY = y;

    words.forEach((word) => {
        const testLine = line ? `${line} ${word}` : word;
        if (ctx.measureText(testLine).width > maxWidth && line) {
            ctx.fillText(line, x, cursorY);
            line = word;
            cursorY += lineHeight;
            return;
        }
        line = testLine;
    });

    if (line) {
        ctx.fillText(line, x, cursorY);
    }

    return cursorY;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
}

function createInvoiceCanvas(result) {
    const items = result.items || [];
    const width = 900;
    const headerHeight = 150;
    const itemRowHeight = 54;
    const height = Math.max(680, 500 + items.length * itemRowHeight);
    const scale = 2;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(scale, scale);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    drawRoundedRect(ctx, 42, 36, width - 84, height - 72, 24);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    const gradient = ctx.createLinearGradient(42, 36, width - 42, 36);
    gradient.addColorStop(0, '#4f46e5');
    gradient.addColorStop(1, '#7c3aed');
    drawRoundedRect(ctx, 42, 36, width - 84, headerHeight, 24);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.fillRect(42, 36 + headerHeight - 24, width - 84, 24);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 38px Arial, sans-serif';
    ctx.fillText('FlashInvoice', 78, 92);
    ctx.font = '700 28px Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(result.invoice_number || 'INV-N/A', width - 78, 92);
    ctx.font = '500 18px Arial, sans-serif';
    ctx.fillStyle = '#ddd6fe';
    ctx.fillText(result.date || 'N/A', width - 78, 124);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#64748b';
    ctx.font = '700 14px Arial, sans-serif';
    ctx.fillText('FROM', 78, 235);
    ctx.fillText('TO', 470, 235);

    ctx.fillStyle = '#0f172a';
    ctx.font = '700 24px Arial, sans-serif';
    drawWrappedText(ctx, result.sender_name, 78, 270, 310, 30);
    drawWrappedText(ctx, result.receiver_name, 470, 270, 310, 30);

    const tableX = 78;
    const tableY = 340;
    const tableWidth = width - 156;

    ctx.fillStyle = '#f1f5f9';
    drawRoundedRect(ctx, tableX, tableY, tableWidth, 52, 12);
    ctx.fill();

    ctx.fillStyle = '#475569';
    ctx.font = '700 14px Arial, sans-serif';
    ctx.fillText('ITEM', tableX + 24, tableY + 32);
    ctx.textAlign = 'center';
    ctx.fillText('QTY', tableX + 430, tableY + 32);
    ctx.textAlign = 'right';
    ctx.fillText('UNIT PRICE', tableX + 590, tableY + 32);
    ctx.fillText('TOTAL', tableX + tableWidth - 24, tableY + 32);
    ctx.textAlign = 'left';

    items.forEach((item, index) => {
        const rowY = tableY + 52 + index * itemRowHeight;
        ctx.fillStyle = index % 2 === 0 ? '#ffffff' : '#f8fafc';
        ctx.fillRect(tableX, rowY, tableWidth, itemRowHeight);
        ctx.strokeStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(tableX, rowY + itemRowHeight);
        ctx.lineTo(tableX + tableWidth, rowY + itemRowHeight);
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.font = '600 18px Arial, sans-serif';
        ctx.fillText(String(item.name || 'Item'), tableX + 24, rowY + 34);
        ctx.font = '500 18px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(String(item.quantity || 0), tableX + 430, rowY + 34);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#475569';
        ctx.fillText(String(item.price || 0), tableX + 590, rowY + 34);
        ctx.fillStyle = '#0f172a';
        ctx.font = '700 18px Arial, sans-serif';
        ctx.fillText(String(item.total || 0), tableX + tableWidth - 24, rowY + 34);
        ctx.textAlign = 'left';
    });

    const totalsY = tableY + 78 + items.length * itemRowHeight;
    drawRoundedRect(ctx, width - 330, totalsY, 252, 116, 16);
    ctx.fillStyle = '#4f46e5';
    ctx.fill();

    ctx.fillStyle = '#c7d2fe';
    ctx.font = '600 16px Arial, sans-serif';
    ctx.fillText('Subtotal', width - 302, totalsY + 38);
    ctx.fillText('Total', width - 302, totalsY + 82);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 20px Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(String(result.subtotal || 0), width - 104, totalsY + 39);
    ctx.fillText(String(result.total || 0), width - 104, totalsY + 83);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 14px Arial, sans-serif';
    ctx.fillText('Generated by FlashInvoice', 78, height - 72);

    return canvas;
}

function createInvoiceImageBlob(result) {
    return new Promise((resolve) => {
        createInvoiceCanvas(result).toBlob((blob) => resolve(blob), 'image/png', 0.95);
    });
}

function createInvoicePdfBlob(result) {
    const canvas = createInvoiceCanvas(result);
    const jpegBytes = Uint8Array.from(
        atob(canvas.toDataURL('image/jpeg', 0.92).split(',')[1]),
        (char) => char.charCodeAt(0)
    );
    const pageWidth = 612;
    const pageHeight = Math.round((canvas.height / canvas.width) * pageWidth);
    const encoder = new TextEncoder();
    const chunks = [];
    const offsets = [0];
    let position = 0;

    function pushText(value) {
        const bytes = encoder.encode(value);
        chunks.push(bytes);
        position += bytes.length;
    }

    function pushBytes(bytes) {
        chunks.push(bytes);
        position += bytes.length;
    }

    function object(id, body) {
        offsets[id] = position;
        pushText(`${id} 0 obj\n${body}\nendobj\n`);
    }

    pushText('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n');
    object(1, '<< /Type /Catalog /Pages 2 0 R >>');
    object(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
    object(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /InvoiceImage 4 0 R >> >> /Contents 5 0 R >>`);

    offsets[4] = position;
    pushText(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`);
    pushBytes(jpegBytes);
    pushText('\nendstream\nendobj\n');

    const content = `q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/InvoiceImage Do\nQ`;
    object(5, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`);

    const xrefPosition = position;
    pushText(`xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\n`);
    pushText(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPosition}\n%%EOF`);

    const pdfBytes = new Uint8Array(position);
    let cursor = 0;
    chunks.forEach((chunk) => {
        pdfBytes.set(chunk, cursor);
        cursor += chunk.length;
    });

    return new Blob([pdfBytes], { type: 'application/pdf' });
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

function StepBadge({ number, label }) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center shadow-md shadow-indigo-200">
                {number}
            </div>
            <p className="text-slate-600 text-sm pt-1.5 leading-relaxed">{label}</p>
        </div>
    );
}

export default function Extractor() {
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [preparingFile, setPreparingFile] = useState(false);
    const [shareStatus, setShareStatus] = useState(null);
    const toolRef = useRef(null);

    function handleCopySample() {
        navigator.clipboard.writeText(SAMPLE_INVOICE);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    async function handleExtract(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        setShareStatus(null);
        try {
            const response = await axios.post('/api/invoice/extract', { text });
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    async function shareInvoiceImage() {
        if (!result) return;
        setPreparingFile(true);
        setShareStatus(null);

        try {
            const blob = await createInvoiceImageBlob(result);
            if (!blob) {
                throw new Error('Image generation failed.');
            }

            const file = new File(
                [blob],
                `${result.invoice_number || 'invoice'}.png`,
                { type: 'image/png' }
            );

            if (navigator.share && navigator.canShare?.({ files: [file] })) {
                await navigator.share({
                    title: result.invoice_number || 'Invoice',
                    text: 'Invoice image from FlashInvoice',
                    files: [file],
                });
                setShareStatus('Invoice image shared.');
                return;
            }

            downloadBlob(blob, file.name);
            setShareStatus('Image sharing is not supported in this browser, so the invoice PNG was downloaded.');
        } catch (err) {
            if (err.name !== 'AbortError') {
                setShareStatus('Could not share the image. Please try again.');
            }
        } finally {
            setPreparingFile(false);
        }
    }

    async function downloadInvoiceImage() {
        if (!result) return;
        setPreparingFile(true);
        setShareStatus(null);

        try {
            const blob = await createInvoiceImageBlob(result);
            if (!blob) {
                throw new Error('Image generation failed.');
            }
            downloadBlob(blob, `${result.invoice_number || 'invoice'}.png`);
            setShareStatus('Invoice image downloaded.');
        } catch (err) {
            setShareStatus('Could not create the image. Please try again.');
        } finally {
            setPreparingFile(false);
        }
    }

    async function shareInvoicePdf() {
        if (!result) return;
        setPreparingFile(true);
        setShareStatus(null);

        try {
            const blob = createInvoicePdfBlob(result);
            const file = new File(
                [blob],
                `${result.invoice_number || 'invoice'}.pdf`,
                { type: 'application/pdf' }
            );

            if (navigator.share && navigator.canShare?.({ files: [file] })) {
                await navigator.share({
                    title: result.invoice_number || 'Invoice',
                    text: 'Invoice PDF from FlashInvoice',
                    files: [file],
                });
                setShareStatus('Invoice PDF shared.');
                return;
            }

            downloadBlob(blob, file.name);
            setShareStatus('PDF sharing is not supported in this browser, so the invoice PDF was downloaded.');
        } catch (err) {
            if (err.name !== 'AbortError') {
                setShareStatus('Could not share the PDF. Please try again.');
            }
        } finally {
            setPreparingFile(false);
        }
    }

    async function downloadInvoicePdf() {
        if (!result) return;
        setPreparingFile(true);
        setShareStatus(null);

        try {
            const blob = createInvoicePdfBlob(result);
            downloadBlob(blob, `${result.invoice_number || 'invoice'}.pdf`);
            setShareStatus('Invoice PDF downloaded.');
        } catch (err) {
            setShareStatus('Could not create the PDF. Please try again.');
        } finally {
            setPreparingFile(false);
        }
    }

    function scrollToTool() {
        toolRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">

            {/* ── Navbar ── */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span className="font-bold text-slate-900 text-lg tracking-tight">FlashInvoice</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-6 text-sm text-slate-600">
                        <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it works</a>
                        <button
                            onClick={scrollToTool}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg font-medium transition-colors"
                        >
                            Try it free
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="hero-gradient relative pt-32 pb-24 px-6 overflow-hidden">
                {/* background blobs */}
                <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-indigo-200 opacity-30 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-violet-200 opacity-30 blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-indigo-100 opacity-20 blur-3xl pointer-events-none" />

                <div className="relative max-w-3xl mx-auto text-center">
                    <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-indigo-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        Invoice parsing, instantly
                    </span>

                    <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
                        Turn messy text into{' '}
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            clean invoices
                        </span>
                    </h1>

                    <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
                        Paste any unstructured invoice text — FlashInvoice extracts sender, receiver, line items, and totals in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={scrollToTool}
                            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all"
                        >
                            Extract an invoice →
                        </button>
                        <a href="#how-it-works" className="w-full sm:w-auto text-slate-600 hover:text-indigo-600 font-medium px-8 py-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 transition-all text-center">
                            See how it works
                        </a>
                    </div>
                </div>

                {/* mock invoice card */}
                <div className="relative max-w-lg mx-auto mt-16">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 text-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-slate-800 text-base">INV-2847</span>
                            <span className="text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-medium">Parsed ✓</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                            <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-slate-400 mb-0.5">Sender</p>
                                <p className="font-semibold text-slate-700">Acme Corp</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-slate-400 mb-0.5">Receiver</p>
                                <p className="font-semibold text-slate-700">John Doe</p>
                            </div>
                        </div>
                        <table className="w-full text-xs mb-4">
                            <thead>
                                <tr className="text-slate-400 border-b border-slate-100">
                                    <th className="text-left pb-2">Item</th>
                                    <th className="text-right pb-2">Qty</th>
                                    <th className="text-right pb-2">Price</th>
                                    <th className="text-right pb-2">Total</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                {[['Apple', 3, 100, 300], ['Beans', 2, 200, 400]].map(([n, q, p, t]) => (
                                    <tr key={n} className="border-b border-slate-50">
                                        <td className="py-1.5">{n}</td>
                                        <td className="text-right">{q}</td>
                                        <td className="text-right">{p}</td>
                                        <td className="text-right font-medium">{t}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end">
                            <div className="bg-indigo-600 text-white rounded-xl px-5 py-2 text-sm font-bold">
                                Total: 700
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" className="py-20 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Everything you need</h2>
                        <p className="text-slate-500">No forms, no hassle — just paste and go.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <FeatureCard
                            title="Smart Parsing"
                            description="Automatically detects sender, receiver, items, quantities, and prices from free-form text."
                            icon={
                                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            }
                        />
                        <FeatureCard
                            title="Auto Totals"
                            description="Quantities and unit prices are multiplied automatically. Subtotals and totals are computed instantly."
                            icon={
                                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            }
                        />
                        <FeatureCard
                            title="Case Insensitive"
                            description="Write '3 X 100' or '3 x 100' — FlashInvoice handles both. Focus on content, not formatting."
                            icon={
                                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                            }
                        />
                        <FeatureCard
                            title="Instant Results"
                            description="No waiting, no loading spinners. Parsed structured data appears the moment you click extract."
                            icon={
                                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            }
                        />
                        <FeatureCard
                            title="Clean Output"
                            description="Structured invoice data with a professional layout — invoice number, date, line items and totals."
                            icon={
                                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            }
                        />
                        <FeatureCard
                            title="Free to Use"
                            description="No account required. Paste your invoice text and extract — completely free with no limits."
                            icon={
                                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            }
                        />
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section id="how-it-works" className="py-20 px-6">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">How it works</h2>
                        <p className="text-slate-500 mb-8">Three simple steps — no setup, no account.</p>
                        <div className="space-y-6">
                            <StepBadge number="1" label="Paste any raw invoice text — emails, notes, copied PDFs, anything with sender, receiver and item info." />
                            <StepBadge number="2" label='Click "Extract Invoice" and let FlashInvoice parse the text into structured fields automatically.' />
                            <StepBadge number="3" label="Review the clean output: invoice number, parties, itemised table, and the computed total." />
                        </div>
                    </div>
                    <div className="relative bg-slate-900 rounded-2xl p-6 font-mono text-sm leading-7 shadow-2xl">
                        <button
                            onClick={handleCopySample}
                            title="Copy sample text"
                            className="absolute top-4 right-4 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg transition-all"
                        >
                            {copied ? (
                                <>
                                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-emerald-400">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                        <p className="text-slate-400"># Paste text like this</p>
                        <p className="text-green-400">Sender: <span className="text-white">Abdul</span></p>
                        <p className="text-green-400">Receiver: <span className="text-white">Majid</span></p>
                        <p className="text-green-400">Items:</p>
                        <p className="text-white pl-2">Apple - 3 X 100</p>
                        <p className="text-white pl-2">Beans - 3 X 200</p>
                        <br />
                        <p className="text-slate-400"># FlashInvoice returns</p>
                        <p className="text-yellow-400">{'{'}</p>
                        <p className="pl-4 text-blue-300">subtotal: <span className="text-white">900</span></p>
                        <p className="pl-4 text-blue-300">total: <span className="text-emerald-400">900</span></p>
                        <p className="text-yellow-400">{'}'}</p>
                    </div>
                </div>
            </section>

            {/* ── Extractor Tool ── */}
            <section ref={toolRef} id="tool" className="py-20 px-6 bg-white">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Try it now</h2>
                        <p className="text-slate-500">Paste your invoice text below and hit extract.</p>
                    </div>

                    <form onSubmit={handleExtract} className="space-y-4">
                        <div className="relative">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={9}
                                placeholder={PLACEHOLDER}
                                className="w-full border border-slate-200 rounded-2xl p-5 text-sm font-mono text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 resize-none shadow-sm transition"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !text.trim()}
                            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-md shadow-indigo-200 transition-all"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Extracting...
                                </span>
                            ) : 'Extract Invoice →'}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 flex items-start gap-3 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="mt-8 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
                            {/* card header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 flex items-center justify-between">
                                <div>
                                    <p className="text-indigo-200 text-xs font-medium mb-0.5">Invoice Number</p>
                                    <p className="text-white font-bold text-lg">{result.invoice_number}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-indigo-200 text-xs font-medium mb-0.5">Date</p>
                                    <p className="text-white font-semibold">{result.date}</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* sender / receiver */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-slate-400 text-xs font-medium mb-1">From</p>
                                        <p className="text-slate-800 font-semibold">{result.sender_name}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-slate-400 text-xs font-medium mb-1">To</p>
                                        <p className="text-slate-800 font-semibold">{result.receiver_name}</p>
                                    </div>
                                </div>

                                {/* items table */}
                                {result.items?.length > 0 && (
                                    <div>
                                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Line Items</p>
                                        <div className="border border-slate-100 rounded-xl overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wide">
                                                    <tr>
                                                        <th className="text-left px-4 py-3">Item</th>
                                                        <th className="text-center px-4 py-3">Qty</th>
                                                        <th className="text-right px-4 py-3">Unit Price</th>
                                                        <th className="text-right px-4 py-3">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {result.items.map((item, i) => (
                                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                            <td className="px-4 py-3 font-medium text-slate-700">{item.name}</td>
                                                            <td className="px-4 py-3 text-center text-slate-500">{item.quantity}</td>
                                                            <td className="px-4 py-3 text-right text-slate-500">{item.price}</td>
                                                            <td className="px-4 py-3 text-right font-semibold text-slate-800">{item.total}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* totals */}
                                <div className="flex flex-col gap-4 pt-2 border-t border-slate-100">
                                    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                                            <button
                                                type="button"
                                                onClick={shareInvoiceImage}
                                                disabled={preparingFile}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <svg className="h-4 w-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12V4m0 0L8 8m4-4 4 4" />
                                                </svg>
                                                <span>Share image</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={shareInvoicePdf}
                                                disabled={preparingFile}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 15h8M8 18h5" />
                                                </svg>
                                                <span>Share PDF</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={downloadInvoiceImage}
                                                disabled={preparingFile}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 10l5 5 5-5M12 15V3" />
                                                </svg>
                                                <span>PNG</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={downloadInvoicePdf}
                                                disabled={preparingFile}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 10l5 5 5-5M12 15V3" />
                                                </svg>
                                                <span>PDF</span>
                                            </button>
                                        </div>
                                        <div className="w-full bg-indigo-600 text-white rounded-xl px-4 py-2.5 text-sm font-bold flex flex-col gap-2 sm:w-48">
                                            <div className="flex justify-between">
                                                <span>Subtotal</span>
                                                <span>{result.subtotal}</span>
                                            </div>
                                            <div className="flex justify-between border-t border-white/20 pt-2">
                                                <span>Total</span>
                                                <span>{result.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {preparingFile && (
                                        <p className="text-xs text-slate-500">Preparing your invoice file...</p>
                                    )}
                                  {shareStatus && (
                                      <p className="text-xs text-slate-500">{shareStatus}</p>
                                  )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-10 px-6 border-t border-slate-100">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span className="font-bold text-slate-800 text-sm">FlashInvoice</span>
                    </div>
                    <p className="text-slate-400 text-xs">© {new Date().getFullYear()} FlashInvoice. Built for fast invoice extraction.</p>
                </div>
            </footer>

        </div>
    );
}
