export default function ColorSwatch({ colors, selected, onSelect, size = "md" }) {
  return (
    <div className={`swatch-row swatch-${size}`}>
      {colors.map((c) => (
        <button
          key={c.hex}
          type="button"
          className={`swatch ${selected?.hex === c.hex ? "swatch-selected" : ""}`}
          style={{ backgroundColor: c.hex }}
          title={c.name}
          aria-label={c.name}
          aria-pressed={selected?.hex === c.hex}
          onClick={() => onSelect(c)}
        />
      ))}
    </div>
  );
}
