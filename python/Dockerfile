# We use python:3.10-slim. Python 3.10 is very stable for ML libraries.
# 'slim' avoids the heavy full Debian image, saving hundreds of megabytes.
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies required for compiling some Python packages (like scikit-learn/numpy).
# We clean up the apt cache afterwards to keep the image small.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first for layer caching
COPY requirements.txt .

# Install Python dependencies. 
# We explicitly install the CPU version of PyTorch first. 
# This prevents pip from downloading 3GB+ of NVIDIA CUDA GPU binaries, drastically speeding up the build.
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# Now install the rest of the requirements
RUN pip install --no-cache-dir -r requirements.txt

# Download the sentence-transformers model during the build process.
# This is a CRITICAL step for ML Docker images. If we don't do this, 
# the model will be downloaded every time the container starts up!
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('BAAI/bge-small-en-v1.5')"

# Copy the rest of the Python code
COPY . .

# Expose the FastAPI default port
EXPOSE 8000

# Run FastAPI using Uvicorn with a single worker to prevent loading multiple ML models into memory
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
