/* ========================================
   WebGL Starfield
   Twinkling stars with gentle drift,
   mouse parallax, and shooting stars
   ======================================== */

(function() {
  'use strict';

  var canvas = document.createElement('canvas');
  canvas.id = 'particles';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.prepend(canvas);

  var gl = canvas.getContext('webgl', { alpha: true, antialias: true });
  if (!gl) return;

  var NUM_STARS = 200;
  var NUM_SHOOTERS = 3;
  var mouse = { x: 0.5, y: 0.5 };

  window.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  }, { passive: true });

  // --- Star state ---
  var stars = [];
  for (var i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      size: 0.5 + Math.random() * 2.5,
      twinkleSpeed: 0.5 + Math.random() * 2.0,
      twinklePhase: Math.random() * Math.PI * 2,
      brightness: 0.3 + Math.random() * 0.7,
      // Color temperature: cool white to warm white
      temp: Math.random()
    });
  }

  // --- Shooting stars ---
  var shooters = [];
  for (var s = 0; s < NUM_SHOOTERS; s++) {
    shooters.push({
      x: 0, y: 0, vx: 0, vy: 0,
      life: 0, maxLife: 0, active: false,
      tailLen: 0
    });
  }

  function spawnShooter(sh) {
    sh.x = Math.random() * 0.8 + 0.1;
    sh.y = Math.random() * 0.3;
    var angle = Math.PI * 0.15 + Math.random() * Math.PI * 0.2;
    var speed = 0.008 + Math.random() * 0.006;
    sh.vx = Math.cos(angle) * speed;
    sh.vy = Math.sin(angle) * speed;
    sh.life = 0;
    sh.maxLife = 40 + Math.random() * 40;
    sh.active = true;
    sh.tailLen = 0.03 + Math.random() * 0.04;
  }

  // --- Star shader ---
  var starVS = [
    'attribute vec2 a_pos;',
    'attribute float a_size;',
    'attribute float a_brightness;',
    'attribute float a_temp;',
    'uniform float u_time;',
    'uniform vec2 u_res;',
    'uniform vec2 u_mouse;',
    'varying float v_bright;',
    'varying float v_temp;',
    'void main() {',
    '  // Subtle parallax from mouse',
    '  vec2 offset = (u_mouse - 0.5) * a_size * 0.003;',
    '  vec2 pos = a_pos + offset;',
    '  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);',
    '  gl_Position.y *= -1.0;',
    '  gl_PointSize = a_size * min(u_res.x, u_res.y) / 800.0;',
    '  v_bright = a_brightness;',
    '  v_temp = a_temp;',
    '}'
  ].join('\n');

  var starFS = [
    'precision mediump float;',
    'varying float v_bright;',
    'varying float v_temp;',
    'void main() {',
    '  float d = length(gl_PointCoord - vec2(0.5));',
    '  if (d > 0.5) discard;',
    '  // Sharp core with soft glow',
    '  float core = smoothstep(0.5, 0.08, d);',
    '  float glow = smoothstep(0.5, 0.0, d) * 0.4;',
    '  float intensity = (core + glow) * v_bright;',
    '  // Color: cool white to warm yellow based on temperature',
    '  vec3 cool = vec3(0.8, 0.85, 1.0);',
    '  vec3 warm = vec3(1.0, 0.9, 0.7);',
    '  vec3 col = mix(cool, warm, v_temp);',
    '  gl_FragColor = vec4(col * intensity, intensity);',
    '}'
  ].join('\n');

  // --- Shooting star shader (lines) ---
  var shootVS = [
    'attribute vec2 a_pos;',
    'attribute float a_alpha;',
    'varying float v_alpha;',
    'void main() {',
    '  gl_Position = vec4(a_pos * 2.0 - 1.0, 0.0, 1.0);',
    '  gl_Position.y *= -1.0;',
    '  v_alpha = a_alpha;',
    '}'
  ].join('\n');

  var shootFS = [
    'precision mediump float;',
    'varying float v_alpha;',
    'void main() {',
    '  gl_FragColor = vec4(0.9, 0.95, 1.0, v_alpha);',
    '}'
  ].join('\n');

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  function makeProgram(vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    return p;
  }

  var starProg = makeProgram(starVS, starFS);
  var shootProg = makeProgram(shootVS, shootFS);

  var starBuf = gl.createBuffer();
  var shootBuf = gl.createBuffer();

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  // stride: x, y, size, brightness, temp = 5 floats
  var starData = new Float32Array(NUM_STARS * 5);
  // Shooting star trail segments
  var shootData = new Float32Array(NUM_SHOOTERS * 6); // 2 verts * 3 floats each

  var lastShoot = 0;

  function draw(t) {
    var time = t * 0.001;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Update star twinkle
    for (var i = 0; i < NUM_STARS; i++) {
      var star = stars[i];
      var twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
      var brightness = star.brightness * (0.5 + 0.5 * twinkle);

      var j = i * 5;
      starData[j] = star.x;
      starData[j+1] = star.y;
      starData[j+2] = star.size;
      starData[j+3] = brightness;
      starData[j+4] = star.temp;
    }

    // Draw stars
    gl.useProgram(starProg);
    gl.bindBuffer(gl.ARRAY_BUFFER, starBuf);
    gl.bufferData(gl.ARRAY_BUFFER, starData, gl.DYNAMIC_DRAW);

    var aPos = gl.getAttribLocation(starProg, 'a_pos');
    var aSize = gl.getAttribLocation(starProg, 'a_size');
    var aBright = gl.getAttribLocation(starProg, 'a_brightness');
    var aTemp = gl.getAttribLocation(starProg, 'a_temp');
    gl.enableVertexAttribArray(aPos);
    gl.enableVertexAttribArray(aSize);
    gl.enableVertexAttribArray(aBright);
    gl.enableVertexAttribArray(aTemp);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 20, 0);
    gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 20, 8);
    gl.vertexAttribPointer(aBright, 1, gl.FLOAT, false, 20, 12);
    gl.vertexAttribPointer(aTemp, 1, gl.FLOAT, false, 20, 16);
    gl.uniform1f(gl.getUniformLocation(starProg, 'u_time'), time);
    gl.uniform2f(gl.getUniformLocation(starProg, 'u_res'), canvas.width, canvas.height);
    gl.uniform2f(gl.getUniformLocation(starProg, 'u_mouse'), mouse.x, mouse.y);
    gl.drawArrays(gl.POINTS, 0, NUM_STARS);
    gl.disableVertexAttribArray(aTemp);

    // Shooting stars
    if (time - lastShoot > 3 + Math.random() * 5) {
      for (var si = 0; si < NUM_SHOOTERS; si++) {
        if (!shooters[si].active) {
          spawnShooter(shooters[si]);
          lastShoot = time;
          break;
        }
      }
    }

    var shootCount = 0;
    for (var k = 0; k < NUM_SHOOTERS; k++) {
      var sh = shooters[k];
      if (!sh.active) continue;

      sh.life++;
      if (sh.life > sh.maxLife) {
        sh.active = false;
        continue;
      }

      var progress = sh.life / sh.maxLife;
      var alpha = progress < 0.1 ? progress / 0.1 : (1.0 - progress);
      alpha = Math.max(0, alpha * 0.8);

      var headX = sh.x + sh.vx * sh.life;
      var headY = sh.y + sh.vy * sh.life;
      var tailX = headX - sh.vx * sh.tailLen / 0.01;
      var tailY = headY - sh.vy * sh.tailLen / 0.01;

      var idx = shootCount * 6;
      shootData[idx] = tailX;
      shootData[idx+1] = tailY;
      shootData[idx+2] = 0;
      shootData[idx+3] = headX;
      shootData[idx+4] = headY;
      shootData[idx+5] = alpha;
      shootCount++;
    }

    if (shootCount > 0) {
      gl.useProgram(shootProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, shootBuf);
      gl.bufferData(gl.ARRAY_BUFFER, shootData.subarray(0, shootCount * 6), gl.DYNAMIC_DRAW);

      var sPos = gl.getAttribLocation(shootProg, 'a_pos');
      var sAlpha = gl.getAttribLocation(shootProg, 'a_alpha');
      gl.enableVertexAttribArray(sPos);
      gl.enableVertexAttribArray(sAlpha);
      gl.vertexAttribPointer(sPos, 2, gl.FLOAT, false, 12, 0);
      gl.vertexAttribPointer(sAlpha, 1, gl.FLOAT, false, 12, 8);
      gl.drawArrays(gl.LINES, 0, shootCount * 2);
      gl.disableVertexAttribArray(sAlpha);
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

})();
