import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Show({ auth, report }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Audit Report: {report.code}</h2>}
        >
            <Head title={`Report ${report.code}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Ownership Safety Score */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Ownership Safety Score</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-4xl font-bold text-blue-600">{report.ownership_safety_result.ownership_safety_index}/100</p>
                                <p className="text-sm text-gray-500">Confidence: {report.ownership_safety_result.confidence}</p>
                            </div>
                            <div className="text-sm text-gray-600">
                                <p>Team Component: {report.ownership_safety_result.breakdown.team_component}</p>
                                <p>Leader Component: {report.ownership_safety_result.breakdown.leader_component}</p>
                            </div>
                        </div>
                    </div>

                    {/* Team Reliability Score */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Team Reliability Score</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-4xl font-bold text-green-600">{report.team_reliability_result.execution_score}/100</p>
                                <p className="text-sm text-gray-500">Confidence: {report.team_reliability_result.confidence}</p>
                            </div>
                            <div className="text-sm text-gray-600">
                                <p>Owner Component: {report.team_reliability_result.breakdown.owner_component}</p>
                                <p>Proof Health: {report.team_reliability_result.breakdown.proof_health_points}</p>
                            </div>
                        </div>
                    </div>

                    {/* Perception Gaps */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Perception Gaps</h3>
                        <div className="space-y-4">
                            {Object.entries(report.perception_gaps_result).map(([key, gap]) => (
                                <div key={key} className={`p-4 border rounded ${gap.major_flag ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                                    <h4 className="font-semibold capitalize">{gap.dimension}</h4>
                                    <p className="text-sm mt-1">{gap.evidence_line}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top 3 Leaks */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Top 3 Leaks</h3>
                        <div className="space-y-4">
                            {report.top_3_leaks_result.map((leak, index) => (
                                <div key={index} className="p-4 border border-yellow-200 bg-yellow-50 rounded">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold text-yellow-800">{leak.type}</h4>
                                        <span className="text-xs font-bold bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Severity: {leak.severity}</span>
                                    </div>
                                    <p className="text-sm mt-2 font-medium">{leak.impact}</p>
                                    <p className="text-xs mt-1 text-gray-600">{leak.evidence}</p>
                                </div>
                            ))}
                            {report.top_3_leaks_result.length === 0 && (
                                <p className="text-gray-500 italic">No major leaks detected.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}