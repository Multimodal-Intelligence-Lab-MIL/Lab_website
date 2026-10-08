---
title: "FairMT: Fairness for Heterogeneous Multi-Task Learning"
authors: "Guanyu Hu, Tangzheng Lian, Na Yan, Dimitrios Kollias, Xinyu Yang, Oya Celiktutan, Siyang Song, Zeyu Fu"
venue: "Advances in Neural Information Processing Systems (NeurIPS)"
year: 2026
category: Conference
image: "uploads/publications/fairmt.webp"
imageAlt: "FairMT framework for fairness-aware heterogeneous multi-task learning."
abstract: "Fairness in machine learning has been extensively studied in single-task settings, while fair multi-task learning (MTL), especially with heterogeneous tasks (classification, detection, regression) and partially missing labels, remains largely unexplored. Existing fairness methods are predominantly classification-oriented and fail to extend to continuous outputs, making a unified fairness objective difficult to formulate. Further, existing MTL optimization is structurally misaligned with fairness: constraining only the shared representation, allowing task heads to absorb bias and leading to uncontrolled task-specific disparities. Finally, most work treats fairness as a zero-sum trade-off with utility, enforcing symmetric constraints that achieve parity by degrading well-served groups. We introduce FairMT, a unified fairness-aware MTL framework that accommodates all three task types under incomplete supervision. At its core is an Asymmetric Heterogeneous Fairness Constraint Aggregation mechanism, which consolidates task-dependent asymmetric violations into a unified fairness constraint. Utility and fairness are jointly optimized via a primal--dual formulation, while a head-aware multi-objective optimization proxy provides a tractable descent geometry that explicitly accounts for head-induced anisotropy. Across three homogeneous and heterogeneous MTL benchmarks encompassing diverse modalities and supervision regimes, FairMT consistently achieves substantial fairness gains while maintaining superior task utility. Code will be released upon paper acceptance."
paperUrl: "https://arxiv.org/abs/2512.00469"
pdf: "https://arxiv.org/pdf/2512.00469"
arxiv: "https://arxiv.org/abs/2512.00469"
featured: true
draft: false
bibtex: |-
  @inproceedings{hu2026fairmt,
    title = {FairMT: Fairness for Heterogeneous Multi-Task Learning},
    author = {Guanyu Hu and Tangzheng Lian and Na Yan and Dimitrios Kollias and Xinyu Yang and Oya Celiktutan and Siyang Song and Zeyu Fu},
    booktitle = {Advances in Neural Information Processing Systems (NeurIPS)},
    year = {2026},
    eprint = {2512.00469},
    archivePrefix = {arXiv}
  }
---
