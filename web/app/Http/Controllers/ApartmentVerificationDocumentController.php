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
            'document_type' => 'required|in:ownership_certificate,utility_bill,authorization_letter,agent_id,national_id',
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

        // double-check the file exists
        if (!Storage::disk('local')->exists($doc->file_path)) {
            abort(404);
        }

        // Use response()->streamDownload to avoid relying on Storage::download helper in all contexts
        $stream = Storage::disk('local')->readStream($doc->file_path);
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

        if (Storage::disk('local')->exists($doc->file_path)) {
            Storage::disk('local')->delete($doc->file_path);
        }

        $doc->delete();

        return redirect()->back()->with('message', 'Verification document deleted');
    }
}
