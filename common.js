// 공통 도우미: 색 토큰, 퀴즈, 분류 활동
window.U = (function(){
  const $ = id => document.getElementById(id);
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const onTheme = fn => { const m = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)'); if (m && m.addEventListener) m.addEventListener('change', fn); };

  // 객관식 퀴즈: items = [{q, o:[...], a:정답번호, e:해설}]
  function quiz(boxId, scoreId, items){
    const box = $(boxId); let correct = 0, answered = 0;
    items.forEach((item, i) => {
      const div = document.createElement('div'); div.className = 'q';
      const p = document.createElement('p'); p.textContent = (i+1) + '. ' + item.q;
      const opts = document.createElement('div'); opts.className = 'opts';
      const fb = document.createElement('div'); fb.className = 'fb';
      item.o.forEach((t, j) => {
        const b = document.createElement('button'); b.textContent = '①②③④⑤'[j] + ' ' + t;
        b.addEventListener('click', () => {
          if (div.dataset.done) return; div.dataset.done = 1; answered++;
          const ok = j === item.a; if (ok) correct++;
          b.classList.add(ok ? 'right' : 'wrong'); opts.children[item.a].classList.add('right');
          fb.className = 'fb ' + (ok ? 'ok' : 'no'); fb.textContent = (ok ? '정답! ' : '오답. ') + item.e;
          if (answered === items.length) $(scoreId).textContent = '점수: ' + correct + ' / ' + items.length;
        });
        opts.appendChild(b);
      });
      div.append(p, opts, fb); box.appendChild(div);
    });
  }

  // 분류 활동: items = [{t:설명, a:정답 분류}], cats = [분류 이름...]
  function classify(boxId, items, cats){
    const box = $(boxId); box.classList.add('cls');
    const rows = items.map(it => {
      const row = document.createElement('div'); row.className = 'cls-row';
      const s = document.createElement('span'); s.textContent = it.t;
      const sel = document.createElement('select');
      sel.innerHTML = '<option value="">선택</option>' + cats.map(c => '<option>' + c + '</option>').join('');
      sel.addEventListener('change', () => row.classList.remove('right','wrong'));
      row.append(s, sel); box.appendChild(row);
      return {row, sel, a: it.a};
    });
    const btns = document.createElement('div'); btns.className = 'btns'; btns.style.marginTop = '8px';
    const chk = document.createElement('button'); chk.className = 'primary'; chk.textContent = '채점하기';
    const rst = document.createElement('button'); rst.textContent = '다시 하기';
    const fb = document.createElement('div'); fb.className = 'fb';
    chk.addEventListener('click', () => {
      let n = 0;
      rows.forEach(r => { const ok = r.sel.value === r.a; if (ok) n++; r.row.classList.remove('right','wrong'); r.row.classList.add(ok ? 'right' : 'wrong'); });
      fb.className = 'fb ' + (n === rows.length ? 'ok' : 'no');
      fb.textContent = n === rows.length ? '모두 맞혔어요! (' + n + '/' + rows.length + ')' : rows.length + '개 중 ' + n + '개 맞혔어요. 빨간 줄을 다시 생각해 보세요.';
    });
    rst.addEventListener('click', () => { rows.forEach(r => { r.sel.value = ''; r.row.classList.remove('right','wrong'); }); fb.className = 'fb'; });
    btns.append(chk, rst); box.after(btns); btns.after(fb);
  }

  return {$, css, onTheme, quiz, classify};
})();
