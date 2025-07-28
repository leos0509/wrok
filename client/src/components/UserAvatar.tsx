import FallbackAvatar from "@/components/FallbackAvatar";
import { cn } from "@/lib/utils";
import { type User } from "@/types/user";

type UserAvatarProps = {
  user: User;
  isShorten?: boolean;
};

const UserAvatar = ({ user, isShorten }: UserAvatarProps) => {
  return (
    <div className={cn("flex items-center justify-center rounded-full", isShorten ? "border-2 border-background -ml-1" : "")}>
      {user.imgUrl ? (
        <img src={user.imgUrl} alt="avatar" className="size-5 rounded-full" />
      ) : (
        <FallbackAvatar user={user} />
      )}
    </div>
  );
};

export default UserAvatar;
