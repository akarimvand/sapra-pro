let selections = {};
let allData = {};
let isDarkMode = true;
let currentPage = 0;

const pages = [
  {
    title: 'پرامپت آماده',
    desc: 'شروع سریع با سبک از پیش تعریف شده',
    icon: 'fa-bolt',
    fields: [
      { id: 'presets', label: 'پرامپت آماده', file: 'presets.json', type: 'dropdown' }
    ]
  },
  {
    title: 'مشخصات سوژه',
    desc: 'اطلاعات اصلی تصویر',
    icon: 'fa-user',
    fields: [
      { id: 'photoSubject', label: 'تعداد افراد', file: 'photoSubject.json', type: 'dropdown' },
      { id: 'gender', label: 'جنسیت', file: 'gender.json', type: 'dropdown' },
      { id: 'ageGroup', label: 'گروه سنی', file: 'ageGroup.json', type: 'dropdown' },
      { id: 'framing', label: 'کادربندی', file: 'framing.json', type: 'dropdown' },
      { id: 'facialExpressions', label: 'حالت چهره', file: 'facialExpressions.json', type: 'dropdown' }
    ]
  },
  {
    title: 'ظاهر و پوشش',
    desc: 'استایل و لباس',
    icon: 'fa-shirt',
    fields: [
      { id: 'hairStyles', label: 'مدل مو', file: 'hairStyles.json', type: 'dropdown' },
      { id: 'makeup', label: 'آرایش', file: 'makeup.json', type: 'dropdown' },
      { id: 'clothing', label: 'لباس', file: 'clothing.json', type: 'dropdown' },
      { id: 'accessories', label: 'اکسسوری', file: 'accessories.json', type: 'dropdown' }
    ]
  },
  {
    title: 'محیط و صحنه',
    desc: 'پسزمینه و اشیاء',
    icon: 'fa-image',
    fields: [
      { id: 'backgrounds', label: 'پسزمینه', file: 'backgrounds.json', type: 'dropdown' },
      { id: 'propsObjects', label: 'اشیای همراه', file: 'propsObjects.json', type: 'dropdown' }
    ]
  },
  {
    title: 'تنظیمات فنی',
    desc: 'نور و دوربین',
    icon: 'fa-camera',
    fields: [
      { id: 'lighting', label: 'نورپردازی', file: 'lighting.json', type: 'dropdown' },
      { id: 'cameras', label: 'دوربین', file: 'cameras.json', type: 'dropdown' }
    ]
  },
  {
    title: 'سبک هنری',
    desc: 'استایل و فیلتر',
    icon: 'fa-palette',
    fields: [
      { id: 'styles', label: 'سبک کلی', file: 'styles.json', type: 'dropdown' },
      { id: 'artisticFilters', label: 'فیلتر هنری', file: 'artisticFilters.json', type: 'dropdown' },
      { id: 'photoEra', label: 'دوره زمانی', file: 'photoEra.json', type: 'dropdown' }
    ]
  },
  {
    title: 'توضیحات نهایی',
    desc: 'جزئیات اضافی دلخواه',
    icon: 'fa-pen',
    fields: [
      { id: 'customText', label: 'توضیحات سفارشی', type: 'textarea' }
    ]
  }
];

async function loadAllData() {
  for (const page of pages) {
    for (const field of page.fields) {
      if (field.file) {
        const response = await fetch(`./data/${field.file}`);
        allData[field.id] = await response.json();
      }
    }
  }
}

function filterByGenderAge(options, fieldId) {
  if (!['clothing', 'accessories', 'makeup', 'hairStyles'].includes(fieldId)) return options;
  const gender = selections.gender || '';
  const age = selections.ageGroup || '';
  return options.filter(opt => {
    if (!opt.gender) return true;
    if (age.includes('child') || age.includes('کودک')) return opt.gender === 'child' || opt.gender === 'unisex';
    if (gender.includes('male') || gender.includes('مرد')) return opt.gender === 'male' || opt.gender === 'unisex';
    if (gender.includes('female') || gender.includes('زن')) return opt.gender === 'female' || opt.gender === 'unisex';
    return true;
  });
}

function renderPage(pageIndex) {
  const page = pages[pageIndex];
  const container = document.getElementById('pageContainer');
  
  let html = `
    <div class="glass-dark rounded-3xl p-8 mb-6 card-hover">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <i class="fas ${page.icon} text-white text-2xl"></i>
        </div>
        <div>
          <h2 class="text-3xl font-black text-white mb-1">${page.title}</h2>
          <p class="text-gray-400 text-sm">${page.desc}</p>
        </div>
      </div>
      <div class="space-y-4">
  `;
  
  page.fields.forEach(field => {
    if (field.type === 'textarea') {
      html += `
        <div class="glass rounded-2xl p-4">
          <label class="block text-white text-sm font-bold mb-3 flex items-center gap-2">
            <i class="fas fa-comment-dots text-indigo-400"></i>
            ${field.label}
          </label>
          <textarea id="${field.id}" rows="4" class="w-full bg-slate-900/50 text-white p-4 rounded-xl border border-slate-700/50 focus:border-indigo-500 outline-none transition-all" placeholder="مثال: یک پروانه روی شانه، نور غروب از پشت سر...">${selections[field.id] || ''}</textarea>
        </div>
      `;
    } else if (field.type === 'dropdown') {
      const options = filterByGenderAge(allData[field.id] || [], field.id);
      html += `
        <div class="glass rounded-2xl p-4">
          <label class="block text-white text-sm font-bold mb-3 flex items-center gap-2">
            <i class="fas fa-list text-indigo-400"></i>
            ${field.label}
          </label>
          <select id="${field.id}" class="w-full bg-slate-900/50 text-white p-4 rounded-xl border border-slate-700/50 focus:border-indigo-500 outline-none transition-all cursor-pointer">
            ${options.map(opt => `<option value="${opt.value}" data-custom="${opt.needsCustom || false}" ${selections[field.id] === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
          </select>
          <div id="${field.id}_custom" class="mt-3 space-y-2 hidden">
            <input type="text" id="${field.id}_design" placeholder="طرح یا متن روی تیشرت" class="w-full bg-slate-900/50 text-white p-3 rounded-xl border border-slate-700/50 focus:border-indigo-500 outline-none">
            <input type="text" id="${field.id}_color" placeholder="رنگ تیشرت" class="w-full bg-slate-900/50 text-white p-3 rounded-xl border border-slate-700/50 focus:border-indigo-500 outline-none">
          </div>
        </div>
      `;
    }
  });
  
  html += `</div></div>`;
  container.innerHTML = html;
  
  // Attach event listeners
  page.fields.forEach(field => {
    if (field.type === 'dropdown' && field.id === 'clothing') {
      const select = document.getElementById(field.id);
      select?.addEventListener('change', (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const needsCustom = selectedOption.dataset.custom === 'true';
        const customDiv = document.getElementById(`${field.id}_custom`);
        if (needsCustom) {
          customDiv?.classList.remove('hidden');
        } else {
          customDiv?.classList.add('hidden');
        }
        
        if (e.target.value === 'TSHIRT_CUSTOM') {
          const design = document.getElementById(`${field.id}_design`)?.value || '';
          const color = document.getElementById(`${field.id}_color`)?.value || '';
          selections[field.id] = `wearing a ${color} t-shirt with ${design} design and blue jeans`;
        } else {
          selections[field.id] = e.target.value;
        }
      });
      
      document.getElementById(`${field.id}_design`)?.addEventListener('input', () => {
        const design = document.getElementById(`${field.id}_design`)?.value || '';
        const color = document.getElementById(`${field.id}_color`)?.value || 'casual';
        selections[field.id] = `wearing a ${color} t-shirt with ${design} design and blue jeans`;
      });
      
      document.getElementById(`${field.id}_color`)?.addEventListener('input', () => {
        const design = document.getElementById(`${field.id}_design`)?.value || '';
        const color = document.getElementById(`${field.id}_color`)?.value || 'casual';
        selections[field.id] = `wearing a ${color} t-shirt with ${design} design and blue jeans`;
      });
    } else if (field.type === 'dropdown') {
      document.getElementById(field.id)?.addEventListener('change', (e) => {
        selections[field.id] = e.target.value;
      });
    } else if (field.type === 'textarea') {
      document.getElementById(field.id)?.addEventListener('input', (e) => {
        selections[field.id] = e.target.value;
      });
    }
  });
}

function updateProgress() {
  const progress = ((currentPage + 1) / pages.length) * 100;
  document.getElementById('progress').style.width = progress + '%';
  document.getElementById('stepCounter').textContent = `${currentPage + 1}/${pages.length}`;
}

function showPage(index) {
  currentPage = index;
  renderPage(index);
  updateProgress();
  document.getElementById('backBtn').style.display = index > 0 ? 'block' : 'none';
  document.getElementById('nextBtn').innerHTML = index === pages.length - 1 ? '<span>مشاهده پرامپت</span><i class="fas fa-check"></i>' : '<span>بعدی</span><i class="fas fa-arrow-left"></i>';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function buildPrompt() {
  let parts = ['Transform the attached image into a professional portrait while preserving the subject\'s identity and facial features with absolute accuracy.', 'Enhance image quality, remove imperfections, and apply the following specifications:'];
  
  Object.keys(selections).forEach(key => {
    if (selections[key] && key !== 'customText') parts.push(selections[key]);
  });
  
  if (selections.customText?.trim()) parts.push(`Additional details: ${selections.customText.trim()}`);
  
  parts.push('High resolution, sharp focus, professional photography, 8K quality.');
  return parts.filter(Boolean).join(' ');
}

function showResult() {
  document.getElementById('mainContent').classList.add('hidden');
  document.getElementById('resultPage').classList.remove('hidden');
  document.getElementById('finalPrompt').value = buildPrompt();
  document.getElementById('backBtn').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'none';
}

document.getElementById('nextBtn')?.addEventListener('click', () => {
  if (currentPage === pages.length - 1) {
    showResult();
  } else {
    if (currentPage === 0 && selections.presets && selections.presets !== '') {
      showPage(pages.length - 1);
    } else {
      showPage(currentPage + 1);
    }
  }
});

document.getElementById('backBtn')?.addEventListener('click', () => {
  if (currentPage > 0) showPage(currentPage - 1);
});

document.getElementById('copyBtn')?.addEventListener('click', () => {
  const prompt = document.getElementById('finalPrompt').value;
  navigator.clipboard.writeText(prompt);
  document.getElementById('copyBtn').innerHTML = '<i class="fas fa-check"></i> کپی شد';
  setTimeout(() => document.getElementById('copyBtn').innerHTML = '<i class="fas fa-copy"></i> کپی', 2000);
});

document.getElementById('shareBtn')?.addEventListener('click', async () => {
  const prompt = document.getElementById('finalPrompt').value;
  if (navigator.share) {
    await navigator.share({ title: 'پرامپت من', text: prompt });
  }
});

document.getElementById('editBtn')?.addEventListener('click', () => {
  document.getElementById('resultPage').classList.add('hidden');
  document.getElementById('mainContent').classList.remove('hidden');
  document.getElementById('nextBtn').style.display = 'block';
  showPage(currentPage);
});

document.getElementById('restartBtn')?.addEventListener('click', () => {
  selections = {};
  currentPage = 0;
  document.getElementById('resultPage').classList.add('hidden');
  document.getElementById('mainContent').classList.remove('hidden');
  document.getElementById('nextBtn').style.display = 'block';
  showPage(0);
});

document.getElementById('themeToggle')?.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('light-mode');
  document.getElementById('themeToggle').textContent = isDarkMode ? '🌙' : '☀️';
});

setTimeout(() => {
  document.getElementById('loadingScreen').classList.add('fade-out');
  setTimeout(() => document.getElementById('loadingScreen').remove(), 500);
}, 2500);

loadAllData().then(() => showPage(0));
