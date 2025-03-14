# Publication DOI Finder Scripts

This directory contains scripts to help you find and add DOI links to your publications, both in your website and CV.

## Prerequisites

Before running these scripts, make sure you have installed the required Python packages:

```bash
pip install requests
```

## Finding DOIs for Website Publications

The `find_dois.py` script will:
1. Load all publications from your `publications.json` file
2. Search for DOIs using Crossref and Semantic Scholar APIs
3. Update your `publications.json` file with found DOIs and links

To run the script:

```bash
python src/scripts/find_dois.py
```

## Finding DOIs for CV Publications

The `find_cv_dois.py` script will:
1. Parse your LaTeX CV file to extract publication information
2. Search for DOIs using Crossref and Semantic Scholar APIs
3. Generate a new CV file with added DOI links in LaTeX format

To run the script:

```bash
python src/scripts/find_cv_dois.py
```

This will create a new file called `CV_ion_with_dois.tex` in the same directory as your original CV.

## How the Links Work

- **Website**: The found DOIs are automatically added to your `publications.json` file.
  - DOIs are stored in the `doi` field
  - A direct link is added to the `url` field with format `https://doi.org/{doi}`
  - The website already has code to display these links in the `PublicationsAndGrants.tsx` component

- **CV**: For the LaTeX CV, DOI links are added as:
  - `\href{https://doi.org/10.1234/abc123}{doi: 10.1234/abc123}`
  - These appear as clickable links in the PDF version of your CV

## Customization

- You can modify the confidence threshold in both scripts (default is 0.5)
- If you want to change how DOIs are displayed, edit the `generate_updated_latex` function in `find_cv_dois.py` or update the `PublicationsAndGrants.tsx` component for the website
- For better matches, you may want to manually check and update titles in your publications data 