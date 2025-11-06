let selections = {};
let allData = {};
let isDarkMode = false;
let currentPage = 0;
let isPresetMode = false;

const pages = [
  {
    title: 'پرامپت آماده',
    desc: 'شروع سریع با سبک از پیش تعریف شده',
    icon: 'bolt',
    fields: [
      { id: 'presets', label: 'پرامپت آماده', file: 'presets.json', type: 'dropdown' }
    ]
  },
  {
    title: 'مشخصات سوژه',
    desc: 'اطلاعات اصلی تصویر',
    icon: 'person',
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
    icon: 'checkroom',
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
    icon: 'image',
    fields: [
      { id: 'backgrounds', label: 'پسزمینه', file: 'backgrounds.json', type: 'dropdown' },
      { id: 'propsObjects', label: 'اشیای همراه', file: 'propsObjects.json', type: 'dropdown' }
    ]
  },
  {
    title: 'تنظیمات فنی',
    desc: 'نور و دوربین',
    icon: 'camera_alt',
    fields: [
      { id: 'lighting', label: 'نورپردازی', file: 'lighting.json', type: 'dropdown' },
      { id: 'cameras', label: 'دوربین', file: 'cameras.json', type: 'dropdown' }
    ]
  },
  {
    title: 'سبک هنری',
    desc: 'استایل و فیلتر',
    icon: 'palette',
    fields: [
      { id: 'styles', label: 'سبک کلی', file: 'styles.json', type: 'dropdown' },
      { id: 'artisticFilters', label: 'فیلتر هنری', file: 'artisticFilters.json', type: 'dropdown' },
      { id: 'photoEra', label: 'دوره زمانی', file: 'photoEra.json', type: 'dropdown' }
    ]
  },
  {
    title: 'توضیحات نهایی',
    desc: 'جزئیات اضافی دلخواه',
    icon: 'edit_note',
    fields: [
      { id: 'customText', label: 'توضیحات سفارشی', type: 'textarea' }
    ]
  }
];

async function loadAllData() {
  try {
    for (const page of pages) {
      for (const field of page.fields) {
        if (field.file) {
          const response = await fetch(`./data/${field.file}`);
          if (response.ok) {
            allData[field.id] = await response.json();
          } else {
            console.error(`Failed to load ${field.file}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error loading data:', error);
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

function getDefaultLabel(fieldId, options) {
  if (!isPresetMode && options.length > 0) {
    const defaultOption = options.find(opt => opt.value && opt.value !== '');
    return defaultOption ? defaultOption.label : null;
  }
  return null;
}

const persianTranslations = {
  "Classic studio portrait with soft lighting and neutral background, professional retouching, sharp focus, smooth skin, detailed textures, natural color correction, DSLR quality, timeless aesthetic.": "پرتره استودیویی کلاسیک با نورپردازی نرم و پسزمینه خنثی، رتوش حرفهای، فوکوس تیز، پوست صاف، بافت جزئیات، تصحیح رنگ طبیعی، کیفیت DSLR، زیبایی جاودانه",
  "Outdoor portrait with natural light and shallow depth of field, vibrant colors, clear focus on subject, detailed environment blur, realistic skin tones, cinematic feel, professional outdoor photography.": "پرتره در فضای باز با نور طبیعی و عمق میدان کم، رنگهای پرجنب و جو، فوکوس واضح روی سوژه، محیط محو با جزئیات، تون پوست واقعی، حس سینمایی، عکاسی حرفهای فضای باز",
  "Dramatic portrait with high contrast and deep shadows, intense mood, strong facial expressions, artistic lighting, detailed textures, powerful aesthetic, professional black and white conversion.": "پرتره دراماتیک با کنتراست بالا و سایههای عمیق، حال و هوای شدید، حالات قوی چهره، نورپردازی هنری، بافت جزئیات، زیبایی قدرتمند، تبدیل حرفهای سیاه و سفید",
  "Artistic black and white portrait with precise textures and details, strong composition, emotional depth, fine film grain, classic monochrome look, professional studio setup, timeless art piece.": "پرتره هنری سیاه و سفید با بافت و جزئیات دقیق، ترکیب قوی، عمق عاطفی، دانه فیلم ظریف، ظاهر کلاسیک تک رنگ، نصب استودیو حرفهای، اثر هنری جاودانه",
  "Fashion portrait with modern styling and pop colors, bold lighting, dynamic pose, sleek background, vibrant aesthetic, high-end editorial look, professional fashion photography.": "پرتره فشن با استایلینگ مدرن و رنگهای پاپ، نورپردازی جسورانه، پوز پویا، پسزمینه شیک، زیبایی پرجنب و جو، ظاهر ادیتوریال بالارده، عکاسی فشن حرفهای"
};

function renderPage(pageIndex) {
  const page = pages[pageIndex];
  const container = document.getElementById('pageContainer');
  
  let html = `
    <div class="material-card p-4 mb-4">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center">
          <span class="material-icons text-white">${page.icon}</span>
        </div>
        <div>
          <h2 class="text-lg font-bold text-gray-900 mb-1">${page.title}</h2>
          <p class="text-gray-600 text-xs">${page.desc}</p>
        </div>
      </div>
      <div class="space-y-3">
  `;
  
  page.fields.forEach(field => {
    if (field.type === 'textarea') {
      html += `
        <div>
          <label class="block text-gray-700 text-sm font-medium mb-2">${field.label}</label>
          <textarea id="${field.id}" rows="3" class="w-full bg-white text-gray-900 p-3 rounded-lg border border-gray-300 focus:border-rose-500 outline-none transition-all text-sm" placeholder="مثال: یک پروانه روی شانه...">${selections[field.id] || ''}</textarea>
        </div>
      `;
    } else if (field.type === 'dropdown') {
      const options = filterByGenderAge(allData[field.id] || [], field.id);
      const defaultLabel = getDefaultLabel(field.id, options);
      html += `
        <div>
          <label class="block text-gray-700 text-sm font-medium mb-2">${field.label}${defaultLabel ? ` (پیشفرض: ${defaultLabel})` : ''}</label>
          <select id="${field.id}" class="w-full bg-white text-gray-900 p-3 rounded-lg border border-gray-300 focus:border-rose-500 outline-none transition-all cursor-pointer text-sm">
            ${options.map(opt => `<option value="${opt.value}" data-custom="${opt.needsCustom || false}" ${selections[field.id] === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
          </select>
          <div id="${field.id}_custom" class="mt-2 space-y-2 hidden">
            <input type="text" id="${field.id}_design" placeholder="طرح روی تیشرت" class="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:border-rose-500 outline-none text-sm">
            <input type="text" id="${field.id}_color" placeholder="رنگ تیشرت" class="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:border-rose-500 outline-none text-sm">
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
  document.getElementById('nextBtn').innerHTML = index === pages.length - 1 ? '<span>مشاهده پرامپت</span><span class="material-icons text-sm">check</span>' : '<span>بعدی</span><span class="material-icons text-sm">arrow_back</span>';
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
  const prompt = buildPrompt();
  document.getElementById('finalPrompt').value = prompt;
  
  // Show Persian translation if it's a preset prompt
  const persianDiv = document.getElementById('persianTranslation');
  const persianText = document.getElementById('persianText');
  
  if (isPresetMode && selections.presets && persianTranslations[selections.presets]) {
    persianText.textContent = persianTranslations[selections.presets];
    persianDiv.classList.remove('hidden');
  } else {
    persianDiv.classList.add('hidden');
  }
  
  document.getElementById('backBtn').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'none';
}

document.getElementById('nextBtn')?.addEventListener('click', () => {
  if (currentPage === pages.length - 1) {
    showResult();
  } else {
    if (isPresetMode && currentPage === 0 && selections.presets && selections.presets !== '') {
      showPage(pages.length - 1);
    } else {
      showPage(currentPage + 1);
    }
  }
});

document.getElementById('backBtn')?.addEventListener('click', () => {
  // If in preset mode and on last page, go back to preset page
  if (isPresetMode && currentPage === pages.length - 1) {
    showPage(0);
  }
  // If on first page of each mode, go back to choice page
  else if ((isPresetMode && currentPage === 0) || (!isPresetMode && currentPage === 1)) {
    document.getElementById('mainContent').classList.add('hidden');
    document.getElementById('choicePage').classList.remove('hidden');
    document.getElementById('bottomNav').classList.add('hidden');
    document.getElementById('backBtn').style.display = 'none';
  }
  // Otherwise go to previous page
  else {
    showPage(currentPage - 1);
  }
});

document.getElementById('copyBtn')?.addEventListener('click', () => {
  const prompt = document.getElementById('finalPrompt').value;
  navigator.clipboard.writeText(prompt);
  document.getElementById('copyBtn').innerHTML = '<span class="material-icons text-sm">check</span> کپی شد';
  setTimeout(() => document.getElementById('copyBtn').innerHTML = '<span class="material-icons text-sm">content_copy</span> کپی', 2000);
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
  document.getElementById('backBtn').style.display = 'block';
  showPage(pages.length - 1);
});

document.getElementById('restartBtn')?.addEventListener('click', () => {
  selections = {};
  currentPage = 0;
  isPresetMode = false;
  document.getElementById('resultPage').classList.add('hidden');
  document.getElementById('mainContent').classList.add('hidden');
  document.getElementById('choicePage').classList.remove('hidden');
  document.getElementById('bottomNav').classList.add('hidden');
  document.getElementById('backBtn').style.display = 'none';
});

document.getElementById('themeToggle')?.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode');
  document.getElementById('themeToggle').innerHTML = isDarkMode ? '<span class="material-icons">light_mode</span>' : '<span class="material-icons">dark_mode</span>';
});

document.getElementById('downloadImageBtn')?.addEventListener('click', () => {
  const prompt = document.getElementById('finalPrompt').value;
  
  // Determine theme colors based on selections
  let gradientStart, gradientEnd, accentColor;
  
  const gender = selections.gender || '';
  const age = selections.ageGroup || '';
  
  if (age.includes('child') || age.includes('کودک')) {
    // Playful colors for children
    gradientStart = '#ff6b6b';
    gradientEnd = '#feca57';
    accentColor = '#fff59d';
  } else if (gender.includes('female') || gender.includes('زن')) {
    // Elegant feminine colors
    gradientStart = '#c2185b';
    gradientEnd = '#7b1fa2';
    accentColor = '#f8bbd0';
  } else if (gender.includes('male') || gender.includes('مرد')) {
    // Strong masculine colors
    gradientStart = '#1565c0';
    gradientEnd = '#0d47a1';
    accentColor = '#90caf9';
  } else {
    // Neutral colors
    gradientStart = '#455a64';
    gradientEnd = '#263238';
    accentColor = '#b0bec5';
  }
  
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  
  // Dynamic gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, gradientStart);
  gradient.addColorStop(1, gradientEnd);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Header
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 70px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('پرامپت ساز حرفه‌ای', canvas.width / 2, 120);
  
  // Subtitle
  ctx.fillStyle = accentColor;
  ctx.font = '40px Arial';
  ctx.fillText('Sapra Pro', canvas.width / 2, 190);
  
  // Card background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.roundRect(60, 270, canvas.width - 120, canvas.height - 450, 20);
  ctx.fill();
  
  // Prompt text - larger font
  ctx.fillStyle = '#ffffff';
  ctx.font = '36px Arial';
  ctx.textAlign = 'left';
  
  const maxWidth = canvas.width - 160;
  const lineHeight = 55;
  const words = prompt.split(' ');
  let line = '';
  let y = 350;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, 100, y);
      line = words[i] + ' ';
      y += lineHeight;
      if (y > canvas.height - 250) break;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 100, y);
  
  // Footer
  ctx.fillStyle = accentColor;
  ctx.font = '28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Developed by Amin Naseri Karimvand', canvas.width / 2, canvas.height - 80);
  ctx.fillText('akarimvand@gmail.com', canvas.width / 2, canvas.height - 40);
  
  // Selection details box
  y += 80;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.roundRect(60, y, canvas.width - 120, 300, 20);
  ctx.fill();
  
  // Selection details title
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('انتخابهای شما', canvas.width / 2, y + 50);
  
  // Selection details
  ctx.fillStyle = '#ffffff';
  ctx.font = '28px Arial';
  ctx.textAlign = 'right';
  let detailY = y + 100;
  
  const details = [];
  if (selections.gender) details.push(`جنسیت: ${allData.gender?.find(g => g.value === selections.gender)?.label || ''}`);
  if (selections.ageGroup) details.push(`سن: ${allData.ageGroup?.find(a => a.value === selections.ageGroup)?.label || ''}`);
  if (selections.clothing) details.push(`لباس: ${allData.clothing?.find(c => c.value === selections.clothing)?.label || ''}`);
  if (selections.backgrounds) details.push(`پسزمینه: ${allData.backgrounds?.find(b => b.value === selections.backgrounds)?.label || ''}`);
  
  details.slice(0, 4).forEach(detail => {
    ctx.fillText(detail, canvas.width - 100, detailY);
    detailY += 45;
  });
  
  // Download
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sapra-prompt-' + Date.now() + '.png';
    a.click();
    URL.revokeObjectURL(url);
  });
});

document.getElementById('presetChoice')?.addEventListener('click', () => {
  isPresetMode = true;
  document.getElementById('choicePage').classList.add('hidden');
  document.getElementById('mainContent').classList.remove('hidden');
  document.getElementById('bottomNav').classList.remove('hidden');
  document.getElementById('backBtn').style.display = 'block';
  showPage(0);
});

document.getElementById('customChoice')?.addEventListener('click', () => {
  isPresetMode = false;
  document.getElementById('choicePage').classList.add('hidden');
  document.getElementById('mainContent').classList.remove('hidden');
  document.getElementById('bottomNav').classList.remove('hidden');
  document.getElementById('backBtn').style.display = 'block';
  showPage(1);
});

async function initApp() {
  await loadAllData();
  setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('fade-out');
    setTimeout(() => document.getElementById('loadingScreen').remove(), 500);
  }, 2500);
}

initApp();
