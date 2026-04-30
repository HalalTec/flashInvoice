export const TEAM_QUESTIONS = [
    {
        id: 'team_intro',
        type: 'header',
        label: 'Culture & Tripwire Detection',
        description: 'Scale: 1 (Strongly Disagree) → 5 (Strongly Agree). Your responses are strictly anonymous.'
    },
    {
        id: 't1_truth_surfacing',
        type: 'scale',
        question: 'T1. If I call out a risk early, it helps me — it doesn’t hurt me.',
        min: 1,
        max: 5,
        required: true
    },
    {
        id: 't2_escalation_speed',
        type: 'scale',
        question: 'T2. When I escalate a blocker, it gets acted on quickly.',
        min: 1,
        max: 5,
        required: true
    },
    {
        id: 't3_initiative_positive',
        type: 'scale',
        question: 'T3. Taking initiative beyond my role is considered positive here.',
        min: 1,
        max: 5,
        required: true
    },
    {
        id: 't4_fix_not_blame',
        type: 'scale',
        question: 'T4. When deadlines slip, leaders focus on fixing first, not blame first.',
        min: 1,
        max: 5,
        required: true
    },
    {
        id: 't5_done_stability',
        type: 'scale',
        question: 'T5. “Done” stays stable unless tradeoffs are renegotiated clearly.',
        min: 1,
        max: 5,
        required: true
    },
    {
        id: 't6_ownership_rewarded',
        type: 'scale',
        question: 'T6. People who own outcomes are rewarded (trust/growth), not punished (extra load).',
        min: 1,
        max: 5,
        required: true
    },
    {
        id: 't7_keep_head_down',
        type: 'scale',
        question: 'T7. The safest strategy here is to keep my head down and just do assigned tasks.',
        help: '(Reverse scored: 5 means high fear/low ownership)',
        min: 1,
        max: 5,
        required: true
    },
    {
        id: 't8_tripwire_text',
        type: 'textarea',
        question: 'T8. Name one “invisible tripwire” you’ve seen — something that made people avoid ownership.',
        help: 'Optional: Short text describing behavior or patterns.',
        required: false
    }
];