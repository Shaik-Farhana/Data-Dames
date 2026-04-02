import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

CATEGORY_MAP = {
    "Raw Materials": 0,
    "Packaging": 1,
    "Marketing": 2,
    "Revenue": 3,
    "Other": 4
}

CLUSTER_LABELS = [
    "Essential daily costs",
    "Growth investments", 
    "Irregular spending"
]

def cluster_expenses(transactions: list) -> dict:
    expenses = [t for t in transactions if t["type"] == "expense"]

    if len(expenses) < 3:
        return {
            "available": False,
            "insight": "Add at least 3 expense entries to see your spending patterns.",
            "labeled_transactions": [],
            "n_clusters": 0
        }

    features = [
        [t["amount_inr"], CATEGORY_MAP.get(t["category"], 4)]
        for t in expenses
    ]

    X = np.array(features)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    n_clusters = min(3, len(expenses))
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = kmeans.fit_predict(X_scaled)

    # Find biggest spending cluster
    cluster_totals = {}
    for i, label in enumerate(labels):
        cluster_totals.setdefault(int(label), []).append(features[i][0])

    biggest_cluster = max(cluster_totals, key=lambda k: sum(cluster_totals[k]))
    biggest_avg = sum(cluster_totals[biggest_cluster]) / len(cluster_totals[biggest_cluster])

    # Attach cluster labels to transactions
    labeled = []
    for i, t in enumerate(expenses):
        labeled.append({
            **t,
            "cluster": int(labels[i]),
            "cluster_label": CLUSTER_LABELS[int(labels[i]) % len(CLUSTER_LABELS)]
        })

    insight = (
        f"Your spending falls into {n_clusters} patterns. "
        f"Your highest-cost cluster averages ₹{biggest_avg:.0f} per transaction. "
        f"Reducing frequency in this cluster could significantly boost your weekly profit."
    )

    return {
        "available": True,
        "labeled_transactions": labeled,
        "insight": insight,
        "n_clusters": n_clusters,
        "cluster_totals": {str(k): sum(v) for k, v in cluster_totals.items()}
    }