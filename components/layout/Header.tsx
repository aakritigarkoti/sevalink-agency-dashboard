"use client";

type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open sidebar menu"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-700 transition-all duration-300 ease-in-out active:scale-95 hover:bg-gray-100 md:hidden"
        >
          <span className="text-lg leading-none">☰</span>
        </button>
        <h2 className="text-base font-semibold tracking-tight text-gray-900 sm:text-lg">Agency Dashboard</h2>
      </div>

      <div className="text-xs text-gray-600 sm:text-sm">
        <span className="sm:hidden">Welcome back</span>
        <span className="hidden sm:inline">Welcome back, Agency Admin</span>
      </div>
    </header>
  );
}

export default Header;