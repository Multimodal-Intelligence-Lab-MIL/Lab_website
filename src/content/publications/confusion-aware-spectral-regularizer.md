---
title: "Confusion-Aware Spectral Regularizer for Long-Tailed Recognition"
authors: "Ziquan Zhu, Gaojie Jin, Hanruo Zhu, Si-Yuan Lu, Yunxiao Zhang, Zeyu Fu, Ronghui Mu, Guoqiang Zhang, Zhao Sun, Xia Yuhang, Jiaxing Shang, Xiang Li, Lu Liu, Tianjin Huang"
venue: "IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)"
year: 2026
category: Conference
research: trustworthy-ai
image: "uploads/publications/confusion-aware-spectral-regularizer.webp"
imageAlt: "Comparison of training and test worst-class accuracy for long-tailed recognition methods."
abstract: "Long-tailed image classification remains a long-standing challenge, as real-world data typically follow highly imbalanced distributions where a few head classes dominate and many tail classes contain only limited samples. This imbalance biases feature learning toward head categories and leads to significant degradation on rare classes. Although recent studies have proposed re-sampling, re-weighting, and decoupled learning strategies, the improvement on the most underrepresented classes still remains marginal compared with overall accuracy. In this work, we present a confusion-centric perspective for long-tailed recognition that explicitly focuses on worst-class generalization. We first establish a new theoretical framework of class-specific error analysis, which shows that the worst-class error can be tightly upper-bounded by the spectral norm of the frequency-weighted confusion matrix and a model-dependent complexity term. Guided by this insight, we propose the Confusion-Aware Spectral Regularizer (CAR) that minimizes the spectral norm of the confusion matrix during training to reduce inter-class confusion and enhance tail-class generalization. To enable stable and efficient optimization, CAR integrates a Differentiable Confusion Matrix Surrogate and an EMA-based Confusion Estimator to maintain smooth and low-variance estimates across mini-batches. Extensive experiments across multiple long-tailed benchmarks demonstrates that CAR substantially improves both worst-class accuracy and overall performance. When combined with ConCutMix augmentation, CAR consistently surpasses exisiting state-of-the-art long-tailed learning methods under both the training-from-scratch setting (by 2.37% ~ 4.83%) and the fine-tuning-from-pretrained setting (by 2.42% ~ 4.17%) across ImageNet-LT, CIFAR100-LT, and iNaturalist datasets."
award: "Oral Presentation"
paperUrl: "https://arxiv.org/abs/2603.16732"
pdf: "https://arxiv.org/pdf/2603.16732"
arxiv: "https://arxiv.org/abs/2603.16732"
featured: true
draft: false
bibtex: |-
  @inproceedings{zhu2026confusion,
    title = {Confusion-Aware Spectral Regularizer for Long-Tailed Recognition},
    author = {Ziquan Zhu and Gaojie Jin and Hanruo Zhu and Si-Yuan Lu and Yunxiao Zhang and Zeyu Fu and Ronghui Mu and Guoqiang Zhang and Zhao Sun and Xia Yuhang and Jiaxing Shang and Xiang Li and Lu Liu and Tianjin Huang},
    booktitle = {IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)},
    year = {2026},
    eprint = {2603.16732},
    archivePrefix = {arXiv}
  }
---
