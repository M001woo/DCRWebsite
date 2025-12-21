/**
 * Image Manifest Generator
 * 
 * This script scans the images folders and generates a manifest.json file
 * that lists all images for each category. Run this with Node.js:
 * 
 * node generate-manifest.js
 * 
 * This will create/update images/manifest.json with all images found.
 */

const fs = require('fs');
const path = require('path');

const categories = ['signs', 'jewelry', 'decor', 'personalized', 'stickers', 'stencils', 'custom', 'events'];
const serviceCategories = ['service-signs', 'service-jewelry', 'service-decor', 'service-personalized', 'service-stickers', 'service-stencils', 'service-custom', 'service-events'];
const imagesDir = path.join(__dirname, 'images');
const manifestPath = path.join(imagesDir, 'manifest.json');

const manifest = {};

categories.forEach(category => {
    const categoryDir = path.join(imagesDir, category);
    manifest[category] = [];
    
    if (fs.existsSync(categoryDir)) {
        const files = fs.readdirSync(categoryDir);
        const imageFiles = files.filter(file => {
            // Filter out macOS metadata files and hidden files
            if (file.startsWith('._') || file.startsWith('.')) return false;
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif'].includes(ext);
        }).sort();
        
        imageFiles.forEach(file => {
            manifest[category].push({
                path: `images/${category}/${file}`,
                alt: `${category} - ${path.basename(file, path.extname(file)).replace(/[-_]/g, ' ')}`
            });
        });
    }
});

// Add service button background folders
serviceCategories.forEach(serviceCategory => {
    const serviceDir = path.join(imagesDir, serviceCategory);
    const key = serviceCategory.replace('service-', '') + '-bg';
    manifest[key] = [];
    
    if (fs.existsSync(serviceDir)) {
        const files = fs.readdirSync(serviceDir);
        const imageFiles = files.filter(file => {
            // Filter out macOS metadata files and hidden files
            if (file.startsWith('._') || file.startsWith('.')) return false;
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif'].includes(ext);
        }).sort();
        
        imageFiles.forEach(file => {
            manifest[key].push({
                path: `images/${serviceCategory}/${file}`,
                alt: `${key} - ${path.basename(file, path.extname(file)).replace(/[-_]/g, ' ')}`
            });
        });
    }
});

// Add Misc folder for background images
const miscDir = path.join(imagesDir, 'Misc');
manifest.misc = [];

    if (fs.existsSync(miscDir)) {
        const files = fs.readdirSync(miscDir);
        const imageFiles = files.filter(file => {
            // Filter out macOS metadata files and hidden files
            if (file.startsWith('._') || file.startsWith('.')) return false;
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif'].includes(ext);
        }).sort();
    
    imageFiles.forEach(file => {
        manifest.misc.push({
            path: `images/Misc/${file}`,
            alt: `Background - ${path.basename(file, path.extname(file)).replace(/[-_]/g, ' ')}`
        });
    });
}

// Write manifest file
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✅ Manifest generated successfully!');
console.log(`📁 Location: ${manifestPath}`);
console.log('\nCategories processed:');
categories.forEach(cat => {
    const count = manifest[cat].length;
    console.log(`  - ${cat}: ${count} image${count !== 1 ? 's' : ''}`);
});
serviceCategories.forEach(serviceCat => {
    const key = serviceCat.replace('service-', '') + '-bg';
    const count = manifest[key] ? manifest[key].length : 0;
    if (count > 0) {
        console.log(`  - ${key} (service button): ${count} image${count !== 1 ? 's' : ''}`);
    }
});
if (manifest.misc && manifest.misc.length > 0) {
    console.log(`  - misc (background images): ${manifest.misc.length} image${manifest.misc.length !== 1 ? 's' : ''}`);
}

