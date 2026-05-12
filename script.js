/* ── YEAR ── */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── NAV ── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');
const navOverlay = document.getElementById('navOverlay');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (navbar)       navbar.classList.toggle('scrolled', window.scrollY > 60);
  if (scrollTopBtn) scrollTopBtn.classList.toggle('show', window.scrollY > 300);
});

if (hamburger && navMobile) {
  hamburger.addEventListener('click', () => navMobile.classList.toggle('open'));
}
if (navOverlay && navMobile) {
  navOverlay.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navOverlay.classList.remove('open');
  });
}
document.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => {
    if (navMobile)  navMobile.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
  });
});

/* ── REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── SKILL BARS ── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skills-grid > div').forEach(el => skillObserver.observe(el));

/* ── TIMELINE ── */
const tlObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.2 });

function observeTimeline() {
  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.1) + 's';
    tlObserver.observe(el);
  });
}
observeTimeline();

/* ── QUALIFICATION TABS ── */
document.querySelectorAll('.qual-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.qual-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.qual-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.target);
    if (target) target.classList.add('active');
    setTimeout(observeTimeline, 50);
  });
});

/* ── STUDENT FORM MODAL ── */
window.openStudentForm = function () {
  const modal = document.getElementById('studentFormModal');
  if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
};
window.closeStudentForm = function () {
  const modal = document.getElementById('studentFormModal');
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
};
window.handleModalClick = function (e) {
  if (e.target === document.getElementById('studentFormModal')) closeStudentForm();
};
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeStudentForm(); });

/* ── STUDENT FORM VALIDATION ── */
const sfFields = {
  name:      { rules: ['required','minlen:2','alpha'] },
  dob:       { rules: ['required','date','notfuture'] },
  address:   { rules: ['required','minlen:5'] },
  hobby:     { rules: ['required','minlen:2'] },
  aim:       { rules: ['required','minlen:2'] },
  fatherOcc: { rules: ['required','minlen:2'] },
  motherOcc: { rules: ['required','minlen:2'] }
};

function sfRules(id, val) {
  for (const rule of sfFields[id].rules) {
    if (rule === 'required' && !val) return 'This field is required.';
    if (!val) continue;
    if (rule === 'minlen:2' && val.length < 2) return 'Minimum 2 characters.';
    if (rule === 'minlen:5' && val.length < 5) return 'Minimum 5 characters.';
    if (rule === 'alpha' && !/^[a-zA-Z\s'.,\-]+$/.test(val)) return 'Letters and basic punctuation only.';
    if (rule === 'date' && isNaN(new Date(val))) return 'Enter a valid date.';
    if (rule === 'notfuture') {
      const d = new Date(val);
      if (d > new Date()) return 'Date cannot be in the future.';
      const age = (new Date() - d) / (1000*60*60*24*365.25);
      if (age > 100 || age < 3) return 'Enter a realistic date of birth.';
    }
  }
  return null;
}

window.sfValidate = function (id) {
  const el = document.getElementById('sf-' + id); if (!el) return;
  const val = el.value.trim();
  const err = sfRules(id, val);
  const em  = document.getElementById('sf-' + id + '-err');
  el.classList.remove('err','ok');
  if (err)      { el.classList.add('err'); if (em) em.textContent = err; }
  else if (val) { el.classList.add('ok');  if (em) em.textContent = ''; }
  else if (em)    em.textContent = '';
  sfUpdateProgress();
};

function sfUpdateProgress() {
  let done = 0;
  Object.keys(sfFields).forEach(id => {
    const el = document.getElementById('sf-' + id);
    if (el && el.value.trim() && !sfRules(id, el.value.trim())) done++;
  });
  const prog = document.getElementById('sf-progress');
  if (prog) prog.textContent = done + ' / 7 fields complete';
}

function sfValidateAll() {
  let ok = true, first = null;
  Object.keys(sfFields).forEach(id => {
    const el = document.getElementById('sf-' + id); if (!el) return;
    const val = el.value.trim();
    const err = sfRules(id, val);
    const em  = document.getElementById('sf-' + id + '-err');
    el.classList.remove('err','ok');
    if (err) { ok = false; el.classList.add('err'); if (em) em.textContent = err; if (!first) first = el; }
    else     { el.classList.add('ok'); if (em) em.textContent = ''; }
  });
  if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return ok;
}

window.sfClear = function () {
  Object.keys(sfFields).forEach(id => {
    const el = document.getElementById('sf-' + id); if (!el) return;
    el.value = ''; el.classList.remove('err','ok');
    const em = document.getElementById('sf-' + id + '-err'); if (em) em.textContent = '';
  });
  ['sf-status-ok','sf-status-err'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
  sfUpdateProgress();
};

window.sfDownload = function () {
  ['sf-status-ok','sf-status-err'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
  if (!sfValidateAll()) { const e = document.getElementById('sf-status-err'); if (e) e.style.display = 'block'; return; }
  const g = id => document.getElementById('sf-' + id).value.trim();
  const name = g('name'), dob = g('dob'), address = g('address'),
        hobby = g('hobby'), aim = g('aim'), fOcc = g('fatherOcc'), mOcc = g('motherOcc');
  const fmtDate = v => new Date(v+'T00:00:00').toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, AlignmentType } = docx;
  const b = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
  const brs = { top:b, bottom:b, left:b, right:b };
  const mg  = { top:80, bottom:80, left:160, right:120 };
  const mkRow = (label, value) => new TableRow({ children: [
    new TableCell({ borders:brs, width:{size:2800,type:WidthType.DXA}, shading:{fill:'F5E4DA',type:ShadingType.CLEAR}, margins:mg,
      children:[new Paragraph({children:[new TextRun({text:label,bold:true,font:'Georgia',size:22,color:'C4622D'})]})] }),
    new TableCell({ borders:brs, width:{size:6560,type:WidthType.DXA}, margins:mg,
      children:[new Paragraph({children:[new TextRun({text:value,font:'Georgia',size:22})]})] })
  ]});
  const mkSec = title => new TableRow({ children: [new TableCell({
    borders:brs, columnSpan:2, width:{size:9360,type:WidthType.DXA}, shading:{fill:'1A1714',type:ShadingType.CLEAR}, margins:mg,
    children:[new Paragraph({children:[new TextRun({text:title,bold:true,font:'Georgia',size:22,color:'FFFFFF'})]})]
  })]});
  const doc2 = new Document({ sections:[{ properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440}}},
    children:[
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:120},children:[new TextRun({text:'Student Information Form',bold:true,font:'Georgia',size:40,color:'1A1714'})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:360},children:[new TextRun({text:'Shishir Bhattarai — Educator',font:'Georgia',size:22,color:'C4622D',italics:true})]}),
      new Table({width:{size:9360,type:WidthType.DXA},columnWidths:[2800,6560],rows:[
        mkSec('Personal Details'),mkRow('Full Name',name),mkRow('Date of Birth',fmtDate(dob)),mkRow('Address',address),
        mkSec('Interests & Aspirations'),mkRow('Hobby',hobby),mkRow('Aim / Career Goal',aim),
        mkSec('Family Background'),mkRow("Father's Occupation",fOcc),mkRow("Mother's Occupation",mOcc),
      ]}),
      new Paragraph({spacing:{before:480},alignment:AlignmentType.RIGHT,children:[new TextRun({
        text:'Generated on: '+new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}),
        font:'Georgia',size:18,color:'888780',italics:true})]})
    ]
  }]});
  Packer.toBlob(doc2).then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name.replace(/\s+/g,'_')+'_Information.docx';
    a.click(); URL.revokeObjectURL(url);
    const ok = document.getElementById('sf-status-ok');
    if (ok) { ok.style.display = 'block'; setTimeout(() => ok.style.display = 'none', 4000); }
  });
};

/* ── EMAILJS ── */
if (typeof emailjs !== 'undefined') emailjs.init("aKRqtcn0wmBtCi-Io");
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const st = document.getElementById('contact-status');
    if (st) { st.textContent = 'Sending…'; st.style.color = ''; }
    emailjs.send("service_c39cgfs","template_ll7ua5c",{
      user_name:  document.getElementById('cf-name').value,
      user_email: document.getElementById('cf-email').value,
      subject:    document.getElementById('cf-subject').value,
      message:    document.getElementById('cf-message').value
    }).then(() => {
      if (st) { st.textContent = 'Message sent! ✓'; st.style.color = '#2d6a2d'; }
      this.reset();
      setTimeout(() => { if (st) st.textContent = ''; }, 4000);
    }, () => {
      if (st) { st.textContent = 'Failed to send. Please try again.'; st.style.color = '#c0392b'; }
    });
  });
}

/* ── NOTES FILTER ── */
(function () {
  const tabs  = document.querySelectorAll('.notes-tab');
  const cards = document.querySelectorAll('.notes-card');
  const empty = document.getElementById('notesEmpty');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      let visible = 0;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.subject === filter;
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      if (empty) empty.style.display = visible === 0 ? 'flex' : 'none';
    });
  });
})();
