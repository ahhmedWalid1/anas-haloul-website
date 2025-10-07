import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";

const sections = [
  {
    title: "التعليم",
    points: [
      "تطوير المدارس ورفع كفاءة المعلمين",
      "توسيع فصول رياض الأطفال وخدمات الطفولة المبكرة",
      "دعم المتفوقين وتوفير منح للطلاب",
    ],
  },
  {
    title: "الصحة",
    points: [
      "رفع كفاءة الوحدات الصحية والمستشفيات",
      "توفير الأدوية الأساسية ودعم التأمين الصحي",
      "قوافل طبية دورية وخدمات الطوارئ",
    ],
  },
  {
    title: "البنية التحتية",
    points: [
      "تطوير الطرق والإنارة والصرف الصحي",
      "توصيل المياه والغاز للمناطق المحرومة",
      "حل مشاكل الكهرباء وتحسين الجهد",
    ],
  },
  {
    title: "الشباب والرياضة",
    points: [
      "دعم مراكز الشباب والأنشطة",
      "برامج تدريب وتوظيف للشباب",
      "تشجيع ريادة الأعمال والمشروعات الصغيرة",
    ],
  },
];

const Program = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4">
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                البرنامج الانتخابي
              </h1>
              <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                خطة عمل واقعية تركز على التعليم والصحة والبنية التحتية وتمكين الشباب
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 grid gap-8 md:grid-cols-2">
            {sections.map((sec) => (
              <div key={sec.title} className="rounded-xl border border-border p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-6">{sec.title}</h2>
                <ul className="space-y-3">
                  {sec.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-foreground">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Program;


