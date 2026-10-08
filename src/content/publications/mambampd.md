---
title: "MambaMPD: A Mamba-Driven Segmentation Framework for Marine Pollution Detection from Remote Sensing Imagery"
authors: "Shuaiyu Chen, Wei Han, Peng Ren, Chunbo Luo, Zeyu Fu"
venue: "GIScience & Remote Sensing"
year: 2026
category: Journal
image: "uploads/publications/mambampd.webp"
imageAlt: "MambaMPD architecture combining a Mamba encoder with frequency-aware augmentation and edge-guided attention."
abstract: "Accurate marine pollution detection (MPD) is essential for protecting coastal ecosystems and marine biodiversity. Vision Mamba models have shown promise in remote-sensing semantic segmentation by efficiently capturing long-range dependencies and global context, yet their potential for MPD remains underexplored. MPD is particularly challenging because of low signal-to-noise ratios, fragmented pollution patterns, and indistinct boundaries caused by the visual similarity between pollutants and the surrounding sea. To address these issues, we propose MambaMPD, an enhanced Mamba-based framework incorporating two complementary structural priors: Frequency-Aware Augmentation (FAA) and multi-scale Edge-Guided Attention (EGA). FAA integrates wavelet transforms into the encoder to decompose features into multi-scale frequency subbands, enabling the model to capture low-frequency contextual semantics and high-frequency structural details needed to identify small, low-contrast, and irregular pollution patterns. EGA adaptively fuses hierarchical, Laplacian-derived boundary cues with deep semantic representations, refining encoder features before decoding to sharpen boundaries and reduce ambiguity in visually confusing, spatially fragmented scenes. Together, these modules improve sensitivity to subtle pollution signals while preserving fine boundary structures. A U-Net-style decoder with squeeze-and-excitation attention and deep supervision progressively restores and refines semantic and spatial information across scales. Extensive experiments on two benchmark MPD datasets show that MambaMPD achieves higher mIoU than competing methods while requiring substantially less computation than foundation-model-based approaches. On MADOS, it improves F1 by 3.6% over OSDMamba; on M4D, it raises Oil Spill IoU by 6.82% over TransOilSeg."
doi: "10.1080/15481603.2026.2730893"
paperUrl: "https://doi.org/10.1080/15481603.2026.2730893"
pdf: "https://arxiv.org/pdf/2609.15676"
arxiv: "https://arxiv.org/abs/2609.15676"
code: "https://github.com/Multimodal-Intelligence-Lab-MIL/MambaMPD"
featured: true
draft: false
bibtex: |-
  @article{Chen_2026, title={MambaMPD: a mamba-driven segmentation framework for marine pollution detection from remote sensing imagery}, volume={63}, ISSN={1943-7226}, url={http://dx.doi.org/10.1080/15481603.2026.2730893}, DOI={10.1080/15481603.2026.2730893}, number={1}, journal={GIScience \& Remote Sensing}, publisher={Informa UK Limited}, author={Chen, Shuaiyu and Han, Wei and Ren, Peng and Luo, Chunbo and Fu, Zeyu}, year={2026}, month=Sept }
---
