---
title: "Enhancing Remote Sensing Change Detection via Masked Edge Reconstruction"
authors: "Shuaiyu Chen, Fu Wang, Tianjin Huang, Xiang Li, Siyang Song, Guangliang Cheng, Chunbo Luo, Zeyu Fu"
venue: "WACV 2026 Workshops (CV4EO)"
year: 2026
category: Workshop
image: "uploads/publications/masked-edge-reconstruction.webp"
imageAlt: "Remote-sensing image pairs, change masks and alternative edge representations used by EASM."
abstract: "Change detection (CD) in remote sensing has seen great progress with deep learning models, yet accurately delineating object boundaries remains a persistent challenge. Most existing CD methods overlook edge information, resulting in blurred contours and frequent misclassifications in regions with subtle or complex changes. To address this, we propose the Edge-Aware Self-Supervised Module (EASM), a lightweight, plug-and-play component designed to enhance edge sensitivity without requiring external edge labels or auxiliary supervision. EASM operates in two stages: (1) edge feature extraction and masking via high-frequency and topological feature encoding, and (2) masked image reconstruction through a self-supervised autoencoder. This encourages the network to learn sharp and structurally consistent edge representations. Extensive experiments on three benchmark CD datasets, across nine backbone architectures, demonstrate that integrating EASM improves change localisation accuracy and edge clarity, with negligible computational overhead. Our results highlight the potential of edge-aware self-supervised learning in advancing reliable and fine-grained CD performance in remote sensing applications. The source code will be released at https://github.com/Multimodal-Intelligence-Lab-MIL/EASM"
doi: "10.1109/WACVW68408.2026.00160"
paperUrl: "https://doi.org/10.1109/WACVW68408.2026.00160"
pdf: "https://openaccess.thecvf.com/content/WACV2026W/CV4EO/papers/Chen_Enhancing_Remote_Sensing_Change_Detection_via_Masked_Edge_Reconstruction_WACVW_2026_paper.pdf"
featured: false
draft: false
bibtex: |-
  @inproceedings{Chen_2026, title={Enhancing Remote Sensing Change Detection Via Masked Edge Reconstruction}, url={http://dx.doi.org/10.1109/WACVW68408.2026.00160}, DOI={10.1109/wacvw68408.2026.00160}, booktitle={2026 IEEE/CVF Winter Conference on Applications of Computer Vision Workshops (WACVW)}, publisher={IEEE}, author={Chen, Shuaiyu and Wang, Fu and Huang, Tianjin and Li, Xiang and Song, Siyang and Cheng, Guangliang and Luo, Chunbo and Fu, Zeyu}, year={2026}, month=Mar, pages={1484–1492} }
---
