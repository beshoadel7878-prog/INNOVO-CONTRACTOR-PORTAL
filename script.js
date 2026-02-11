const THEME_KEY = 'innovo-theme';
const LANGUAGE_KEY = 'innovo-lang';
const rootElement = document.documentElement;
const themeToggles = Array.from(document.querySelectorAll('[data-theme-toggle]'));
const lockedTheme = rootElement.dataset.themeLock;
let languageOverlay = document.getElementById('language-overlay');
let languageLinks = Array.from(document.querySelectorAll('[data-language-select]'));
let languageShowTimer = null;
let mobileToggle = document.querySelector('[data-menu-toggle]');
let mobilePanel = document.getElementById('mobile-panel');
const defaultTitle = document.title;

function isHomePage() {
    const path = window.location.pathname.toLowerCase();
    return path.endsWith('index.html') || path === '/' || path === '';
}

function updateThemeToggle(theme) {
    if (!themeToggles.length) return;
    const isArabic = document.documentElement.lang === 'ar';
    const label = theme === 'dark'
        ? (isArabic ? 'الوضع الفاتح' : 'Light Mode')
        : (isArabic ? 'الوضع الداكن' : 'Dark Mode');
    themeToggles.forEach((toggle) => {
        toggle.textContent = label;
        toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    });
}

const translations = {
    en: {},
    ar: {
        common: {
            "nav.back_home": "العودة للرئيسية",
            "nav.back_dashboard": "العودة للوحة البوابة",
            "nav.main_portal": "البوابة الرئيسية",
            "nav.site_entry": "دخول الموقع",
            "nav.documents": "المستندات",
            "nav.safety": "السلامة",
            "nav.payment_claims": "المطالبات المالية",
            "nav.choose_language": "اختر اللغة"
        },
        index: {
            title: "بوابة المقاولين | Innovo",
            "hero.title_main": "بوابة",
            "hero.title_accent": " المقاولين",
            "hero.subtitle": "دليلك الرقمي لدخول الموقع: قواعد السلامة، المستندات، والفيديوهات المهمة.",
            "hero.enter_portal": "دخول البوابة",
            "hero.payment_claims": "المطالبات المالية",
            "search.title": "ابحث في البوابة",
            "search.placeholder": "ابحث عن السلامة، المستندات، المطالبات...",
            "search.button": "بحث",
            "search.payment_claims": "المطالبات المالية",
            "section.portal.title": "مناطق البوابة",
            "section.portal.subtitle": "كل ما تحتاجه للوصول الآمن والمتوافق والسريع للموقع.",
            "section.portal.site_entry.label": "دخول الموقع",
            "section.portal.site_entry.title": "قواعد السلامة وخطوات الدخول",
            "section.portal.site_entry.copy": "أهم القواعد، متطلبات معدات الوقاية، وتعليمات الدخول اليومية.",
            "section.portal.documents.label": "المستندات",
            "section.portal.documents.title": "أدلة وتحميلات",
            "section.portal.documents.copy": "سياسات، نماذج، وقوائم فحص معتمدة جاهزة للاستخدام.",
            "section.portal.hse.label": "السلامة والصحة",
            "section.portal.hse.title": "السلامة ودعم الحوادث",
            "section.portal.hse.copy": "إجراءات، بلاغات، وأفضل ممارسات أثناء العمل في الموقع."
        },
        dashboard: {
            title: "لوحة البوابة الرئيسية | Innovo",
            "header.title": "لوحة البوابة الرئيسية",
            "header.subtitle": "كل ما تحتاجه للعمل بأمان والبقاء على توافق مع Innovo. اضغط على البطاقة لفتح الصفحة.",
            "cards.site_entry.tag": "دخول الموقع",
            "cards.site_entry.title": "دخول الموقع",
            "cards.site_entry.item1": "قواعد السلامة + معدات الوقاية",
            "cards.site_entry.item2": "ساعات العمل",
            "cards.site_entry.item3": "أرقام الطوارئ + خريطة الموقع",
            "cards.access.tag": "الدخول",
            "cards.access.title": "الدخول والتحقق",
            "cards.access.item1": "خطوات الدخول",
            "cards.access.item2": "قائمة التحقق",
            "cards.access.item3": "خرائط الدخول",
            "cards.documents.tag": "المستندات",
            "cards.documents.title": "المستندات والإرشادات",
            "cards.documents.item1": "الإجراءات والسياسات",
            "cards.documents.item2": "ملفات PDF ورسومات",
            "cards.documents.item3": "مركز التنزيل",
            "cards.payment.tag": "المدفوعات",
            "cards.payment.title": "المدفوعات",
            "cards.payment.item1": "تقديم مطالبات الدفع",
            "cards.payment.item2": "المستندات المطلوبة",
            "cards.payment.item3": "مواعيد التسليم النهائية",
            "cards.safety.tag": "السلامة",
            "cards.safety.title": "السلامة",
            "cards.safety.item1": "إجراءات السلامة",
            "cards.safety.item2": "معدات الوقاية المطلوبة",
            "cards.safety.item3": "الإبلاغ عن الحوادث ومشكلات السلامة",
            "cards.training.tag": "التدريب",
            "cards.training.title": "التدريب",
            "cards.training.item1": "وحدات تدريب قصيرة (2-5 دقائق)",
            "cards.training.item2": "تتبع الإقرار والتوقيع",
            "cards.training.item3": "محتوى تعريف العمال الجدد",
            "cards.issue.tag": "المشكلات والملاحظات",
            "cards.issue.title": "المشكلات والملاحظات",
            "cards.issue.item1": "اسأل مدير المشروع/المشرف في Innovo مع صورة",
            "cards.issue.item2": "مخاوف السلامة المجهولة",
            "cards.issue.item3": "الإبلاغ السريع عن مشكلات الموقع",
            "cards.quality.tag": "الجودة",
            "cards.quality.title": "متطلبات الجودة",
            "cards.quality.item1": "عملية التفتيش",
            "cards.quality.item2": "قوائم الفحص + قواعد العيوب",
            "cards.quality.item3": "اعتماد المواد",
            "cards.howto.tag": "كيف تفعل",
            "cards.howto.title": "طريقة تنفيذ الأمور",
            "cards.howto.item1": "حجز تفتيش",
            "cards.howto.item2": "إدخال المعدات",
            "cards.howto.item3": "طلب تصريح",
            "cards.videos.tag": "الفيديوهات",
            "cards.videos.title": "الفيديوهات",
            "cards.videos.item1": "شاهد فيديوهات دقيقة واحدة",
            "cards.videos.item2": "سلامة + إرشادات",
            "quick_help.title": "مساعدة سريعة",
            "quick_help.subtitle": "إجابات سريعة بدون أوراق.",
            "quick_help.forms.title": "النماذج والقوالب",
            "quick_help.forms.item1": "نموذج طلب تصريح",
            "quick_help.forms.item2": "نموذج طلب تفتيش",
            "quick_help.forms.item3": "نموذج بلاغ حادث",
            "quick_help.contact.title": "التواصل والمساعدة",
            "quick_help.contact.item1": "هاتف مشرف الموقع",
            "quick_help.contact.item2": "مسؤول السلامة",
            "quick_help.contact.item3": "خط واتساب للمساعدة",
            "quick_help.announcements.title": "الإعلانات",
            "quick_help.announcements.item1": "تحديثات البوابات والدخول",
            "quick_help.announcements.item2": "تغييرات ساعات العمل",
            "quick_help.announcements.item3": "تنبيهات عامة للموقع",
            "quick_help.faq.title": "أسئلة شائعة",
            "quick_help.faq.item1": "أين أذهب لهذا الأمر؟",
            "quick_help.faq.item2": "كيف أقدم المطالبة؟",
            "quick_help.faq.item3": "ما المطلوب قبل الدخول؟"
        },
        site_entry: {
            title: "دخول الموقع | Innovo",
            "header.title": "دخول الموقع",
            "header.subtitle": "أهم النقاط قبل الدخول إلى الموقع.",
            "sections.safety_rules.title": "قواعد السلامة",
            "sections.safety_rules.item1": "سجّل الدخول والخروج يوميًا.",
            "sections.safety_rules.item2": "التزم بمنطقة العمل المخصصة.",
            "sections.safety_rules.item3": "اتبع مسارات المرور ومناطق الحظر.",
            "sections.safety_rules.item4": "حافظ على الممرات نظيفة.",
            "sections.ppe.title": "معدات الوقاية المطلوبة",
            "sections.ppe.item1": "خوذة + جزمة أمان + سترة عاكسة.",
            "sections.ppe.item2": "نظارات وقفازات حسب المهمة.",
            "sections.ppe.item3": "حماية السمع في المناطق المزعجة.",
            "sections.ppe.item4": "كمامة عند وجود غبار أو أبخرة.",
            "sections.hours.title": "ساعات العمل",
            "sections.hours.item1": "سجّل في البوابة قبل بدء الوردية.",
            "sections.hours.item2": "التزم بمواعيد بداية ونهاية العمل.",
            "sections.hours.item3": "لا عمل خارج الساعات المعتمدة.",
            "sections.hours.item4": "أي ساعات إضافية تحتاج موافقة.",
            "sections.emergency.title": "أرقام الطوارئ",
            "sections.emergency.item1": "مشرف الموقع: +00 000 000 000",
            "sections.emergency.item2": "الأمن: +00 000 000 000",
            "sections.emergency.item3": "مسؤول السلامة: +00 000 000 000",
            "sections.emergency.item4": "الطوارئ: 999 / 911",
            "sections.map.title": "خريطة الموقع",
            "sections.map.item1": "البوابة الرئيسية والأمن",
            "sections.map.item2": "نقاط التجمع ومخارج الطوارئ",
            "sections.map.item3": "الإسعافات الأولية ونقاط الإطفاء",
            "sections.map.item4": "مواقف السيارات ومناطق التسليم",
            "sections.video.title": "فيديو التعريف",
            "sections.video.subtitle": "شاهد فيديو التعريف لمدة دقيقة قبل الدخول.",
            "sections.video.button": "مشاهدة الفيديو (Placeholder)"
        },
        payment_claims: {
            title: "المطالبات المالية | Innovo",
            "header.title": "المطالبات المالية",
            "header.subtitle": "طريقة تقديم المطالبات بشكل صحيح وفي الوقت المحدد.",
            "sections.steps.title": "الخطوات",
            "sections.steps.item1": "جهّز المطالبة للأعمال المنجزة.",
            "sections.steps.item2": "أرفق المستندات والموافقات المطلوبة.",
            "sections.steps.item3": "قدّمها في النظام قبل الموعد النهائي.",
            "sections.steps.item4": "تابع حالة الاعتماد ورد على الملاحظات.",
            "sections.docs.title": "المستندات المطلوبة",
            "sections.docs.item1": "محضر استلام أو دليل فحص معتمد.",
            "sections.docs.item2": "BOQ أو تغيير معتمد (إن وجد).",
            "sections.docs.item3": "كشوفات العمل أو سندات التسليم.",
            "sections.docs.item4": "موافقة المشرف (توقيع/إيميل).",
            "sections.deadline.title": "الموعد النهائي",
            "sections.deadline.item1": "تُرسل المطالبات الأسبوعية كل خميس.",
            "sections.deadline.item2": "التأخير يُرحّل للدورة التالية.",
            "sections.deadline.item3": "الاستفسارات تُرد خلال 48 ساعة.",
            "sections.system.title": "رابط النظام",
            "sections.system.subtitle": "استخدم نظام الدفع الرسمي (Oracle أو رابط البوابة).",
            "sections.system.button": "فتح بوابة الدفع (Placeholder)"
        },
        safety: {
            title: "السلامة | Innovo",
            "header.title": "السلامة",
            "header.subtitle": "حافظ على سلامتك وسلامة الجميع بالموقع.",
            "sections.procedures.title": "إجراءات السلامة",
            "sections.procedures.item1": "استخدم الأدوات فقط إذا كنت مدربًا ومصرحًا.",
            "sections.procedures.item2": "التزم بمسارات المرور ومناطق الحظر.",
            "sections.procedures.item3": "أوقف العمل إذا كانت الظروف غير آمنة.",
            "sections.ppe.title": "معدات الوقاية المطلوبة",
            "sections.ppe.item1": "خوذة، حذاء أمان، وسترة عاكسة.",
            "sections.ppe.item2": "قفازات ونظارات حسب المهمة.",
            "sections.ppe.item3": "حماية السمع في المناطق المزدحمة.",
            "sections.incident.title": "الإبلاغ عن الحوادث",
            "sections.incident.item1": "بلّغ المشرف فورًا.",
            "sections.incident.item2": "أكمل نموذج البلاغ.",
            "sections.incident.item3": "أرفق صورًا إن توفرت.",
            "sections.toolbox.title": "اجتماعات السلامة",
            "sections.toolbox.item1": "احضر التوجيهات قبل بدء العمل.",
            "sections.toolbox.item2": "اسأل إذا كان هناك شيء غير واضح.",
            "sections.toolbox.item3": "وقّع على الحضور بعد الانتهاء.",
            "sections.dos.title": "افعل / لا تفعل",
            "sections.dos.item1": "افعل: حافظ على نظافة موقعك.",
            "sections.dos.item2": "افعل: اتبع تعليمات المشرف.",
            "sections.dos.item3": "لا تفعل: لا تتجاوز وسائل الأمان.",
            "sections.dos.item4": "لا تفعل: لا تستخدم الهاتف أثناء المشي."
        },
        quality: {
            title: "متطلبات الجودة | Innovo",
            "header.title": "متطلبات الجودة",
            "header.subtitle": "كيف تسلم العمل بدون رفض.",
            "sections.inspection.title": "عملية التفتيش",
            "sections.inspection.item1": "قدّم طلب التفتيش قبل إنهاء العمل.",
            "sections.inspection.item2": "جهّز الموقع والرسومات.",
            "sections.inspection.item3": "احضر التفتيش وأغلق الملاحظات.",
            "sections.checklists.title": "قوائم الفحص",
            "sections.checklists.item1": "استخدم القائمة المعتمدة لكل تخصص.",
            "sections.checklists.item2": "قم بالفحص الذاتي قبل التفتيش.",
            "sections.checklists.item3": "أرفق القائمة بطلب التفتيش.",
            "sections.snags.title": "قواعد العيوب (Snags)",
            "sections.snags.item1": "أصلح العيوب خلال الإطار الزمني المتفق عليه.",
            "sections.snags.item2": "التفتيش الثاني مطلوب بعد الإصلاح.",
            "sections.snags.item3": "لا تبدأ المرحلة التالية قبل إغلاق العيوب.",
            "sections.material.title": "اعتماد المواد",
            "sections.material.item1": "قدّم اعتماد المواد مبكرًا.",
            "sections.material.item2": "لا تركيب قبل الاعتماد.",
            "sections.material.item3": "احتفظ بالموافقات داخل الموقع."
        },
        howto: {
            title: "طريقة تنفيذ الأمور | Innovo",
            "header.title": "طريقة تنفيذ الأمور",
            "header.subtitle": "إرشادات سريعة لأكثر الطلبات شيوعًا.",
            "sections.inspection.title": "حجز تفتيش",
            "sections.inspection.item1": "املأ نموذج طلب التفتيش.",
            "sections.inspection.item2": "أرفق قائمة الفحص والرسومات.",
            "sections.inspection.item3": "أرسل للجودة قبل 24 ساعة.",
            "sections.equipment.title": "إدخال المعدات للموقع",
            "sections.equipment.item1": "شارك قائمة المعدات مع الأمن.",
            "sections.equipment.item2": "قدّم رخص التشغيل عند الحاجة.",
            "sections.equipment.item3": "الدخول من البوابة المعتمدة فقط.",
            "sections.permit.title": "طلب تصريح",
            "sections.permit.item1": "قدّم الطلب قبل بدء العمل.",
            "sections.permit.item2": "أرفق منهجية العمل وتقييم المخاطر.",
            "sections.permit.item3": "انتظر الموافقة قبل التحرك."
        },
        videos: {
            title: "الفيديوهات | Innovo",
            "header.title": "الفيديوهات",
            "header.subtitle": "شاهد فيديوهات دقيقة واحدة قبل بدء العمل.",
            "cards.safety.title": "السلامة",
            "cards.safety.placeholder": "شاهد فيديو دقيقة واحدة",
            "cards.safety.subtitle": "نظرة عامة على السلامة (1 دقيقة).",
            "cards.howto.title": "كيفية تنفيذ الأمور",
            "cards.howto.placeholder": "شاهد فيديو دقيقة واحدة",
            "cards.howto.subtitle": "حجز التفتيش (1 دقيقة).",
            "cards.site.title": "دخول الموقع",
            "cards.site.placeholder": "شاهد فيديو دقيقة واحدة",
            "cards.site.subtitle": "قواعد الدخول للموقع (1 دقيقة)."
        },
        training: {
            title: "التدريب | Innovo",
            "header.title": "التدريب",
            "header.subtitle": "وحدات قصيرة، تتبع الإقرار، ومحتوى التعريف.",
            "sections.modules.title": "وحدات تدريب قصيرة",
            "sections.modules.action1": "ابدأ الوحدات",
            "sections.modules.action2": "عرض قائمة الوحدات",
            "sections.signoff.title": "الإقرار والتوقيع",
            "sections.signoff.action1": "وقّع الإقرار",
            "sections.signoff.action2": "عرض حالة الإكمال",
            "sections.onboarding.title": "تعريف العاملين الجدد",
            "sections.onboarding.action1": "ابدأ التعريف",
            "sections.onboarding.action2": "تحميل دليل معدات الوقاية"
        },
        training_videos: {
            "training_videos.title": "فيديوهات التدريب",
            "training_videos.subtitle": "عينات تعمل تلقائيًا حتى تزويد الفيديوهات الرسمية.",
            "training_videos.card1.title": "تعريف الموقع",
            "training_videos.card2.title": "أساسيات السلامة",
            "training_videos.card3.title": "الدخول والتحقق"
        },
        issue_feedback: {
            title: "المشكلات والملاحظات | Innovo",
            "header.title": "المشكلات والملاحظات",
            "header.subtitle": "أرسل الأسئلة، بلّغ عن المشكلات، وارفع المخاوف مباشرة إلى فريق Innovo.",
            "notice.safety": "سلامتك هي أولويتنا القصوى. إذا كان لديك أي مخاوف أو مشكلات أو أسئلة، فلا تتردد في التواصل.",
            "sections.ask.title": "اسأل مدير مشروع / مشرف Innovo",
            "sections.ask.desc": "احصل على إرشاد وإجابات لأسئلتك في المشروع.",
            "sections.ask.email.label": "بريدك الإلكتروني (مطلوب للرد) *",
            "sections.ask.email.placeholder": "your.email@example.com",
            "sections.ask.question.label": "سؤالك *",
            "sections.ask.question.placeholder": "اشرح سؤالك بالتفصيل...",
            "sections.ask.location.label": "الموقع",
            "sections.ask.location.placeholder": "موقع العمل أو المنطقة",
            "sections.ask.trade.label": "التخصص / القسم",
            "sections.ask.trade.placeholder": "مثال: كهرباء، مدني، ميكانيكا",
            "sections.ask.upload.label": "ارفع صورًا داعمة (اختياري)",
            "sections.ask.upload.cta": "اضغط لرفع الصور",
            "sections.ask.submit": "إرسال السؤال",
            "sections.anonymous.title": "مخاوف السلامة المجهولة",
            "sections.anonymous.desc": "أبلغ عن قضايا السلامة بسرية تامة.",
            "sections.anonymous.issue.label": "وصف مخاوف السلامة *",
            "sections.anonymous.issue.placeholder": "صف مخاوف السلامة بالتفصيل...",
            "sections.anonymous.area.label": "المنطقة / الموقع",
            "sections.anonymous.area.placeholder": "المكان المحدد للمشكلة",
            "sections.anonymous.upload.label": "أرفق صور أدلة (اختياري)",
            "sections.anonymous.upload.cta": "اضغط لرفع الصور",
            "sections.anonymous.submit": "إبلاغ مجهول",
            "sections.report.title": "الإبلاغ عن مشكلات الموقع",
            "sections.report.desc": "وثّق وتتبع مشكلات الموقع لحل سريع.",
            "sections.report.email.label": "بريدك الإلكتروني (للتحديثات) *",
            "sections.report.email.placeholder": "your.email@example.com",
            "sections.report.issue.label": "وصف المشكلة *",
            "sections.report.issue.placeholder": "صف مشكلة الموقع بالتفصيل...",
            "sections.report.location.label": "الموقع *",
            "sections.report.location.placeholder": "الموقع الدقيق للمشكلة",
            "sections.report.priority.label": "مستوى الأولوية *",
            "sections.report.priority.placeholder": "اختر الأولوية",
            "sections.report.priority.low": "منخفضة - يمكن الانتظار",
            "sections.report.priority.medium": "متوسطة - تحتاج انتباه",
            "sections.report.priority.high": "مرتفعة - عاجلة",
            "sections.report.priority.critical": "حرجة - تتعلق بالسلامة",
            "sections.report.upload.label": "أرفق صورًا أو مستندات (اختياري)",
            "sections.report.upload.cta": "اضغط لرفع الملفات",
            "sections.report.submit": "إبلاغ عن المشكلة"
        },
        documents: {
            title: "المستندات والإرشادات | Innovo",
            "header.title": "المستندات والإرشادات",
            "header.subtitle": "اعثر على المستندات المطلوبة قبل الدخول.",
            "sections.available.title": "المستندات المتاحة",
            "sections.available.item1": "دليل التعريف وقواعد السلامة.",
            "sections.available.item2": "خرائط الوصول ومواعيد البوابات.",
            "sections.available.item3": "تصاريح العمل وقوائم المخاطر.",
            "sections.available.item4": "جهات الاتصال والطوارئ.",
            "sections.howto.title": "طريقة الاستخدام",
            "sections.howto.item1": "افتح الملف واقرأ النقاط المهمة.",
            "sections.howto.item2": "أظهر المستندات المطلوبة عند البوابة.",
            "sections.howto.item3": "أرسل النماذج المكتملة للمشرف.",
            "sections.howto.item4": "تحقق من التحديثات قبل كل وردية.",
            "sections.downloads.title": "التنزيلات",
            "sections.downloads.item1": "تنزيل دليل التعريف",
            "sections.downloads.item2": "تنزيل قواعد السلامة",
            "sections.downloads.item3": "تنزيل خريطة الدخول",
            "sections.downloads.item4": "تنزيل قائمة التصاريح"
        },
        access: {
            title: "الدخول والتحقق | Innovo",
            "header.title": "الدخول والتحقق",
            "header.subtitle": "اتبع الخطوات للدخول بسهولة.",
            "sections.steps.title": "خطوات الدخول والتحقق",
            "sections.steps.item1": "توجه إلى البوابة الرئيسية وأظهر الهوية.",
            "sections.steps.item2": "سجّل الدخول واستلم بطاقة الزائر.",
            "sections.steps.item3": "أظهر إثبات التعريف والتدريب.",
            "sections.steps.item4": "أكد منطقة العمل وبيانات المشرف.",
            "sections.steps.item5": "استلم خريطة الموقع ومعلومات الطوارئ.",
            "sections.arrival.title": "الوصول للموقع",
            "sections.arrival.item1": "استخدم البوابة الرئيسية واتبع الأمن.",
            "sections.arrival.item2": "اركن في الأماكن المخصصة للمقاولين.",
            "sections.arrival.item3": "جهّز الهوية لتسريع الدخول.",
            "sections.verify.title": "التحقق",
            "sections.verify.item1": "تأكد من معدات الوقاية المطلوبة.",
            "sections.verify.item2": "أظهر التصاريح والموافقات.",
            "sections.verify.item3": "استلم البطاقة قبل الدخول لمنطقة العمل.",
            "sections.maps.title": "خرائط الدخول (PDF / صورة)",
            "sections.maps.subtitle": "تنزيل عندما تكون متاحة.",
            "sections.maps.item1": "خريطة الدخول PDF",
            "sections.maps.item2": "خريطة الدخول صورة"
        }
    },
    hi: {
        common: {
            "nav.back_home": "मुखपृष्ठ पर लौटें",
            "nav.back_dashboard": "डैशबोर्ड पर लौटें",
            "nav.main_portal": "मुख्य पोर्टल",
            "nav.site_entry": "साइट एंट्री",
            "nav.documents": "डॉक्यूमेंट्स",
            "nav.safety": "सेफ़्टी",
            "nav.payment_claims": "पेमेंट क्लेम्स",
            "nav.choose_language": "भाषा चुनें"
        },
        index: {
            title: "सबकॉन्ट्रैक्टर पोर्टल | Innovo",
            "hero.title_main": "कॉन्ट्रैक्टर",
            "hero.title_accent": " पोर्टल",
            "hero.subtitle": "साइट में प्रवेश के लिए डिजिटल गाइड: सुरक्षा नियम, दस्तावेज़ और ज़रूरी वीडियो।",
            "hero.enter_portal": "पोर्टल में प्रवेश",
            "hero.payment_claims": "पेमेंट क्लेम",
            "search.title": "पोर्टल में खोजें",
            "search.placeholder": "सेफ्टी, डॉक्यूमेंट्स, क्लेम्स खोजें...",
            "search.button": "खोजें",
            "search.payment_claims": "पेमेंट क्लेम्स",
            "section.portal.title": "पोर्टल क्षेत्र",
            "section.portal.subtitle": "सुरक्षित, अनुपालन और तेज़ साइट एक्सेस के लिए सब कुछ।",
            "section.portal.site_entry.label": "साइट एंट्री",
            "section.portal.site_entry.title": "सुरक्षा नियम और एंट्री स्टेप्स",
            "section.portal.site_entry.copy": "मुख्य नियम, PPE आवश्यकताएँ, और दैनिक प्रवेश निर्देश।",
            "section.portal.documents.label": "डॉक्यूमेंट्स",
            "section.portal.documents.title": "गाइड्स और डाउनलोड",
            "section.portal.documents.copy": "नीतियाँ, फॉर्म्स, और स्वीकृत चेकलिस्ट उपयोग के लिए तैयार।",
            "section.portal.hse.label": "HSE",
            "section.portal.hse.title": "सुरक्षा और घटना समर्थन",
            "section.portal.hse.copy": "प्रक्रियाएँ, रिपोर्टिंग, और ऑन-साइट सर्वोत्तम अभ्यास।"
        },
        dashboard: {
            title: "मुख्य पोर्टल डैशबोर्ड | Innovo",
            "header.title": "मुख्य पोर्टल डैशबोर्ड",
            "header.subtitle": "सुरक्षित रूप से काम करने और Innovo के साथ जुड़े रहने के लिए सब कुछ। पेज खोलने के लिए कार्ड पर टैप करें।",
            "cards.site_entry.tag": "साइट एंट्री",
            "cards.site_entry.title": "साइट एंट्री",
            "cards.site_entry.item1": "सेफ्टी नियम + PPE",
            "cards.site_entry.item2": "वर्किंग ऑवर्स",
            "cards.site_entry.item3": "इमरजेंसी नंबर + साइट मैप",
            "cards.access.tag": "एक्सेस",
            "cards.access.title": "एक्सेस व वेरिफिकेशन",
            "cards.access.item1": "एंट्री स्टेप्स",
            "cards.access.item2": "वेरिफिकेशन चेकलिस्ट",
            "cards.access.item3": "एक्सेस मैप्स",
            "cards.documents.tag": "डॉक्यूमेंट्स",
            "cards.documents.title": "डॉक्यूमेंट्स व गाइड्स",
            "cards.documents.item1": "प्रोसीजर्स + पॉलिसीज़",
            "cards.documents.item2": "PDFs / ड्रॉइंग्स",
            "cards.documents.item3": "डाउनलोड सेंटर",
            "cards.payment.tag": "पेमेंट्स",
            "cards.payment.title": "पेमेंट्स",
            "cards.payment.item1": "पेमेंट क्लेम सबमिशन",
            "cards.payment.item2": "ज़रूरी डॉक्यूमेंट्स",
            "cards.payment.item3": "सबमिशन डेडलाइन्स",
            "cards.safety.tag": "सेफ्टी",
            "cards.safety.title": "सेफ्टी",
            "cards.safety.item1": "सेफ्टी प्रक्रियाएँ",
            "cards.safety.item2": "ज़रूरी PPE",
            "cards.safety.item3": "घटनाओं और सुरक्षा मुद्दों की रिपोर्टिंग",
            "cards.training.tag": "ट्रेनिंग",
            "cards.training.title": "ट्रेनिंग",
            "cards.training.item1": "छोटे ट्रेनिंग मॉड्यूल (2-5 मिनट)",
            "cards.training.item2": "स्वीकृति और साइन-ऑफ ट्रैकिंग",
            "cards.training.item3": "नए कर्मचारियों का ऑनबोर्डिंग कंटेंट",
            "cards.issue.tag": "इश्यू व फीडबैक",
            "cards.issue.title": "इश्यू व फीडबैक",
            "cards.issue.item1": "फोटो के साथ Innovo PM/सुपर से पूछें",
            "cards.issue.item2": "गुमनाम सुरक्षा चिंताएँ",
            "cards.issue.item3": "साइट इश्यू जल्दी रिपोर्ट करें",
            "cards.quality.tag": "क्वालिटी",
            "cards.quality.title": "क्वालिटी रिक्वायरमेंट्स",
            "cards.quality.item1": "इंस्पेक्शन प्रोसेस",
            "cards.quality.item2": "चेकलिस्ट + स्नैग रूल्स",
            "cards.quality.item3": "मैटेरियल अप्रूवल्स",
            "cards.howto.tag": "हाउ टू",
            "cards.howto.title": "काम कैसे करें",
            "cards.howto.item1": "इंस्पेक्शन बुक करें",
            "cards.howto.item2": "इक्विपमेंट लाना",
            "cards.howto.item3": "परमिट रिक्वेस्ट",
            "cards.videos.tag": "वीडियो",
            "cards.videos.title": "वीडियो",
            "cards.videos.item1": "1 मिनट के वीडियो देखें",
            "cards.videos.item2": "सेफ्टी + हाउ-टू",
            "quick_help.title": "क्विक हेल्प",
            "quick_help.subtitle": "बिना पेपरवर्क के तेज़ जवाब।",
            "quick_help.forms.title": "फॉर्म्स व टेम्पलेट्स",
            "quick_help.forms.item1": "परमिट रिक्वेस्ट फॉर्म",
            "quick_help.forms.item2": "इंस्पेक्शन रिक्वेस्ट फॉर्म",
            "quick_help.forms.item3": "इंसिडेंट रिपोर्ट टेम्पलेट",
            "quick_help.contact.title": "कॉन्टैक्ट व हेल्प",
            "quick_help.contact.item1": "साइट सुपरवाइज़र फोन",
            "quick_help.contact.item2": "सेफ्टी ऑफिसर कॉन्टैक्ट",
            "quick_help.contact.item3": "WhatsApp हेल्प लाइन",
            "quick_help.announcements.title": "एनाउंसमेंट्स",
            "quick_help.announcements.item1": "गेट क्लोज़र / एक्सेस अपडेट्स",
            "quick_help.announcements.item2": "वर्किंग ऑवर बदलाव",
            "quick_help.announcements.item3": "साइट-वाइड अलर्ट्स",
            "quick_help.faq.title": "FAQ",
            "quick_help.faq.item1": "मुझे इसके लिए कहाँ जाना है?",
            "quick_help.faq.item2": "क्लेम कैसे सबमिट करूँ?",
            "quick_help.faq.item3": "एंट्री से पहले क्या चाहिए?"
        },
        site_entry: {
            title: "साइट एंट्री | Innovo",
            "header.title": "साइट एंट्री",
            "header.subtitle": "साइट में प्रवेश से पहले ज़रूरी बातें।",
            "sections.safety_rules.title": "सेफ्टी नियम",
            "sections.safety_rules.item1": "हर दिन इन/आउट साइन करें।",
            "sections.safety_rules.item2": "अपने निर्धारित ज़ोन में रहें।",
            "sections.safety_rules.item3": "ट्रैफिक और एक्सक्लूजन ज़ोन फॉलो करें।",
            "sections.safety_rules.item4": "वॉकवे साफ रखें।",
            "sections.ppe.title": "PPE आवश्यक",
            "sections.ppe.item1": "हार्ड हैट, सेफ्टी बूट्स, हाई-विज वेस्ट।",
            "sections.ppe.item2": "कार्य अनुसार सेफ्टी ग्लास/ग्लव्स।",
            "sections.ppe.item3": "शोर वाले क्षेत्रों में ईयर प्रोटेक्शन।",
            "sections.ppe.item4": "धूल/धुएँ में रेस्पिरेटर।",
            "sections.hours.title": "वर्किंग ऑवर्स",
            "sections.hours.item1": "शिफ्ट से पहले गेट पर चेक-इन।",
            "sections.hours.item2": "साइट के स्टार्ट/फिनिश टाइम फॉलो करें।",
            "sections.hours.item3": "मंज़ूर समय के बाहर काम नहीं।",
            "sections.hours.item4": "ओवरटाइम के लिए मंज़ूरी जरूरी।",
            "sections.emergency.title": "इमरजेंसी नंबर",
            "sections.emergency.item1": "साइट सुपरवाइज़र: +00 000 000 000",
            "sections.emergency.item2": "सिक्योरिटी डेस्क: +00 000 000 000",
            "sections.emergency.item3": "सेफ्टी ऑफिसर: +00 000 000 000",
            "sections.emergency.item4": "इमरजेंसी सेवाएँ: 999 / 911",
            "sections.map.title": "साइट मैप",
            "sections.map.item1": "मुख्य गेट और सिक्योरिटी डेस्क",
            "sections.map.item2": "असेंबली पॉइंट्स और एग्ज़िट्स",
            "sections.map.item3": "फर्स्ट एड और फायर पॉइंट्स",
            "sections.map.item4": "पार्किंग और डिलीवरी ज़ोन",
            "sections.video.title": "इंडक्शन वीडियो",
            "sections.video.subtitle": "एंट्री से पहले 1 मिनट का इंडक्शन वीडियो देखें।",
            "sections.video.button": "वीडियो देखें (Placeholder)"
        },
        payment_claims: {
            title: "पेमेंट क्लेम | Innovo",
            "header.title": "पेमेंट क्लेम",
            "header.subtitle": "क्लेम सही और समय पर कैसे जमा करें।",
            "sections.steps.title": "स्टेप्स",
            "sections.steps.item1": "पूरे हुए काम के लिए क्लेम तैयार करें।",
            "sections.steps.item2": "ज़रूरी डॉक्यूमेंट्स और अप्रूवल जोड़ें।",
            "sections.steps.item3": "डेडलाइन से पहले सिस्टम में सबमिट करें।",
            "sections.steps.item4": "स्टेटस ट्रैक करें और क्वेरी का जवाब दें।",
            "sections.docs.title": "ज़रूरी डॉक्यूमेंट्स",
            "sections.docs.item1": "साइन की गई वर्क कम्प्लीशन/इंस्पेक्शन प्रूफ।",
            "sections.docs.item2": "अप्रूव्ड BOQ या वैरिएशन (अगर हो)।",
            "sections.docs.item3": "टाइमशीट्स या डिलीवरी नोट्स।",
            "sections.docs.item4": "सुपरवाइज़र अप्रूवल ईमेल/साइन।",
            "sections.deadline.title": "डेडलाइन",
            "sections.deadline.item1": "साप्ताहिक क्लेम हर गुरुवार सबमिट करें।",
            "sections.deadline.item2": "लेट सबमिशन अगली साइकिल में जाएगा।",
            "sections.deadline.item3": "क्लैरिफिकेशन 48 घंटे में दें।",
            "sections.system.title": "सिस्टम लिंक",
            "sections.system.subtitle": "ऑफिशियल पेमेंट सिस्टम (Oracle/पोर्टल) इस्तेमाल करें।",
            "sections.system.button": "Oracle पेमेंट पोर्टल खोलें"
        },
        safety: {
            title: "सेफ्टी | Innovo",
            "header.title": "सेफ्टी",
            "header.subtitle": "साइट पर सभी की सुरक्षा बनाए रखें।",
            "sections.procedures.title": "सेफ्टी प्रोसीजर्स",
            "sections.procedures.item1": "ट्रेंड/ऑथराइज़्ड होने पर ही टूल्स इस्तेमाल करें।",
            "sections.procedures.item2": "ट्रैफिक और एक्सक्लूजन ज़ोन फॉलो करें।",
            "sections.procedures.item3": "अगर स्थिति असुरक्षित लगे तो काम रोकें।",
            "sections.ppe.title": "ज़रूरी PPE",
            "sections.ppe.item1": "हार्ड हैट, सेफ्टी बूट और हाई-विज़ वेस्ट।",
            "sections.ppe.item2": "काम के अनुसार दस्ताने और आई प्रोटेक्शन।",
            "sections.ppe.item3": "ज़्यादा शोर वाले क्षेत्रों में हियरिंग प्रोटेक्शन।",
            "sections.incident.title": "इंसिडेंट रिपोर्टिंग",
            "sections.incident.item1": "तुरंत सुपरवाइज़र को रिपोर्ट करें।",
            "sections.incident.item2": "इंसिडेंट रिपोर्ट फॉर्म भरें।",
            "sections.incident.item3": "फोटो हों तो शेयर करें।",
            "sections.toolbox.title": "टूलबॉक्स टॉक्स",
            "sections.toolbox.item1": "काम शुरू होने से पहले टूलबॉक्स टॉक अटेंड करें।",
            "sections.toolbox.item2": "कुछ समझ न आए तो सवाल पूछें।",
            "sections.toolbox.item3": "ब्रिफिंग के बाद अटेंडेंस साइन करें।",
            "sections.dos.title": "करें / न करें",
            "sections.dos.item1": "करें: कार्य क्षेत्र साफ रखें।",
            "sections.dos.item2": "करें: सुपरवाइज़र के निर्देश मानें।",
            "sections.dos.item3": "न करें: सेफ्टी डिवाइस को बायपास न करें।",
            "sections.dos.item4": "न करें: चलते समय फोन इस्तेमाल न करें।"
        },
        quality: {
            title: "क्वालिटी रिक्वायरमेंट्स | Innovo",
            "header.title": "क्वालिटी रिक्वायरमेंट्स",
            "header.subtitle": "काम बिना रिजेक्शन के कैसे दें।",
            "sections.inspection.title": "इंस्पेक्शन प्रोसेस",
            "sections.inspection.item1": "कम्प्लीशन से पहले इंस्पेक्शन रिक्वेस्ट करें।",
            "sections.inspection.item2": "वर्क एरिया और ड्रॉइंग्स तैयार रखें।",
            "sections.inspection.item3": "इंस्पेक्शन में मौजूद रहें और कमेंट्स बंद करें।",
            "sections.checklists.title": "चेकलिस्ट्स",
            "sections.checklists.item1": "हर ट्रेड के लिए अप्रूव्ड चेकलिस्ट इस्तेमाल करें।",
            "sections.checklists.item2": "इंस्पेक्शन से पहले सेल्फ-चेक करें।",
            "sections.checklists.item3": "इंस्पेक्शन रिक्वेस्ट के साथ चेकलिस्ट जोड़ें।",
            "sections.snags.title": "स्नैग रूल्स",
            "sections.snags.item1": "स्नैग तय समय में ठीक करें।",
            "sections.snags.item2": "फिक्स के बाद री-इंस्पेक्शन जरूरी।",
            "sections.snags.item3": "अगली गतिविधि से पहले स्नैग बंद करें।",
            "sections.material.title": "मैटेरियल अप्रूवल",
            "sections.material.item1": "मैटेरियल सबमिटल जल्दी भेजें।",
            "sections.material.item2": "अप्रूवल से पहले इंस्टॉलेशन नहीं।",
            "sections.material.item3": "अप्रूवल्स साइट पर रखें।"
        },
        howto: {
            title: "काम कैसे करें | Innovo",
            "header.title": "काम कैसे करें",
            "header.subtitle": "आम कामों के लिए तेज़ गाइड्स।",
            "sections.inspection.title": "इंस्पेक्शन बुक करें",
            "sections.inspection.item1": "इंस्पेक्शन रिक्वेस्ट फॉर्म भरें।",
            "sections.inspection.item2": "चेकलिस्ट और ड्रॉइंग्स जोड़ें।",
            "sections.inspection.item3": "क्वालिटी टीम को 24 घंटे पहले भेजें।",
            "sections.equipment.title": "इक्विपमेंट साइट पर लाएं",
            "sections.equipment.item1": "इक्विपमेंट लिस्ट सिक्योरिटी को दें।",
            "sections.equipment.item2": "ज़रूरत हो तो ऑपरेटर लाइसेंस दें।",
            "sections.equipment.item3": "सिर्फ अनुमोदित गेट से एंटर करें।",
            "sections.permit.title": "परमिट रिक्वेस्ट",
            "sections.permit.item1": "काम शुरू होने से पहले परमिट रिक्वेस्ट करें।",
            "sections.permit.item2": "मेथड स्टेटमेंट और रिस्क असेसमेंट जोड़ें।",
            "sections.permit.item3": "मंज़ूरी के बाद ही आगे बढ़ें।"
        },
        videos: {
            title: "वीडियो | Innovo",
            "header.title": "वीडियो",
            "header.subtitle": "काम शुरू करने से पहले 1 मिनट के वीडियो देखें।",
            "cards.safety.title": "सेफ्टी",
            "cards.safety.placeholder": "1 मिनट का वीडियो देखें",
            "cards.safety.subtitle": "सेफ्टी ओवरव्यू (1 मिनट)।",
            "cards.howto.title": "काम कैसे करें",
            "cards.howto.placeholder": "1 मिनट का वीडियो देखें",
            "cards.howto.subtitle": "इंस्पेक्शन बुकिंग (1 मिनट)।",
            "cards.site.title": "साइट एंट्री",
            "cards.site.placeholder": "1 मिनट का वीडियो देखें",
            "cards.site.subtitle": "साइट एंट्री नियम (1 मिनट)।"
        },
        training: {
            title: "ट्रेनिंग | Innovo",
            "header.title": "ट्रेनिंग",
            "header.subtitle": "छोटे मॉड्यूल, साइन-ऑफ ट्रैकिंग और ऑनबोर्डिंग कंटेंट।",
            "sections.modules.title": "छोटे ट्रेनिंग मॉड्यूल",
            "sections.modules.action1": "मॉड्यूल शुरू करें",
            "sections.modules.action2": "मॉड्यूल लिस्ट देखें",
            "sections.signoff.title": "स्वीकृति और साइन-ऑफ",
            "sections.signoff.action1": "स्वीकृति पर साइन करें",
            "sections.signoff.action2": "कम्प्लीशन स्टेटस देखें",
            "sections.onboarding.title": "नए कर्मचारियों का ऑनबोर्डिंग",
            "sections.onboarding.action1": "इंडक्शन शुरू करें",
            "sections.onboarding.action2": "PPE गाइड डाउनलोड करें"
        },
        training_videos: {
            "training_videos.title": "ट्रेनिंग वीडियो",
            "training_videos.subtitle": "आधिकारिक वीडियो मिलने तक ऑटो-प्ले सैंपल्स।",
            "training_videos.card1.title": "साइट इंडक्शन",
            "training_videos.card2.title": "सेफ्टी बेसिक्स",
            "training_videos.card3.title": "एक्सेस व वेरिफिकेशन"
        },
        issue_feedback: {
            title: "इश्यू व फीडबैक | Innovo",
            "header.title": "इश्यू व फीडबैक",
            "header.subtitle": "Innovo टीम को सीधे सवाल, समस्याएँ और चिंताएँ भेजें।",
            "notice.safety": "आपकी सुरक्षा हमारी सर्वोच्च प्राथमिकता है। यदि कोई चिंता, समस्या या सवाल हों, तो बेझिझक संपर्क करें।",
            "sections.ask.title": "Innovo PM/सुपरवाइज़र से पूछें",
            "sections.ask.desc": "प्रोजेक्ट सवालों के लिए मार्गदर्शन और जवाब पाएं।",
            "sections.ask.email.label": "आपका ईमेल (जवाब के लिए आवश्यक) *",
            "sections.ask.email.placeholder": "your.email@example.com",
            "sections.ask.question.label": "आपका सवाल *",
            "sections.ask.question.placeholder": "अपना सवाल विस्तार से लिखें...",
            "sections.ask.location.label": "लोकेशन",
            "sections.ask.location.placeholder": "साइट का स्थान या क्षेत्र",
            "sections.ask.trade.label": "ट्रेड / विभाग",
            "sections.ask.trade.placeholder": "उदा: इलेक्ट्रिकल, सिविल, MEP",
            "sections.ask.upload.label": "समर्थन फोटो अपलोड करें (वैकल्पिक)",
            "sections.ask.upload.cta": "फोटो अपलोड करने के लिए क्लिक करें",
            "sections.ask.submit": "सवाल भेजें",
            "sections.anonymous.title": "गुमनाम सेफ्टी चिंताएँ",
            "sections.anonymous.desc": "अपनी पहचान बताए बिना सेफ्टी मुद्दे भेजें।",
            "sections.anonymous.issue.label": "सेफ्टी चिंता विवरण *",
            "sections.anonymous.issue.placeholder": "सेफ्टी चिंता को विस्तार से लिखें...",
            "sections.anonymous.area.label": "क्षेत्र / लोकेशन",
            "sections.anonymous.area.placeholder": "समस्या का सटीक क्षेत्र",
            "sections.anonymous.upload.label": "सबूत फोटो अपलोड करें (वैकल्पिक)",
            "sections.anonymous.upload.cta": "फोटो अपलोड करने के लिए क्लिक करें",
            "sections.anonymous.submit": "गुमनाम रिपोर्ट भेजें",
            "sections.report.title": "साइट इश्यू रिपोर्ट करें",
            "sections.report.desc": "साइट इश्यू को रिकॉर्ड करें और जल्दी हल करें।",
            "sections.report.email.label": "आपका ईमेल (अपडेट्स के लिए) *",
            "sections.report.email.placeholder": "your.email@example.com",
            "sections.report.issue.label": "इश्यू विवरण *",
            "sections.report.issue.placeholder": "साइट इश्यू को विस्तार से लिखें...",
            "sections.report.location.label": "लोकेशन *",
            "sections.report.location.placeholder": "इश्यू का सटीक स्थान",
            "sections.report.priority.label": "प्रायोरिटी स्तर *",
            "sections.report.priority.placeholder": "प्रायोरिटी चुनें",
            "sections.report.priority.low": "Low - प्रतीक्षा कर सकता है",
            "sections.report.priority.medium": "Medium - ध्यान ज़रूरी",
            "sections.report.priority.high": "High - तुरंत",
            "sections.report.priority.critical": "Critical - सेफ्टी चिंता",
            "sections.report.upload.label": "फोटो या दस्तावेज़ जोड़ें (वैकल्पिक)",
            "sections.report.upload.cta": "फ़ाइलें अपलोड करने के लिए क्लिक करें",
            "sections.report.submit": "इश्यू रिपोर्ट करें"
        },
        documents: {
            title: "डॉक्यूमेंट्स व गाइड्स | Innovo",
            "header.title": "डॉक्यूमेंट्स व गाइड्स",
            "header.subtitle": "साइट एंट्री से पहले ज़रूरी डॉक्यूमेंट्स ढूंढें।",
            "sections.available.title": "उपलब्ध डॉक्यूमेंट्स",
            "sections.available.item1": "साइट इंडक्शन गाइड और सेफ्टी नियम।",
            "sections.available.item2": "एक्सेस मैप्स, गेट टाइम्स, पार्किंग जानकारी।",
            "sections.available.item3": "वर्क परमिट्स और रिस्क चेकलिस्ट।",
            "sections.available.item4": "इमरजेंसी कॉन्टैक्ट्स और इंसिडेंट फॉर्म्स।",
            "sections.howto.title": "कैसे इस्तेमाल करें",
            "sections.howto.item1": "फाइल खोलें, मुख्य बिंदु पढ़ें और सेव करें।",
            "sections.howto.item2": "गेट पर जरूरी डॉक्यूमेंट्स दिखाएँ।",
            "sections.howto.item3": "फॉर्म्स सुपरवाइज़र को भेजें।",
            "sections.howto.item4": "हर शिफ्ट से पहले अपडेट चेक करें।",
            "sections.downloads.title": "डाउनलोड्स",
            "sections.downloads.item1": "इंडक्शन PDF डाउनलोड करें",
            "sections.downloads.item2": "सेफ्टी नियम डाउनलोड करें",
            "sections.downloads.item3": "एक्सेस मैप डाउनलोड करें",
            "sections.downloads.item4": "परमिट चेकलिस्ट डाउनलोड करें"
        },
        access: {
            title: "एक्सेस व वेरिफिकेशन | Innovo",
            "header.title": "एक्सेस व वेरिफिकेशन",
            "header.subtitle": "साइट में आसानी से प्रवेश के लिए कदम फॉलो करें।",
            "sections.steps.title": "एक्सेस व वेरिफिकेशन स्टेप्स",
            "sections.steps.item1": "मुख्य गेट पर पहुँचें और आईडी दिखाएँ।",
            "sections.steps.item2": "साइन इन करें और बैज लें।",
            "sections.steps.item3": "इंडक्शन और ट्रेनिंग प्रूफ दिखाएँ।",
            "sections.steps.item4": "वर्क एरिया और सुपरवाइज़र कॉन्टैक्ट कन्फर्म करें।",
            "sections.steps.item5": "एंट्री से पहले साइट मैप और इमरजेंसी जानकारी लें।",
            "sections.arrival.title": "साइट आगमन",
            "sections.arrival.item1": "मुख्य गेट का इस्तेमाल करें और सिक्योरिटी निर्देश मानें।",
            "sections.arrival.item2": "सिर्फ निर्धारित क्षेत्रों में पार्क करें।",
            "sections.arrival.item3": "तेज़ चेक-इन के लिए आईडी तैयार रखें।",
            "sections.verify.title": "वेरिफिकेशन",
            "sections.verify.item1": "सही PPE की पुष्टि करें।",
            "sections.verify.item2": "ज़रूरी परमिट और अप्रूवल दिखाएँ।",
            "sections.verify.item3": "वर्क ज़ोन में जाने से पहले बैज लें।",
            "sections.maps.title": "एक्सेस मैप्स (PDF / इमेज)",
            "sections.maps.subtitle": "उपलब्ध होने पर डाउनलोड करें।",
            "sections.maps.item1": "एक्सेस मैप PDF",
            "sections.maps.item2": "एक्सेस मैप इमेज"
        }
    }
};

function getPageKey() {
    return document.body?.dataset?.page || 'common';
}

function applyTranslations(lang) {
    const pageKey = getPageKey();
    const pageTranslations = translations[lang]?.[pageKey] || {};
    const commonTranslations = translations[lang]?.common || {};

    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        const value = pageTranslations[key] ?? commonTranslations[key];
        if (!el.dataset.i18nDefault) {
            el.dataset.i18nDefault = el.textContent;
        }
        const fallback = el.dataset.i18nDefault;
        if (typeof value === 'string') {
            el.textContent = value;
        } else if (lang === 'en' && typeof fallback === 'string') {
            el.textContent = fallback;
        }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        if (!el.dataset.i18nPlaceholderDefault) {
            el.dataset.i18nPlaceholderDefault = el.getAttribute('placeholder') || '';
        }
        const key = el.getAttribute('data-i18n-placeholder');
        const value = pageTranslations[key] ?? commonTranslations[key];
        const fallback = el.dataset.i18nPlaceholderDefault;
        if (typeof value === 'string') {
            el.setAttribute('placeholder', value);
        } else if (lang === 'en') {
            el.setAttribute('placeholder', fallback);
        }
    });

    const titleKey = document.body?.dataset?.titleKey;
    if (titleKey) {
        const titleValue = pageTranslations[titleKey] ?? commonTranslations[titleKey];
        if (typeof titleValue === 'string') {
            document.title = titleValue;
        } else if (lang === 'en') {
            document.title = defaultTitle;
        }
    }
}

function setLanguage(lang) {
    const nextLang = lang === 'ar' || lang === 'hi' ? lang : 'en';
    rootElement.lang = nextLang;
    rootElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem(LANGUAGE_KEY, nextLang);
    applyTranslations(nextLang);
    updateThemeToggle(rootElement.dataset.theme || 'light');
}
function applyTheme(theme, options = {}) {
    const persist = options.persist !== false;
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    rootElement.dataset.theme = nextTheme;
    rootElement.style.colorScheme = nextTheme;
    if (persist) {
        localStorage.setItem(THEME_KEY, nextTheme);
    }
    updateThemeToggle(nextTheme);
}

if (lockedTheme) {
    applyTheme(lockedTheme, { persist: false });
} else {
    const savedTheme = localStorage.getItem(THEME_KEY);
    applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

    if (themeToggles.length) {
        themeToggles.forEach((toggle) => {
            toggle.addEventListener('click', () => {
                const next = rootElement.dataset.theme === 'dark' ? 'light' : 'dark';
                applyTheme(next);
            });
        });
    }
}

function showLanguageOverlay() {
    if (!languageOverlay) return;
    languageOverlay.classList.remove('hide');
    languageOverlay.classList.add('show');
    languageOverlay.setAttribute('aria-hidden', 'false');
}

function hideLanguageOverlay() {
    if (!languageOverlay) return;
    languageOverlay.classList.remove('show');
    languageOverlay.classList.add('hide');
    languageOverlay.setAttribute('aria-hidden', 'true');
}

function ensureLanguageOverlay() {
    languageOverlay = document.getElementById('language-overlay');
    languageLinks = Array.from(document.querySelectorAll('[data-language-select], .lang-menu a[data-lang]'));
}

// Add a mobile hamburger + quick panel on non-home pages (links + quick actions)
function buildMobileMenuForContentPages() {
    if (isHomePage()) return;

    const navActions = document.querySelector('.nav-actions') || document.querySelector('.page-nav');

    if (!document.querySelector('[data-menu-toggle]')) {
        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'menu-trigger';
        trigger.setAttribute('aria-label', 'Toggle menu');
        trigger.setAttribute('data-menu-toggle', '');
        trigger.innerHTML = '<span></span><span></span>';
        if (navActions) {
            navActions.appendChild(trigger);
        } else {
            document.body.prepend(trigger);
        }
    }

    if (!document.getElementById('mobile-panel')) {
        const panel = document.createElement('div');
        panel.id = 'mobile-panel';
        panel.className = 'mobile-panel';

        // Quick actions
        const langLink = document.createElement('a');
        langLink.href = '#';
        langLink.dataset.mobileLang = 'true';
        langLink.dataset.i18n = 'nav.choose_language';
        langLink.textContent = 'Choose Language';
        panel.appendChild(langLink);

        const themeBtn = document.createElement('button');
        themeBtn.type = 'button';
        themeBtn.className = 'mobile-panel-link';
        themeBtn.dataset.themeToggle = '';
        themeBtn.textContent = 'Dark Mode';
        themeBtn.addEventListener('click', () => {
            const next = rootElement.dataset.theme === 'dark' ? 'light' : 'dark';
            applyTheme(next);
        });
        panel.appendChild(themeBtn);
        themeToggles.push(themeBtn);

        const homeLink = document.createElement('a');
        homeLink.href = 'index.html';
        homeLink.dataset.i18n = 'nav.back_home';
        homeLink.textContent = 'Back to Home';
        panel.appendChild(homeLink);

        if (navActions && navActions.parentNode) {
            navActions.parentNode.insertBefore(panel, navActions.nextSibling);
        } else {
            document.body.appendChild(panel);
        }

        updateThemeToggle(rootElement.dataset.theme || 'light');
    }

    // refresh refs for mobile menu
    mobileToggle = document.querySelector('[data-menu-toggle]');
    mobilePanel = document.getElementById('mobile-panel');
}

ensureLanguageOverlay();
buildMobileMenuForContentPages();

const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
setLanguage(savedLanguage || 'en');

if (languageLinks.length) {
    languageLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            if (languageShowTimer) {
                clearTimeout(languageShowTimer);
                languageShowTimer = null;
            }
            const lang = link.getAttribute('data-lang') || link.dataset.lang;
            if (lang) {
                setLanguage(lang);
            }
            const details = link.closest('details');
            if (details) {
                details.removeAttribute('open');
            }
            if (languageOverlay) {
                hideLanguageOverlay();
            }
            if (mobilePanel) {
                mobilePanel.classList.remove('open');
            }
        });
    });
}

if (languageOverlay) {
    if (isHomePage()) {
        languageShowTimer = setTimeout(showLanguageOverlay, 300);
    }
}

const lightPointer = document.getElementById('light-pointer');
const iconCards = Array.from(document.querySelectorAll('.icon-card'));

// Auto-focus safety panels on hover/touch
const stripPanels = Array.from(document.querySelectorAll('.panel-stack .strip-panel'));
if (stripPanels.length) {
    const container = stripPanels[0].parentElement;
    const scrollToPanel = (panel) => {
        if (!panel || !container) return;
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };
    stripPanels.forEach((panel) => {
        panel.addEventListener('mouseenter', () => scrollToPanel(panel));
        panel.addEventListener('touchstart', () => scrollToPanel(panel), { passive: true });
    });
}

// Issue actions interaction
const issueActions = Array.from(document.querySelectorAll('.issue-action'));
const isIssueFeedbackPage = document.body?.dataset?.page === 'issue_feedback';
if (issueActions.length && !isIssueFeedbackPage) {
    issueActions.forEach((action) => {
        action.addEventListener('click', (e) => {
            e.preventDefault();
            action.classList.remove('action-pressed');
            void action.offsetWidth; // restart animation
            action.classList.add('action-pressed');
            const form = action.closest('.section-card')?.querySelector('.action-form');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                const input = form.querySelector('input, textarea');
                if (input) input.focus({ preventScroll: true });
            }
        });
    });
}

// Custom file triggers for issue forms
const fileTriggers = Array.from(document.querySelectorAll('.file-trigger'));
if (fileTriggers.length) {
    fileTriggers.forEach((trigger) => {
        const inputId = trigger.dataset.input;
        const input = document.getElementById(inputId);
        const fileNameEl = document.getElementById(`${inputId}-name`);
        if (!input) return;
        trigger.addEventListener('click', () => input.click());
        input.addEventListener('change', () => {
            if (fileNameEl) {
                const name = input.files && input.files.length ? input.files[0].name : '';
                fileNameEl.textContent = name;
            }
        });
    });
}

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let scrollY = 0;

const sensitivity = 6;
const lerpFactor = 0.05;

// Track mouse for interactive effects
window.addEventListener('mousemove', (e) => {
    const mouseXPercent = (e.clientX / window.innerWidth) * 100;
    const mouseYPercent = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', `${mouseXPercent}%`);
    document.documentElement.style.setProperty('--mouse-y', `${mouseYPercent}%`);

    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    targetY = x * sensitivity;
    targetX = -y * sensitivity;

    if (lightPointer) {
        lightPointer.style.left = `${e.clientX}px`;
        lightPointer.style.top = `${e.clientY}px`;
        lightPointer.style.opacity = '0.6';
    }
});

// Track scroll for parallax
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    document.documentElement.style.setProperty('--scroll-y', scrollY);
});

const siteHeader = document.getElementById('site-header');
const searchOpens = Array.from(document.querySelectorAll('[data-search-open]'));
const searchClose = document.querySelector('[data-search-close]');
const searchOverlay = document.getElementById('search-overlay');
const searchResults = document.getElementById('search-results');

function updateHeaderState() {
    if (!siteHeader) return;
    if (window.scrollY > 10) {
        siteHeader.classList.add('scrolled');
    } else {
        siteHeader.classList.remove('scrolled');
    }
}

if (siteHeader) {
    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
}

if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener('click', () => {
        const langDetails = document.querySelector('.lang-switch');
        if (langDetails) langDetails.removeAttribute('open');
        mobilePanel.classList.toggle('open');
    });
}

// Close mobile panel if language dropdown opens
const langDetails = document.querySelector('.lang-switch');
if (langDetails) {
    langDetails.addEventListener('toggle', () => {
        if (langDetails.open && mobilePanel) {
            mobilePanel.classList.remove('open');
        }
    });
}

// Mobile menu: choose language shortcut
const mobileLangLinks = Array.from(document.querySelectorAll('[data-mobile-lang]'));
if (mobileLangLinks.length) {
    mobileLangLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const langSwitch = document.querySelector('.lang-switch');
            if (langSwitch) {
                if (mobilePanel) mobilePanel.classList.remove('open');
                langSwitch.open = true;
                const summary = langSwitch.querySelector('summary');
                if (summary) summary.focus({ preventScroll: true });
            } else if (typeof showLanguageOverlay === 'function') {
                showLanguageOverlay();
            }
        });
    });
}

function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('show');
    searchOverlay.setAttribute('aria-hidden', 'false');
    const input = searchOverlay.querySelector('input[type="search"]');
    if (input) {
        setTimeout(() => input.focus(), 50);
    }
}

function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('show');
    searchOverlay.setAttribute('aria-hidden', 'true');
}

if (searchOpens.length) {
    searchOpens.forEach((btn) => btn.addEventListener('click', openSearch));
}

if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
}

if (searchOverlay) {
    const searchForm = searchOverlay.querySelector('.search-form');
    const searchInput = searchOverlay.querySelector('input[type="search"]');

    function buildSearchIndex() {
        const nodes = Array.from(document.querySelectorAll('a, h1, h2, h3, h4, h5, p, li'));
        return nodes
            .map((node) => {
                const text = (node.textContent || '').trim();
                if (!text) return null;
                const href = node.tagName.toLowerCase() === 'a' ? node.getAttribute('href') : null;
                return { text, href };
            })
            .filter(Boolean);
    }

    const searchIndex = buildSearchIndex();

    function renderResults(query) {
        if (!searchResults || !query) {
            if (searchResults) searchResults.innerHTML = '';
            return;
        }
        const q = query.toLowerCase();
        const matches = searchIndex
            .filter((item) => item.text.toLowerCase().includes(q))
            .slice(0, 12);

        if (!matches.length) {
            searchResults.innerHTML = `<div class="search-result">No results found.</div>`;
            return;
        }

        searchResults.innerHTML = matches
            .map((item) => {
                const display = item.text.length > 120 ? `${item.text.slice(0, 117)}...` : item.text;
                if (item.href) {
                    return `<div class="search-result"><a href="${item.href}">${display}</a><small>${item.href}</small></div>`;
                }
                return `<div class="search-result">${display}</div>`;
            })
            .join('');
    }

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            renderResults(searchInput.value.trim());
        });
        searchInput.addEventListener('input', () => {
            renderResults(searchInput.value.trim());
        });
    }

    searchOverlay.addEventListener('click', (event) => {
        if (event.target === searchOverlay) {
            closeSearch();
        }
    });

    const suggestionButtons = Array.from(searchOverlay.querySelectorAll('.search-suggestions button'));
    suggestionButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const input = searchOverlay.querySelector('input[type="search"]');
            if (input) {
                input.value = button.textContent || '';
                input.focus();
                renderResults(input.value.trim());
            }
        });
    });
}

function updateIconParallax() {
    if (!iconCards.length) return;

    const viewportH = window.innerHeight;
    const viewportW = window.innerWidth;

    iconCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewportH) return;

        const progress = (viewportH - rect.top) / (viewportH + rect.height);
        const clamped = Math.min(1, Math.max(0, progress));
        const centerX = rect.left + rect.width / 2;
        const xRatio = (centerX / viewportW) - 0.5;

        const rotateX = (0.5 - clamped) * 18;
        const rotateY = xRatio * 16;
        const lift = clamped * 14;

        card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
        card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
        card.style.setProperty('--lift', `${lift.toFixed(2)}px`);
    });
}

function animate() {
    currentX += (targetX - currentX) * lerpFactor;
    currentY += (targetY - currentY) * lerpFactor;

    document.documentElement.style.setProperty('--rotate-x', `${currentX}deg`);
    document.documentElement.style.setProperty('--rotate-y', `${currentY}deg`);
    updateIconParallax();

    requestAnimationFrame(animate);
}

function onWindowResize() {
    targetX = 0;
    targetY = 0;
    currentX = 0;
    currentY = 0;
    updateIconParallax();
}

window.onload = () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.display = 'none';
    }

    animate();
    window.addEventListener('resize', onWindowResize);

    if (lightPointer) {
        document.addEventListener('mouseleave', () => {
            lightPointer.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            lightPointer.style.opacity = '0.6';
        });
    }
};




