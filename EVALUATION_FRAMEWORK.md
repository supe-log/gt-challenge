# Evaluation Framework: Cognitively Demanding Arguments

**Purpose:** A rubric for evaluating whether a DOK4 SPOV represents genuine intellectual ownership vs. borrowed or superficial reasoning. Derived from analyzing what the BrainLift evaluator rewards and penalizes, combined with principles from argumentation theory, epistemology, and psychometrics.

---

## The Five Tests of a Strong DOK4 Argument

### Test 1: The Mechanism Test (Causal Reasoning)

**Question:** Does the argument explain HOW and WHY, or only THAT?

| Level | Description |
|-------|-------------|
| Weak | States a claim and cites evidence. "X predicts Y (Smith, 2007)." |
| Partial | Identifies a relationship and direction. "X predicts Y because X captures variance that Z misses." |
| Strong | Traces the causal chain step by step. "X predicts Y through the following mechanism: [step 1] → [step 2] → [step 3]. This mechanism is supported by [evidence A] and would be falsified if [condition B] held." |

**The evaluator's strongest recurring criticism was weak causal reasoning.** Every SPOV scored 2 said "X is true" without explaining the mechanism that makes it true.

**Practical test:** After writing a claim, ask: "Could someone who agrees with my conclusion but disagrees with my reasoning distinguish between us?" If not, your reasoning is too thin.

### Test 2: The Steel-Man Test (Counterargument Engagement)

**Question:** Does the argument engage with the strongest version of the opposing case?

| Level | Description |
|-------|-------------|
| Weak | Ignores counterarguments entirely. |
| Partial | Mentions counterarguments but dismisses them. "Critics say X, but they're wrong because Y." |
| Strong | Presents the opposing case in its strongest form, identifies which parts of it are correct, then shows where and why it breaks down. "The strongest version of the opposing argument is [X]. This is correct about [A] and [B]. It fails at [C] because [mechanism], as demonstrated by [evidence]." |

**The evaluator flagged every SPOV for not addressing obvious counterarguments.** The CogAT defense above identifies five specific weaknesses in its own position — the GT Challenge BrainLift should do the same.

**Practical test:** Write the best possible version of the opposing argument before writing your own. If your SPOV doesn't directly address the opposing argument's strongest points, it's not ready.

### Test 3: The Source Independence Test (Not Borrowed)

**Question:** Does the conclusion require the specific combination of sources the student assembled, or could it be derived from any single source?

| Level | Description |
|-------|-------------|
| Weak | The SPOV restates what one source already says. Removing that source removes the entire argument. |
| Partial | The SPOV draws from multiple sources but the synthesis is additive (Source A says this, Source B says that, therefore both). |
| Strong | The SPOV derives a conclusion that NO individual source reaches on its own. The insight emerges from the intersection of multiple independent evidence lines, and the student explains why this intersection produces something the sources individually don't see. |

**The evaluator's "Source Traceability" flag caught this repeatedly.** Every SPOV flagged for traceability was essentially restating a single source's argument.

**Practical test:** For each DOK1 source supporting your SPOV, ask: "If I removed this source, would my argument collapse?" If removing any single source collapses the argument, it's borrowed. If the argument requires 3+ sources working together, it's synthetic.

### Test 4: The Falsifiability Test (Intellectual Honesty)

**Question:** What evidence would change the author's mind?

| Level | Description |
|-------|-------------|
| Weak | No conditions for falsification stated or implied. The SPOV reads as a commitment regardless of evidence. |
| Partial | The author acknowledges limitations but doesn't specify what would change their position. |
| Strong | The author states specific, concrete conditions under which their position would be wrong. "This SPOV depends on [assumption A]. If [study type B] showed [result C], I would need to revise to [position D]." |

**The evaluator never explicitly tests for this, but it's implicit in the "Grounded & Traceable" and "Causal Reasoning" criteria.** An argument with a clear falsification condition demonstrates deeper understanding than one that simply asserts.

**Practical test:** After writing your SPOV, write one paragraph beginning with "I would abandon this position if..." If you can't fill in that sentence with something specific and empirically testable, your position may be ideology rather than analysis.

### Test 5: The Voice Test (Distinct from Sources and AI)

**Question:** Does the argument contain reasoning that only someone who deeply understands the specific evidence could produce?

| Level | Description |
|-------|-------------|
| Weak | The argument could be produced by an LLM with the same sources. The reasoning is generic. |
| Partial | The argument has some distinctive framing but the core logic is conventional. |
| Strong | The argument makes a move that requires understanding something the sources don't say explicitly — an implication, a contradiction, a surprising connection. The author demonstrates they've internalized the evidence, not just summarized it. |

**The LLM Divergence check in the evaluator tests exactly this.** The evaluator asks a vanilla AI the same question and compares. SPOVs that matched the AI's answer scored weak on divergence.

**Practical test:** Ask Claude or GPT the neutral version of your SPOV question. If their answer is close to yours, your thinking isn't spiky enough. Find the specific point where you disagree with the AI and make THAT the center of your SPOV.

---

## Applying These Tests: Diagnostic for the Current BrainLift

| SPOV | Mechanism | Steel-Man | Independence | Falsifiability | Voice | Overall |
|------|-----------|-----------|-------------|----------------|-------|---------|
| Gameable test is honest | Partial (explains why coaching ≠ g, but not why coaching = learning) | Weak (never addresses: coached kids may not keep up in GT) | Weak (traced to CogAT/Te Nijenhuis) | Weak (no conditions stated) | Partial (inversion framing is distinctive) | 2-3 |
| Appetite is blue ocean | Weak (asserts signals measure grit without mechanism) | Weak (never addresses confounds, heritability of grit) | Weak (traced to Duckworth) | Weak | Partial (entrepreneurial voice) | 2 |
| Multi-session is superior | Weak (asserts without explaining psychometric mechanism) | Weak (never addresses practice effects, attrition) | Partial (draws from multiple tests) | Weak | Partial | 2-3 |
| Culture-fair tests don't exist | Partial (high stakes → coaching → inequity chain) | Weak (incomplete SPOV, never finishes alternative) | Weak (traced to NNAT) | Weak | Partial | 2 |
| IQ doesn't predict achievers | Weak (misreads Te Nijenhuis — actually supports g) | Weak (ignores SMPY data entirely) | Weak (traced to Te Nijenhuis, inverted) | Weak | Partial | 2 |
| Single score shouldn't determine trajectory | N/A (consensus, not spiky) | N/A | Weak | N/A | Weak | 1 |
| Longitudinal dataset | Weak (no mechanism for why data is valuable) | Weak (never addresses privacy, consent, data quality) | Weak (traced to general "data is valuable") | Weak | Partial | 2 |
| BUILD IT (convergence) | Weak (asserts convergence without independent reasoning) | Weak | Weak (assembles other SPOVs) | Weak | Partial | 2 |

**Pattern:** Every SPOV fails the Mechanism Test and the Steel-Man Test. These are the two highest-leverage improvements.

---

## How to Write a 4/5 or 5/5 SPOV

1. **Start with the opposing case.** Write the strongest possible argument against your position. Identify the specific points where it is correct and where it breaks down.

2. **Trace the mechanism.** For every causal claim, write out the chain: A → B → C → D. At each step, cite evidence supporting that specific link, not just the overall conclusion.

3. **Show the math.** Where possible, use actual numbers. Don't say "thousands of false negatives" — calculate the expected false negative rate from the SEM and cutoff score. Don't say "appetite explains real-world outcomes" — compare the explained variance (2% vs. 25%).

4. **Name your assumptions and falsification conditions.** Every strong argument has boundary conditions. State them explicitly.

5. **Find the move the sources don't make.** The sources tell you facts. Your SPOV should identify a *relationship between facts* that no individual source identifies. This is where spikiness lives.

6. **Don't advocate for your product.** The evaluator catches this every time. A DOK4 SPOV is a knowledge claim, not a marketing pitch. "GT Challenge solves this" is not an insight — it's an advertisement. The insight is the underlying mechanism; the product is one possible implementation.
