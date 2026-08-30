import React, { useEffect, useRef } from 'react';

export const CosmicShaderBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return;

    let animationFrameId: number;

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      void main() {
        vec2 uv = v_texCoord;
        float time = u_time * 0.2;
        
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_resolution.x / u_resolution.y;
        
        float noise = 0.0;
        vec2 q = p - vec2(0.5, 0.5);
        
        for(float i = 1.0; i < 4.0; i++) {
          p.x += 0.3 / i * sin(i * 3.0 * p.y + time + i * 0.5);
          p.y += 0.3 / i * cos(i * 3.0 * p.x + time + i * 0.8);
          noise += abs(p.x + p.y);
        }
        
        vec3 color1 = vec3(0.027, 0.039, 0.071); // #070A12
        vec3 color2 = vec3(0.051, 0.3, 0.8); // Electric Blue
        vec3 color3 = vec3(0.1, 0.05, 0.2); // Deep Violet
        
        vec3 finalColor = mix(color1, color2, 0.15 * sin(noise * 0.5 + time));
        finalColor = mix(finalColor, color3, 0.1 * cos(noise * 0.3 - time));
        
        float dist = length(q);
        finalColor += 0.05 * (1.0 - dist);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error(glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uTimeLocation = gl.getUniformLocation(program, 'u_time');
    const uResLocation = gl.getUniformLocation(program, 'u_resolution');
    const uMouseLocation = gl.getUniformLocation(program, 'u_mouse');

    const mouse = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        mouse.x = (e.clientX - rect.left);
        mouse.y = (rect.height - (e.clientY - rect.top));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const syncSize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      syncSize();
    });
    resizeObserver.observe(canvas);
    syncSize();

    let startTime = performance.now();
    const render = (timeNow: number) => {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      const elapsed = (timeNow - startTime) * 0.001;

      if (uTimeLocation) gl.uniform1f(uTimeLocation, elapsed);
      if (uResLocation) gl.uniform2f(uResLocation, canvas.width, canvas.height);
      if (uMouseLocation) gl.uniform2f(uMouseLocation, mouse.x, mouse.y);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={`pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
