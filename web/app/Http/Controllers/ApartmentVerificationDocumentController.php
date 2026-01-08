<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\Apartment;
use App\Models\ApartmentVerificationDocument;

class ApartmentVerificationDocumentController extends Controller
{
    /**
     * List verification documents for an apartment (admin only)
     */
    public function index(Apartment $apartment)
    {
        abort_unless(Auth::guard('admin')->check(), 403);

        $docs = ApartmentVerificationDocument::where('apartment_id', $apartment->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return view('web.admin.apartment.verification.index', compact('apartment', 'docs'));
    }

    /**
     * Store a verification document for an apartment (file upload)
     * Note: UI not changed here; endpoint provided for future use.
     */
    public function store(Request $request, Apartment $apartment)
    {
        abort_unless(Auth::guard('admin')->check(), 403);

        $request->validate([
            // align allowed types with application naming
            'document_type' => 'required|in:ownership_certificate,utility_bill,rental_authorization_letter,agent_authorization_letter,national_id',
            'file' => 'required|file|max:51200', // max 50MB - adjustable
        ]);

        $file = $request->file('file');

        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

        // Store in a private location inside storage/app/apartment_verifications/{apartment_id}
        $path = $file->storeAs('apartment_verifications/' . $apartment->id, $filename, 'local');

        $doc = ApartmentVerificationDocument::create([
            'apartment_id' => $apartment->id,
            'document_type' => $request->input('document_type'),
            'file_path' => $path,
        ]);

        return redirect()->back()->with('message', 'Verification document uploaded');
    }

    /**
     * Download a verification document (admin only)
     */
    public function download(ApartmentVerificationDocument $doc)
    {
        abort_unless(Auth::guard('admin')->check(), 403);

        // Support files stored either on the local disk (storage/app/...) or the public disk (storage/app/public/...)
        $disk = null;
        if (Storage::disk('local')->exists($doc->file_path)) {
            $disk = 'local';
        } elseif (Storage::disk('public')->exists($doc->file_path)) {
            $disk = 'public';
        }

        if (!$disk) {
            abort(404);
        }

        $stream = Storage::disk($disk)->readStream($doc->file_path);
        if ($stream === false) {
            abort(404);
        }

        $name = basename($doc->file_path);
        return response()->streamDownload(function () use ($stream) {
            fpassthru($stream);
        }, $name);
    }

    /**
     * Delete a verification document (admin only)
     */
    public function destroy(ApartmentVerificationDocument $doc)
    {
        abort_unless(Auth::guard('admin')->check(), 403);

        // Delete from whichever disk the file lives on
        if (Storage::disk('local')->exists($doc->file_path)) {
            Storage::disk('local')->delete($doc->file_path);
        } elseif (Storage::disk('public')->exists($doc->file_path)) {
            Storage::disk('public')->delete($doc->file_path);
        }

        $doc->delete();

        return redirect()->back()->with('message', 'Verification document deleted');
    }

    /**
     * Preview a verification document inline (images/PDF) for admin review.
     */
    public function preview(ApartmentVerificationDocument $doc)
    {
        abort_unless(Auth::guard('admin')->check(), 403);

        // Try local then public disk
        $fullPath = null;
        $mime = null;

        if (Storage::disk('local')->exists($doc->file_path)) {
            $fullPath = storage_path('app/' . $doc->file_path);
        } elseif (Storage::disk('public')->exists($doc->file_path)) {
            // files stored via the public disk live under storage/app/public
            $fullPath = storage_path('app/public/' . $doc->file_path);
        }

        if (!$fullPath || !file_exists($fullPath)) {
            abort(404);
        }

        $mime = @mime_content_type($fullPath) ?: 'application/octet-stream';

        // For images and PDFs return inline display, otherwise force download
        $inlineTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

        if (in_array($mime, $inlineTypes)) {
            return response()->file($fullPath, ['Content-Type' => $mime]);
        }

        // Fallback to download for other types
        return response()->download($fullPath, basename($doc->file_path));
    }

    /**
     * Preview a file path stored in meta (admin only).
     * Path is provided via query param 'p' (base64 encoded) to avoid exposing raw paths.
     */
    public function previewMeta(Apartment $apartment, Request $request)
    {
        abort_unless(Auth::guard('admin')->check(), 403);

        $b64 = $request->query('p');
        if (empty($b64)) abort(404);

        $path = base64_decode($b64);
        if ($path === false) abort(404);

        // Basic sanitization: disallow traversal
        if (strpos($path, '..') !== false) abort(403);

        // Try public then local
        $fullPath = null;
        if (Storage::disk('public')->exists($path)) {
            $fullPath = storage_path('app/public/' . $path);
        } elseif (Storage::disk('local')->exists($path)) {
            $fullPath = storage_path('app/' . $path);
        }

        if (!$fullPath || !file_exists($fullPath)) abort(404);

        $mime = @mime_content_type($fullPath) ?: 'application/octet-stream';
        $inlineTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        if (in_array($mime, $inlineTypes)) {
            return response()->file($fullPath, ['Content-Type' => $mime]);
        }

        return response()->download($fullPath, basename($path));
    }

    /**
     * Download a meta-stored path (admin only).
     */
    public function downloadMeta(Apartment $apartment, Request $request)
    {
        abort_unless(Auth::guard('admin')->check(), 403);

        $b64 = $request->query('p');
        if (empty($b64)) abort(404);
        $path = base64_decode($b64);
        if ($path === false) abort(404);
        if (strpos($path, '..') !== false) abort(403);

        if (Storage::disk('public')->exists($path)) {
            $fullPath = storage_path('app/public/' . $path);
        } elseif (Storage::disk('local')->exists($path)) {
            $fullPath = storage_path('app/' . $path);
        } else {
            abort(404);
        }

        return response()->download($fullPath, basename($path));
    }
}
