import Loading from "@/components/Loading";
import { useGetProjectTags } from "@/hooks/useProject";
import {
  useCreateAndLinkTag,
  useLinkTagToTask,
  useUnlinkTagFromTask,
} from "@/hooks/useTask";
import type { Tag } from "@/types/tag";
import { useParams } from "@tanstack/react-router";
import { XIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

type TagContentPopoverContentProps = {
  taskId: string;
  value: Tag[] | undefined | null;
  onChange: (tags: Tag[] | undefined | null) => void;
  onClose: () => void;
};

const TagContentPopoverContent = ({
  taskId,
  value,
  onChange,
}: TagContentPopoverContentProps) => {
  const { projectId } = useParams({
    from: "/dashboard/_layout/projects/$projectId",
  });

  const { data: tags, isLoading } = useGetProjectTags(projectId, true);
  const [searchTerm, setSearchTerm] = useState("");
  const { mutateAsync: createAndLinkTag } = useCreateAndLinkTag();
  const { mutate: linkTag } = useLinkTagToTask();
  const { mutate: unlinkTag } = useUnlinkTagFromTask();

  const selectedTags = useMemo(() => value || [], [value]);

  const filteredTags = useMemo(() => {
    if (!tags) return [];

    const lowerSearch = searchTerm.toLowerCase();

    return tags.filter(
      (tag) =>
        !selectedTags.some((t) => t.id === tag.id) &&
        (!searchTerm || tag.name.toLowerCase().includes(lowerSearch)),
    );
  }, [tags, searchTerm, selectedTags]);

  const handleSelectTag = useCallback(
    (tag: Tag) => {
      onChange([...selectedTags, tag]);
      linkTag({ taskId, tagId: tag.id });
    },
    [onChange, selectedTags, linkTag, taskId],
  );

  const handleDeselectTag = useCallback(
    (tag: Tag) => {
      onChange(selectedTags.filter((t) => t.id !== tag.id));
      unlinkTag({ taskId, tagId: tag.id });
    },
    [onChange, selectedTags, unlinkTag, taskId],
  );

  const handleEnterPress = async () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    try {
      const newTag = await createAndLinkTag({
        taskId,
        tagName: trimmed,
        projectId,
      });

      onChange([...selectedTags, newTag.data]);
      setSearchTerm("");
    } catch (error) {
      console.error("Error creating and linking tag:", error);
    }
  };

  const renderTags = () => {
    if (isLoading) {
      return <Loading />;
    }

    if (filteredTags.length === 0 && searchTerm) {
      return (
        <p className="text-muted-foreground">
          No matching tags. Press <span className="font-bold">Enter</span> to
          create a new tag.
        </p>
      );
    }

    if (!tags || tags.length === 0) {
      return <p className="text-muted-foreground">No tags available.</p>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {filteredTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleSelectTag(tag)}
            className="rounded-md bg-accent px-2 py-1 text-[10px] font-semibold text-accent-foreground hover:bg-primary hover:text-primary-foreground"
          >
            {tag.name}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="w-56 space-y-3 overflow-hidden rounded-xl border bg-popover p-3 text-xs shadow-lg">
      <input
        type="text"
        placeholder="Search tags"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleEnterPress();
          }
        }}
        className="w-full rounded-md border px-2 py-2 text-xs"
      />

      <div className="w-[1000px] -translate-x-1/2 border-b border-border" />

      <div className="flex min-h-4 items-center justify-start">
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedTags.map((tag) => (
              <div
                key={tag.id}
                className="group relative flex cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-md bg-accent px-2 py-1 text-[10px] font-semibold text-accent-foreground hover:bg-destructive hover:text-destructive-foreground"
              >
                <span>{tag.name}</span>
                <div
                  className="absolute inset-0 hidden w-full items-center justify-center bg-destructive text-destructive-foreground group-hover:flex"
                  onClick={() => handleDeselectTag(tag)}
                >
                  <XIcon className="size-3" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-[1000px] -translate-x-1/2 border-b border-border" />

      <div className="max-h-[200px] min-h-[120px] overflow-y-auto">
        {renderTags()}
      </div>
    </div>
  );
};

export default TagContentPopoverContent;
