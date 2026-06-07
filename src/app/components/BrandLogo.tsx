type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showMotto?: boolean;
  light?: boolean;
  logoSrc?: string;
};

const MOTTO = "Rooted in stories, driven by journeys.";

export function BrandLogo({
  className = "",
  markClassName = "h-14 w-72",
  textClassName,
  showMotto = false,
  light,
  logoSrc: logoSrcOverride,
}: BrandLogoProps) {
  const logoSrc = logoSrcOverride ?? (light ? "/images/logo_dark_theme.png" : "/images/logowhite_theme.png");
  const imageClassName = light
    ? "inset-0 h-full w-full object-contain"
    : "left-1/2 top-1/2 h-[300%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2";

  return (
    <div className={`flex flex-col ${className}`}>
      <div className={textClassName}>
        <span className={`relative block shrink-0 overflow-hidden ${markClassName}`}>
          <img
            src={logoSrc}
            alt="Voyoroots"
            className={`absolute ${imageClassName}`}
          />
        </span>
      </div>
      {showMotto && (
        <span className={`mt-2 text-sm font-medium ${light ? "text-white/80" : "text-slate-600"}`}>
          {MOTTO}
        </span>
      )}
    </div>
  );
}

export { MOTTO };
