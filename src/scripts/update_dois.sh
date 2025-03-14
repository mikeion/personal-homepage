#!/bin/bash

# Make script exit on error
set -e

echo "====================================="
echo "Publication DOI Finder - Update Tool"
echo "====================================="
echo

# Determine script directory and project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "Error: Python is not installed or not in PATH"
    exit 1
fi

# Check if pip is installed
if ! command -v pip &> /dev/null; then
    echo "Error: pip is not installed or not in PATH"
    exit 1
fi

# Install required packages
echo "Installing required Python packages..."
pip install requests > /dev/null

# Run the website DOI finder
echo
echo "Finding DOIs for website publications..."
echo "---------------------------------------"
python "$SCRIPT_DIR/find_dois.py"

# Run the CV DOI finder
echo
echo "Finding DOIs for CV publications..."
echo "---------------------------------------"
python "$SCRIPT_DIR/find_cv_dois.py"

echo
echo "====================================="
echo "DOI update completed!"
echo "====================================="
echo
echo "Next steps:"
echo "1. Check the updated publications.json file for accuracy"
echo "2. Review the generated CV_ion_with_dois.tex file"
echo "3. Rebuild your website to see the updated links"
echo
echo "To rebuild your website, run:"
echo "  cd $PROJECT_ROOT && npm run build && npm run start" 