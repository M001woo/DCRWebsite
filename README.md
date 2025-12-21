# DCR Laser Cutting Website

A professional website for your laser cutting business, featuring custom design, SEO optimization, and easy image management.

## Features

- **Modern Design**: Elegant, professional design inspired by high-end woodworking businesses
- **SEO Optimized**: Comprehensive meta tags, structured data, and keyword optimization for "custom wood design" and "laser engraving" in Los Angeles
- **Image Carousels**: Automatic carousel galleries for 8 product categories
- **Contact Form**: Easy-to-use contact modal that opens your email client
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **Local Pickup Highlight**: Emphasizes Southern California pickup to save on shipping

## Quick Start

1. **Add Your Email**: Edit `index.html` and `about.html` and replace `your-email@example.com` with your actual email address (appears in the contact form)

2. **Add Images**: Simply drop your product images into the appropriate folders:
   - `images/signs/` - Custom signs
   - `images/jewelry/` - Jewelry
   - `images/decor/` - Home decor
   - `images/personalized/` - Personalized items
   - `images/stickers/` - Vinyl stickers
   - `images/stencils/` - Stencils
   - `images/custom/` - Custom products
   - `images/events/` - Event decor & displays

3. **Generate Image Manifest** (Optional but Recommended):
   ```bash
   node generate-manifest.js
   ```
   This creates a `manifest.json` file that lists all your images for faster loading.

4. **Open the Website**: Simply open `index.html` in a web browser, or upload to a web server.

## File Structure

```
DCRWebsite/
├── index.html              # Homepage
├── about.html              # About page
├── styles.css              # All styling
├── script.js               # Carousel and contact functionality
├── generate-manifest.js    # Script to generate image manifest
├── images/                 # Image folders
│   ├── signs/
│   ├── jewelry/
│   ├── decor/
│   ├── personalized/
│   ├── stickers/
│   ├── stencils/
│   ├── custom/
│   ├── events/
│   └── manifest.json       # Auto-generated image list
└── README.md               # This file
```

## SEO Features

The website includes:
- Optimized meta tags for search engines
- Structured data (JSON-LD) for Google Business listings
- Semantic HTML structure
- Keyword optimization for "custom wood design los angeles" and "laser engraving los angeles"
- Open Graph tags for social media sharing
- Canonical URLs

## Customization

### Update Business Name
Search and replace "DCR LASER CUTTING" throughout the files with your business name.

### Change Colors
Edit `styles.css` - the main color scheme uses:
- Primary: `#2c1810` (dark brown)
- Accent: `#d4af37` (gold)
- Background: `#f8f8f8` (light gray)

### Modify Services
Update the services grid in `index.html` and the services list in `about.html`.

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 1000px+ width for best quality
- **Naming**: Use descriptive names (e.g., `custom-sign-1.jpg`)
- **Optimization**: Compress images for web to ensure fast loading

## Contact Form

The contact form uses a `mailto:` link that opens the user's default email client. For a production site, you may want to:
- Use a form submission service (Formspree, Netlify Forms, etc.)
- Set up a server-side script to handle form submissions
- Integrate with an email service provider

## Browser Support

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Need Help?

If you need to make changes or have questions about customizing the website, refer to the code comments in each file or consult with a web developer.

---

**Note**: Remember to update the email address in the contact form and customize the business information to match your actual business details.

