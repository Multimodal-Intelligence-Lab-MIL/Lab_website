---
title: "Memory-Augmented SAM2 for Training-Free Surgical Video Segmentation"
authors: "Ming Yin, Fu Wang, Xujiong Ye, Yanda Meng, Zeyu Fu"
venue: "Medical Image Computing and Computer Assisted Intervention (MICCAI)"
year: 2025
category: Conference
research: ai-for-healthcare
image: "uploads/publications/memory-sam2-framework.webp"
imageAlt: "Architecture of MA-SAM2 with its memory-augmented strategy of context-aware and occlusion-resilient memories."
abstract: "Surgical video segmentation is a critical task in computer-assisted surgery, essential for enhancing surgical quality and patient outcomes. Recently, the Segment Anything Model 2 (SAM2) framework has demonstrated remarkable advancements in both image and video segmentation. However, the inherent limitations of SAM2's greedy selection memory design are amplified by the unique properties of surgical videos-rapid instrument movement, frequent occlusion, and complex instrument-tissue interaction-resulting in diminished performance in the segmentation of complex, long videos. To address these challenges, we introduce Memory Augmented (MA)-SAM2, a training-free video object segmentation strategy, featuring novel context-aware and occlusion-resilient memory models. MA-SAM2 exhibits strong robustness against occlusions and interactions arising from complex instrument movements while maintaining accuracy in segmenting objects throughout videos. Employing a multi-target, single-loop, one-prompt inference further enhances the efficiency of the tracking process in multi-instrument videos. Without introducing any additional parameters or requiring further training, MA-SAM2 achieved performance improvements of 4.36% and 6.1% over SAM2 on the EndoVis2017 and EndoVis2018 datasets, respectively, demonstrating its potential for practical surgical applications."
award: "Oral Presentation"
doi: "10.1007/978-3-032-05127-1_32"
paperUrl: "https://doi.org/10.1007/978-3-032-05127-1_32"
pdf: "https://arxiv.org/pdf/2507.09577"
arxiv: "https://arxiv.org/abs/2507.09577"
code: "https://github.com/Fawke108/MA-SAM2"
featured: true
draft: false
bibtex: |-
  @incollection{yin2025memory,
    title = {Memory-Augmented SAM2 for Training-Free Surgical Video Segmentation},
    author = {Ming Yin and Fu Wang and Xujiong Ye and Yanda Meng and Zeyu Fu},
    booktitle = {Medical Image Computing and Computer Assisted Intervention -- MICCAI 2025},
    publisher = {Springer Nature Switzerland},
    pages = {328--337},
    year = {2025},
    doi = {10.1007/978-3-032-05127-1_32}
  }
---
