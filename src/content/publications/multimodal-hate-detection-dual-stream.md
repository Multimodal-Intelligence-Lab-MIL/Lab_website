---
title: "Multimodal Hate Detection Using Dual-Stream Graph Neural Networks"
authors: "Jiangbei Yue, Shuonan Yang, Tailin Chen, Jianbo Jiao, Zeyu Fu"
venue: "British Machine Vision Conference (BMVC)"
year: 2025
category: Conference
research: multimedia-understanding-and-safety
image: "uploads/publications/multimodal-hate-detection-dual-stream.webp"
imageAlt: "Dual-stream graph neural network architecture for instance-aware multimodal hateful-video detection."
abstract: "Hateful videos present serious risks to online safety and real-world well-being, necessitating effective detection methods. Although multimodal classification approaches integrating information from several modalities outperform unimodal ones, they typically neglect that even minimal hateful content defines a video's category. Specifically, they generally treat all content uniformly, instead of emphasizing the hateful components. Additionally, existing multimodal methods cannot systematically capture structured information in videos, limiting the effectiveness of multimodal fusion. To address these limitations, we propose a novel multimodal dual-stream graph neural network model. It constructs an instance graph by separating the given video into several instances to extract instance-level features. Then, a complementary weight graph assigns importance weights to these features, highlighting hateful instances. Importance weights and instance features are combined to generate video labels. Our model employs a graph-based framework to systematically model structured relationships within and across modalities. Extensive experiments on public datasets show that our model is state-of-the-art in hateful video classification and has strong explainability. Code is available: https://github.com/Multimodal-Intelligence-Lab-MIL/MultiHateGNN."
paperUrl: "https://arxiv.org/abs/2509.13515"
pdf: "https://arxiv.org/pdf/2509.13515"
arxiv: "https://arxiv.org/abs/2509.13515"
code: "https://github.com/Multimodal-Intelligence-Lab-MIL/MultiHateGNN"
featured: true
draft: false
bibtex: |-
  @inproceedings{yue2025multimodal,
    title = {Multimodal Hate Detection Using Dual-Stream Graph Neural Networks},
    author = {Jiangbei Yue and Shuonan Yang and Tailin Chen and Jianbo Jiao and Zeyu Fu},
    booktitle = {British Machine Vision Conference (BMVC)},
    year = {2025},
    eprint = {2509.13515},
    archivePrefix = {arXiv}
  }
---
