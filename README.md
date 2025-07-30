# 🎉 Birthday Website

A beautiful, interactive birthday website with confetti animation, happy birthday message, and a slideshow of memories.

## ✨ Features

- **Confetti Animation**: Colorful confetti falls when the website loads
- **Dark Theme**: Beautiful dark gradient background with purple accents
- **Happy Birthday Message**: Large, animated text with gradient colors
- **Interactive Slideshow**: Auto-advancing slideshow with manual controls
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Floating Balloons**: Animated balloon effect in the background
- **Interactive Button**: Click to restart confetti animation

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## 🖼️ Customizing the Slideshow

To add your own birthday images to the slideshow:

1. **Add your images** to the `public/` folder
2. **Update the slideshow images** in `src/app/page.tsx`:

```typescript
const slideshowImages = [
  '/your-image-1.jpg',
  '/your-image-2.jpg',
  '/your-image-3.jpg',
  '/your-image-4.jpg',
  '/your-image-5.jpg',
];
```

## 🎨 Customization Options

### Changing Colors
- Modify the gradient colors in the main container: `bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900`
- Update confetti colors in the `colors` array
- Change text gradient colors in the title

### Adjusting Animation Duration
- Confetti duration: Change the timeout in the `useEffect` (currently 10 seconds)
- Slideshow interval: Modify the interval in the slideshow `useEffect` (currently 3 seconds)

### Adding More Features
- Add background music
- Include birthday countdown
- Add more interactive elements
- Customize the birthday message

## 🛠️ Built With

- **Next.js 15** - React framework
- **React Confetti** - Confetti animation library
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## 📱 Responsive Design

The website is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones

## 🎊 Happy Birthday!

This website is designed to make someone's birthday extra special with beautiful animations and a personalized slideshow of memories.
