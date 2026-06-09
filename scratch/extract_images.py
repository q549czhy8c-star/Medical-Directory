import os
import zipfile
import xml.etree.ElementTree as ET
import re

def extract_slide_images(pptx_path, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    
    namespaces = {
        'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
        'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
        'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'
    }
    
    with zipfile.ZipFile(pptx_path, 'r') as zip_ref:
        namelist = zip_ref.namelist()
        
        # We need to map relationship IDs to image files for each slide
        # Relationships are in ppt/slides/_rels/slide{n}.xml.rels
        slide_pattern = re.compile(r'ppt/slides/slide(\d+)\.xml')
        slides = []
        for name in namelist:
            match = slide_pattern.match(name)
            if match:
                slides.append((int(match.group(1)), name))
        slides.sort()
        
        for slide_num, slide_name in slides:
            rels_name = f"ppt/slides/_rels/slide{slide_num}.xml.rels"
            if rels_name not in namelist:
                continue
                
            # Parse relationships
            rels_xml = zip_ref.read(rels_name)
            rels_root = ET.fromstring(rels_xml)
            rel_map = {}
            for rel in rels_root:
                rId = rel.attrib.get('Id')
                target = rel.attrib.get('Target')
                # Target is relative to ppt/slides/
                # e.g., ../media/image1.png
                if target and 'media/' in target:
                    media_path = os.path.normpath(os.path.join("ppt/slides", target)).replace('\\', '/')
                    rel_map[rId] = media_path
            
            # Now parse slide.xml to find pictures and match their rId
            slide_xml = zip_ref.read(slide_name)
            slide_root = ET.fromstring(slide_xml)
            
            # Find all pic shapes
            pic_count = 1
            for elem in slide_root.iter():
                if elem.tag.endswith('}pic'):
                    # Look for blip element containing embed relationship
                    blip = None
                    for child in elem.iter():
                        if child.tag.endswith('}blip'):
                            blip = child
                            break
                    
                    if blip is not None:
                        embed_rId = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                        if embed_rId in rel_map:
                            img_zip_path = rel_map[embed_rId]
                            # Find shape name
                            shape_name = f"pic_{pic_count}"
                            for child in elem.iter():
                                if child.tag.endswith('}cNvPr'):
                                    shape_name = child.attrib.get('name', f"pic_{pic_count}")
                                    # Clean shape name for file path
                                    shape_name = "".join([c if c.isalnum() or c in ('-', '_') else '_' for c in shape_name])
                                    break
                            
                            # Extract image
                            ext = os.path.splitext(img_zip_path)[1]
                            dest_filename = f"slide_{slide_num}_{shape_name}{ext}"
                            dest_path = os.path.join(output_dir, dest_filename)
                            
                            try:
                                with open(dest_path, 'wb') as img_out:
                                    img_out.write(zip_ref.read(img_zip_path))
                                print(f"Extracted: Slide {slide_num} -> {dest_filename}")
                            except Exception as e:
                                print(f"Failed to extract {img_zip_path}: {e}")
                            
                            pic_count += 1

if __name__ == '__main__':
    pptx_path = '/Users/keith/Documents/Antigravity Project/ppt/FNA Training 2026.pptx'
    output_dir = '/Users/keith/Documents/Antigravity Project/scratch/images'
    extract_slide_images(pptx_path, output_dir)
