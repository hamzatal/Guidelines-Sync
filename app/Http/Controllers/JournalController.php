<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class JournalController extends Controller
{
    /**
     * Display a listing of journals
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $query = Journal::query();

            // البحث في اسم المجلة أو الناشر
            if ($request->has('search') && !empty($request->input('search'))) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('publisher', 'like', '%' . $search . '%')
                        ->orWhere('category', 'like', '%' . $search . '%');
                });
            }

            // فلترة حسب الفئة
            if ($request->has('category') && !empty($request->input('category'))) {
                $query->where('category', $request->input('category'));
            }

            // فلترة المجلات النشطة فقط
            if ($request->has('active_only') && $request->input('active_only') == true) {
                $query->where('is_active', true);
            }

            // الترتيب
            $orderBy = $request->input('order_by', 'name');
            $orderDir = $request->input('order_dir', 'asc');

            $allowedOrderBy = ['name', 'publisher', 'impact_factor', 'created_at'];
            if (in_array($orderBy, $allowedOrderBy)) {
                $query->orderBy($orderBy, $orderDir);
            } else {
                $query->orderBy('name', 'asc');
            }

            // Pagination
            $perPage = $request->input('per_page', 50);

            if ($perPage === 'all' || $perPage == -1) {
                $journals = $query->get();

                return response()->json([
                    'success' => true,
                    'journals' => $journals,
                    'total' => $journals->count()
                ]);
            } else {
                $journals = $query->paginate($perPage);

                $paginationData = [
                    'total' => $journals->total(),
                    'per_page' => $journals->perPage(),
                    'current_page' => $journals->currentPage(),
                    'last_page' => $journals->lastPage(),
                    'from' => $journals->firstItem(),
                    'to' => $journals->lastItem()
                ];

                return response()->json([
                    'success' => true,
                    'journals' => $journals->items(),
                    'pagination' => $paginationData
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching journals',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified journal
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show($id)
    {
        try {
            $journal = Journal::findOrFail($id);

            return response()->json([
                'success' => true,
                'journal' => $journal
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Journal not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching journal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get journal formatting guidelines
     *
     * @param int $id
     * @return JsonResponse
     */
    public function guidelines($id)
    {
        try {
            $journal = Journal::findOrFail($id);

            $guidelinesData = [
                'font_family' => $journal->font_family,
                'font_size' => $journal->font_size,
                'line_spacing' => $journal->line_spacing,
                'margin_top' => $journal->margin_top,
                'margin_bottom' => $journal->margin_bottom,
                'margin_left' => $journal->margin_left,
                'margin_right' => $journal->margin_right,
                'citation_style' => $journal->citation_style,
                'reference_style' => $journal->reference_style,
                'max_pages' => $journal->max_pages,
                'abstract_required' => $journal->abstract_required,
                'keywords_required' => $journal->keywords_required,
                'custom_guidelines' => $journal->custom_guidelines
            ];

            return response()->json([
                'success' => true,
                'guidelines' => $guidelinesData,
                'journal_name' => $journal->name,
                'journal_publisher' => $journal->publisher
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Journal not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching guidelines',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all journal categories
     *
     * @return JsonResponse
     */
    public function categories()
    {
        try {
            $categories = Journal::select('category')
                ->whereNotNull('category')
                ->where('category', '!=', '')
                ->distinct()
                ->orderBy('category')
                ->pluck('category');

            return response()->json([
                'success' => true,
                'categories' => $categories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created journal (Admin only)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'publisher' => 'required|string|max:255',
                'category' => 'nullable|string|max:100',
                'impact_factor' => 'nullable|numeric|min:0|max:999.999',
                'issn' => 'nullable|string|max:20',
                'website' => 'nullable|url|max:255',
                'submission_url' => 'nullable|url|max:255',
                'font_family' => 'nullable|string|max:100',
                'font_size' => 'nullable|integer|min:8|max:20',
                'line_spacing' => 'nullable|numeric|min:1|max:3',
                'citation_style' => 'nullable|string|max:50',
                'reference_style' => 'nullable|string|max:50',
                'max_pages' => 'nullable|integer|min:1',
                'abstract_required' => 'nullable|boolean',
                'keywords_required' => 'nullable|boolean',
                'is_active' => 'nullable|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $journal = Journal::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Journal created successfully',
                'journal' => $journal
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating journal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified journal (Admin only)
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $journal = Journal::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'publisher' => 'sometimes|required|string|max:255',
                'category' => 'nullable|string|max:100',
                'impact_factor' => 'nullable|numeric|min:0|max:999.999',
                'issn' => 'nullable|string|max:20',
                'website' => 'nullable|url|max:255',
                'submission_url' => 'nullable|url|max:255',
                'font_family' => 'nullable|string|max:100',
                'font_size' => 'nullable|integer|min:8|max:20',
                'line_spacing' => 'nullable|numeric|min:1|max:3',
                'citation_style' => 'nullable|string|max:50',
                'reference_style' => 'nullable|string|max:50',
                'max_pages' => 'nullable|integer|min:1',
                'abstract_required' => 'nullable|boolean',
                'keywords_required' => 'nullable|boolean',
                'is_active' => 'nullable|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $journal->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Journal updated successfully',
                'journal' => $journal
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Journal not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating journal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified journal (Admin only)
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        try {
            $journal = Journal::findOrFail($id);
            $journal->delete();

            return response()->json([
                'success' => true,
                'message' => 'Journal deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Journal not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting journal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search journals by query
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request)
    {
        try {
            $query = $request->input('q', '');

            if (empty($query)) {
                return response()->json([
                    'success' => true,
                    'journals' => []
                ]);
            }

            $journals = Journal::where('is_active', true)
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', '%' . $query . '%')
                        ->orWhere('publisher', 'like', '%' . $query . '%')
                        ->orWhere('category', 'like', '%' . $query . '%')
                        ->orWhere('issn', 'like', '%' . $query . '%');
                })
                ->limit(20)
                ->orderBy('impact_factor', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'journals' => $journals,
                'count' => $journals->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error searching journals',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get popular journals (by impact factor)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function popular(Request $request)
    {
        try {
            $limit = $request->input('limit', 10);

            $journals = Journal::where('is_active', true)
                ->whereNotNull('impact_factor')
                ->orderBy('impact_factor', 'desc')
                ->limit($limit)
                ->get();

            return response()->json([
                'success' => true,
                'journals' => $journals
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching popular journals',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
