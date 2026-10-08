---
title: "OSDMamba: Enhancing Oil Spill Detection from Remote Sensing Images Using Selective State Space Model"
authors: "Shuaiyu Chen, Fu Wang, Peng Ren, Chunbo Luo, Zeyu Fu"
venue: "IEEE Geoscience and Remote Sensing Letters"
year: 2025
category: Journal
image: "uploads/publications/osdmamba.webp"
imageAlt: "Class distributions for the oil-spill detection and MADOS remote-sensing datasets."
abstract: "Semantic segmentation is commonly used for Oil Spill Detection (OSD) in remote sensing images. However, the limited availability of labelled oil spill samples and class imbalance present significant challenges that can reduce detection accuracy. Furthermore, most existing methods, which rely on convolutional neural networks (CNNs), struggle to detect small oil spill areas due to their limited receptive fields and inability to effectively capture global contextual information. This study explores the potential of State-Space Models (SSMs), particularly Mamba, to overcome these limitations, building on their recent success in vision applications. We propose OSDMamba, the first Mamba-based architecture specifically designed for oil spill detection. OSDMamba leverages Mamba's selective scanning mechanism to effectively expand the model's receptive field while preserving critical details. Moreover, we designed an asymmetric decoder incorporating ConvSSM and deep supervision to strengthen multi-scale feature fusion, thereby enhancing the model's sensitivity to minority class samples. Experimental results show that the proposed OSDMamba achieves state-of-the-art performance, yielding improvements of 8.9% and 11.8% in OSD across two publicly available datasets."
doi: "10.1109/LGRS.2025.3583965"
paperUrl: "https://doi.org/10.1109/LGRS.2025.3583965"
pdf: "https://arxiv.org/pdf/2506.18006"
arxiv: "https://arxiv.org/abs/2506.18006"
code: "https://github.com/Chenshuaiyu1120/Oil-Spill-detection"
featured: false
draft: false
bibtex: |-
  @article{chen2025osdmamba,
    title = {OSDMamba: Enhancing Oil Spill Detection from Remote Sensing Images Using Selective State Space Model},
    author = {Shuaiyu Chen and Fu Wang and Peng Ren and Chunbo Luo and Zeyu Fu},
    journal = {IEEE Geoscience and Remote Sensing Letters},
    year = {2025},
    doi = {10.1109/LGRS.2025.3583965},
    eprint = {2506.18006},
    archivePrefix = {arXiv}
  }
---
