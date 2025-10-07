import { GraduationCap, Heart, Users, Award } from "lucide-react";
import communityImage from "@/assets/community.jpg";
import educationImage from "@/assets/education.jpg";
import healthcareImage from "@/assets/healthcare.jpg";

const achievements = [
  {
    icon: GraduationCap,
    title: "التعليم والشباب",
    description: "دعم 500+ طالب من خلال المنح الدراسية والدورات التدريبية",
    image: educationImage,
  },
  {
    icon: Heart,
    title: "الرعاية الصحية",
    description: "تنظيم 20+ قافلة طبية مجانية للمناطق النائية",
    image: healthcareImage,
  },
  {
    icon: Users,
    title: "التنمية المجتمعية",
    description: "إطلاق 15 مشروع تنموي لخدمة أهالي أطفيح",
    image: communityImage,
  },
  {
    icon: Award,
    title: "الإنجازات والجوائز",
    description: "حاصل على شهادات تقدير من جهات حكومية وأهلية",
    image: communityImage,
  },
];

const Achievements = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            الإنجازات والمساهمات
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نفخر بما قدمناه لخدمة مجتمعنا على مدار السنوات الماضية
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div
                key={index}
                className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in border border-border"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={achievement.image}
                    alt={achievement.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
                  <div className="absolute bottom-4 right-4">
                    <div className="p-3 bg-accent rounded-full">
                      <Icon className="h-6 w-6 text-accent-foreground" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {achievement.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
