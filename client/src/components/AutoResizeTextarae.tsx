import { useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const AutoResizingTextarea = ({ value, onChange }: Props) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      className="w-full resize-none overflow-hidden rounded-lg bg-transparent p-2 text-2xl font-semibold block h-fit"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Task Title"
    />
  );
};

export default AutoResizingTextarea;