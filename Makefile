.PHONY: all clean setup dev build classify-research

# Python virtual environment
VENV := .venv
PYTHON := $(VENV)/bin/python
PIP := $(VENV)/bin/pip

# Node environment
NODE_MODULES := node_modules

# Directories
SCRIPTS_DIR := scripts
DATA_DIR := src/data

# Default target
all: setup classify-research build

# Create Python virtual environment and install dependencies
$(VENV)/bin/activate: requirements.txt
	python -m venv $(VENV)
	$(PIP) install -r requirements.txt

# Install Node.js dependencies
$(NODE_MODULES): package.json
	npm install
	touch $(NODE_MODULES)

# Setup both Python and Node environments
setup: $(VENV)/bin/activate $(NODE_MODULES)

# Run research classification
classify-research: setup
	$(PYTHON) $(SCRIPTS_DIR)/research_classifier.py \
		--input $(DATA_DIR)/cv/CV_ion.tex \
		--output $(DATA_DIR)/research

# Development server
dev: setup
	npm run dev

# Production build
build: setup classify-research
	npm run build

# Clean up
clean:
	rm -rf $(VENV)
	rm -rf $(NODE_MODULES)
	rm -rf .next
	rm -rf out 