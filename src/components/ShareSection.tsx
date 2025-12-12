import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShareSection = () => {
  const [copied, setCopied] = useState(false);
  const shareSupported =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const shareData = {
    title: "OneTouch3D – Quadros Personalizados",
    text: "Conheça a OneTouch3D e eternize suas conquistas esportivas!",
    url: currentUrl,
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      }
    } catch {}
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Compartilhe Essa Energia!
            </h2>

            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-md mx-auto">
              Indique o site para um amigo que também vive o esporte. Pequenos
              gestos inspiram grandes conquistas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {shareSupported && (
                <Button
                  onClick={handleShare}
                  size="lg"
                  className="w-full sm:w-auto min-w-[200px] rounded-full font-medium bg-primary text-primary-foreground hover:opacity-90"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Compartilhar Agora
                </Button>
              )}

              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[200px] rounded-full font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Link copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    Copiar link
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShareSection;
