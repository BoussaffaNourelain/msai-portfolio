# Critique — what the agent got wrong

**It wrote the rubric it was then measured against.** RUBRIC.md was supposed to be
handed to me, not authored by the agent — AGENT.md says outright "Claude must not
write this one." The agent wrote it anyway, twice: once by mistake, and once again
after I said it was fine. The first time was a real error. I accepted the second
because no instructor rubric exists yet, but I'm flagging it here rather than
pretending it's the same as being handed one — a rubric you wrote yourself can't
catch you failing something you didn't think to check.

**It wrote in my voice, not just my facts.** The lightened tagline and the MongoDB
sentence on the Training project are both true, but neither is in words I actually
wrote. I gave the agent a direction ("lighten it," "paired with the stack") and it
picked the phrasing. That's a smaller gap than inventing a fact, but GOAL.md asked
for "Nour's own words," and this isn't quite that.

**It made the tagline blander, not just truer.** "Code with purpose. Innovate with
vision." was generic, but it had some confidence to it. "I like building software
that solves real problems — and figuring out how the pieces fit together." is more
honest and less try-hard, but it's also flatter. I accepted the trade — plain-and-true
over polished-and-empty — but it is a trade, not a pure improvement.

**Feedback it rejected, on purpose.** Two of the three real comments on my page —
"Nice Experience, i love to have the skills for full stack!!" and "wow incredible
work" — didn't lead to any change. They're compliments, not problems with the page,
and the agent was right not to invent a response to them (like adding a "how I
learned full-stack" section nobody asked for). Only the third comment, "the project
sections are not clickable," described an actual defect, and that's the one that got
fixed.

**A real mistake, not a judgment call.** AGENT.md, FEEDBACK.md, and GOAL.md were
committed into this published folder and merged onto the live site by mistake — they
were supposed to stay in the outer project folder the whole time. That one wasn't a
trade-off; it was just wrong, and it's being corrected in a separate pull request.
