---
title: "Localize-Then-Decide Guarantees for LLM Judgments"
authors: "Xinyu Li, Yi Zhou, Guanqun Cao, Zeyu Fu, Tianjin Huang, Gaojie Jin"
venue: "Findings of the Association for Computational Linguistics: EMNLP"
year: 2026
category: Conference
research: trustworthy-ai
image: "uploads/publications/localize-then-decide.webp"
imageAlt: "Overview of the two-stage Localize-Then-Decide guarantees framework."
abstract: "Large language models (LLMs) are increasingly used as evaluators to assess output quality and preference alignment, yet providing reliable guarantees of agreement with human judgments remains challenging. Recent work introduces confidence-thresholding methods that provide such guarantees for pairwise comparisons, relying on the assumption that higher estimated confidence implies lower disagreement risk with humans. However, this assumption can break down when the number of candidate responses increases, since distributing probability mass across many alternatives can distort confidence estimates. To address this issue, we propose a Localize-Then-Decide framework. First, conformal prediction localizes a small shortlist that contains the human-preferred response with high probability. Then, a calibrated confidence-based rule selectively chooses a single response from this shortlist or abstains. This design restores the monotonic relationship between confidence and disagreement risk and enables high-probability agreement guarantees. Experiments with multiple candidate sizes across several datasets and judge LLMs demonstrate that our framework consistently achieves higher guarantee success rates and substantially higher coverage than single-stage baselines."
paperUrl: "https://arxiv.org/abs/2608.25824"
pdf: "https://arxiv.org/pdf/2608.25824"
arxiv: "https://arxiv.org/abs/2608.25824"
code: "https://github.com/llm2409/Localize-Then-Decide"
featured: false
draft: false
bibtex: |-
  @inproceedings{li2026localize,
    title = {Localize-Then-Decide Guarantees for LLM Judgments},
    author = {Xinyu Li and Yi Zhou and Guanqun Cao and Zeyu Fu and Tianjin Huang and Gaojie Jin},
    booktitle = {Findings of the Association for Computational Linguistics: EMNLP},
    year = {2026},
    eprint = {2608.25824},
    archivePrefix = {arXiv}
  }
---
