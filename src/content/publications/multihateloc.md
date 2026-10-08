---
title: "MultiHateLoc: Towards Temporal Localisation of Multimodal Hate Content in Online Videos"
authors: "Qiyue Sun, Tailin Chen, Yinghui Zhang, Yuchen Zhang, Jiangbei Yue, Jianbo Jiao, Zeyu Fu"
venue: "Proceedings of the ACM Web Conference (The Web Conference)"
year: 2026
category: Conference
image: "uploads/publications/multihateloc.webp"
imageAlt: "Comparison of hateful-video detection, weakly supervised anomaly detection and multimodal hate localisation."
abstract: "The rapid growth of video content on platforms such as TikTok and YouTube has intensified the spread of multimodal hate speech, where harmful cues emerge subtly and asynchronously across visual, acoustic, and textual streams. Existing research primarily focuses on video-level classification, leaving the practically crucial task of temporal localisation, identifying when hateful segments occur, largely unaddressed. This challenge is even more noticeable under weak supervision, where only video-level labels are available, and static fusion or classification-based architectures struggle to capture cross-modal and temporal dynamics. To address these challenges, we propose MultiHateLoc, the first framework designed for weakly-supervised multimodal hate localisation. MultiHateLoc incorporates (1) modality-aware temporal encoders to model heterogeneous sequential patterns, including a tailored text-based preprocessing module for feature enhancement; (2) dynamic cross-modal fusion to adaptively emphasise the most informative modality at each moment and a cross-modal contrastive alignment strategy to enhance multimodal feature consistency; (3) a modality-aware MIL objective to identify discriminative segments under video-level supervision. Despite relying solely on coarse labels, MultiHateLoc produces fine-grained, interpretable frame-level predictions. Experiments on HateMM and MultiHateClip show that our method achieves state-of-the-art performance in the localisation task."
paperUrl: "https://arxiv.org/abs/2512.10408"
pdf: "https://arxiv.org/pdf/2512.10408"
arxiv: "https://arxiv.org/abs/2512.10408"
featured: true
draft: false
bibtex: |-
  @inproceedings{sun2026multihateloc,
    title = {MultiHateLoc: Towards Temporal Localisation of Multimodal Hate Content in Online Videos},
    author = {Qiyue Sun and Tailin Chen and Yinghui Zhang and Yuchen Zhang and Jiangbei Yue and Jianbo Jiao and Zeyu Fu},
    booktitle = {Proceedings of the ACM Web Conference (The Web Conference)},
    year = {2026},
    eprint = {2512.10408},
    archivePrefix = {arXiv}
  }
---
