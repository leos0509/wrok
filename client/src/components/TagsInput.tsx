import type { Tag } from "@/types/tag";

type TagsInputProps = {
  tags: Tag[];
};

const TagsInput = ({ tags }: TagsInputProps) => {
  if (tags.length > 2)
    return (
      <div className="flex w-full items-center justify-start gap-1">
        {tags.slice(0, 2).map((tag) => (
          <span
            key={tag.id}
            className="rounded bg-primary px-2 py-1 text-[10px] text-primary-foreground font-semibold"
          >
            {tag.name}
          </span>
        ))}
        <span className="rounded bg-primary px-2 py-1 text-[10px] text-primary-foreground font-semibold">
          + {tags.length - 2}
        </span>
      </div>
    );

  return (
    <div className="flex w-full items-center justify-start gap-1">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="rounded bg-primary px-2 py-1 text-[10px] text-primary-foreground font-semibold"
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
};

export default TagsInput;
