---
title: "ReGround-Surg: Reliability-Guided Anchor Grounding for Referring Surgical Video Segmentation"
authors: "Jiaxin Wen, Ming Yin, Lu Liu, Zeyu Fu"
venue: "Pattern Recognition and Computer Vision (PRCV)"
year: 2026
category: Conference
image: "uploads/publications/reground-surg.webp"
imageAlt: "Visualisation of initial-frame grounding and tracking failures in referring surgical video segmentation."
abstract: "Referring surgical video segmentation requires segmenting a target instrument or tissue region across video frames according to a natural language expression. Recent Segment Anything Model 2 (SAM2) based two-stage methods (e.g., ReSurgSAM2) first ground the referred target in an initial or selected frame, then propagate the selected mask via tracking. Although effective, their performance is highly sensitive to the quality of the initial grounded mask: once an incorrect anchor is selected, subsequent tracking tends to propagate the error. This issue is especially challenging in surgical videos due to visually similar instruments, occlusion, and complex tissue-tool interactions. To address this issue, we propose ReGround-Surg, a lightweight reliability-guided anchor grounding framework to improve SAM2-based referring surgical video segmentation. It first predicts a text-conditioned spatial reliability map from the referring expression and current-frame visual features. The map is then reused in two complementary branches: a Gated Side Adapter enhances expression-relevant visual regions before text-to-vision fusion, while a Reliability-Weighted Vision-to-Text Attention module suppresses off-target visual evidence during prompt-token aggregation. Experiments on Ref-EndoVis17 and Ref-EndoVis18 show consistent improvements over state-of-the-art methods across three evaluation splits with negligible speed reduction. Code is publicly available at https://github.com/JiaxinWen1/ReGround-Surg."
award: "Oral Presentation (2.8%)"
paperUrl: "https://arxiv.org/abs/2608.24671"
pdf: "https://arxiv.org/pdf/2608.24671"
arxiv: "https://arxiv.org/abs/2608.24671"
code: "https://github.com/JiaxinWen1/ReGround-Surg"
featured: true
draft: false
bibtex: |-
  @inproceedings{wen2026reground,
    title = {ReGround-Surg: Reliability-Guided Anchor Grounding for Referring Surgical Video Segmentation},
    author = {Jiaxin Wen and Ming Yin and Lu Liu and Zeyu Fu},
    booktitle = {Pattern Recognition and Computer Vision (PRCV)},
    year = {2026},
    eprint = {2608.24671},
    archivePrefix = {arXiv}
  }
---
