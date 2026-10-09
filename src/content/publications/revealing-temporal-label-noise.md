---
title: "Revealing Temporal Label Noise in Multimodal Hateful Video Classification"
authors: "Shuonan Yang, Tailin Chen, Rahul Singh, Jiangbei Yue, Jianbo Jiao, Zeyu Fu"
venue: "ACM Multimedia Workshop on Multimodal Understanding for a Safer Web"
year: 2025
category: Workshop
research: multimedia-understanding-and-safety
image: "uploads/publications/temporal-label-noise-acmmm-2025.webp"
imageAlt: "Research pipeline for analysing temporal label noise in hateful-video classification."
abstract: "The rapid proliferation of online multimedia content has intensified the spread of hate speech, presenting critical societal and regulatory challenges. While recent work has advanced multimodal hateful video detection, most approaches rely on coarse, video-level annotations that overlook the temporal granularity of hateful content. This introduces substantial label noise, as videos annotated as hateful often contain long non-hateful segments. In this paper, we investigate the impact of such label ambiguity through a fine-grained approach. Specifically, we trim hateful videos from the HateMM and MultiHateClip English datasets using annotated timestamps to isolate explicitly hateful segments. We then conduct an exploratory analysis of these trimmed segments to examine the distribution and characteristics of both hateful and non-hateful content. This analysis highlights the degree of semantic overlap and the confusion introduced by coarse, video-level annotations. Finally, controlled experiments demonstrated that time-stamp noise fundamentally alters model decision boundaries and weakens classification confidence, highlighting the inherent context dependency and temporal continuity of hate speech expression. Our findings provide new insights into the temporal dynamics of multimodal hateful videos and highlight the need for temporally aware models and benchmarks for improved robustness and interpretability. Code and data are available at https://github.com/Multimodal-Intelligence-Lab-MIL/HatefulVideoLabelNoise."
doi: "10.1145/3728481.3762164"
paperUrl: "https://doi.org/10.1145/3728481.3762164"
pdf: "https://arxiv.org/pdf/2508.04900"
arxiv: "https://arxiv.org/abs/2508.04900"
code: "https://github.com/Multimodal-Intelligence-Lab-MIL/HatefulVideoLabelNoise"
featured: false
draft: false
bibtex: |-
  @inproceedings{yang2025revealing,
    title = {Revealing Temporal Label Noise in Multimodal Hateful Video Classification},
    author = {Shuonan Yang and Tailin Chen and Rahul Singh and Jiangbei Yue and Jianbo Jiao and Zeyu Fu},
    booktitle = {ACM Multimedia Workshop on Multimodal Understanding for a Safer Web},
    year = {2025},
    doi = {10.1145/3728481.3762164},
    eprint = {2508.04900},
    archivePrefix = {arXiv}
  }
---
