  (function () {
    let lastPos = null;
    let lastAngle = null;
    let wiggleCount = 0;
    let totalMoves = 0;
    let verified = false;

    const MIN_WIGGLES = 3;
    const MIN_TOTAL_MOVES = 10;
    const MIN_WIGGLE_RATIO = 0.15;

    // Create checkbox UI
    const container = document.createElement('div');
    container.style.cssText = `
      display:inline-flex;align-items:center;
      padding:10px 15px;background:#f9f9f9;
      border:1px solid #ccc;border-radius:8px;
      font-family:sans-serif;user-select:none;`;
    container.innerHTML = `
      <input type="checkbox" id="humanCheck" style="width:20px;height:20px;margin-right:10px;cursor:pointer;">
      <label id="captchaLabel" for="humanCheck">I'm not a robot</label>
      <input type="hidden" id="captchaToken" name="captcha_token">
    `;
    document.getElementById('myForm').prepend(container);

    const checkbox = document.getElementById('humanCheck');
    const label = document.getElementById('captchaLabel');
    const tokenField = document.getElementById('captchaToken');

    function getAngle(p1, p2) {
      return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
    }

    document.addEventListener('mousemove', (e) => {
      const currentPos = { x: e.clientX, y: e.clientY };
      if (lastPos) {
        const angle = getAngle(lastPos, currentPos);
        if (lastAngle !== null) {
          const angleDiff = Math.abs(angle - lastAngle);
          if (angleDiff > 20 && angleDiff < 340) {
            wiggleCount++;
          }
        }
        lastAngle = angle;
        totalMoves++;
      }
      lastPos = currentPos;
    });

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        const wiggleRatio = wiggleCount / totalMoves;
        if (
          totalMoves >= MIN_TOTAL_MOVES &&
          wiggleCount >= MIN_WIGGLES &&
          wiggleRatio > MIN_WIGGLE_RATIO
        ) {
          verified = true;
          label.textContent = '✔ Verified';
          label.style.color = 'green';
          tokenField.value = btoa(Date.now().toString());
        } else {
          verified = false;
          checkbox.checked = false;
          label.textContent = 'Verification failed - move mouse naturally';
          label.style.color = 'red';
        }
      } else {
        verified = false;
        tokenField.value = '';
        label.textContent = "I'm not a robot";
        label.style.color = 'black';
      }
    });

    document.getElementById('myForm').addEventListener('submit', (e) => {
      if (!verified) {
        e.preventDefault();
        alert('Please verify you are human before submitting.');
      }
    });
  })();
