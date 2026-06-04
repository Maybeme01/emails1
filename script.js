document.addEventListener('DOMContentLoaded', () => {
    // مصفوفة حفظ البيانات التراكمية
    let allData = [];

    // جلب عناصر واجهة المستخدم
    const accountsInput = document.getElementById('accounts-input');
    const netflixPassContainer = document.getElementById('netflix-pass-container');
    const netflixPassInput = document.getElementById('netflix_pass');
    const btnProcess = document.getElementById('btn-process');
    const btnClear = document.getElementById('btn-clear');
    const btnCopy = document.getElementById('btn-copy');
    const outputPreview = document.getElementById('output-preview');
    const lineCountSpan = document.getElementById('line-count');
    const serviceRadios = document.querySelectorAll('input[name="service"]');

    // مصفوفة بروفايلات نتفليكس الثابتة
    const netflixProfiles = [
        { num: "1", code: "1789" },
        { num: "2", code: "2890" },
        { num: "3", code: "3309" },
        { num: "4", code: "4204" },
        { num: "5", code: "6510" }
    ];

    // إظهار حقل الباسورد فقط عند اختيار خدمة نتفليكس
    serviceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'netflix') {
                netflixPassContainer.classList.remove('hidden');
            } else {
                netflixPassContainer.classList.add('hidden');
            }
        });
    });

    // دالة استخراج الأرقام من النصوص (Regex)
    function extractNumber(email) {
        const match = email.match(/\d+/);
        return match ? match[0] : "";
    }

    // معالجة النصوص المستلمة من الـ Textarea وإخراج الصيغة المطلوبة
    function processInputText(textValue, serviceType, netflixPass) {
        const lines = textValue.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const results = [];

        lines.forEach(entry => {
            if (serviceType === 'shahid') {
                const password = "Aa123123";
                for (let p_num = 1; p_num <= 4; p_num++) {
                    results.push(`الايميل: ${entry} | كلمة المرور: ${password} | بروفايل ${p_num}`);
                }
            } 
            else if (serviceType === 'netflix') {
                let password = "";
                // إذا كتب المستخدم باسورد يتم اعتماده، وإذا تركه فارغاً يتم توليده تلقائياً برقم الإيميل كما في الكود الأساسي
                if (netflixPass) {
                    password = netflixPass;
                } else {
                    const numPart = extractNumber(entry);
                    password = `Aa1122334455@@${numPart}`;
                }
                
                netflixProfiles.forEach(p => {
                    results.push(`الايميل: ${entry} | كلمة المرور: ${password} | بروفايل ${p.num} | رمز البروفايل ${p.code}`);
                });
            } 
            else if (serviceType === 'osn') {
                for (let p_num = 1; p_num <= 5; p_num++) {
                    results.push(`الايميل: ${entry} | بروفايل ${p_num} | @fuc217bot تواصل مع بوت التيليجرام للحصول على الكود`);
                }
            }
        });

        return results;
    }

    // زر بدء معالجة المدخلات وتوليد السطور المخصصة
    btnProcess.addEventListener('click', () => {
        const textValue = accountsInput.value.trim();
        if (!textValue) {
            alert("حط ايميلات اول شي يا حمار");
            return;
        }

        const selectedService = document.querySelector('input[name="service"]:checked').value;
        const netflixPass = netflixPassInput.value.trim();

        // معالجة البيانات الحالية وإضافتها تراكمياً
        const newProcessedData = processInputText(textValue, selectedService, netflixPass);
        allData = allData.concat(newProcessedData);

        // عرض النتائج بلونها البنفسجي وتحديث كاونتر الأسطر
        outputPreview.value = allData.join('\n');
        lineCountSpan.textContent = allData.length;

        // تفعيل زر النسخ الكلي
        if (allData.length > 0) {
            btnCopy.disabled = false;
        }
    });

    // ميزة نسخ جميع النتائج الحالية إلى الحافظة بضغطة زر واحدة
    btnCopy.addEventListener('click', () => {
        if (allData.length === 0) return;
        
        navigator.clipboard.writeText(outputPreview.value)
            .then(() => {
                const originalText = btnCopy.textContent;
                btnCopy.textContent = "✅ تم نسخ القائمة كاملة!";
                btnCopy.style.background = "#00e676";
                btnCopy.style.color = "#032b16";
                
                setTimeout(() => {
                    btnCopy.textContent = originalText;
                    btnCopy.style.background = "var(--copy-btn)";
                    btnCopy.style.color = "white";
                }, 2000);
            })
            .catch(err => {
                console.error("فشل في نسخ النص: ", err);
            });
    });

    // تفريغ ومسح البيانات وإعادة تعيين الواجهة بالكامل لبدء عملية جديدة
    btnClear.addEventListener('click', () => {
        allData = [];
        accountsInput.value = "";
        outputPreview.value = "";
        lineCountSpan.textContent = "0";
        netflixPassInput.value = "";
        btnCopy.disabled = true;
    });
});