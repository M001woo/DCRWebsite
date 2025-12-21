# Image Folders

This directory contains folders for each product category. Simply add your images to the appropriate folder, and they will automatically appear in the carousels on the website.

## Folder Structure

- `signs/` - Custom signs images
- `jewelry/` - Jewelry images
- `decor/` - Home decor images
- `personalized/` - Personalized items images
- `stickers/` - Vinyl stickers images
- `stencils/` - Stencils images
- `custom/` - Custom products images
- `events/` - Event decor & displays images

## How to Add Images

### Method 1: Automatic Detection (Easiest)

Simply drop your image files into the appropriate folder. The website will automatically detect images using common naming patterns:

**Supported naming patterns:**
- `signs1.jpg`, `signs2.jpg`, `signs3.jpg` (category + number)
- `signs_1.jpg`, `signs_2.jpg` (category + underscore + number)
- `signs-1.jpg`, `signs-2.jpg` (category + dash + number)
- `image1.jpg`, `image2.jpg` (generic image naming)
- `img1.jpg`, `img2.jpg` (short image naming)
- `1.jpg`, `2.jpg`, `01.jpg` (just numbers)
- Any other common pattern

**Supported formats:** JPG, JPEG, PNG, WebP (case insensitive)

### Method 2: Using Manifest (Recommended for Production)

For better control over image order and alt text, generate a manifest file:

1. Add your images to the folders (any names work)
2. Run the manifest generator:
   ```bash
   node generate-manifest.js
   ```
3. This creates `manifest.json` which lists all images in order
4. The website will automatically use the manifest if it exists

## Image Requirements

For best results, use images that are:
- At least 1000px wide
- Optimized for web (compressed but high quality)
- Named descriptively (helps with SEO)

## How It Works

The website tries to load images in this order:
1. **First**: Checks for `manifest.json` (if you ran the generator)
2. **Second**: Scans folder for images using common naming patterns
3. **Fallback**: Shows a placeholder if no images are found

Images will automatically appear in the carousels and start rotating!

