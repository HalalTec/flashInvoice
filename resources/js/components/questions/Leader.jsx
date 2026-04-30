/**
 * LEADER QUESTIONS
 * Purpose: Strategic context and organizational behavior diagnostic.
 */
export const LEADER_QUESTIONS = [
    {
        id: 'leader_context',
        type: 'header',
        label: 'Section 1: Strategic Context',
        description: 'Establish the scope and size of the project team.'
    },
    {
        id: 'team_name',
        type: 'text',
        question: 'Team Name',
        required: true
    },
    {
        id: 'team_size',
        type: 'number',
        question: 'Team Size',
        required: true
    },
    {
        id: 'deliverables_scanned',
        type: 'text',
        question: 'Deliverables Scanned (1–3 labels)',
        help: 'List the deliverables we will scan (cross-functional + recurring works if possible).',
        required: true
    },
    {
        id: 'behavior_header',
        type: 'header',
        label: 'Section 2: Behavioral Diagnostic',
        description: 'Analyzing how the organization responds to pressure.'
    },
    {
        id: 'lead_yellow_response',
        type: 'radio',
        question: 'When a risk is raised early (“yellow”), what usually happens next?',
        options: [
            { value: 'A', label: 'We act quickly and adjust plan/scope' },
            { value: 'B', label: 'We ask for more info, then decide later' },
            { value: 'C', label: 'We push to “try harder” to keep the original deadline' },
            { value: 'D', label: 'It gets noted, nothing changes until it becomes urgent' }
        ]
    },
    {
        id: 'lead_late_surprises',
        type: 'radio',
        question: 'In the last 30 days, how many “late surprises” (unexpected delivery failures) happened?',
        options: [
            { value: '0', label: '0' },
            { value: '1', label: '1' },
            { value: '2-3', label: '2–3' },
            { value: '4+', label: '4+' }
        ]
    },
    {
        id: 'lead_escalation_response',
        type: 'radio',
        question: 'When a blocker is escalated, typical response time is:',
        options: [
            { value: 'A', label: 'Same day' },
            { value: 'B', label: 'Within 48 hours' },
            { value: 'C', label: '3–5 days' },
            { value: 'D', label: 'Often unresolved until urgent' }
        ]
    },
    {
        id: 'lead_done_change_behavior',
        type: 'radio',
        question: 'When “done” changes mid-flight, what usually happens?',
        options: [
            { value: 'A', label: 'We explicitly renegotiate scope & timeline' },
            { value: 'B', label: 'We keep timeline, quietly cut quality' },
            { value: 'C', label: 'We keep scope & push people harder' },
            { value: 'D', label: 'It becomes unclear and teams guess' }
        ]
    },
    {
        id: 'lead_who_saves',
        type: 'radio',
        question: 'Who usually “saves” outcomes near deadlines?',
        options: [
            { value: 'A', label: 'The owner' },
            { value: 'B', label: 'The team lead' },
            { value: 'C', label: 'A senior leader (Director/VP/Founder)' },
            { value: 'D', label: 'A hero IC' }
        ]
    }
];
