# 🎮 Gaming Cyberpunk Theme

## Color Palette

### Primary Neon Colors
```
Neon Pink:    #FF006E  (Hot pink - primary accent)
Neon Purple:  #8338EC  (Electric purple - secondary)
Neon Blue:    #3A86FF  (Cyber blue - tertiary)
Neon Cyan:    #00F5FF  (Matrix cyan - highlights)
Neon Green:   #06FFA5  (Energy green - success)
Neon Yellow:  #FFBE0B  (Warning yellow)
Neon Orange:  #FB5607  (Energy orange)
```

### Dark Backgrounds
```
Deepest:      #050814  (Almost black)
Main BG:      #0A0E27  (Primary background)
Card BG:      #151932  (Elevated surfaces)
Surface:      #1E2139  (Interactive elements)
Border:       #252A48  (Subtle borders)
Hover:        #2D3250  (Hover states)
```

## Typography

### Fonts
- **Headers**: Orbitron (Gaming/Tech font)
- **Body**: Rajdhani (Clean, readable)

### Sizes
- Base: 14px (corporate standard)
- H1: 2.5rem (40px)
- H2: 1.875rem (30px)
- Buttons: 0.875rem (14px, uppercase)

## Visual Effects

### Glassmorphism
- Frosted glass cards with blur
- Neon borders with glow
- Subtle inner shadows

### Neon Glow
- Multi-layer box shadows
- Pulsing animations
- Hover intensity increase

### Animations
- `glow` - Pulsing neon effect
- `float` - Floating elements
- `scan` - Scanline effect
- `flicker` - Neon flicker
- `glitch` - Cyberpunk glitch

### Background Patterns
- Cyber grid (subtle dots)
- Hex pattern (honeycomb)
- Radial gradients (corner glows)
- Scanline overlay

## Components

### Buttons
- Gradient backgrounds (pink → purple → blue)
- Neon glow on hover
- Shine effect animation
- Uppercase text with Orbitron font

### Cards
- Glass effect with blur
- Neon border on hover
- Lift animation (8px up)
- Gradient border reveal

### Inputs
- Neon slider thumbs
- Glowing focus states
- Cyberpunk styling

### Scrollbar
- Gradient thumb (pink → purple → cyan)
- Neon glow effect
- Dark track with border

## Usage Examples

### Gradient Text
```tsx
<h1 className="gradient-text">GreenScore AI</h1>
```

### Neon Button
```tsx
<button className="neon-button">Launch Simulator</button>
```

### Gaming Card
```tsx
<div className="glass-strong rounded-3xl p-8 neon-border card-hover">
  Content here
</div>
```

### Glowing Text
```tsx
<span className="text-glow-pink">CRITICAL</span>
<span className="text-glow-cyan">ONLINE</span>
```

## Inspiration
- Cyberpunk 2077
- Valorant UI
- Apex Legends HUD
- Tron Legacy
- Blade Runner 2049

## Best Practices

1. **Use neon colors sparingly** - Accent only, not everywhere
2. **Dark backgrounds** - Always use dark-900 or darker
3. **Glow effects** - Apply to interactive elements
4. **Animations** - Keep subtle, don't overdo
5. **Contrast** - Ensure text readability
6. **Performance** - Use backdrop-blur wisely

## Color Combinations

### High Energy
- Pink + Purple + Blue gradient
- Use for: CTAs, important metrics

### Cool Tech
- Cyan + Blue + Purple
- Use for: Data displays, charts

### Success/Active
- Green + Cyan
- Use for: Positive states, online status

### Warning/Critical
- Orange + Yellow + Pink
- Use for: Alerts, important info

## Accessibility

- All text meets WCAG AA contrast (4.5:1)
- Neon effects are decorative, not functional
- Focus states clearly visible
- Animations respect prefers-reduced-motion
