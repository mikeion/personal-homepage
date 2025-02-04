import streamlit as st
import json
from pathlib import Path
import datetime
from typing import Dict, List
import pandas as pd

# Constants
DATA_DIR = Path("src/data/research")
AREAS_FILE = DATA_DIR / "areas.json"

def load_research_data() -> Dict:
    """Load research areas and items"""
    with open(AREAS_FILE) as f:
        return json.load(f)

def save_research_data(data: Dict):
    """Save research data back to file"""
    with open(AREAS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def render_add_item():
    """Render form for adding new research items"""
    st.header("Add Research Item")
    
    # Load current data
    research_data = load_research_data()
    
    # Form for adding new items
    with st.form("add_item_form"):
        # Select type and area
        col1, col2 = st.columns(2)
        with col1:
            item_type = st.selectbox(
                "Type",
                ["publication", "project", "grant"]
            )
        with col2:
            area = st.selectbox(
                "Research Area",
                list(research_data.keys())
            )
        
        # Common fields
        title = st.text_input("Title")
        description = st.text_area("Description")
        year = st.number_input("Year", min_value=2000, max_value=datetime.datetime.now().year + 1, value=datetime.datetime.now().year)
        collaborators = st.text_input("Collaborators (comma-separated)")
        
        # Type-specific fields
        if item_type == "publication":
            venue = st.text_input("Venue")
            status = st.selectbox("Status", ["published", "in_review", "in_progress"])
            url = st.text_input("URL (optional)")
            doi = st.text_input("DOI (optional)")
            
        elif item_type == "project":
            status = st.selectbox("Status", ["active", "completed"])
            code_url = st.text_input("Code URL (optional)")
            demo_url = st.text_input("Demo URL (optional)")
            
        elif item_type == "grant":
            amount = st.text_input("Amount")
            funder = st.text_input("Funder")
            grant_number = st.text_input("Grant Number (optional)")
        
        submitted = st.form_submit_button("Add Item")
        
        if submitted:
            # Create item data
            item_data = {
                "title": title,
                "description": description,
                "year": year,
                "collaborators": [c.strip() for c in collaborators.split(",") if c.strip()],
            }
            
            # Add type-specific fields
            if item_type == "publication":
                item_data.update({
                    "venue": venue,
                    "status": status,
                    "url": url,
                    "doi": doi
                })
            elif item_type == "project":
                item_data.update({
                    "status": status,
                    "code_url": code_url,
                    "demo_url": demo_url
                })
            elif item_type == "grant":
                item_data.update({
                    "amount": amount,
                    "funder": funder,
                    "grant_number": grant_number
                })
            
            # Add to research data
            key = f"{item_type}s"
            if key not in research_data[area]:
                research_data[area][key] = []
            research_data[area][key].append(item_data)
            
            # Save updated data
            save_research_data(research_data)
            st.success(f"Added {item_type}: {title}")

def render_edit_items():
    """Render interface for editing existing items"""
    st.header("Edit Research Items")
    
    # Load current data
    research_data = load_research_data()
    
    # Select area and type to edit
    col1, col2 = st.columns(2)
    with col1:
        area = st.selectbox(
            "Research Area",
            list(research_data.keys()),
            key="edit_area"
        )
    with col2:
        item_type = st.selectbox(
            "Type",
            ["publications", "projects", "grants"],
            key="edit_type"
        )
    
    # Get items for selected area and type
    items = research_data[area].get(item_type, [])
    
    if not items:
        st.info(f"No {item_type} found for {area}")
        return
    
    # Convert to DataFrame for easier editing
    df = pd.DataFrame(items)
    
    # Edit DataFrame
    edited_df = st.data_editor(
        df,
        num_rows="dynamic",
        use_container_width=True
    )
    
    # Save button
    if st.button("Save Changes"):
        research_data[area][item_type] = edited_df.to_dict('records')
        save_research_data(research_data)
        st.success("Changes saved!")

def render_manage_areas():
    """Render interface for managing research areas"""
    st.header("Manage Research Areas")
    
    # Load current data
    research_data = load_research_data()
    
    # Add new area
    with st.expander("Add New Research Area"):
        with st.form("add_area_form"):
            area_name = st.text_input("Area Name")
            description = st.text_area("Description")
            submitted = st.form_submit_button("Add Area")
            
            if submitted and area_name:
                research_data[area_name] = {
                    "description": description,
                    "publications": [],
                    "projects": [],
                    "grants": []
                }
                save_research_data(research_data)
                st.success(f"Added research area: {area_name}")
    
    # Edit existing areas
    st.subheader("Edit Areas")
    for area, data in research_data.items():
        with st.expander(area):
            new_description = st.text_area("Description", data["description"], key=f"desc_{area}")
            if st.button("Update", key=f"update_{area}"):
                research_data[area]["description"] = new_description
                save_research_data(research_data)
                st.success(f"Updated {area}")
            if st.button("Delete", key=f"delete_{area}"):
                if st.checkbox(f"Confirm deletion of {area}"):
                    del research_data[area]
                    save_research_data(research_data)
                    st.success(f"Deleted {area}")
                    st.rerun()

def main():
    st.title("Research Management")
    
    # Sidebar navigation
    page = st.sidebar.radio(
        "Navigation",
        ["Add Item", "Edit Items", "Manage Areas"]
    )
    
    # Render appropriate page
    if page == "Add Item":
        render_add_item()
    elif page == "Edit Items":
        render_edit_items()
    else:
        render_manage_areas()

if __name__ == "__main__":
    main() 