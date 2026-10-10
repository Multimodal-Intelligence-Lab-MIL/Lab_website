---
title: "GraphRAG-Rad: Concept-Aware Radiology Report Generation via Latent Visual-Semantic Retrieval"
authors: "Faezeh Safari, Hang Dong, Zeyu Fu, Aline Villavicencio"
venue: "EACL 2026 Student Research Workshop"
year: 2026
category: Workshop
research: ai-for-healthcare
image: "uploads/publications/graphrag-rad-framework.webp"
imageAlt: "Overview of the GraphRAG-Rad framework: latent visual-semantic retrieval, knowledge-grounded visual encoding, multi-hop reasoning and graph-gated fusion for report generation."
abstract: "Radiology report generation involves translating visual signals from pixels into precise clinical language. Existing encoder-decoder models often suffer from hallucinations, generating plausible but incorrect medical findings. We propose GraphRAG-Rad, a novel architecture that integrates biomedical knowledge through a novel Latent Visual-Semantic Retrieval (VSR). Unlike traditional Retrieval-Augmented Generation (RAG) methods that rely on textual queries, our approach aligns visual embeddings with the latent space of the Knowledge Graph, PrimeKG. The retrieved sub-graph guides the Visual Encoder and the Multi-Hop Reasoning Module. The reasoning module simulates clinical deduction paths (Ground-Glass Opacity → Viral Pneumonia → COVID-19) before it combines the information with visual features in a Graph-Gated Cross-Modal Decoder. Experiments on the COV-CTR dataset demonstrate that GraphRAG-Rad achieves competitive performance with strong results across multiple metrics. Furthermore, ablation studies show that integrating latent retrieval and reasoning improves performance significantly compared to a visual-only baseline. Qualitative analysis further reveals interpretable attention maps. These maps explicitly link visual regions to symbolic medical concepts, effectively bridging the modality gap between vision and language."
doi: "10.18653/v1/2026.eacl-srw.34"
paperUrl: "https://doi.org/10.18653/v1/2026.eacl-srw.34"
pdf: "https://aclanthology.org/2026.eacl-srw.34.pdf"
featured: false
draft: false
bibtex: |-
  @inproceedings{Safari_2026, title={GraphRAG-Rad: Concept-Aware Radiology Report Generation via Latent Visual-Semantic Retrieval}, url={http://dx.doi.org/10.18653/v1/2026.eacl-srw.34}, DOI={10.18653/v1/2026.eacl-srw.34}, booktitle={Proceedings of the 19th Conference of the European Chapter of the Association for Computational Linguistics (Volume 4: Student Research Workshop)}, publisher={Association for Computational Linguistics}, author={Safari, Faezeh and Dong, Hang and Fu, Zeyu and Villavicencio, Aline}, year={2026}, pages={464–475} }
---
