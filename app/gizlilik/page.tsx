import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "Gizlilik Politikası — ASTİM Ticaret Merkezi",
  description: "ASTİM Ticaret Merkezi kişisel veri işleme ve gizlilik politikası (KVKK).",
};

const sections = [
  {
    no: "01",
    title: "VERİ SORUMLUSU",
    content: `Bu gizlilik politikası, ASTİM Ticaret Merkezi ("ASTİM", "biz") tarafından yönetilen astimticaretmerkezi.com web sitesine ilişkindir. Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla ASTİM Ticaret Merkezi tarafından işlenmektedir.\n\nAdres: Çan Yolu 2. Sk. Karacaören Mah. Merkez, Çanakkale, Türkiye\nE-posta: astimticaretmerkezi@gmail.com`,
  },
  {
    no: "02",
    title: "TOPLANAN VERİLER",
    content: `Web sitemizi kullanmanız sırasında aşağıdaki kişisel veriler toplanabilir:\n\n• Ad ve soyad\n• E-posta adresi\n• Telefon numarası\n• İşletme / firma bilgileri\n• Bülten aboneliği kayıtları\n• Üye girişi ve oturum bilgileri\n\nWeb sitesi kullanımına ilişkin teknik veriler (tarayıcı türü, IP adresi, ziyaret saati) sunucu kayıtlarında anonimleştirilmiş biçimde tutulabilir.`,
  },
  {
    no: "03",
    title: "VERİLERİN KULLANIM AMACI",
    content: `Toplanan kişisel veriler aşağıdaki amaçlarla kullanılmaktadır:\n\n• Üye hesabı oluşturma ve kimlik doğrulama\n• Atölye ve firma bilgilerinin yönetimi\n• Bülten ve duyuru iletişimi (açık rıza ile)\n• Hizmet kalitesini artırma ve teknik destek\n• Yasal yükümlülüklerin yerine getirilmesi\n\nVerileriniz üçüncü taraflarla satılmaz veya kiralanmaz.`,
  },
  {
    no: "04",
    title: "VERİLERİN SAKLANMASI",
    content: `Kişisel verileriniz, GitHub altyapısı üzerinde güvenli biçimde saklanmaktadır. Üye şifreleri tek yönlü kriptografik yöntemlerle (bcrypt) hashlenerek tutulmakta; hiçbir zaman düz metin olarak saklanmamaktadır.\n\nVerileriniz, ilgili yasal saklama sürelerine ve işleme amacının gerektirdiği süreyle muhafaza edilmektedir. Amacın ortadan kalkması halinde veriler silinir veya anonimleştirilir.`,
  },
  {
    no: "05",
    title: "KVKK KAPSAMINDA HAKLARINIZ",
    content: `6698 sayılı KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:\n\n• Kişisel verilerinizin işlenip işlenmediğini öğrenme\n• İşlenmişse buna ilişkin bilgi talep etme\n• İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme\n• Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme\n• Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme\n• Verilerin silinmesini veya yok edilmesini talep etme\n• İşlemeye itiraz etme\n\nBu haklarınızı kullanmak için astimticaretmerkezi@gmail.com adresine yazılı başvuruda bulunabilirsiniz.`,
  },
  {
    no: "06",
    title: "ÇEREZLER (COOKIES)",
    content: `Web sitemiz, oturum yönetimi amacıyla zorunlu çerezler kullanmaktadır. Bu çerezler, güvenli oturum açma işlemlerini sağlamak için gereklidir ve kişisel veri niteliği taşımaz.\n\nAnalitik veya pazarlama amaçlı üçüncü taraf çerezleri kullanılmamaktadır.`,
  },
  {
    no: "07",
    title: "POLİTİKA DEĞİŞİKLİKLERİ",
    content: `Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler olması durumunda site üzerinden bilgilendirme yapılacaktır. Politikanın güncel halini bu sayfadan her zaman inceleyebilirsiniz.\n\nSon güncelleme: Haziran 2025`,
  },
];

export default function GizlilikPolitikasi() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F3F0]">
        {/* Header */}
        <div className="border-b border-[#111111] px-6 md:px-10 py-8 md:py-12 flex flex-col gap-2">
          <p
            className="text-[10px] tracking-[0.25em] uppercase text-[#FF4A00]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            KVKK / GİZLİLİK
          </p>
          <h1
            className="text-[36px] md:text-[64px] font-[900] tracking-[-0.03em] uppercase leading-none"
            style={{ fontFamily: "var(--font-hanken)" }}
          >
            GİZLİLİK
            <br />
            POLİTİKASI
          </h1>
          <p
            className="text-[13px] text-[#595C5C] mt-1 max-w-xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Kişisel verilerinizi nasıl topladığımız, işlediğimiz ve koruduğumuza ilişkin bilgiler.
          </p>
        </div>

        {/* Sections */}
        <div className="divide-y divide-[#111111]">
          {sections.map((section) => (
            <div key={section.no} className="grid grid-cols-1 md:grid-cols-12">
              {/* Section number + title */}
              <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-[#111111] px-6 md:px-10 py-6 md:py-10 flex md:flex-col gap-3 md:gap-3 items-baseline md:items-start">
                <span
                  className="text-[48px] md:text-[64px] font-[900] tracking-[-0.04em] text-[#111111]/10 leading-none flex-shrink-0"
                  style={{ fontFamily: "var(--font-hanken)" }}
                >
                  {section.no}
                </span>
                <h2
                  className="text-[13px] font-[700] tracking-[0.15em] uppercase"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {section.title}
                </h2>
              </div>

              {/* Content */}
              <div className="md:col-span-8 px-6 md:px-10 py-6 md:py-10">
                {section.content.split("\n").map((line, i) =>
                  line === "" ? (
                    <div key={i} className="h-3" />
                  ) : line.startsWith("•") ? (
                    <p
                      key={i}
                      className="text-[14px] leading-[22px] text-[#111111] pl-4"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {line}
                    </p>
                  ) : (
                    <p
                      key={i}
                      className="text-[14px] leading-[22px] text-[#111111]"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {line}
                    </p>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="border-t border-[#111111] px-6 md:px-10 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111111]">
          <div>
            <p
              className="text-[10px] tracking-[0.2em] uppercase text-[#FF4A00] mb-1"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              KVKK BAŞVURUSU
            </p>
            <p
              className="text-[14px] font-[700] text-[#F4F3F0]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Verilerinize ilişkin talepleriniz için bize ulaşın.
            </p>
          </div>
          <a
            href="mailto:astimticaretmerkezi@gmail.com"
            className="flex-shrink-0 bg-[#F4F3F0] text-[#111111] px-6 py-3 text-[11px] font-[700] uppercase tracking-widest hover:bg-[#FF4A00] hover:text-[#F4F3F0] transition-none self-start sm:self-auto"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            E-POSTA GÖNDER →
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
