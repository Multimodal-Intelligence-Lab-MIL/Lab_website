---
title: "CPR: Chained Perceptual Refinement for Coarse-to-Fine Medical Image Classification"
authors: "Si-Yuan Lu, Hanruo Zhu, Ziquan Zhu, Gaojie Jin, Zeyu Fu, Lu Yin, Ke Li, Lu Liu, Tianjin Huang"
venue: "Medical Image Computing and Computer Assisted Intervention (MICCAI)"
year: 2026
category: Conference
research: ai-for-healthcare
image: "uploads/publications/cpr-medical-image-classification.webp"
imageAlt: "Overview of CPR's chained coarse-to-fine refinement for high-resolution medical image classification."
abstract: "High resolution medical images contain fine grained, spatially sparse cues that are critical for diagnosis, yet preserving full resolution incurs substantial computational and memory costs. Most deep models process images uniformly, leading to redundant computation or loss of diagnostic detail under downsampling. We propose Chained Perceptual Refinement, CPR, a coarse to fine framework that formulates medical image analysis as a sequential global to local decision process. Starting from a low resolution global view, CPR dynamically predicts the location and spatial extent of refinement regions, extracts high resolution evidence from the original image, and incrementally integrates it with global context. By keeping the backbone input size fixed while contracting the perceptual field, CPR preserves diagnostic fidelity with constant peak GPU memory. Extensive experiments on five medical imaging datasets and multiple backbone architectures demonstrate that CPR consistently outperforms both fixed resolution and multi scale state of the art baselines, achieving improvements of up to 2.27 percentage points over the second best method. It also achieves up to a 19.6 fold reduction in GFLOPs at matched accuracy, establishing a superior accuracy and efficiency trade off for high resolution medical image analysis. The code is available on GitHub."
paperUrl: "https://arxiv.org/abs/2607.02591"
pdf: "https://arxiv.org/pdf/2607.02591"
arxiv: "https://arxiv.org/abs/2607.02591"
code: "https://github.com/SiyuanLuLSY/CPR-Chained-Perceptual-Refinement"
featured: false
draft: false
bibtex: |-
  @inproceedings{lu2026cpr,
    title = {CPR: Chained Perceptual Refinement for Coarse-to-Fine Medical Image Classification},
    author = {Si-Yuan Lu and Hanruo Zhu and Ziquan Zhu and Gaojie Jin and Zeyu Fu and Lu Yin and Ke Li and Lu Liu and Tianjin Huang},
    booktitle = {Medical Image Computing and Computer Assisted Intervention (MICCAI)},
    year = {2026},
    eprint = {2607.02591},
    archivePrefix = {arXiv}
  }
---
