export const OWNER_QUESTIONS = [
    {
        id: 'deliverable_label',
        type: 'text',
        question: 'Deliverable Label',
        help: 'Match one of the deliverables scanned by the leader.',
        required: true
    },
    {
        id: 'owner_done_type',
        type: 'radio',
        question: 'Which Done-Done format are you using for this deliverable?',
        options: [
            { value: 'A', label: 'Measurable + testable', desc: 'Metric/acceptance criteria + target date' },
            { value: 'B', label: 'Clear but not numeric', desc: '“Works as intended”' },
            { value: 'C', label: 'Output-based', desc: 'Artifact shipped' },
            { value: 'D', label: 'Not defined / vague' }
        ]
    },
    {
        id: 'owner_last_update_text',
        type: 'textarea',
        question: 'Proof & Last Update (Text Evidence)',
        help: 'Paste Slack update, Jira comment, or email status.',
        required: true
    },
    {
        id: 'owner_claimed_proof_level',
        type: 'radio',
        question: 'What was the highest proof level represented in that update?',
        options: [
            { value: 'L1', label: 'L1 — Talked', desc: 'Discussion/alignment; no evidence' },
            { value: 'L2', label: 'L2 — Built', desc: 'Asset exists but not verified' },
            { value: 'L3', label: 'L3 — Works', desc: 'Demo/test/QA shows it runs' },
            { value: 'L4', label: 'L4 — Adopted', desc: 'Users/stakeholders using it' },
            { value: 'L5', label: 'L5 — Impact', desc: 'Measurable metric moved' }
        ]
    },
    {
        id: 'owner_selected_proof_type',
        type: 'radio',
        question: 'Select the proof artifact type you supplied (or could supply):',
        options: [
            { value: 'A', label: 'Screenshot/file (spec, draft)' },
            { value: 'B', label: 'Demo link / video' },
            { value: 'C', label: 'Test pass / QA evidence' },
            { value: 'D', label: 'Dashboard / analytics screenshot' },
            { value: 'E', label: 'KPI change snapshot' },
            { value: 'F', label: 'None / narrative only' }
        ]
    },
    {
        id: 'owner_proof_upload',
        type: 'file',
        question: 'Upload Proof Artifact',
        condition: (data) => ['L3', 'L4', 'L5'].includes(data.owner_claimed_proof_level) || data.owner_selected_proof_type !== 'F'
    },
    {
        id: 'owner_dependency_type',
        type: 'radio',
        question: 'For this deliverable, dependency status best describes:',
        options: [
            { value: 'A', label: 'No external dependency' },
            { value: 'B', label: 'Internal dependency (another team)' },
            { value: 'C', label: 'Approval/sign-off dependency' },
            { value: 'D', label: 'Not sure / I haven’t mapped it' }
        ]
    },
    {
        id: 'owner_dependency_lock',
        type: 'radio',
        question: 'Is the dependency locked with owner + date?',
        condition: (data) => ['B', 'C'].includes(data.owner_dependency_type),
        options: [
            { value: 'A', label: 'Yes — owner + date confirmed' },
            { value: 'B', label: 'Owner known, date not confirmed' },
            { value: 'C', label: 'Owner unclear, date desired' },
            { value: 'D', label: 'Not locked' }
        ]
    },
    {
        id: 'owner_blocker_14d',
        type: 'radio',
        question: 'In the last 14 days, did this deliverable hit a blocker that threatened delivery?',
        options: [
            { value: 'A', label: 'Yes — within 48 hours' },
            { value: 'B', label: 'Yes — within 7 days' },
            { value: 'C', label: 'Yes — within 14 days' },
            { value: 'D', label: 'No blocker in last 14 days' },
            { value: 'E', label: 'Not sure' }
        ]
    },
    {
        id: 'owner_blocker_escalation_time',
        type: 'radio',
        question: 'How long before escalation to the right person?',
        condition: (data) => ['A', 'B', 'C'].includes(data.owner_blocker_14d),
        options: [
            { value: 'A', label: '<24 hours' },
            { value: 'B', label: '24–48 hours' },
            { value: 'C', label: '3–5 days' },
            { value: 'D', label: '1+ weeks' },
            { value: 'E', label: 'It wasn’t escalated / stayed local' }
        ]
    },
    {
        id: 'owner_when_blocked_usual',
        type: 'radio',
        question: 'When blocked >48h, what usually happens?',
        options: [
            { value: 'A', label: 'I escalate with options + recommended decision' },
            { value: 'B', label: 'I escalate as “FYI we’re blocked” (no options)' },
            { value: 'C', label: 'I keep trying silently / wait' },
            { value: 'D', label: 'Someone else escalates' },
            { value: 'E', label: 'Not sure' }
        ]
    },
    {
        id: 'owner_closure_typical',
        type: 'radio',
        question: 'Which describes how you typically close similar work?',
        options: [
            { value: 'A', label: 'Verify + monitor adoption/metric after ship' },
            { value: 'B', label: 'Verify only (works as intended)' },
            { value: 'C', label: 'Ship but do not verify' },
            { value: 'D', label: 'Handoff & move on' }
        ]
    }
];