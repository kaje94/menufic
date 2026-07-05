export default function Avatar({
  src,
  name,
  size = 36,
  className,
}: {
  src: string;
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <img
      className={`rounded-full object-cover ${className ?? ''}`}
      src={src}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
}
