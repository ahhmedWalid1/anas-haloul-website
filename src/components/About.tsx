import candidateImage from "@/assets/candidate-portrait.jpg";

const About = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 md:order-1 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 rounded-2xl transform rotate-3"></div>
              <img
                src={candidateImage}
                alt="أنس هلول"
                className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              السيرة الذاتية
            </h2>
            
            <div className="space-y-6 text-muted-foreground leading-relaxed">

              {/* المؤهلات الأكاديمية */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-bold text-primary mb-4">المؤهلات الأكاديمية</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>بكالوريوس علوم إدارية – شعبة محاسبة</span>
                  </li>
                </ul>
              </div>

              {/* الخبرات المهنية */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-bold text-primary mb-4">الخبرات المهنية</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>صاحب ومدير مصنع فيوتشر للمنتجات الإسمنتية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>صاحب ومدير شركة إس إم للمقاولات والتوريدات العامة</span>
                  </li>
                </ul>
              </div>

              {/* الخبرات التنظيمية والسياسية */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-bold text-primary mb-4">الخبرات التنظيمية والسياسية</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>منسق جمعية "من أجل مصر" (2016 - 2018) – أطفيح</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>منسق حملة "كلنا معاك من أجل مصر" للانتخابات الرئاسية (2018) – أطفيح</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>أمين حزب مستقبل وطن -اطفيح(2018 - 2024)</span>
                  </li>
                </ul>
              </div>

              {/* الإنجازات السياسية والتنظيمية */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-bold text-primary mb-4">الإنجازات السياسية والتنظيمية</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>قيادة وتنظيم الاستفتاء على التعديلات الدستورية (2019)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>الإشراف على تنظيم انتخابات مجلس الشيوخ (2020)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>الإشراف على حملات انتخابات مجلس النواب (2020)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>دعم وتنظيم فعاليات الانتخابات الرئاسية (2023)</span>
                  </li>
                </ul>
              </div>

              {/* الدورات التدريبية */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-bold text-primary mb-4">الدورات التدريبية</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>دورة إعداد القادة للمحليات – أكاديمية السادات</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>دورة الاستراتيجية والأمن القومي – أكاديمية ناصر العسكرية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>دورة إدارة الأزمات والتفاوض – أكاديمية ناصر العسكرية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>دورة أساليب التفكير وصناعة القرار – أكاديمية ناصر العسكرية</span>
                  </li>
                </ul>
              </div>

              {/* المهارات الشخصية والمهنية */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-bold text-primary mb-4">المهارات الشخصية والمهنية</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span><strong>قيادة الفرق:</strong> إدارة فرق العمل لتحقيق الأهداف بكفاءة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span><strong>إدارة الأزمات والتفاوض:</strong> اتخاذ القرارات المناسبة تحت الضغط</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span><strong>تنظيم الحملات:</strong> خبرة في الإشراف على الحملات السياسية والتنظيمية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span><strong>التخطيط الاستراتيجي:</strong> وضع وتنفيذ خطط تخدم الأهداف طويلة المدى</span>
                  </li>
                </ul>
              </div>

              {/* اللغات */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-bold text-primary mb-4">اللغات</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span><strong>العربية:</strong> ممتاز</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span><strong>الإنجليزية:</strong> جيد</span>
                  </li>
                </ul>
              </div>

              {/* الاهتمامات الشخصية */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-bold text-primary mb-4">الاهتمامات الشخصية</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>المساهمة في تطوير المجتمعات المحلية</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
