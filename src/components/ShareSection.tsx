import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ShareSection = () => {
  const [copied, setCopied] = useState(false);
  const [shareSupported] = useState(() => typeof navigator !== 'undefined' && !!navigator.share);

  const shareData = {
    title: 'OneTouch3D – Quadros Personalizados',
    text: 'Conheça a OneTouch3D e eternize suas conquistas esportivas!',
    url: typeof window !== 'undefined' ? window.location.href : '',
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed');
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#F7F7F7]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Card with white background and shadow */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12 text-center">
            {/* Title */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Compartilhe Essa Energia!
            </h2>
            
            {/* Subtitle */}
            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-md mx-auto">
              Indique o site para um amigo que também vive o esporte. Pequenos gestos inspiram grandes conquistas.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Mobile: Share button (shown when Web Share API is supported) */}
              {shareSupported && (
                <Button
                  onClick={handleShare}
                  variant="cta"
                  size="lg"
                  className="w-full sm:w-auto min-w-[200px]"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Compartilhar Agora
                </Button>
              )}
              
              {/* Desktop: Copy link button (always shown, primary on desktop when share not supported) */}
              <Button
                onClick={handleCopyLink}
                variant={shareSupported ? "outline" : "cta"}
                size="lg"
                className={`w-full sm:w-auto min-w-[200px] ${
                  !shareSupported ? '' : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                }`}
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
