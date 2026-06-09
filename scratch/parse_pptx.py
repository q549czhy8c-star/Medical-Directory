import zipfile
import xml.etree.ElementTree as ET
import re
import os

def extract_text_from_pptx(pptx_path):
    namespaces = {
        'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
        'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
        'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'
    }
    
    with zipfile.ZipFile(pptx_path, 'r') as zip_ref:
        # Get list of files
        namelist = zip_ref.namelist()
        
        # Find all slides and sort them numerically
        slide_pattern = re.compile(r'ppt/slides/slide(\d+)\.xml')
        slides = []
        for name in namelist:
            match = slide_pattern.match(name)
            if match:
                slides.append((int(match.group(1)), name))
        slides.sort()
        
        # Find all notes slides
        notes_pattern = re.compile(r'ppt/notesSlides/notesSlide(\d+)\.xml')
        notes = {}
        for name in namelist:
            match = notes_pattern.match(name)
            if match:
                notes[int(match.group(1))] = name
                
        print(f"Found {len(slides)} slides.")
        
        for slide_num, slide_name in slides:
            print(f"\n--- Slide {slide_num} ---")
            slide_xml = zip_ref.read(slide_name)
            root = ET.fromstring(slide_xml)
            
            # Find all text elements
            texts = []
            for elem in root.iter():
                # Check tag ending with 't' in the drawingml namespace or presentationml namespace
                if elem.tag.endswith('}t'):
                    if elem.text:
                        texts.append(elem.text.strip())
            
            # Filter empty strings and print
            texts = [t for t in texts if t]
            print(" | ".join(texts))
            
            # Check if there is a corresponding notes slide
            # Note: The mapping between slides and notes slides can be found in relationships,
            # but usually notesSlide{n} corresponds to slide{n}. Let's check.
            notes_name = notes.get(slide_num)
            if notes_name:
                notes_xml = zip_ref.read(notes_name)
                notes_root = ET.fromstring(notes_xml)
                notes_texts = []
                for elem in notes_root.iter():
                    if elem.tag.endswith('}t'):
                        if elem.text:
                            notes_texts.append(elem.text.strip())
                notes_texts = [t for t in notes_texts if t]
                if notes_texts:
                    print(f"Notes: {' | '.join(notes_texts)}")

if __name__ == '__main__':
    pptx_path = '/Users/keith/Documents/Antigravity Project/ppt/FNA Training 2026.pptx'
    extract_text_from_pptx(pptx_path)
