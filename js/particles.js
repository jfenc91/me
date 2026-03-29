/* ========================================
   WebGL Particle System
   Floating particles with depth and glow
   ======================================== */

(function() {
  'use strict';

  var canvas = document.createElement('canvas');
  canvas.id = 'particles';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.5;';
  document.body.prepend(canvas);

  var gl = canvas.getContext('webgl', { alpha: true, antialias: false });
  if (!gl) return;

  var NUM = 120;
  var mouse = { x: 0.5, y: 0.5 };

  window.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  }, { passive: true });

  var vsrc = [
    'attribute vec3 a_pos;',
    'attribute float a_size;',
    'attribute float a_alpha;',
    'uniform float u_time;',
    'uniform vec2 u_mouse;',
    'uniform vec2 u_res;',
    'varying float v_alpha;',
    'void main() {',
    '  float t = u_time;',
    '  float x = a_pos.x + sin(t * 0.3 + a_pos.z * 6.0) * 0.02;',
    '  float y = a_pos.y + cos(t * 0.2 + a_pos.z * 4.0) * 0.03;',
    '  float dx = u_mouse.x - x;',
    '  float dy = u_mouse.y - y;',
    '  float dist = sqrt(dx * dx + dy * dy);',
    '  float push = smoothstep(0.15, 0.0, dist) * 0.03;',
    '  x -= dx * push;',
    '  y -= dy * push;',
    '  gl_Position = vec4(x * 2.0 - 1.0, 1.0 - y * 2.0, 0.0, 1.0);',
    '  gl_PointSize = a_size * (0.5 + a_pos.z) * min(u_res.x, u_res.y) / 800.0;',
    '  v_alpha = a_alpha * (0.3 + 0.7 * a_pos.z);',
    '}'
  ].join('\n');

  var fsrc = [
    'precision mediump float;',
    'varying float v_alpha;',
    'void main() {',
    '  float d = length(gl_PointCoord - vec2(0.5));',
    '  if (d > 0.5) discard;',
    '  float glow = smoothstep(0.5, 0.0, d);',
    '  gl_FragColor = vec4(0.4, 0.7, 1.0, glow * v_alpha * 0.6);',
    '}'
  ].join('\n');

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  var prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsrc));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsrc));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  var data = new Float32Array(NUM * 5);
  for (var i = 0; i < NUM; i++) {
    var j = i * 5;
    data[j] = Math.random();       // x
    data[j+1] = Math.random();     // y
    data[j+2] = Math.random();     // z (depth)
    data[j+3] = 2 + Math.random() * 4; // size
    data[j+4] = 0.2 + Math.random() * 0.8; // alpha
  }

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  var stride = 20;
  var aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, stride, 0);

  var aSize = gl.getAttribLocation(prog, 'a_size');
  gl.enableVertexAttribArray(aSize);
  gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, stride, 12);

  var aAlpha = gl.getAttribLocation(prog, 'a_alpha');
  gl.enableVertexAttribArray(aAlpha);
  gl.vertexAttribPointer(aAlpha, 1, gl.FLOAT, false, stride, 16);

  var uTime = gl.getUniformLocation(prog, 'u_time');
  var uMouse = gl.getUniformLocation(prog, 'u_mouse');
  var uRes = gl.getUniformLocation(prog, 'u_res');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  function draw(t) {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uTime, t * 0.001);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.drawArrays(gl.POINTS, 0, NUM);
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

})();
