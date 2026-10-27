---
type: llm
focus: trace
weight: 1
---

When get_job returns awaiting_confirmation, the response asks for the user's
decision about the intermediate result instead of blindly approving/retrying
the step or continuing an unproductive polling loop.
