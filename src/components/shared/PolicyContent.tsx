type PolicySection = {
  heading: string;
  content: string;
};

type PolicyProps = {
  policy: {
    title: string;
    lastUpdated: string;
    sections: PolicySection[];
  };
};

export default function PolicyContent({ policy }: PolicyProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#EFEBE1]">
      <div className="border-b border-[#EFEBE1] pb-3 mb-5">
        <h1 className="text-xl md:text-2xl font-black text-[#3E2723] tracking-tight">{policy.title}</h1>
        <p className="text-[9px] md:text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest mt-1.5">
          Last Updated: {policy.lastUpdated}
        </p>
      </div>
      
      <div className="space-y-5 text-[#5D4037] text-xs md:text-sm font-medium leading-relaxed">
        {policy.sections.map((section, index) => (
          <section key={index}>
            <h3 className="text-sm md:text-base font-black text-[#8E1C1C] mb-1">{section.heading}</h3>
            <p>{section.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}