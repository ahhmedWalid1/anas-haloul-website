import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Phone, Calendar, Trash2 } from "lucide-react";

type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
};

const ADMIN_TOKEN = "changeme";

const ContactAdmin = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/contacts", {
        headers: {
          "Authorization": `Bearer ${ADMIN_TOKEN}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        toast.error("خطأ في تحميل الرسائل");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("خطأ في تحميل الرسائل");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-red-500">جديد</Badge>;
      case 'read':
        return <Badge className="bg-blue-500">مقروء</Badge>;
      case 'replied':
        return <Badge className="bg-green-500">تم الرد</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">إدارة الرسائل</h1>
            <p className="text-lg text-primary-foreground/90 mt-4">رسائل التواصل من الموقع</p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">جاري تحميل الرسائل...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">لا توجد رسائل بعد</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {messages.map((message) => (
                  <Card key={message.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-foreground">{message.name}</h3>
                            {getStatusBadge(message.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{message.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(message.date)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`tel:${message.phone}`)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          اتصال
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`mailto:anas.halou@outlook.com?subject=رد على رسالة من ${message.name}&body=الرسالة الأصلية: ${message.message}`)}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          رد
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactAdmin;
