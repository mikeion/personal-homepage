import streamlit as st
from pathlib import Path
from cv_importer import CVImporter

def cv_upload_page():
    st.title("CV Importer")
    
    uploaded_file = st.file_uploader("Choose your CV file", type=['tex'])
    
    if uploaded_file:
        # Save uploaded file temporarily
        temp_path = Path("temp") / uploaded_file.name
        temp_path.parent.mkdir(exist_ok=True)
        
        try:
            temp_path.write_bytes(uploaded_file.getvalue())
            
            # Import CV
            importer = CVImporter(temp_path)
            data = importer.import_cv()
            
            # Show preview
            st.subheader("Import Preview")
            for section, content in data.items():
                with st.expander(f"{section.title()} Preview"):
                    st.json(content)
            
            # Save button
            if st.button("Save Imported Data"):
                importer.save_data(data)
                st.success("CV data imported successfully!")
                
        finally:
            # Cleanup
            if temp_path.exists():
                temp_path.unlink()
            
if __name__ == "__main__":
    cv_upload_page() 