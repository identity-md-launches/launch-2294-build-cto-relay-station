# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: revision.spec.ts >> a verified single output updates the file stage; a wide Markdown table stays readable in its own scroll region
- Location: tests/e2e/revision.spec.ts:139:1

# Error details

```
Test timeout of 45000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=f2e2]:
  - link "Skip to main content" [ref=f2e3]:
    - /url: "#main"
  - banner [ref=f2e4]:
    - link "STEPS home" [ref=f2e5]:
      - /url: "#/"
    - navigation "Platform" [ref=f2e11]:
      - link "Projects" [ref=f2e12]:
        - /url: "#/"
      - link "Demo" [ref=f2e13]:
        - /url: "#/demo"
      - link "Components" [ref=f2e14]:
        - /url: "#/showcase"
    - button "Connect wallet" [ref=f2e16] [cursor=pointer]
  - generic [ref=f2e17]:
    - generic [ref=f2e18]: Demo mode
    - generic [ref=f2e19]: Deterministic local fixtures. Simulated signatures only.
    - group [ref=f2e20]:
      - generic "Demo settings" [ref=f2e21] [cursor=pointer]
      - generic [ref=f2e22]:
        - generic [ref=f2e23]:
          - generic [ref=f2e24]: Demo signing account
          - combobox "Demo signing account" [ref=f2e25]:
            - option "Demo account A" [selected]
            - option "Demo account B"
        - generic [ref=f2e26] [cursor=pointer]:
          - checkbox "Simulate wrong network" [ref=f2e27]
          - generic [ref=f2e28]: Simulate wrong network
        - button "Reset demo data" [ref=f2e29] [cursor=pointer]
  - main [ref=f2e30]:
    - generic [ref=f2e31]:
      - region [ref=f2e32]:
        - link "← All projects" [ref=f2e33]:
          - /url: "#/demo"
        - heading "Single file verification" [level=1] [ref=f2e35]
        - paragraph [ref=f2e36]: Verify file stage and wide tables
      - region [ref=f2e37]:
        - generic [ref=f2e38]:
          - heading "Sequence" [level=2] [ref=f2e39]
          - generic [ref=f2e40]: 1 accepted checkpoints in chain order
        - list [ref=f2e41]:
          - listitem [ref=f2e42]:
            - button "Select Project created, Latest, Selected" [ref=f2e43] [cursor=pointer]:
              - generic [ref=f2e44]: "00"
              - generic [ref=f2e45]:
                - strong [ref=f2e46]: Project created
                - generic [ref=f2e47]: Fixed goal; no paid round
              - generic [ref=f2e48]:
                - generic [ref=f2e49]: Latest
                - generic [ref=f2e50]: Selected
      - region [ref=f2e51]:
        - generic [ref=f2e53]:
          - heading "Starting point" [level=2] [ref=f2e54]
          - paragraph [ref=f2e55]: Selected checkpoint · No completed paid round
        - generic [ref=f2e56]:
          - heading "The first output starts here" [level=3] [ref=f2e57]
          - paragraph [ref=f2e58]: Prepare a proposal at the current checkpoint. Approval and funding happen separately.
        - group [ref=f2e59]:
          - generic "Complete asset table (0) and checkpoint evidence" [ref=f2e60] [cursor=pointer]
      - region [ref=f2e61]:
        - generic [ref=f2e62]:
          - heading "What comes next?" [level=2] [ref=f2e63]
          - paragraph [ref=f2e64]: Prepare work at the current checkpoint, or fund an eligible contribution.
          - paragraph [ref=f2e65]: Continue opens preparation only. Proposal, approval and payment stay separate.
        - generic [ref=f2e66]:
          - button "Continue" [ref=f2e67] [cursor=pointer]
          - link "View contributions (1)" [ref=f2e68]:
            - /url: "#proposals"
      - region [ref=f2e69]:
        - generic [ref=f2e70]:
          - heading "Contributions" [level=2] [ref=f2e71]
          - generic [ref=f2e72]: Every eligible proposal can be funded
        - list [ref=f2e73]:
          - listitem [ref=f2e74]:
            - article [ref=f2e75]:
              - generic [ref=f2e76]:
                - heading "Create Markdown · wide-table" [level=3] [ref=f2e77]:
                  - text: Create Markdown
                  - generic [ref=f2e78]: · wide-table
                - generic [ref=f2e79]: Eligible
              - paragraph [ref=f2e80]: "| A | A | A | A | A | A | A | A | A | A | A | A | A | A | A | A | A | A | A | A | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | B | B | B | B | B | B | B | B | B | B | B | B | B | B | B | B | B | B | B | B |"
              - group [ref=f2e81]:
                - generic "Proposal details" [ref=f2e82] [cursor=pointer]
              - button "Review funding" [ref=f2e83] [cursor=pointer]
      - region [ref=f2e84]:
        - generic [ref=f2e85]:
          - heading "Funding and build status" [level=2] [ref=f2e86]
          - button "Refresh chain state" [ref=f2e87] [cursor=pointer]
        - paragraph [ref=f2e88]: No funding attempts recorded for this branch.
        - list
      - group [ref=f2e89]:
        - generic "Branch, network and execution identity" [ref=f2e90] [cursor=pointer]
      - group [ref=f2e91]:
        - generic "Demo failure controls (next attempt only)" [active] [ref=f2e92] [cursor=pointer]
        - option "Accept and bind" [selected]
        - option "Missing; remain pending"
        - option "Refused; status 1"
        - option "Frozen; status 2"
        - option "Accepted; invalid binding"
        - option "Confirmed" [selected]
        - option "Unknown; reconcile"
  - contentinfo [ref=f2e93]:
    - generic [ref=f2e94]: STEPS by Stepstoke
    - navigation "Footer" [ref=f2e99]:
      - link "Platform components" [ref=f2e100]:
        - /url: "#/showcase"
      - link "@stepstoke on X (opens in a new tab)" [ref=f2e101]:
        - /url: https://x.com/stepstoke
        - text: "@stepstoke on X"
    - generic [ref=f2e102]: Local acceptance only · No public deployment
```