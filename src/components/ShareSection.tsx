import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ShareSection = () => {
  const [copied, setCopied] = useState(false);
  const [shareClicked, setShareClicked] = useState(false);
  const [copyClicked, setCopyClicked] = useState(false);
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
    setShareClicked(true);
    setTimeout(() => setShareClicked(false), 250);
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      }
    } catch {}
  };

  const handleCopyLink = async () => {
    setCopyClicked(true);
    setTimeout(() => setCopyClicked(false), 250);
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const iconBounce = {
    scale: [0.9, 1.1, 1],
    transition: { duration: 0.25 }
  };

  return (
    <motion.section 
      className="py-16 md:py-20 lg:py-24 bg-white"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 text-center"
            initial={{ scale: 0.97, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0.0, 0.2, 1] }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Compartilhe Essa Energia!
            </h2>

            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-md mx-auto">
              Indique o site para um amigo que também vive o esporte. Pequenos
              gestos inspiram grandes conquistas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {shareSupported && (
                <motion.div
                  whileHover={{ scale: 1.02, filter: "brightness(1.05)" }}
                  transition={{ duration: 0.25 }}
                >
                  <Button
                    onClick={handleShare}
                    size="lg"
                    className="w-full sm:w-auto min-w-[200px] rounded-full font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all duration-250"
                  >
                    <motion.span
                      className="flex items-center"
                      animate={shareClicked ? iconBounce : {}}
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      Compartilhar Agora
                    </motion.span>
                  </Button>
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.02, filter: "brightness(1.05)" }}
                transition={{ duration: 0.25 }}
              >
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto min-w-[200px] rounded-full font-medium transition-all duration-250"
                >
                  <motion.span
                    className="flex items-center"
                    animate={copyClicked ? iconBounce : {}}
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
                  </motion.span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ShareSection;
