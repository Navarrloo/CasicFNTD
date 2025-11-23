export const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uHover;

  void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    // Gentle breathing/scaling
    float breath = sin(uTime * 0.5) * 0.02;
    pos.x += pos.x * breath;
    pos.y += pos.y * breath;
    
    // Slit-scan displacement (horizontal shifting based on Y)
    float slitEffect = sin(pos.y * 20.0 + uTime) * 0.02;
    pos.x += slitEffect;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uScrollSpeed;
  uniform float uHover;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // 1. Slit-Scan / Horizontal Lines Effect
    float scanlineCount = 50.0;
    float scanline = sin(uv.y * scanlineCount * 3.14159);
    // Make lines distinct but not fully black
    float lineIntensity = smoothstep(0.0, 0.2, abs(scanline)); 
    
    // 2. Automatic Shimmering / Distortion
    // Shift UVs slightly over time for a "liquid" feel
    float shift = sin(uv.y * 10.0 + uTime * 2.0) * 0.005;
    vec2 shiftedUv = vec2(uv.x + shift, uv.y);
    
    // 3. RGB Split (Chromatic Aberration) - Always active, stronger on edges
    float splitAmount = 0.005 + abs(uv.x - 0.5) * 0.01; // More split at edges
    
    float r = texture2D(uTexture, vec2(shiftedUv.x + splitAmount, shiftedUv.y)).r;
    float g = texture2D(uTexture, shiftedUv).g;
    float b = texture2D(uTexture, vec2(shiftedUv.x - splitAmount, shiftedUv.y)).b;
    float a = texture2D(uTexture, shiftedUv).a;
    
    vec3 color = vec3(r, g, b);
    
    // 4. Holographic Gradient (Auto-animating)
    // Blue -> Purple -> Yellow/Green flow
    vec3 col1 = vec3(0.1, 0.3, 1.0); // Blue
    vec3 col2 = vec3(0.8, 0.0, 1.0); // Purple
    vec3 col3 = vec3(0.8, 1.0, 0.2); // Yellow-Green
    
    float gradientPos = uv.x + sin(uTime * 0.5) * 0.5;
    vec3 holoGradient = mix(col1, col2, sin(gradientPos * 3.0) * 0.5 + 0.5);
    holoGradient = mix(holoGradient, col3, sin(gradientPos * 2.0 + 2.0) * 0.5 + 0.5);
    
    // Apply gradient to the text
    color *= holoGradient * 2.0; // Boost brightness
    
    // 5. Apply Scanlines
    color *= (0.8 + 0.2 * lineIntensity);
    
    // 6. Fog / Vignette on edges
    // Darken the edges to create "fog" look
    float distFromCenter = distance(uv, vec2(0.5));
    float vignette = smoothstep(0.7, 0.3, distFromCenter);
    
    // Add a glowing fog color at the edges
    vec3 fogColor = vec3(0.1, 0.0, 0.3); // Dark purple fog
    color = mix(color, fogColor, 1.0 - vignette);
    
    // Final Alpha
    // Text alpha + slight fog glow even where there is no text
    float finalAlpha = a * vignette + (1.0 - vignette) * 0.2; 
    
    // Only show where there is text or fog
    if (a < 0.1 && finalAlpha < 0.01) discard;

    gl_FragColor = vec4(color, a);
  }
`;
