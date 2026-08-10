export const Divider = ({ text = "OR" }: { text?: string }) => {
  return (
    <div className="relative my-6 text-center">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200" />
      </div>
      <div className="relative inline-block bg-slate100 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {text}
      </div>
    </div>
  );
};
