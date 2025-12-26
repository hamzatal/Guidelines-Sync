<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AIJournalController extends Controller
{
    /**
     * Get journals list
     */
    public function index(Request $request)
    {
        try {
            $search = $request->input('search', '');

            // جلب المجلات النموذجية
            $journals = $this->getSampleJournals($search);

            return response()->json([
                'success' => true,
                'journals' => $journals
            ]);
        } catch (\Exception $e) {
            Log::error('Journal API Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error fetching journals',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get specific journal details
     */
    public function show(Request $request)
    {
        try {
            $journalName = $request->input('name', '');

            $journal = [
                'name' => $journalName,
                'publisher' => 'Academic Publisher',
                'category' => 'General',
                'impact_factor' => 5.5,
                'issn' => '0000-0000',
                'font_family' => 'Times New Roman',
                'font_size' => 12,
                'line_spacing' => 2.0,
                'margin_top' => 2.54,
                'margin_bottom' => 2.54,
                'margin_left' => 2.54,
                'margin_right' => 2.54,
                'citation_style' => 'APA',
                'reference_style' => 'APA',
                'max_pages' => 30,
                'abstract_required' => true,
                'keywords_required' => true
            ];

            return response()->json([
                'success' => true,
                'journal' => $journal
            ]);
        } catch (\Exception $e) {
            Log::error('Journal Details Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error fetching journal details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get journal categories
     */
    public function categories()
    {
        $categories = [
            'Multidisciplinary',
            'Medicine',
            'Engineering',
            'Computer Science',
            'Biology',
            'Chemistry',
            'Physics',
            'Mathematics',
            'Psychology',
            'Sociology',
            'Economics',
            'Business',
            'Environmental Science',
            'Materials Science',
            'Agriculture',
            'Education'
        ];

        return response()->json([
            'success' => true,
            'categories' => $categories
        ]);
    }

    /**
     * Get sample journals
     */
    private function getSampleJournals($search = '')
    {
        $allJournals = [
            [
                'id' => 1,
                'name' => 'Nature',
                'publisher' => 'Springer Nature',
                'category' => 'Multidisciplinary',
                'impact_factor' => 49.962,
                'issn' => '0028-0836'
            ],
            [
                'id' => 2,
                'name' => 'Science',
                'publisher' => 'AAAS',
                'category' => 'Multidisciplinary',
                'impact_factor' => 47.728,
                'issn' => '0036-8075'
            ],
            [
                'id' => 3,
                'name' => 'IEEE Transactions on Pattern Analysis and Machine Intelligence',
                'publisher' => 'IEEE',
                'category' => 'Computer Science',
                'impact_factor' => 20.815,
                'issn' => '0162-8828'
            ],
            [
                'id' => 4,
                'name' => 'ACM Computing Surveys',
                'publisher' => 'ACM',
                'category' => 'Computer Science',
                'impact_factor' => 14.324,
                'issn' => '0360-0300'
            ],
            [
                'id' => 5,
                'name' => 'IEEE Access',
                'publisher' => 'IEEE',
                'category' => 'Engineering',
                'impact_factor' => 3.367,
                'issn' => '2169-3536'
            ],
            [
                'id' => 6,
                'name' => 'The Lancet',
                'publisher' => 'Elsevier',
                'category' => 'Medicine',
                'impact_factor' => 79.323,
                'issn' => '0140-6736'
            ],
            [
                'id' => 7,
                'name' => 'New England Journal of Medicine',
                'publisher' => 'Massachusetts Medical Society',
                'category' => 'Medicine',
                'impact_factor' => 91.245,
                'issn' => '0028-4793'
            ],
            [
                'id' => 8,
                'name' => 'Cell',
                'publisher' => 'Elsevier',
                'category' => 'Biology',
                'impact_factor' => 41.582,
                'issn' => '0092-8674'
            ],
            [
                'id' => 9,
                'name' => 'Physical Review Letters',
                'publisher' => 'APS',
                'category' => 'Physics',
                'impact_factor' => 8.385,
                'issn' => '0031-9007'
            ],
            [
                'id' => 10,
                'name' => 'Journal of the American Chemical Society',
                'publisher' => 'ACS',
                'category' => 'Chemistry',
                'impact_factor' => 15.419,
                'issn' => '0002-7863'
            ],
            [
                'id' => 11,
                'name' => 'Psychological Bulletin',
                'publisher' => 'APA',
                'category' => 'Psychology',
                'impact_factor' => 17.902,
                'issn' => '0033-2909'
            ],
            [
                'id' => 12,
                'name' => 'American Sociological Review',
                'publisher' => 'SAGE Publications',
                'category' => 'Sociology',
                'impact_factor' => 7.854,
                'issn' => '0003-1224'
            ],
            [
                'id' => 13,
                'name' => 'Journal of Finance',
                'publisher' => 'Wiley',
                'category' => 'Finance',
                'impact_factor' => 8.351,
                'issn' => '0022-1082'
            ],
            [
                'id' => 14,
                'name' => 'Management Science',
                'publisher' => 'INFORMS',
                'category' => 'Management',
                'impact_factor' => 5.484,
                'issn' => '0025-1909'
            ],
            [
                'id' => 15,
                'name' => 'Environmental Science & Technology',
                'publisher' => 'ACS',
                'category' => 'Environmental Science',
                'impact_factor' => 10.815,
                'issn' => '0013-936X'
            ],
            [
                'id' => 16,
                'name' => 'Journal of Machine Learning Research',
                'publisher' => 'JMLR',
                'category' => 'Computer Science',
                'impact_factor' => 6.035,
                'issn' => '1533-7928'
            ],
            [
                'id' => 17,
                'name' => 'Artificial Intelligence',
                'publisher' => 'Elsevier',
                'category' => 'Computer Science',
                'impact_factor' => 14.050,
                'issn' => '0004-3702'
            ],
            [
                'id' => 18,
                'name' => 'IEEE Transactions on Software Engineering',
                'publisher' => 'IEEE',
                'category' => 'Computer Science',
                'impact_factor' => 6.226,
                'issn' => '0098-5589'
            ],
            [
                'id' => 19,
                'name' => 'Communications of the ACM',
                'publisher' => 'ACM',
                'category' => 'Computer Science',
                'impact_factor' => 11.410,
                'issn' => '0001-0782'
            ],
            [
                'id' => 20,
                'name' => 'Journal of Computer Science and Technology',
                'publisher' => 'Springer',
                'category' => 'Computer Science',
                'impact_factor' => 1.871,
                'issn' => '1000-9000'
            ]
        ];

        // فلترة حسب البحث
        if (!empty($search)) {
            $search = strtolower(trim($search));
            $filtered = array_filter($allJournals, function ($journal) use ($search) {
                return
                    str_contains(strtolower($journal['name']), $search) ||
                    str_contains(strtolower($journal['category']), $search) ||
                    str_contains(strtolower($journal['publisher']), $search);
            });

            return array_values($filtered);
        }

        return $allJournals;
    }
}
