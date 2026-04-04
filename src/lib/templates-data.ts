export interface EmailTemplate {
  id: string;
  name: string;
  scenario: string;
  subject: string;
  body: string;
  tags: string[];
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'intro',
    name: 'Intro / Cold Outreach',
    scenario: 'First contact with a new account admin',
    subject: 'Modernizing Access Management + Check-in at {{Account Name}}',
    body: `Hi {{First Name}},

I work with a B2B SaaS platform — we help companies replace manual sign-in sheets and paper badges with a seamless digital system (check-in kiosks, mobile scanners, and smart badge cards).

A few clients near you — including {{Nearby Account}} — went live with us this quarter and cut operations admin time by about 40%.

Would a 15-minute call this week make sense? I can walk you through exactly how it works and what the setup looks like for an organization your size.

Ryan Grant
Customer Success & Marketing
`,
    tags: ['cold', 'intro', 'new lead'],
  },
  {
    id: 'follow-up-no-response',
    name: 'Follow-up (No Response)',
    scenario: 'No reply after initial outreach or quote',
    subject: 'Re: {{Account Name}} — Quick check-in',
    body: `Hi {{First Name}},

Following up on my last note. I know things get busy — just wanted to make sure this landed.

We sent over Q {{Quote Number}} for {{Quote Items}} a couple weeks ago. Happy to adjust the scope, answer any questions, or schedule a quick call if that helps move things forward.

Is there a better time to connect?

Ryan`,
    tags: ['follow-up', 'no response', 'quote'],
  },
  {
    id: 'po-chase',
    name: 'PO Chase (Overdue)',
    scenario: 'Quote approved but PO not yet received',
    subject: 'PO for {{Quote Number}} — any update?',
    body: `Hi {{First Name}},

Hope things are going well. I wanted to check in on the PO for Q {{Quote Number}} — our team is holding the order but we want to make sure everything gets processed before the end of the month.

If there's anything on the purchasing side I can help move along — additional documentation, updated W-9, or anything else — just let me know and I'll get it over right away.

Thanks,
Ryan`,
    tags: ['PO', 'overdue', 'finance'],
  },
  {
    id: 'post-install',
    name: 'Post-Install Check-in',
    scenario: 'After system goes live at the account',
    subject: '{{Account Name}} is live — how\'s it going?',
    body: `Hi {{First Name}},

It's been a couple weeks since your platform went live — wanted to check in and see how things are running.

A few things I'd love to get your take on:
- How's the check-in experience at the kiosks?
- Any questions from staff or users we can help with?
- Anything you'd want to add or expand?

Also — if the team is happy with the results, a quick review or a referral to another account would mean a lot to us.

Talk soon,
Ryan`,
    tags: ['post-install', 'retention', 'upsell'],
  },
  {
    id: 'renewal',
    name: 'Renewal / Annual Expansion',
    scenario: 'Existing customer approaching renewal or expansion opportunity',
    subject: 'Renewing {{Account Name}} for next year — let\'s plan ahead',
    body: `Hi {{First Name}},

Your current contract is coming up, and I wanted to get ahead of the renewal before the budget cycle closes.

A few things worth talking through:
- Any sites or departments you'd want to expand to next year?
- Any new features (access management, visitor tracking, automated alerts) worth adding?
- Are there neighboring accounts you've mentioned us to?

I can put together an updated quote that reflects current seat counts — usually takes me less than 24 hours.

Ryan`,
    tags: ['renewal', 'upsell', 'retention'],
  },
  {
    id: 'budget-unlock',
    name: 'Budget Signal Response',
    scenario: 'Account just got funding approved or budget allocation',
    subject: '{{Account Name}} funding — good timing to revisit the platform',
    body: `Hi {{First Name}},

Congrats on the recent {{Budget Type}} approval — that's a big win.

I wanted to reach out because some of what we offer falls squarely in that category. Specifically, {{Relevant Product}} is exactly the kind of purchase this funding is designed for.

We've helped several accounts move quickly on this — sometimes as fast as 2-3 weeks from PO to go-live.

Worth a quick call to see if the timing works?

Ryan`,
    tags: ['budget', 'funding', 'timing'],
  },
  {
    id: 'compliance-urgency',
    name: 'Compliance Deadline',
    scenario: 'Regulatory mandate creating urgency to adopt',
    subject: '{{State}} compliance deadline — Platform can get you there',
    body: `Hi {{First Name}},

I wanted to flag something that might be relevant to your planning — {{State}} is requiring digital access tracking logs by {{Deadline}}.

The platform covers this completely out of the box — your check-in data is automatically logged, timestamped, and exportable for audits. We've already helped several accounts get compliant well ahead of the deadline.

We can typically go live in 3 weeks from a signed PO. Would it help to see exactly what the compliance report looks like?

Ryan`,
    tags: ['compliance', 'urgency', 'deadline'],
  },
];
