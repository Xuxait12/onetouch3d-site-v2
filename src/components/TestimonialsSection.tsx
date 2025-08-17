import { Component } from "@/components/ui/testimonial";

const TestimonialsSection = () => {
  return (
    <section className="section-spacing">
      <div className="text-center mb-8">
        <h2 className="section-text">O que nossos clientes dizem</h2>
      </div>
      <Component />
    </section>
  );
};

export default TestimonialsSection;