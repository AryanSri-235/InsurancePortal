export default function SectionDivider() {
  return (
    <div className="relative flex items-center justify-center py-1">
      {/* Fading line */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Center dot cluster */}
      <div className="relative flex items-center gap-1 bg-white px-3">
        <span className="w-1 h-1 rounded-full bg-gray-200" />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        <span className="w-1 h-1 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}
