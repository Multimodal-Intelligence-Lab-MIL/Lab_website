---
title: "OilSAM2: Memory-Augmented SAM2 for Scalable SAR Oil Spill Detection"
authors: "Shuaiyu Chen, Ming Yin, Peng Ren, Chunbo Luo, Zeyu Fu"
venue: "IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP)"
year: 2026
category: Conference
image: "uploads/publications/oilsam2.webp"
imageAlt: "OilSAM2 framework with hierarchical texture, structure and semantic memory for SAR oil-spill segmentation."
abstract: "Segmenting oil spills from Synthetic Aperture Radar (SAR) imagery remains challenging due to severe appearance variability, scale heterogeneity, and the absence of temporal continuity in real world monitoring scenarios. While foundation models such as Segment Anything (SAM) enable prompt driven segmentation, existing SAM based approaches operate on single images and cannot effectively reuse information across scenes. Memory augmented variants (e.g., SAM2) further assume temporal coherence, making them prone to semantic drift when applied to unordered SAR image collections. We propose OilSAM2, a memory augmented segmentation framework tailored for unordered SAR oil spill monitoring. OilSAM2 introduces a hierarchical feature aware multi scale memory bank that explicitly models texture, structure, and semantic level representations, enabling robust cross image information reuse. To mitigate memory drift, we further propose a structure semantic consistent memory update strategy that selectively refreshes memory based on semantic discrepancy and structural variation.Experiments on two public SAR oil spill datasets demonstrate that OilSAM2 achieves state of the art segmentation performance, delivering stable and accurate results under noisy SAR monitoring scenarios. The source code is available at https://github.com/Chenshuaiyu1120/OILSAM2."
doi: "10.1109/ICASSP55912.2026.11460427"
paperUrl: "https://doi.org/10.1109/ICASSP55912.2026.11460427"
pdf: "https://arxiv.org/pdf/2603.10231"
arxiv: "https://arxiv.org/abs/2603.10231"
featured: true
draft: false
bibtex: |-
  @inproceedings{chen2026oilsam2,
    title = {OilSAM2: Memory-Augmented SAM2 for Scalable SAR Oil Spill Detection},
    author = {Shuaiyu Chen and Ming Yin and Peng Ren and Chunbo Luo and Zeyu Fu},
    booktitle = {IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP)},
    year = {2026},
    doi = {10.1109/ICASSP55912.2026.11460427},
    eprint = {2603.10231},
    archivePrefix = {arXiv}
  }
---
