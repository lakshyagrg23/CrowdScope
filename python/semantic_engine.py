import logging
import uuid
import numpy as np
import time

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    logging.error("Failed to import sentence_transformers. Please ensure it is installed.")
    raise

try:
    from sklearn.cluster import HDBSCAN
except ImportError:
    logging.error("Failed to import HDBSCAN from sklearn.cluster. Scikit-learn >= 1.3.0 is required.")
    raise

MODEL_NAME = 'BAAI/bge-small-en-v1.5'
MAX_DOCUMENT_CHARS = 6000

logging.info(f"Loading model: {MODEL_NAME}")
t0_model = time.time()
try:
    # Initialize the model ONCE at module level (stays in RAM permanently)
    MODEL = SentenceTransformer(MODEL_NAME)
except Exception as e:
    logging.error(f"Failed to load model {MODEL_NAME}: {e}")
    raise
t1_model = time.time()
logging.info(f"[Timing] Model loaded in {t1_model - t0_model:.3f}s")


def build_discussion_text(discussion):
    """Formats a discussion object into a cohesive document string with structure."""
    title = discussion.get("title", "")
    body = discussion.get("body", "")
    comments = discussion.get("comments", [])

    text_parts = []
    if title:
        text_parts.append(f"Title:\n{title}\n")
    if body:
        text_parts.append(f"Body:\n{body}\n")
    
    if comments:
        text_parts.append("Community Discussion:\n")
        for i, comment in enumerate(comments, 1):
            text_parts.append(f"{i}.\n{comment}\n")

    full_text = "\n".join(text_parts).strip()
    return full_text[:MAX_DOCUMENT_CHARS]


def calculate_similarity_metrics(embeddings, discussions):
    """Calculates full pairwise similarities, logs global metrics, and assigns mean similarity to each discussion."""
    if len(embeddings) < 2:
        return

    t0_sim = time.time()
    
    # Convert list of lists to 2D numpy array
    emb_matrix = np.array(embeddings)
    
    # Calculate pairwise cosine similarities
    similarity_matrix = np.dot(emb_matrix, emb_matrix.T)
    
    n = len(discussions)
    all_pairs = []
    
    for i in range(n):
        # Exclude self-similarity
        others_sims = np.delete(similarity_matrix[i], i)
        mean_sim = float(np.mean(others_sims))
        discussions[i]["meanSimilarity"] = round(mean_sim, 4)
        
        for j in range(i + 1, n):
            all_pairs.append({
                "sim": similarity_matrix[i, j],
                "idx_a": i,
                "idx_b": j
            })
            
    if all_pairs:
        all_pairs.sort(key=lambda x: x["sim"])
        
        lowest = all_pairs[0]
        highest = all_pairs[-1]
        median = all_pairs[len(all_pairs) // 2]
        
        t1_sim = time.time()
        logging.info(f"[Timing] Similarity metrics calculated in {t1_sim - t0_sim:.3f}s")
        
        logging.info("\n--- Global Similarity Diagnostics ---")
        logging.info(f"Lowest Similarity: {lowest['sim']:.3f}")
        logging.info(f"Median Similarity: {median['sim']:.3f}")
        logging.info(f"Highest Similarity: {highest['sim']:.3f}")
        logging.info("-------------------------------------\n")


def perform_clustering(embeddings, discussions):
    """Clusters the embeddings using HDBSCAN and returns cluster mapping."""
    if len(embeddings) < 2:
        return []
        
    t0_cluster = time.time()
    
    clusterer = HDBSCAN(min_cluster_size=2)
    labels = clusterer.fit_predict(embeddings)
    
    clusters_map = {}
    
    for i, label in enumerate(labels):
        cluster_id = int(label)
        if cluster_id not in clusters_map:
            clusters_map[cluster_id] = []
        clusters_map[cluster_id].append(discussions[i]["id"])
        
    t1_cluster = time.time()
    logging.info(f"[Timing] Clustering completed in {t1_cluster - t0_cluster:.3f}s")
    
    clusters_array = []
    for cid, ids in clusters_map.items():
        is_noise = (cid == -1)
        clusters_array.append({
            "id": None if is_noise else cid,
            "noise": is_noise,
            "size": len(ids),
            "discussionIds": ids
        })
        
    noise_count = len(clusters_map.get(-1, []))
    valid_clusters = len(clusters_array) - (1 if -1 in clusters_map else 0)
    logging.info(f"Found {valid_clusters} clusters and {noise_count} noise items.")
    
    return clusters_array


def select_representatives(embeddings, clusters, discussions, mmr_lambda, mmr_top_k):
    """Selects representative discussions for each cluster using Maximal Marginal Relevance (MMR)."""
    t0 = time.time()
    
    # O(1) Precompute mappings
    emb_map = {d["id"]: np.array(embeddings[i]) for i, d in enumerate(discussions)}
    discussion_map = {d["id"]: d for d in discussions}
    
    for cluster in clusters:
        if cluster["noise"]:
            continue
            
        cluster_ids = cluster["discussionIds"]
        if not cluster_ids:
            continue
            
        # 1. Compute Centroid
        cluster_embs = [emb_map[did] for did in cluster_ids]
        centroid = np.mean(cluster_embs, axis=0)
        
        # Normalizing centroid allows dot product = cosine similarity
        norm = np.linalg.norm(centroid)
        if norm > 0:
            centroid = centroid / norm
            
        cluster["centroid"] = centroid.tolist()
        
        # Calculate cohesion
        sims_to_centroid = [float(np.dot(emb, centroid)) for emb in cluster_embs]
        cohesion = sum(sims_to_centroid) / len(sims_to_centroid) if sims_to_centroid else 0.0
        cluster["cohesion"] = round(cohesion, 4)
            
        # 2. MMR Selection
        selected = []
        unselected = list(cluster_ids)
        
        # First selection: Discussion closest to the centroid
        sim_to_centroid = [np.dot(emb_map[did], centroid) for did in unselected]
        first_idx = np.argmax(sim_to_centroid)
        selected.append(unselected.pop(first_idx))
        
        # Iterative MMR for remaining slots
        while len(selected) < mmr_top_k and unselected:
            best_score = -float('inf')
            best_idx = -1
            
            for idx, unsel_did in enumerate(unselected):
                sim_cent = np.dot(emb_map[unsel_did], centroid)
                max_sim_sel = max(np.dot(emb_map[unsel_did], emb_map[sel_did]) for sel_did in selected)
                mmr_score = mmr_lambda * sim_cent - (1 - mmr_lambda) * max_sim_sel
                
                if mmr_score > best_score:
                    best_score = mmr_score
                    best_idx = idx
                    
            selected.append(unselected.pop(best_idx))
            
        cluster["representativeIds"] = selected
        
    t1 = time.time()
    logging.info(f"[Timing] Representative selection completed in {t1 - t0:.3f}s")


def process_dataset(dataset: dict, mmr_lambda: float = 0.6, mmr_top_k: int = 3) -> dict:
    """Executes the full pipeline and restructures the output dataset."""
    discussions = dataset.get("discussions", [])
    logging.info(f"Received {len(discussions)} discussions to process.")

    if not discussions:
        return dataset

    processed_discussions = []
    documents = []

    # 1. Build discussion text and assign IDs/metadata
    for discussion in discussions:
        doc_text = build_discussion_text(discussion)
        documents.append(doc_text)
        
        processed_discussion = {
            **discussion,
            "id": discussion.get("id") or str(uuid.uuid4()),
            "documentLength": len(doc_text.split()),
            "document": doc_text
        }
        processed_discussions.append(processed_discussion)

    # 2. Batch encode all documents
    t0_embed = time.time()
    # Embeddings are normalized for cosine similarity downstream
    embeddings_np = MODEL.encode(
        documents,
        batch_size=32,
        normalize_embeddings=True
    )
    embeddings = embeddings_np.tolist()
    t1_embed = time.time()
    logging.info(f"[Timing] Batch encoding completed in {t1_embed - t0_embed:.3f}s")

    # 3. Calculate and log similarity diagnostics
    calculate_similarity_metrics(embeddings, processed_discussions)

    # 4. Perform Clustering
    clusters = perform_clustering(embeddings, processed_discussions)

    # 5. Representative Selection (MMR)
    select_representatives(embeddings, clusters, processed_discussions, mmr_lambda, mmr_top_k)

    # Sort clusters by size descending
    clusters.sort(key=lambda x: x["size"], reverse=True)

    # 6. Construct decoupled semantic payload
    semantic_payload = {
        "embeddingModel": MODEL_NAME,
        "embeddingDimension": len(embeddings[0]) if embeddings else 0,
        "clusters": clusters
    }

    return {
        "entity": dataset.get("entity", ""),
        "discussions": processed_discussions,
        "semantic": semantic_payload
    }
